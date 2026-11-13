/**
 * Build-time prerender entry.
 *
 * Renders the app to static HTML so crawlers that do not execute JavaScript
 * still see the real page content. The client keeps using createRoot, which
 * discards this markup on mount, so there is no hydration contract to honour.
 */
import { renderToStaticMarkup } from 'react-dom/server';
import App from './App';

export function render(): string {
  return renderToStaticMarkup(<App />);
}

/* The machine-readable half of the build, exported from the same bundle so
   scripts/prerender.mjs has one thing to import. */
export { jsonLd, llmsTxt } from './machine-readable';
