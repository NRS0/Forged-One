/**
 * Which page is this address?
 *
 * There is no router. Each page is its own HTML file, written at build time
 * with its content already in it, and moving between pages is an ordinary link
 * and an ordinary page load. All this does is pick what to draw once the
 * script wakes up: a page from src/pages.ts if the address matches one, and
 * the home page otherwise.
 */
import App from "./App";
import Page from "./Page";
import { pageFor } from "./pages";

export default function Root({ path }: { path: string }) {
  const page = pageFor(path);
  return page ? <Page page={page} /> : <App />;
}
