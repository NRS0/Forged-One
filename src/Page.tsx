/**
 * The template for every page that is not the home page: a service, or a
 * country. The content comes from src/pages.ts; this file only decides how a
 * page of it is drawn, so ten pages look like one site and an eleventh costs
 * nothing but its copy.
 *
 * It borrows the home page's own parts (nav, footer, reveal, accordion) rather
 * than drawing lookalikes that would drift.
 */
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Navbar, Footer, FloatingCTA, LegalModal, Reveal, AccordionItem } from "./App";
import { Blacksmith } from "./Blacksmith";
import { SITE } from "./content";
import { type PageData, type Block } from "./pages";

const label = "text-[9px] uppercase tracking-[0.5em] font-mono text-accent";

const BlockBody = ({ block }: { block: Block }) => (
  <div className="flex flex-col gap-6">
    {block.body.map((part, i) =>
      typeof part === "string" ? (
        <p key={i} className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-xl">
          {part}
        </p>
      ) : (
        <ul key={i} className="border-b border-line max-w-xl">
          {part.map((item, n) => (
            <li key={item} className="border-t border-line py-4 flex items-baseline gap-6">
              <span className="text-[9px] font-mono font-medium tracking-widest text-accent shrink-0">
                {String(n + 1).padStart(2, "0")}
              </span>
              <span className="text-secondary text-sm md:text-base font-light leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      ),
    )}
    {block.links && <LinkRows links={block.links} />}
  </div>
);

const LinkRows = ({ links }: { links: { label: string; href: string }[] }) => (
  <div className="border-b border-line max-w-xl">
    {links.map((l) => (
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
);

export default function Page({ page }: { page: PageData }) {
  const [legalType, setLegalType] = useState<"Privacy" | "Terms" | "Accessibility" | null>(null);

  /* The built HTML already carries the right title. This is for the dev
     server, which serves the home page's <head> at every address. */
  useEffect(() => {
    document.title = page.title;
  }, [page.title]);

  const toBrief = page.cta.href.startsWith(SITE.briefUrl);

  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar home={false} />
      <FloatingCTA />
      <Blacksmith />

      <main className="relative z-10">
        {/* ── header ── */}
        <header className="px-8 md:px-16 pt-36 md:pt-48 pb-16 md:pb-24">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-3 text-[9px] font-mono uppercase tracking-[0.4em] mb-10 md:mb-14">
            <a href="/" className="text-secondary hover:text-accent transition-colors">Forged One</a>
            <span className="text-muted" aria-hidden="true">/</span>
            {page.parent && (
              <>
                <a href={page.parent.href} className="text-secondary hover:text-accent transition-colors">{page.parent.name}</a>
                <span className="text-muted" aria-hidden="true">/</span>
              </>
            )}
            <span className="text-accent" aria-current="page">{page.name}</span>
          </nav>

          {/* The same face as the home page's headline: DM Sans, bold, tight,
              upper case, white. `hero-title` is what carries it there, and it
              also overrides the Bebas Neue every other heading gets by default.
              Bebas stays where the home page uses it, on the section titles. */}
          <h1 className="hero-title font-sans font-bold uppercase text-white text-[11vw] sm:text-6xl md:text-[5.5rem] lg:text-[7rem] max-w-6xl">
            {page.h1}
          </h1>

          <p className="mt-8 md:mt-12 max-w-2xl text-base md:text-xl font-light leading-snug text-secondary">
            {page.lead}
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-10">
            <a href={page.cta.href} {...(toBrief ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
              <button className="group bg-accent text-white text-sm font-normal rounded-full px-8 py-4 hover:bg-[#ff5146] transition-colors cursor-pointer inline-flex items-center gap-3">
                {page.cta.label}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            {toBrief && (
              <a
                href={SITE.callUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[9px] uppercase tracking-[0.4em] font-mono text-muted hover:text-accent transition-colors"
              >
                or talk it through first
              </a>
            )}
          </div>
        </header>

        {/* ── content ── */}
        {page.blocks.map((block, i) => (
          <section key={block.h} className="border-t border-line py-14 md:py-24 px-8 md:px-16">
            <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
              <div className="lg:col-span-5 flex flex-col gap-4">
                <span className="text-[9px] font-mono font-medium tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-secondary leading-[0.9]">
                  {block.h}
                </h2>
              </div>
              <div className="lg:col-span-7">
                <BlockBody block={block} />
              </div>
            </Reveal>
          </section>
        ))}

        {/* ── questions ── */}
        <section className="border-t border-line bg-surface py-14 md:py-24 px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className={label}>{page.name}</span>
              <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-secondary leading-[0.9]">
                Common questions
              </h2>
            </div>
            <div className="lg:col-span-7 border-b border-line">
              {page.faqs.map((faq) => (
                <div key={faq.q}>
                  <AccordionItem question={faq.q} answer={faq.a} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── the door ── */}
        <section className="border-t border-line py-16 md:py-28 px-8 md:px-16">
          <Reveal className="flex flex-col gap-6 max-w-3xl">
            <span className={label}>{toBrief ? "The Build Brief" : "Book a call"}</span>
            <h2 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-secondary leading-[0.9]">
              {page.cta.heading}
            </h2>
            <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-xl">{page.cta.text}</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
              <a href={page.cta.href} {...(toBrief ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                <button className="group bg-accent text-white text-sm font-normal rounded-full px-8 py-4 hover:bg-[#ff5146] transition-colors cursor-pointer inline-flex items-center gap-3">
                  {page.cta.label}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </a>
              {toBrief && (
                <a
                  href={SITE.callUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] uppercase tracking-[0.4em] font-mono text-muted hover:text-accent transition-colors"
                >
                  or talk it through first
                </a>
              )}
            </div>
          </Reveal>
        </section>
      </main>

      {/* The footer lists every service and country, so each page links to
          all the others without a second list here saying the same thing. */}
      <Footer home={false} onOpenLegal={(type) => setLegalType(type)} />
      <LegalModal isOpen={!!legalType} onClose={() => setLegalType(null)} type={legalType} />
    </div>
  );
}
