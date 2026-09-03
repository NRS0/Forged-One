/**
 * Injects the prerendered app markup into dist/index.html.
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

const { render } = await import(`file://${ssr}`);
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

writeFileSync(dist, out);
rmSync(resolve('dist-ssr'), { recursive: true, force: true });
console.log(`[prerender] injected ${(markup.length / 1024).toFixed(1)} kB of static markup`);
