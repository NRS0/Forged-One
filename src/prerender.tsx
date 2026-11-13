/**
 * Build-time prerender entry.
 *
 * Renders each page to static HTML so crawlers that do not execute JavaScript
 * still see the real page content. The client keeps using createRoot, which
 * discards this markup on mount, so there is no hydration contract to honour.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import Root from './Root';

/** "/" is the home page; any path in src/pages.ts is that page. */
export function render(path: string = '/'): string {
  return renderToStaticMarkup(<Root path={path} />);
}

/* The machine-readable half of the build, exported from the same bundle so
   scripts/prerender.mjs has one thing to import. */
export { jsonLd, pageJsonLd, llmsTxt, sitemapXml } from './machine-readable';
export { pages } from './pages';
