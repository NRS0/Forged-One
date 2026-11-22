/**
 * Which page is this address?
 *
 * There is no router. Each page is its own HTML file, written at build time
 * with its content already in it, and moving between pages is an ordinary link
 * and an ordinary page load. All this does is pick what to draw once the
 * script wakes up: a page from src/pages.ts or src/articles.ts if the address
 * matches one, and the home page otherwise.
 */
import App from "./App";
import Page from "./Page";
import { ArticlesIndex, ArticleView } from "./ArticlePage";
import { pageFor, normalisePath } from "./pages";
import { articleFor, ARTICLES_PATH } from "./articles";

export default function Root({ path }: { path: string }) {
  const at = normalisePath(path);
  if (at === ARTICLES_PATH) return <ArticlesIndex />;
  const article = articleFor(at);
  if (article) return <ArticleView article={article} />;
  const page = pageFor(at);
  return page ? <Page page={page} /> : <App />;
}
