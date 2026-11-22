/**
 * Everything on the site that is written for a machine rather than a person:
 * the JSON-LD graph and /llms.txt. Both are built from src/content.ts at build
 * time by scripts/prerender.mjs, so neither can say something the page does not.
 */
import { SITE, services, serviceUrl, faqs } from "./content";
import { pages, type PageData } from "./pages";
import {
  articles,
  articlePath,
  plain,
  ARTICLES_PATH,
  ARTICLES_TITLE,
  ARTICLES_DESCRIPTION,
  type Article,
} from "./articles";

type PageFacts = {
  /** <title> and meta description, read back out of index.html. */
  title: string;
  description: string;
  /** YYYY-MM-DD of the build. Every deploy is a commit, so it tracks the last change. */
  modified: string;
};

const ORG = `${SITE.url}#organization`;
const WEBSITE = `${SITE.url}#website`;
const WEBPAGE = `${SITE.url}#webpage`;

export function jsonLd({ title, description, modified }: PageFacts): string {
  const areaServed = [
    { "@type": "Place", name: "Caribbean" },
    ...SITE.countries.map((name) => ({ "@type": "Country", name })),
  ];

  const graph = [
    {
      "@type": "ProfessionalService",
      "@id": ORG,
      name: SITE.name,
      alternateName: SITE.alternateNames,
      url: SITE.url,
      logo: `${SITE.url}android-chrome-512x512.png`,
      image: `${SITE.url}og-image.png`,
      description: SITE.summary,
      email: SITE.email,
      telephone: SITE.phone,
      address: { "@type": "PostalAddress", addressCountry: "BB" },
      areaServed,
      knowsAbout: SITE.knowsAbout,
      sameAs: SITE.sameAs,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        telephone: SITE.phone,
        url: SITE.callUrl,
        availableLanguage: "English",
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          url: serviceUrl(s),
          itemOffered: {
            "@type": "Service",
            name: s.name,
            description: s.desc,
            provider: { "@id": ORG },
            /* The country list lives once, on the organisation. */
            areaServed: { "@type": "Place", name: "Caribbean" },
          },
        })),
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE,
      url: SITE.url,
      name: SITE.name,
      alternateName: SITE.alternateNames,
      inLanguage: "en",
      publisher: { "@id": ORG },
    },
    {
      /* FAQPage is a WebPage, so one node carries both the page facts and the answers. */
      "@type": "FAQPage",
      "@id": WEBPAGE,
      url: SITE.url,
      name: title,
      description,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE },
      about: { "@id": ORG },
      primaryImageOfPage: `${SITE.url}og-image.png`,
      dateModified: modified,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  /* "<" is escaped so no answer can ever close the script tag it sits in. */
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(
    /</g,
    "\\u003c",
  );
}

const abs = (path: string) => `${SITE.url.replace(/\/$/, "")}${path}`;

const stringify = (graph: unknown[]) =>
  JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replace(/</g, "\\u003c");

/**
 * The graph for a service or country page: the page itself with its trail
 * back to the home page, the thing it is about, and its own questions. The
 * organisation is a short stub that points at the full node on the home page
 * by @id, so the facts about the company are stated once.
 */
