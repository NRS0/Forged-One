/**
 * The two article pages: the list at /articles, and one article at
 * /articles/<slug>. The content comes from src/articles.ts.
 *
 * Like src/Page.tsx, these borrow the home page's own nav, footer and reveal
 * rather than drawing lookalikes. The difference is the reading column: an
 * article is read top to bottom, so the text runs in one measure-width column
 * instead of the service pages' heading-left, copy-right grid.
 */
import { Fragment, useEffect, useState, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Navbar, Footer, FloatingCTA, LegalModal, Reveal } from "./App";
import { Blacksmith } from "./Blacksmith";
import { SITE } from "./content";
import { articles, articlePath, readingMinutes, longDate, ARTICLES_PATH, ARTICLES_TITLE, type Article } from "./articles";

const label = "text-[9px] uppercase tracking-[0.5em] font-mono text-accent";
const crumb = "text-secondary hover:text-accent transition-colors";

/** A string with [text](href) links in it, drawn as text and links. */
const Rich = ({ text }: { text: string }) => {
  const parts: ReactNode[] = [];
  const link = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  for (let m = link.exec(text); m; m = link.exec(text)) {
    parts.push(text.slice(last, m.index));
    const [, words, path] = m;
    /* Written as /services/ai-agents in the article, drawn as the full
       address, so a copy imported into Medium still points back here. */
    const href = path.startsWith("/") ? `${SITE.url.replace(/\/$/, "")}${path}` : path;
    const away = /^https?:\/\//.test(href) && !href.startsWith(SITE.url) && !href.startsWith(SITE.briefUrl);
    parts.push(
      <a
        key={m.index}
        href={href}
        {...(away ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-white underline decoration-accent decoration-1 underline-offset-4 hover:text-accent transition-colors"
      >
        {words}
      </a>,
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
};

/** Sets the tab title on the dev server; the built HTML already has it. */
const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

const Shell = ({ children }: { children: ReactNode }) => {
  const [legalType, setLegalType] = useState<"Privacy" | "Terms" | "Accessibility" | null>(null);
  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar home={false} />
      <FloatingCTA />
      <Blacksmith />
      <main className="relative z-10">{children}</main>
      <Footer home={false} onOpenLegal={(type) => setLegalType(type)} />
      <LegalModal isOpen={!!legalType} onClose={() => setLegalType(null)} type={legalType} />
    </div>
  );
};

const Meta = ({ article }: { article: Article }) => (
  <p className="text-[9px] uppercase tracking-[0.4em] font-mono text-muted">
    <time dateTime={article.published}>{longDate(article.published)}</time>
    <span aria-hidden="true"> · </span>
    {readingMinutes(article)} min read
  </p>
);

const BriefButton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
    <a href={SITE.briefUrl}>
      <button className="group bg-accent text-white text-sm font-normal rounded-full px-8 py-4 hover:bg-[#ff5146] transition-colors cursor-pointer inline-flex items-center gap-3">
        Start the brief
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </a>
    <a
      href={SITE.callUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[9px] uppercase tracking-[0.4em] font-mono text-muted hover:text-accent transition-colors"
    >
      or talk it through first
    </a>
  </div>
);

/* ─────────────────────────────── /articles ─────────────────────────────── */

export function ArticlesIndex() {
  useTitle(ARTICLES_TITLE);
  return (
    <Shell>
      <header className="px-8 md:px-16 pt-36 md:pt-48 pb-16 md:pb-24">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 text-[9px] font-mono uppercase tracking-[0.4em] mb-10 md:mb-14">
          <a href="/" className={crumb}>Forged One</a>
          <span className="text-muted" aria-hidden="true">/</span>
          <span className="text-accent" aria-current="page">Articles</span>
        </nav>
        {/* The same headline face as the service pages; see src/Page.tsx. */}
        <h1 className="hero-title font-sans font-bold uppercase text-white [word-spacing:0.16em] text-[11vw] sm:text-6xl md:text-[5.5rem] lg:text-[7rem] max-w-6xl">
          Articles
        </h1>
        <p className="mt-8 md:mt-12 max-w-2xl text-base md:text-xl font-light leading-snug text-secondary">
          What we have learned building AI automation, agents and software for businesses in Barbados and across the Caribbean. Written for the people running them.
        </p>
      </header>

      <section className="border-t border-line px-8 md:px-16 pb-16 md:pb-28">
        <ul className="max-w-4xl">
          {articles.map((a) => (
            <li key={a.slug} className="border-b border-line">
              <a href={articlePath(a)} className="group py-10 md:py-14 flex flex-col gap-4 no-underline">
                <Meta article={a} />
                <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-secondary group-hover:text-accent transition-colors duration-300 leading-[0.95]">
                  {a.h1}
                </h2>
                <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-2xl">{a.description}</p>
                <span className="inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] font-mono text-accent">
                  Read the article
                  <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </Shell>
  );
}

/* ─────────────────────────── /articles/<slug> ─────────────────────────── */

export function ArticleView({ article }: { article: Article }) {
  useTitle(article.title);
  return (
    <Shell>
      <article>
        <header className="px-8 md:px-16 pt-36 md:pt-48 pb-12 md:pb-20">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 text-[9px] font-mono uppercase tracking-[0.4em] mb-10 md:mb-14">
            <a href="/" className={crumb}>Forged One</a>
            <span className="text-muted" aria-hidden="true">/</span>
            <a href={ARTICLES_PATH} className={crumb}>Articles</a>
          </nav>
          {/* Smaller than a service page's headline: an article's title is a
              sentence, not three words, and at 7rem it would run to six lines. */}
          <h1 className="hero-title font-sans font-bold uppercase text-white [word-spacing:0.16em] text-[9vw] sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl">
            {article.h1}
          </h1>
          <div className="mt-8 md:mt-10">
            <Meta article={article} />
          </div>
          <p className="mt-8 md:mt-10 max-w-2xl text-lg md:text-2xl font-light leading-snug text-secondary">
            <Rich text={article.lead} />
          </p>
        </header>

        <div className="border-t border-line px-8 md:px-16 py-14 md:py-20">
          <div className="max-w-2xl flex flex-col gap-14 md:gap-16">
            {article.sections.map((s) => (
              <section key={s.h} className="flex flex-col gap-6">
                <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wide text-secondary leading-[0.95]">{s.h}</h2>
                {s.body.map((part, i) =>
                  typeof part === "string" ? (
                    <p key={i} className="text-secondary text-base md:text-lg font-light leading-relaxed">
                      <Rich text={part} />
                    </p>
                  ) : (
                    <ul key={i} className="border-b border-line">
                      {part.map((item, n) => (
                        <li key={item} className="border-t border-line py-4 flex items-baseline gap-6">
                          <span className="text-[9px] font-mono font-medium tracking-widest text-accent shrink-0">
                            {String(n + 1).padStart(2, "0")}
                          </span>
                          <span className="text-secondary text-base md:text-lg font-light leading-snug">
                            <Rich text={item} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </section>
            ))}
          </div>
        </div>
      </article>

      {article.related && article.related.length > 0 && (
        <section className="border-t border-line py-14 md:py-20 px-8 md:px-16">
          <span className={`${label} mb-6 block`}>Read next</span>
          <div className="border-b border-line max-w-2xl">
            {article.related.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group border-t border-line py-5 flex items-center justify-between gap-6 no-underline"
              >
                <span className="font-serif text-2xl md:text-3xl tracking-tight text-secondary group-hover:text-accent transition-colors duration-300">
                  {l.label}
                </span>
                <ArrowRight size={16} className="text-accent shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line py-16 md:py-28 px-8 md:px-16">
        <Reveal className="flex flex-col gap-6 max-w-3xl">
          <span className={label}>The Build Brief</span>
          <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-secondary leading-[0.9]">
            Find out what is worth building first.
          </h2>
          <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-xl">
            The Build Brief takes about twelve minutes. It ranks the jobs eating your team's time by the hours you would get back against how buildable each one looks, and what comes back is a written scope within two working days, not a sales call.
          </p>
          <BriefButton />
        </Reveal>
      </section>
    </Shell>
  );
}
