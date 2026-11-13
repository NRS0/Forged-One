/**
 * Everything on the site that is written for a machine rather than a person:
 * the JSON-LD graph and /llms.txt. Both are built from src/content.ts at build
 * time by scripts/prerender.mjs, so neither can say something the page does not.
 */
import { SITE, services, serviceUrl, faqs } from "./content";
import { pages, type PageData } from "./pages";

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

/** Every address the site has, with the date of this build. */
export function sitemapXml({ modified }: Pick<PageFacts, "modified">): string {
  const entry = (loc: string, priority: string, lastmod = true) =>
    [
      "  <url>",
      `    <loc>${loc}</loc>`,
      ...(lastmod ? [`    <lastmod>${modified}</lastmod>`] : []),
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entry(SITE.url, "1.0"),
    ...pages.map((p) => entry(abs(p.path), "0.8")),
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
