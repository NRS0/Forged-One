/**
 * The articles: the part of the site that is meant to change.
 *
 * Every other page says what Forged One is, and those pages rarely change.
 * Google offers a site as a "preferred source" in Top Stories only when it
 * publishes regularly, and a reader who finds one useful article has a reason
 * to come back. So articles live here, on our own domain, and are published
 * here first. Copies on Medium or LinkedIn point back to this address.
 *
 * Each article is one file in src/articles/, registered in the list below,
 * newest first. Adding one is: write the file, add it to the list, deploy.
 * The page, its schema, the sitemap, llms.txt and the RSS feed all come from
 * the same object.
 *
 * The same rule as the rest of the site holds for the copy: no prices,
 * clients, timelines or numbers that were not already published, and no
 * invented statistics. An article can explain, give examples and say what we
 * think; it cannot claim results we cannot show.
 */
import type { Body } from "./pages";
import whatToAutomateFirst from "./articles/what-to-automate-first";

export type ArticleSection = {
  /** The section heading, an <h2>. */
  h: string;
  /**
   * Paragraphs and lists. Inside any string, [text](/path) is a link: use it
   * for links to our own pages (a service, the brief) and, sparingly, to a
   * source the article relies on.
   */
  body: Body;
};

/**
 * The person who wrote an article. Optional: an article without one is
 * credited to Forged One. With one, the page shows a byline and a short bio,
 * and the schema names this person as the author, working for Forged One.
 * Only use real details the person has agreed to publish.
 */
export type ArticleAuthor = {
  /** Their name as it should appear in the byline. */
  name: string;
  /** Their role at Forged One, for example "Founder". */
  jobTitle?: string;
  /** A page about them: a profile on this site, or their own site. */
  url?: string;
  /** Their profiles elsewhere (LinkedIn and the like), full addresses. */
  sameAs?: string[];
  /** One or two sentences, third person, shown under the article. */
  bio?: string;
};

export type Article = {
  /** The last part of the address: /articles/<slug>. Lower case, hyphens. */
  slug: string;
  /** The <title>, about 60 characters, ending in " | Forged One". */
  title: string;
  /** The meta description, 140 to 160 characters, written to be clicked. */
  description: string;
  /** The headline on the page. Sentence case; the page sets it in capitals. */
  h1: string;
  /** The first paragraph, written to be quoted whole: it answers the headline. */
  lead: string;
  /** YYYY-MM-DD. */
  published: string;
  /** YYYY-MM-DD, only when the article was changed after it went out. */
  updated?: string;
  /** Who wrote it. Leave it out and the article is credited to Forged One. */
  author?: ArticleAuthor;
  /** A few words for search engines and the schema, most important first. */
  keywords: string[];
  sections: ArticleSection[];
  /** Pages of ours the article leads to, drawn as rows at the end. */
  related?: { label: string; href: string }[];
};

/** Newest first. */
export const articles: Article[] = [whatToAutomateFirst];

export const ARTICLES_PATH = "/articles";
export const ARTICLES_TITLE = "Articles on AI for Caribbean Business | Forged One";
export const ARTICLES_DESCRIPTION =
  "Practical articles from Forged One on AI automation, AI agents and software for Caribbean businesses: what to build, and what to leave alone.";
export const articlePath = (a: Article) => `${ARTICLES_PATH}/${a.slug}`;

/** The article at this address, if there is one. */
export const articleFor = (path: string) => articles.find((a) => articlePath(a) === path);

/** Rough reading time, at 230 words a minute, never under one minute. */
export const readingMinutes = (a: Article) => {
  const text = [a.lead, ...a.sections.flatMap((s) => [s.h, ...s.body.flat()])].join(" ");
  return Math.max(1, Math.round(text.split(/\s+/).length / 230));
};

/** "22 November 2026", the way the rest of the site writes dates. */
export const longDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/** The text of a string with its [text](href) links reduced to their text. */
export const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