export function pageJsonLd(page: PageData, { modified }: Pick<PageFacts, "modified">): string {
  const url = abs(page.path);
  const isService = page.kind === "service";

  const graph: unknown[] = [
    { "@type": "ProfessionalService", "@id": ORG, name: SITE.name, url: SITE.url },
    {
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: page.title,
      description: page.description,
      inLanguage: "en",
      isPartOf: { "@id": WEBSITE },
      about: { "@id": isService ? `${url}#service` : ORG },
      breadcrumb: { "@id": `${url}#breadcrumb` },
      dateModified: modified,
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { name: SITE.name, item: SITE.url },
        ...(page.parent ? [{ name: page.parent.name, item: abs(page.parent.href) }] : []),
        { name: page.name, item: url },
      ].map((step, i) => ({ "@type": "ListItem", position: i + 1, ...step })),
    },
    {
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      isPartOf: { "@id": `${url}#webpage` },
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  /* What the page offers and where. A service page and the Caribbean page
     cover the whole region; the Barbados page names one country. */
  graph.push({
    "@type": "Service",
    "@id": `${url}#service`,
    name: isService ? page.name : page.h1,
    ...(isService ? { serviceType: page.name } : {}),
    description: page.lead,
    url,
    provider: { "@id": ORG },
    areaServed: page.country
      ? { "@type": "Country", name: page.country }
      : [
          { "@type": "Place", name: "Caribbean" },
          ...SITE.countries.map((name) => ({ "@type": "Country", name })),
        ],
  });

  return stringify(graph);
}

/**
 * An address the prerender writes that is not in src/pages.ts: the article
 * list and each article. Each carries everything its <head> needs.
 */
export type ExtraRoute = {
  path: string;
  title: string;
  description: string;
  ogType: "website" | "article";
  ld: string;
};

const lastChange = (a: Article) => a.updated ?? a.published;

const articleUrl = (a: Article) => abs(articlePath(a));

/** The article list, then every article, ready for scripts/prerender.mjs. */
export function articleRoutes(): ExtraRoute[] {
  const indexUrl = abs(ARTICLES_PATH);
  const crumbs = (steps: { name: string; item: string }[]) =>
    steps.map((step, i) => ({ "@type": "ListItem", position: i + 1, ...step }));

  const index: ExtraRoute = {
    path: ARTICLES_PATH,
    title: ARTICLES_TITLE,
    description: ARTICLES_DESCRIPTION,
    ogType: "website",
    ld: stringify([
      { "@type": "ProfessionalService", "@id": ORG, name: SITE.name, url: SITE.url },
      {
        "@type": "Blog",
        "@id": `${indexUrl}#blog`,
        url: indexUrl,
        name: ARTICLES_TITLE,
        description: ARTICLES_DESCRIPTION,
        inLanguage: "en",
        isPartOf: { "@id": WEBSITE },
        publisher: { "@id": ORG },
        breadcrumb: { "@id": `${indexUrl}#breadcrumb` },
        blogPost: articles.map((a) => ({ "@id": `${articleUrl(a)}#article` })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${indexUrl}#breadcrumb`,
        itemListElement: crumbs([
          { name: SITE.name, item: SITE.url },
          { name: "Articles", item: indexUrl },
        ]),
      },
    ]),
  };

  const each = articles.map((a): ExtraRoute => {
    const url = articleUrl(a);
    return {
      path: articlePath(a),
      title: a.title,
      description: a.description,
      ogType: "article",
      ld: stringify([
        { "@type": "ProfessionalService", "@id": ORG, name: SITE.name, url: SITE.url },
        {
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          url,
          mainEntityOfPage: url,
          headline: a.h1,
          description: a.description,
          abstract: plain(a.lead),
          image: `${SITE.url}og-image.png`,
          datePublished: a.published,
          dateModified: lastChange(a),
          inLanguage: "en",
          keywords: a.keywords.join(", "),
          author: { "@id": ORG },
          publisher: { "@id": ORG },
          isPartOf: { "@id": `${indexUrl}#blog` },
          breadcrumb: { "@id": `${url}#breadcrumb` },
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${url}#breadcrumb`,
          itemListElement: crumbs([
            { name: SITE.name, item: SITE.url },
            { name: "Articles", item: indexUrl },
            { name: a.h1, item: url },
          ]),
        },
      ]),
    };
  });

  return [index, ...each];
}

const xml = (t: string) =>
  t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/**
 * /articles/feed.xml, RSS 2.0. Feed readers, Google and anything that wants
 * to repost an article can follow the site from here.
 */
export function rssXml(): string {
  const rfc822 = (iso: string) => new Date(`${iso}T12:00:00Z`).toUTCString();
  const newest = articles.length ? lastChange(articles[0]) : undefined;
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${xml(`${SITE.name}: Articles`)}</title>`,
    `    <link>${abs(ARTICLES_PATH)}</link>`,
    `    <description>${xml(ARTICLES_DESCRIPTION)}</description>`,
    "    <language>en</language>",
    `    <atom:link href="${abs(`${ARTICLES_PATH}/feed.xml`)}" rel="self" type="application/rss+xml" />`,
    ...(newest ? [`    <lastBuildDate>${rfc822(newest)}</lastBuildDate>`] : []),
    ...articles.flatMap((a) => [
      "    <item>",
      `      <title>${xml(a.h1)}</title>`,
      `      <link>${articleUrl(a)}</link>`,
      `      <guid isPermaLink="true">${articleUrl(a)}</guid>`,
      `      <pubDate>${rfc822(a.published)}</pubDate>`,
      `      <description>${xml(plain(a.lead))}</description>`,
      "    </item>",
    ]),
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}

/** Every address the site has, with the date of this build. */
export function sitemapXml({ modified }: Pick<PageFacts, "modified">): string {
  /* An article's date is its own, not the build's: rebuilding the site does
     not change what the article says. null leaves the date out, for a page
     this build does not make. */
  const entry = (loc: string, priority: string, lastmod: string | null = modified) =>
    [
      "  <url>",
      `    <loc>${loc}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entry(SITE.url, "1.0"),
    ...pages.map((p) => entry(abs(p.path), "0.8")),
    entry(abs(ARTICLES_PATH), "0.7"),
    ...articles.map((a) => entry(articleUrl(a), "0.6", lastChange(a))),
    /* The Build Brief is its own site on brief.forgedone.xyz, with no sitemap
       of its own. Its robots.txt points here, which is what lets this sitemap
       list it. */
    entry(SITE.briefUrl, "0.9", null),
    "</urlset>",
    "",
  ].join("\n");
}

/**
 * /llms.txt, in the llmstxt.org shape: a title, a one-paragraph summary, then
 * plain sections. It is the page with the layout taken off, for a model that
 * would rather read 4 kB of markdown than 50 kB of markup.
 */
export function llmsTxt({ modified }: Pick<PageFacts, "modified">): string {
  const lines = [
    `# ${SITE.name}`,
    "",
    `> ${SITE.summary} Everything is delivered remotely.`,
    "",
    `Also written as ${SITE.alternateNames.join(" or ")}. Website: ${SITE.url}. Last updated ${modified}.`,
    "",
    "## Where it works",
    "",
    "- Based in Barbados (Atlantic Standard Time, UTC-4). Works in English.",
    `- Works with businesses in ${SITE.countries.join(", ")}, the rest of the Caribbean, and further afield.`,
    "- Everything is built and delivered remotely.",
    "",
    "## Services",
    "",
    ...services.map((s) => `- [${s.name}](${serviceUrl(s)}): ${s.desc}`),
    "",
    "## Pages",
    "",
    ...pages.map((p) => `- [${p.kind === "place" ? p.h1 : p.name}](${abs(p.path)}): ${p.description}`),
    "",
    "## Articles",
    "",
    ...articles.map((a) => `- [${a.h1}](${articleUrl(a)}) (${a.published}): ${a.description}`),
    "",
    "## How to start",
    "",
    `- [The Build Brief](${SITE.briefUrl}): A guided form that takes about twelve minutes. You describe the jobs eating your team's time or the thing you need built. It scores each job on the hours you would get back against how buildable it looks, ranks them, and hands you the brief. Answers stay in your browser until you send them, and the brief is yours whether or not you work with Forged One. What comes back is a written scope, within two working days, not a sales call.`,
    `- [Book a call](${SITE.callUrl}): Thirty minutes, to talk it through first.`,
    "",
    "## Contact",
    "",
    `- Email: ${SITE.email}`,
    `- Phone: ${SITE.phone}`,
    ...SITE.sameAs.map((u) => `- ${u}`),
    "",
    "## Questions and answers",
    "",
    ...faqs.flatMap((f) => [`### ${f.q}`, "", f.a, ""]),
  ];
  return lines.join("\n").trimEnd() + "\n";
}
