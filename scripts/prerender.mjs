/**
 * Injects the prerendered app markup into dist/index.html, then writes the
 * things meant for machines from the same content: the JSON-LD in <head>,
 * dist/llms.txt, and the <lastmod> in dist/sitemap.xml.
 *
 * Two post-processing passes run over the snapshot:
 *   1. Motion's entrance styles (opacity:0 / translate) are stripped, so the
 *      static copy is visible text rather than hidden text.
 *   2. Only the first <h1> stays an <h1>. The hero renders one per breakpoint
 *      and CSS shows exactly one, but a non-rendering crawler would otherwise
 *      count three.
 */
import { readFileSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const dist = resolve('dist/index.html');
const ssr = resolve('dist-ssr/prerender.js');

if (!existsSync(ssr)) {
  console.error('[prerender] missing SSR bundle at dist-ssr/prerender.js');
  process.exit(1);
}

const { render, jsonLd, llmsTxt } = await import(`file://${ssr}`);
let markup = render();

markup = markup
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

const html = readFileSync(dist, 'utf8');
const out = html.replace(
  /* Vite 6 hoists the entry script into <head>, so the old lookahead for a
     following <script> could never match and the step exited 1. The root div
     is unambiguous on its own. */
  /<div id="root">[\s\S]*?<\/div>/,
  `<div id="root">${markup}</div>\n    `,
);

if (out === html) {
  console.error('[prerender] could not find #root placeholder in dist/index.html');
  process.exit(1);
}

/* Structured data. The title and description are read back out of the page
   rather than typed a second time, and the date is the build's: every deploy
   is a commit, so it tracks the last change without anyone maintaining it. */
const unescape = (t) => t.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const title = out.match(/<title>([^<]*)<\/title>/)?.[1];
const description = out.match(/<meta name="description" content="([^"]*)"/)?.[1];
const MARKER = '<!--structured-data-->';

if (!title || !description || !out.includes(MARKER)) {
  console.error('[prerender] index.html is missing its <title>, meta description or the structured-data marker');
  process.exit(1);
}

const modified = new Date().toISOString().slice(0, 10);
const ld = jsonLd({ title: unescape(title), description: unescape(description), modified });
JSON.parse(ld); // a schema that does not parse should stop the deploy, not ship

const withData = out.replace(
  MARKER,
  () => `<script type="application/ld+json">\n${ld}\n    </script>`,
);
writeFileSync(dist, withData);

writeFileSync(resolve('dist/llms.txt'), llmsTxt({ modified }));

/* public/sitemap.xml stays the source for which URLs exist. The build only
   stamps the home page with the date it was last deployed. */
const sitemapPath = resolve('dist/sitemap.xml');
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  writeFileSync(
    sitemapPath,
    sitemap.replace(
      '<loc>https://forgedone.xyz/</loc>',
      `<loc>https://forgedone.xyz/</loc>\n    <lastmod>${modified}</lastmod>`,
    ),
  );
}

rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`[prerender] injected ${(markup.length / 1024).toFixed(1)} kB of static markup`);
console.log(`[prerender] wrote JSON-LD (${(ld.length / 1024).toFixed(1)} kB), llms.txt and sitemap lastmod ${modified}`);
