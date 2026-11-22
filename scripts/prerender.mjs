/**
 * Turns the one built page into every page of the site.
 *
 * `vite build` produces a single dist/index.html with an empty #root. This
 * script renders each page to static HTML and writes it to its own file, so a
 * crawler that does not run JavaScript still reads the real content at the
 * real address:
 *
 *   /                          dist/index.html
 *   /services/ai-agents        dist/services/ai-agents/index.html
 *   /caribbean/jamaica         dist/caribbean/jamaica/index.html
 *   /articles/<slug>           dist/articles/<slug>/index.html
 *
 * Each file gets its own <title>, description, canonical and JSON-LD. Then it
 * writes the things meant for machines from the same content: dist/llms.txt,
 * dist/sitemap.xml and the article feed at dist/articles/feed.xml.
 *
 * Two post-processing passes run over every snapshot:
 *   1. Motion's entrance styles (opacity:0 / translate) are stripped, so the
 *      static copy is visible text rather than hidden text.
 *   2. Only the first <h1> stays an <h1>. The hero renders one per breakpoint
 *      and CSS shows exactly one, but a non-rendering crawler would otherwise
 *      count three.
 */
import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const dist = resolve('dist/index.html');
const ssr = resolve('dist-ssr/prerender.js');

const fail = (message) => {
  console.error(`[prerender] ${message}`);
  process.exit(1);
};

if (!existsSync(ssr)) fail('missing SSR bundle at dist-ssr/prerender.js');

const { render, jsonLd, pageJsonLd, llmsTxt, sitemapXml, articleRoutes, rssXml, pages } = await import(`file://${ssr}`);

function snapshot(path) {
  let markup = render(path)
    .replace(/opacity:\s*0(\.\d+)?\s*;?/g, '')
    .replace(/transform:\s*translate[XYZ]?\([^)]*\)\s*;?/g, '')
    .replace(/style="\s*"/g, '');

  let seenH1 = false;
  markup = markup.replace(/<(\/?)h1(\s|>)/g, (match, slash, tail) => {
    if (!slash && !seenH1) { seenH1 = true; return match; }
    if (!slash) return `<div${tail}`;
    return seenH1 && match === '</h1>' ? '</h1>' : match;
  });

  // the closing tags need the same one-survivor rule, applied in order
  let open = 0;
  markup = markup.replace(/<h1(\s|>)|<\/h1>/g, (m) => {
    if (m === '</h1>') { open -= 1; return open === 0 ? '</h1>' : '</div>'; }
    open += 1;
    return m;
  });

  if (!/<h1[\s>]/.test(markup)) fail(`${path} rendered without an <h1>`);
  return markup;
}

const template = readFileSync(dist, 'utf8');
const MARKER = '<!--structured-data-->';
const ROOT = /<div id="root">[\s\S]*?<\/div>/;

/* The title and description are read back out of the page rather than typed a
   second time, and the date is the build's: every deploy is a commit, so it
   tracks the last change without anyone maintaining it. */
const unescape = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const escape = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const homeTitle = template.match(/<title>([^<]*)<\/title>/)?.[1];
const homeDescription = template.match(/<meta name="description" content="([^"]*)"/)?.[1];
const HOME = 'https://forgedone.xyz/';

if (!homeTitle || !homeDescription || !template.includes(MARKER) || !ROOT.test(template)) {
  fail('index.html is missing its <title>, meta description, #root or the structured-data marker');
}

const modified = new Date().toISOString().slice(0, 10);

function fill(html, markup, ld) {
  JSON.parse(ld); // a schema that does not parse should stop the deploy, not ship
  return html
    /* Vite 6 hoists the entry script into <head>, so the root div is
       unambiguous on its own. Replacers are functions so a "$" in the copy
       is never read as a substitution pattern. */
    .replace(ROOT, () => `<div id="root">${markup}</div>\n    `)
    .replace(MARKER, () => `<script type="application/ld+json">\n${ld}\n    </script>`);
}

/* ── the home page ── */
const homeMarkup = snapshot('/');
const homeLd = jsonLd({ title: unescape(homeTitle), description: unescape(homeDescription), modified });
writeFileSync(dist, fill(template, homeMarkup, homeLd));

/* ── every other page ──
   Same <head> as the home page, with the five things that must differ
   swapped: title, description, canonical, and their Open Graph and Twitter
   copies. Each swap has to land, or the page would ship claiming to be the
   home page. */
let written = 0;
function writePage({ path, title, description, ogType = 'website' }, ld) {
  const url = `${HOME.replace(/\/$/, '')}${path}`;
  const swaps = [
    [`<title>${homeTitle}</title>`, `<title>${escape(title)}</title>`, 1],
    [`content="${homeTitle}"`, `content="${escape(title)}"`, 2],
    [`content="${homeDescription}"`, `content="${escape(description)}"`, 3],
    [`<link rel="canonical" href="${HOME}" />`, `<link rel="canonical" href="${url}" />`, 1],
    [`<meta property="og:url" content="${HOME}" />`, `<meta property="og:url" content="${url}" />`, 1],
    ...(ogType === 'website' ? [] : [
      ['<meta property="og:type" content="website" />', `<meta property="og:type" content="${ogType}" />`, 1],
    ]),
  ];

  let html = template;
  for (const [from, to, times] of swaps) {
    const found = html.split(from).length - 1;
    if (found !== times) fail(`${path}: expected ${times} of ${from.slice(0, 40)}… in <head>, found ${found}`);
    html = html.split(from).join(to);
  }

  const out = resolve(`dist${path}/index.html`);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, fill(html, snapshot(path), ld));
  written += 1;
}

for (const page of pages) writePage(page, pageJsonLd(page, { modified }));

/* ── the article list and every article ── */
for (const route of articleRoutes()) writePage(route, route.ld);

writeFileSync(resolve('dist/llms.txt'), llmsTxt({ modified }));
writeFileSync(resolve('dist/sitemap.xml'), sitemapXml({ modified }));
writeFileSync(resolve('dist/articles/feed.xml'), rssXml());

rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`[prerender] home page: ${(homeMarkup.length / 1024).toFixed(1)} kB of static markup`);
console.log(`[prerender] wrote ${written} more pages, llms.txt, sitemap.xml and the article feed (${modified})`);
