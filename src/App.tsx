/**
 * FORGED 1, AI for Business Leaders
 * Redesigned: assertive minimalism inspired by missioncontrol.co
 */

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from "motion/react";
import { ArrowRight, ArrowDown, Plus, X, Menu } from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";

/* ─────────────────────────────── UTILS ─────────────────────────────── */

function useInView() {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

/* ─────────────────────────────── SCROLL REVEAL ─────────────────────────────── */

const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode, delay?: number, className?: string, key?: any }) => {
  const { ref, inView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────────────── COUNTER ─────────────────────────────── */

const Counter = ({ value, duration = 2.5 }: { value: string, duration?: number }) => {
  const { ref, inView } = useInView();
  const numMatch = value.match(/(\d+(\.\d+)?)/);
  const target = numMatch ? parseFloat(numMatch[0]) : 0;
  const suffix = value.replace(numMatch ? numMatch[0] : "", "");
  const isDecimal = numMatch && numMatch[0].includes(".");
  
  const count = useMotionValue(0);
  const [display, setDisplay] = useState<string | number>(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, { 
        duration: duration, 
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (isDecimal) {
            setDisplay(latest.toFixed(1));
          } else {
            setDisplay(Math.round(latest));
          }
        }
      });
      return controls.stop;
    }
  }, [inView, target, duration, count, isDecimal]);

  return <span ref={ref}>{display}{suffix}</span>;
};

/* ─────────────────────────────── NAVBAR ─────────────────────────────── */

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`fixed z-50 px-6 md:px-10 left-0 right-0 top-0 flex items-center justify-between gap-4 transition-all duration-300 ${scrolled ? "pt-4 pb-4" : "pt-6"} bg-transparent`}>
        {/* Left pill */}
        <div className="flex items-center bg-neutral-900/90 backdrop-blur rounded-full px-4 py-2">
          <img 
            src="https://imglink.cc/cdn/-G5PGyVsCf.png" 
            alt="FORGED 1 Logo" 
            className="h-6 w-auto object-contain invert brightness-200"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Center pill (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900/90 backdrop-blur rounded-full px-3 py-2">
          {[
            { name: "Workflows", href: "#workflows" },
            { name: "Services", href: "#services" },
            { name: "The Brief", href: "#brief" },
            { name: "The Edge", href: "#edge" },
            { name: "FAQ", href: "#faq" }
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-neutral-300 hover:text-white transition-colors text-sm px-5 py-2 rounded-full cursor-pointer"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <a href="https://calendly.com/forgedonebusiness/30min" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
            <button className="bg-accent text-white text-sm font-normal rounded-full px-6 py-3 hover:bg-[#ff5146] transition-colors cursor-pointer">
              Book Call
            </button>
          </a>
          
          {/* Hamburger Menu Button for mobile/tablet */}
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden bg-neutral-900/90 backdrop-blur text-white p-3 rounded-full hover:text-accent transition-colors cursor-pointer flex items-center justify-center"
            aria-label="Toggle Menu"
          >
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Full-Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-main flex flex-col justify-between p-8 md:p-16"
          >
            {/* Header in overlay */}
            <div className="flex items-center justify-between">
              <img 
                src="https://imglink.cc/cdn/-G5PGyVsCf.png" 
                alt="FORGED 1 Logo" 
                className="h-6 w-auto object-contain invert brightness-200"
                referrerPolicy="no-referrer"
              />
              <button 
                onClick={() => setMenuOpen(false)}
                className="bg-neutral-900/90 backdrop-blur text-white p-3 rounded-full hover:text-accent transition-colors cursor-pointer flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-6 my-auto">
              {[
                { name: "Workflows", href: "#workflows" },
                { name: "Services", href: "#services" },
                { name: "The Brief", href: "#brief" },
                { name: "The Edge", href: "#edge" },
                { name: "FAQ", href: "#faq" }
              ].map((item, index) => (
                <motion.a
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-5xl md:text-7xl uppercase tracking-wider text-secondary hover:text-accent transition-colors"
                >
                  {item.name}
                </motion.a>
              ))}
            </div>

            {/* Bottom info / CTA */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-t border-line pt-8">
              <span className="text-[10px] uppercase tracking-[0.4em] font-mono text-accent">AI for Business Leaders · Barbados</span>
              <a 
                href="https://calendly.com/forgedonebusiness/30min" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="w-full sm:w-auto"
              >
                <button className="w-full sm:w-auto bg-accent text-white text-sm font-normal rounded-full px-8 py-4 hover:bg-[#ff5146] transition-colors cursor-pointer">
                  Book Strategy Call
                </button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─────────────────────────────── HERO ─────────────────────────────── */

const Hero = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        src="https://imglink.cc/cdn/yilKLu3tUf.mp4"
      />

      {/* Foreground content wrapper */}
      <div className="relative h-full w-full max-w-[1440px] mx-auto z-10">
        {/* Desktop-only: Three giant staggered headline words */}
        <h1 className="hidden lg:block">
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hero-title absolute text-white font-bold font-sans lg:text-[13vw] lg:left-[160px] top-[18%] uppercase tracking-tighter"
          >
            ai
          </motion.span>
          
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="hero-title absolute text-white font-bold font-sans lg:text-[13vw] lg:right-[712px] top-[38%] uppercase tracking-tighter"
          >
            for
          </motion.span>
          
          <motion.span 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="hero-title absolute text-white font-bold font-sans lg:text-[13vw] lg:left-[28%] top-[58%] uppercase tracking-tighter"
          >
            businesses
          </motion.span>
        </h1>

        {/* Tablet-only: Uniform & well-structured headline layout */}
        <h1 className="absolute left-12 top-[22%] hidden md:flex lg:hidden flex-col gap-2 z-10">
          <motion.span 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hero-title text-white font-bold font-sans text-[11vw] uppercase tracking-tighter leading-[0.85]"
          >
            ai
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="hero-title text-white font-bold font-sans text-[11vw] uppercase tracking-tighter leading-[0.85]"
          >
            for
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="hero-title text-white font-bold font-sans text-[11vw] uppercase tracking-tighter leading-[0.85]"
          >
            businesses
          </motion.span>
        </h1>

        {/* Mobile-only: Uniform & well-structured headline layout */}
        <h1 className="absolute left-6 top-[20%] md:hidden flex flex-col gap-1 z-10">
          <motion.span 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="hero-title text-white font-bold font-sans text-[15vw] xs:text-[16vw] uppercase tracking-tighter leading-[0.85]"
          >
            ai
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="hero-title text-white font-bold font-sans text-[15vw] xs:text-[16vw] uppercase tracking-tighter leading-[0.85]"
          >
            for
          </motion.span>
          <motion.span 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="hero-title text-white font-bold font-sans text-[15vw] xs:text-[16vw] uppercase tracking-tighter leading-[0.85]"
          >
            businesses
          </motion.span>
        </h1>

        {/* Description paragraph */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ duration: 1.5, delay: 0.7 }}
          className="absolute right-6 md:right-10 top-[46%] max-w-[180px] xs:max-w-[220px] md:max-w-[240px] text-xs xs:text-[14px] md:text-[15px] leading-snug text-white/90 lowercase text-right"
        >
          we build the autonomous systems that define the next decade of industrial dominance
        </motion.p>

        {/* Stat block — top-right */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
          className="absolute right-6 md:right-24 top-[24%] sm:top-[26%] flex flex-col items-end"
        >
          <div className="flex items-center gap-3 justify-end">
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[20deg]" />
            <span className="text-3xl md:text-5xl font-medium tracking-tight text-white">3x</span>
          </div>
          <span className="text-[10px] md:text-sm text-white/70 mt-0.5 text-right lowercase">efficiency increase</span>
        </motion.div>

        {/* Stat block — bottom-left */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
          className="absolute left-6 md:left-20 bottom-24 md:bottom-24 flex flex-col items-start"
        >
          <div className="flex items-center gap-3 justify-start">
            <span className="text-3xl md:text-5xl font-medium tracking-tight text-white">75%</span>
            <div className="hidden md:block h-px w-24 bg-white/40 rotate-[-20deg]" />
          </div>
          <span className="text-[10px] md:text-sm text-white/70 mt-0.5 lowercase">boost sales outreach</span>
        </motion.div>

        {/* Stat block — bottom-right */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="absolute right-6 md:right-20 bottom-12 md:bottom-20 flex flex-col items-end"
        >
          <div className="flex items-center gap-3 justify-end">
            <div className="h-px w-24 bg-white/40 rotate-[-20deg] hidden md:block" />
            <span className="text-3xl md:text-5xl font-medium tracking-tight text-white">1st</span>
          </div>
          <span className="text-[10px] md:text-sm text-white/70 mt-0.5 text-right lowercase">in market rank</span>
        </motion.div>

        {/* Bottom gradient overlay */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent to-black" />
      </div>
    </section>
  );
};

/* ─────────────────────────────── MARQUEE ─────────────────────────────── */

const MarqueeDivider = () => {
  const items = ["Strategy", "Generative AI", "Based in Barbados", "Leadership", "Prompt Engineering", "Serving the Caribbean", "AI Ethics", "ROI Measurement", "Team Building", "ML Lifecycle"];
  const doubled = [...items, ...items];
  return (
    <div className="-mt-6 md:-mt-12 lg:-mt-[59px] mb-12 md:mb-16 py-8 border-y border-line bg-surface marquee-container relative z-30">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="whitespace-nowrap px-6 font-mono text-[11px] tracking-[0.3em] text-secondary uppercase select-none">
            {item}
            <span className="text-accent/40 mx-6">/</span>
          </span>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────── SECTION HEADER ─────────────────────────────── */

const SectionHeader = ({ number, title, subtitle, className = "" }: { number: string, title: string, subtitle: string, className?: string }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className={`flex flex-col gap-6 mb-12 md:mb-20 ${className}`}>
      <div className="flex items-center gap-4">
        <motion.span initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} className="text-[9px] font-mono font-medium tracking-widest text-accent">{number}</motion.span>
        <motion.div initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-px flex-1 bg-secondary/8 origin-left"
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.h2 initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="text-3xl xs:text-4xl sm:text-5xl md:text-[5rem] lg:text-[7rem] font-serif tracking-wider uppercase text-secondary leading-[0.85]"
        >{title}</motion.h2>
        <motion.p initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }} className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent max-w-[220px] leading-relaxed"
        >{subtitle}</motion.p>
      </div>
    </div>
  );
};

/* ─────────────────────────────── WORKFLOWS ─────────────────────────────── */

const Workflows = () => {
  const cases = [
    {
      id: "01", title: "Decision Support", category: "Strategy",
      description: "Are You Tracking the AI Developments That Will Define Your Industry?",
      detail: "AI is not evolving evenly, it's advancing in sharp, uneven bursts across specific domains. The developments that matter most to you are not the headlines everyone is sharing, but the niche breakthroughs that directly impact your workflows, costs, and output quality. This course builds the radar you need."
    },
    {
      id: "02", title: "Customer Intelligence", category: "Marketing",
      description: "Transform customer data into actionable insights with AI-powered analytics and predictive modeling.",
      detail: "Leverage generative AI to understand customer behavior patterns, predict churn, and personalize engagement at scale, turning your marketing from reactive to anticipatory."
    },
    {
      id: "03", title: "Process Autonomy", category: "Operations",
      description: "Automate complex operational workflows while maintaining strategic oversight and quality control.",
      detail: "From supply chain optimization to intelligent document processing, AI can handle the repetitive while you focus on the strategic. Learn to identify which processes are ripe for autonomy."
    },
    {
      id: "04", title: "Talent Optimization", category: "HR",
      description: "Reshape how your organization attracts, develops, and retains talent in an AI-augmented workplace.",
      detail: "AI is redefining job roles, skill requirements, and team structures. Understand how to build teams that combine human creativity with AI capability for maximum output."
    },
  ];

  return (
    <section id="workflows" className="py-16 md:py-28 px-0 md:px-0">
      <SectionHeader number="01" title="workflows" subtitle="the workflows of elite operators" className="px-8 md:px-16" />
      <div className="flex flex-col px-8 md:px-16 border-b border-line">
        {cases.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.06}>
            <WorkflowCard {...c} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const WorkflowCard = ({ id, title, category, description, detail }: {
  id: string, title: string, category: string, description: string, detail: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = isOpen || hovered;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setIsOpen(!isOpen)}
      className="group border-t border-line"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16 py-8 md:py-14 cursor-pointer">
        {/* left: number + category */}
        <div className="md:w-40 shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-2">
          <span className="text-[9px] font-mono font-medium tracking-widest text-accent">{id}</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-accent">{category}</span>
        </div>
        {/* middle: title + description */}
        <div className="flex-1 flex flex-col gap-3">
          <h3 className={`text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-secondary transition-colors duration-500 leading-[0.95] ${active ? "text-accent" : "group-hover:text-accent"}`}>
            {title}
          </h3>
          <p className="text-sm text-secondary font-light leading-relaxed max-w-lg">
            {description}
          </p>
          {/* expandable detail */}
          <div className={`accordion-content ${active ? "open" : ""}`}>
            <div className="accordion-inner">
              <p className="text-sm text-secondary font-light leading-relaxed max-w-lg pt-3 border-t border-line mt-3">
                {detail}
              </p>
            </div>
          </div>
        </div>
        {/* right: arrow indicator */}
        <div className="shrink-0 self-start">
          <motion.div
            animate={{ rotate: active ? 45 : 0, scale: active ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className={`w-10 h-10 border flex items-center justify-center transition-colors duration-300 ${active ? "border-accent" : "border-secondary/10 group-hover:border-accent"}`}
          >
            <Plus size={14} className="text-accent" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── SERVICES ─────────────────────────────── */

const ServicesSection = () => {
  const services = [
    { n: "01", name: "Custom Applications & Tools", desc: "Build bespoke software, internal tools, and AI-powered interfaces engineered around how your business actually operates.", color: "#FFFFFF" },
    { n: "02", name: "AI Advertising", desc: "Scale your outreach and conversion with self-optimizing, high-impact algorithmic campaigns.", color: "#FFFFFF" },
    { n: "03", name: "Data Pipelines", desc: "Scrape, structure, and synthesize critical industry datasets to feed your decision-making engines.", color: "#FFFFFF" },
    { n: "04", name: "Autonomous Agents", desc: "Deploy self-governing digital workforces that execute multi-step operational loops.", color: "#FFFFFF" },
    { n: "05", name: "AI Courses", desc: "Equip your leadership with the framework knowledge to guide technical implementation without losing strategic control.", color: "#FFFFFF" },
  ];

  return (
    <section id="services" className="py-16 md:py-28 px-0 md:px-0 border-t border-line">
      <SectionHeader number="02" title="services" subtitle="strategic capabilities for the industrial age" className="px-8 md:px-16" />

      {/* vertical card list */}
      <div className="flex flex-col px-8 md:px-16 border-b border-line">
        {services.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.04}>
            <div className="group border-t border-line flex items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 py-8 md:py-10 lg:py-12 cursor-default hover:bg-secondary/[0.02] transition-colors duration-500 px-0 md:px-4">
              <span className="font-serif text-3xl md:text-5xl leading-none shrink-0" style={{ color: s.color }}>{s.n}</span>
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-8 lg:gap-12">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-serif tracking-tight text-secondary group-hover:text-accent transition-colors duration-400 md:w-[40%] lg:w-1/3">
                  {s.name}
                </h3>
                <p className="text-sm text-secondary font-light leading-relaxed max-w-lg flex-1">
                  {s.desc}
                </p>
              </div>
              <div className="hidden sm:block w-12 md:w-16 lg:w-24 h-px bg-secondary/5 group-hover:bg-accent/40 transition-all duration-500 shrink-0" />
            </div>
          </Reveal>
        ))}
      </div>

      {/* total stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 mt-16 border border-line">
        {[
          { n: "100+", label: "Leaders Trained" },
          { n: "24/7", label: "Agent Execution" },
          { n: "14", label: "Custom Workflows" },
        ].map(({ n, label }, index) => (
          <Reveal 
            key={label}
            className={`bg-main p-10 flex flex-col gap-2 text-center border-line
              ${index < 2 ? "border-b md:border-b-0 md:border-r" : ""}
            `}
          >
            <span className="font-serif text-5xl md:text-6xl text-secondary">
              <Counter value={n} />
            </span>
            <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent">{label}</span>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ─────────────────────────────── THE BRIEF ─────────────────────────────── */

const BuildBrief = () => {
  const points = [
    { k: "About 12 minutes", v: "It saves in your browser as you go, so you can start it now and finish it later." },
    { k: "Nothing is sent until you send it", v: "Your answers stay on your device. At the end you copy it, download it, or send it over." },
    { k: "The brief is yours either way", v: "Ranked opportunities with the hours behind them, whether or not you work with us." },
  ];

  return (
    <section id="brief" className="py-16 md:py-28 px-0 md:px-0 border-t border-line">
      <SectionHeader number="03" title="the brief" subtitle="tell us what's slow, we'll tell you what's buildable" className="px-8 md:px-16" />

      <div className="px-8 md:px-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        <Reveal className="lg:col-span-7 flex flex-col gap-6">
          <h3 className="font-serif text-3xl md:text-5xl uppercase tracking-wide text-secondary leading-[0.9]">
            Twelve minutes instead of two discovery calls.
          </h3>
          <p className="text-secondary text-sm md:text-base font-light leading-relaxed max-w-xl">
            The Build Brief turns a vague sense that something should be automated into a scoped
            piece of work. You describe the jobs eating your team's time: how often they run, how
            long they take, and how much of that is copying, retyping and chasing.
          </p>
          <p className="text-muted text-sm md:text-base font-light leading-relaxed max-w-xl">
            It scores each job on the hours you would get back against how buildable it looks, ranks
            them against each other, and hands you the brief at the end. Send it over and we come
            back with a scope, not a sales call.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mt-2">
            <a href="https://brief.forgedone.xyz" target="_blank" rel="noopener noreferrer">
              <button className="group bg-accent text-white text-sm font-normal rounded-full px-8 py-4 hover:bg-[#ff5146] transition-colors cursor-pointer inline-flex items-center gap-3">
                Start the brief
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <a
              href="https://calendly.com/forgedonebusiness/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] uppercase tracking-[0.4em] font-mono text-muted hover:text-accent transition-colors"
            >
              or talk it through first
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5 w-full">
          <div className="border border-line">
            {points.map((row, i) => (
              <div key={row.k} className={`p-6 md:p-8 flex flex-col gap-2 ${i < points.length - 1 ? "border-b border-line" : ""}`}>
                <span className="text-[9px] uppercase tracking-[0.4em] font-mono text-accent">{row.k}</span>
                <p className="text-sm text-secondary font-light leading-relaxed">{row.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

/* ─────────────────────────────── THE EDGE ─────────────────────────────── */

const CompetitiveEdge = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section id="edge" ref={ref} className="py-16 md:py-28 px-0 md:px-0 bg-surface border-t border-line relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-accent/2 blur-[180px] pointer-events-none" />

      <SectionHeader number="04" title="the edge" subtitle="why ai literacy is the new baseline" className="px-8 md:px-16" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 lg:gap-12 mt-12 items-center px-8 md:px-16">
        {/* video */}
        <div className="md:col-span-12 lg:col-span-7 mb-8 lg:mb-0">
          <div className="relative aspect-video overflow-hidden border border-line shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="https://imglink.cc/cdn/uk2b_8PwJk.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 flex items-end p-6 bg-linear-to-t from-main/60 to-transparent">
              <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent">Visual Intelligence</span>
            </div>
            <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent" />
          </div>
        </div>

        {/* statement */}
        <div className="md:col-span-12 lg:col-span-5 flex flex-col justify-center gap-8 lg:gap-10">
          <Reveal>
            <p className="text-3xl md:text-4xl lg:text-[2.6rem] font-serif leading-[1.05] tracking-wide text-secondary">
              "The greatest risk isn't <span className="text-accent">AI itself</span>, it's being the last to understand its potential."
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex items-center gap-4">
              <div className="w-8 h-px bg-accent" />
              <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent">Market Dominance</span>
            </div>
            <p className="text-secondary font-light leading-relaxed mt-4">
              Early adopters are capturing 3× more market share through AI-driven insights and automated decision cycles.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12">
              {[
                { n: "3×", label: "More market share" },
                { n: "60%", label: "Cost reduction" },
                { n: "18mo", label: "Ahead of laggards" },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-serif text-3xl sm:text-4xl text-accent leading-none">{n}</span>
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-mono text-accent">{label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────── MANIFESTO ─────────────────────────────── */

const Manifesto = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);
  const words = "The leaders who define the next decade are not the ones who build AI, they are the ones who understand it well enough to wield it.".split(" ");
  const accentWords = new Set(["understand", "wield"]);

  return (
    <section id="manifesto" ref={ref} className="py-20 md:py-36 px-0 md:px-0 border-t border-line overflow-hidden">
      <motion.div style={{ scale }} className="px-8 md:px-16">
        <div className="flex items-center gap-4 mb-8 md:mb-16">
          <div className="w-2 h-2 rounded-full bg-accent" />
          <span className="text-[9px] uppercase tracking-[0.6em] font-mono text-accent">Manifesto</span>
        </div>
        <p className="text-3xl md:text-[3.5rem] font-serif leading-[1.1] tracking-wide text-secondary max-w-6xl">
          {words.map((word, i) => (
            <Word key={i} word={word} index={i} total={words.length} accent={accentWords.has(word.toLowerCase().replace(/[—,\.]/g, ""))} />
          ))}
        </p>
      </motion.div>
    </section>
  );
};

const Word = ({ word, index, total, accent }: { word: string, index: number, total: number, accent: boolean, key?: any }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.4"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [20, 0]);
  return (
    <motion.span ref={ref} style={{ opacity, y }}
      className={`inline-block mr-[0.3em] ${accent ? "text-accent" : ""}`}
    >{word}</motion.span>
  );
};

/* ─────────────────────────────── FAQ ─────────────────────────────── */

const FAQ = () => {
  const faqs = [
    {
      q: "Where are you based?",
      a: "Barbados. We work with businesses across the Caribbean and further afield, and everything we build is delivered remotely. Being in the region means we are in your timezone and we understand how business actually runs here."
    },
    {
      q: "Who is this course designed for?",
      a: "Business leaders, executives, and elite operators who need to move past AI theory and master real, production-ready workflows that drive organizational efficiency."
    },
    {
      q: "How much time is required?",
      a: "The program is designed for busy professionals. You can progress at your own pace, with structured modules that can be completed in under 4 hours per week."
    },
    {
      q: "Do I need a technical background?",
      a: "No. This course is built specifically for leaders. We focus on strategic implementation, high-level architectures, and decision frameworks, not writing code."
    },
    {
      q: "What makes Forged 1 different?",
      a: "Unlike theoretical courses, Forged 1 provides exact, operational blueprints. You will see real-world systems, cost breakdowns, and live deployments that you can clone immediately."
    },
    {
      q: "Is there post-program support?",
      a: "Yes. Every participant gets access to our exclusive network of alumni, ongoing workflow updates, and monthly live strategy calls to review custom implementations."
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-28 px-0 md:px-0 border-t border-line bg-surface">
      <SectionHeader number="05" title="faq" subtitle="common questions answered" className="px-8 md:px-16" />
      <div className="max-w-3xl px-8 md:px-16">
        {faqs.map((faq, i) => (
          <Reveal key={i} delay={i * 0.04}>
            <AccordionItem question={faq.q} answer={faq.a} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const AccordionItem = ({ question, answer }: { question: string, answer: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-t border-line">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-8 text-left group"
      >
        <span className="text-base md:text-lg text-secondary/80 group-hover:text-accent transition-colors duration-300 max-w-[85%]">{question}</span>
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 w-8 h-8 border border-secondary/10 flex items-center justify-center group-hover:border-accent transition-colors"
        >
          <Plus size={12} className="text-accent group-hover:text-accent transition-colors" />
        </motion.div>
      </button>
      <div className={`accordion-content ${open ? "open" : ""}`}>
        <div className="accordion-inner">
          <p className="text-sm text-secondary font-light leading-relaxed pb-8 max-w-xl">{answer}</p>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── FOOTER ─────────────────────────────── */


const Footer = ({ onOpenLegal }: { onOpenLegal: (type: "Privacy" | "Terms" | "Accessibility") => void }) => (
    <footer className="py-12 md:py-20 px-0 md:px-0 border-t border-line">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 px-8 md:px-16">
      <div className="md:col-span-4">
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center">
            <img 
              src="https://imglink.cc/cdn/-G5PGyVsCf.png" 
              alt="FORGED 1 Logo" 
              className="h-6 w-auto object-contain invert brightness-200"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[8px] uppercase tracking-[0.4em] font-mono text-accent">AI for Business Leaders</span>
        </div>
        <p className="text-secondary text-sm leading-relaxed max-w-xs">
          The definitive AI business leadership course for the industrial age. Master the workflows that define the next decade of industry leadership.
        </p>
        <p className="text-muted text-sm leading-relaxed max-w-xs mt-4">
          Based in Barbados, building for businesses across the Caribbean and beyond.
        </p>
      </div>

      <div className="md:col-span-2 md:col-start-6">
        <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent mb-6 block">Navigate</span>
        <div className="flex flex-col gap-3">
          {[
            { name: "Workflows", href: "#workflows" },
            { name: "Services", href: "#services" },
            { name: "The Brief", href: "#brief" },
            { name: "The Edge", href: "#edge" },
            { name: "FAQ", href: "#faq" }
          ].map(item => (
            <a key={item.name} href={item.href} className="text-sm text-secondary hover:text-accent transition-colors tracking-wide">{item.name}</a>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 md:col-start-8">
        <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent mb-6 block">Contact</span>
        <a href="mailto:forgedonebusiness@gmail.com" className="text-lg font-serif text-secondary hover:text-accent transition-colors">forgedonebusiness@gmail.com</a>
        <div className="flex flex-wrap gap-4 md:gap-8 mt-8">
          {[
            { name: "LinkedIn", href: "https://www.linkedin.com/company/forgedone/" },
            { name: "Instagram", href: "https://www.instagram.com/forgedone.xyz" },
            { name: "YouTube", href: "#" }
          ].map(s => (
            <a
              key={s.name}
              href={s.href}
              {...(s.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
              className="text-[9px] uppercase tracking-widest font-mono text-accent hover:text-accent transition-colors"
            >{s.name}</a>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 md:col-start-11 flex flex-col justify-between">
        <a href="#workflows" className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] font-mono font-medium text-accent hover:text-accent transition-colors">
          <span>Our Workflows</span>
          <div className="w-10 h-10 border border-secondary/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
            <ArrowRight size={12} className="group-hover:text-main transition-colors" />
          </div>
        </a>
      </div>
    </div>

    <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row justify-between gap-8 md:gap-6 px-8 md:px-16">
      <p className="text-[9px] uppercase tracking-[0.5em] font-mono text-secondary">© 2026, ALL RIGHTS RESERVED</p>
      <div className="flex gap-10">
        {["Privacy", "Terms", "Accessibility"].map(l => (
          <button 
            key={l} 
            onClick={() => onOpenLegal(l as any)}
            className="text-[9px] uppercase tracking-[0.4em] font-mono text-secondary hover:text-accent transition-colors cursor-pointer"
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────── LEGAL MODAL ─────────────────────────────── */

const LegalModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: "Privacy" | "Terms" | "Accessibility" | null }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!type) return null;

  const content = {
    Privacy: {
      title: "Privacy Policy",
      text: `Forged One · forgedone.xyz · Last updated: April 13, 2025

1. Who We Are
Forged One ("we", "us", "our") operates the website at forgedone.xyz. This policy explains what information we collect, how we use it, and your rights regarding it.

2. Information We Collect
Information you provide directly:
• Contact details (name, email) if you fill out a contact or sign-up form
• Any messages or communications you send us

Information collected automatically:
• IP address and general location (country/region)
• Browser type and version
• Pages visited and time spent
• Referring URLs
• Device type and operating system

Cookies and similar technologies:
We use essential cookies to operate the site and, where applicable, analytics cookies to understand how visitors use it. You can disable cookies in your browser settings, though some site functionality may be affected.

3. How We Use Your Information
• To operate and improve the website
• To respond to enquiries you send us
• To monitor security and prevent abuse
• To analyse usage patterns through aggregated, anonymised analytics

We do not sell, rent, or trade your personal information to third parties.

4. Third-Party Services
We may use third-party tools such as hosting providers and analytics services (e.g. Cloudflare, Google Analytics, or similar). These services may process data on our behalf under their own privacy policies.

5. Data Retention
We retain personal data only as long as necessary for the purposes described above, or as required by law. Analytics data is typically retained in aggregated form.

6. Your Rights
Depending on your location, you may have the right to:
• Access the personal data we hold about you
• Request correction or deletion of your data
• Object to or restrict certain processing
• Withdraw consent at any time (where processing is based on consent)
• Lodge a complaint with your local data protection authority

To exercise any of these rights, contact us at the address below.

7. Data Security
We take reasonable technical and organisational measures to protect your data. No transmission over the internet is completely secure, however, and we cannot guarantee absolute security.

8. Children's Privacy
This site is not directed at children under 13. We do not knowingly collect personal data from children.

9. Changes to This Policy
We may update this policy from time to time. Changes will be posted on this page with an updated date. Continued use of the site after changes constitutes acceptance.

10. Contact
Questions about this policy? Reach us at: forgedonebusiness@gmail.com`
    },
    Terms: {
      title: "Terms of Use",
      text: `Forged One · forgedone.xyz · Last updated: April 13, 2025

1. Acceptance of Terms
By accessing or using forgedone.xyz ("the Site"), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.

2. Use of the Site
You may use the Site for lawful purposes only. You agree not to:
• Use the Site in any way that violates applicable local, national, or international law
• Attempt to gain unauthorised access to any part of the Site or its underlying systems
• Transmit any unsolicited or unauthorised advertising or spam
• Introduce malware, viruses, or other malicious code
• Scrape, harvest, or extract data from the Site in bulk without our prior written consent
• Impersonate any person or entity, or misrepresent your affiliation with any person or entity

3. Intellectual Property
All content on the site including text, graphics, logos, images, and code is the property of Forged One or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from any content on the Site without our express written permission.

4. User-Submitted Content
If you submit any content to us (e.g. via a contact form or other channel), you grant us a non-exclusive, royalty-free licence to use, display, and reproduce that content for the purposes of operating the Site and responding to you. You represent that you own or have the right to submit such content and that it does not infringe any third party's rights.

5. Third-Party Links
The Site may contain links to third-party websites. These are provided for convenience only. We have no control over those sites and accept no responsibility for their content, privacy practices, or availability.

6. Disclaimers
The Site and its content are provided "as is" without warranties of any kind, express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of harmful components. We make no representations about the accuracy, completeness, or suitability of any content on the Site.

7. Limitation of Liability
To the fullest extent permitted by law, Forged One shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of, or inability to use, the site even if we have been advised of the possibility of such damages.

8. Indemnification
You agree to indemnify and hold harmless Forged One and its operators from any claims, damages, or expenses (including legal fees) arising from your use of the Site or your violation of these Terms.

9. Governing Law
These Terms are governed by the laws of the jurisdiction in which Forged One operates, without regard to conflict of law principles. Any disputes shall be resolved in the courts of that jurisdiction.

10. Changes to These Terms
We reserve the right to modify these Terms at any time. Updated Terms will be posted on this page. Continued use of the Site after changes constitutes your acceptance of the revised Terms.

11. Contact
Questions about these Terms? Contact us at: forgedonebusiness@gmail.com`
    },
    Accessibility: {
      title: "Accessibility Statement",
      text: `Forged One · forgedone.xyz · Last updated: April 13, 2025

Our Commitment
Forged One is committed to ensuring that forgedone.xyz is accessible to everyone, including people with disabilities. We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA as our baseline standard.

Measures We Take
We work to make the Site accessible by:
• Using semantic HTML to provide meaningful structure
• Ensuring sufficient colour contrast between text and backgrounds
• Providing text alternatives for non-text content
• Making all functionality available via keyboard navigation
• Avoiding content that flashes or strobes in ways known to cause seizures
• Ensuring the Site is usable with screen readers and other assistive technologies
• Testing the Site across modern browsers and devices

Known Limitations
We are a small team and continuously working to improve. If you encounter any accessibility barriers, we want to hear from you.

Supported Assistive Technologies
We aim to support:
• Screen readers (including NVDA, JAWS, VoiceOver, and TalkBack)
• Keyboard-only navigation
• Browser zoom up to 200% without loss of functionality
• High contrast and forced-colour display modes

Feedback and Contact
If you experience any accessibility issues on the Site, or if you need content in an alternative format, please contact us:
Email: forgedonebusiness@gmail.com

We aim to acknowledge accessibility feedback within 2 business days and to resolve issues within 10 business days where possible.

Formal Complaints
If you are not satisfied with our response, you may contact the relevant national accessibility enforcement body in your country.`
    }
  }[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-main/95 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-surface border border-line p-8 md:p-12 overflow-y-auto shadow-2xl overscroll-contain custom-scrollbar"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-secondary/40 hover:text-accent transition-colors z-10"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span className="text-[9px] uppercase tracking-[0.6em] font-mono text-accent">Legal</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-8 leading-none">{content.title}</h2>
            
            <div className="space-y-6">
              {content.text.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-secondary/70 text-sm leading-relaxed whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
            
            <div className="mt-12 pt-8 border-t border-line">
              <button 
                onClick={onClose}
                className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent hover:text-accent/80 transition-colors"
              >
                Close Document
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ─────────────────────────────── FLOATING CTA ─────────────────────────────── */

const FloatingCTA = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => setVisible(latest > 300));
  }, [scrollY]);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.a
            href="https://calendly.com/forgedonebusiness/30min"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] hidden md:flex items-center"
          >
            <div className="bg-accent text-white py-6 px-4 [writing-mode:vertical-lr] rotate-180 flex items-center gap-4 hover:pr-8 transition-all duration-500 group shadow-2xl border-l border-white/10 cursor-pointer">
              <span className="text-[10px] uppercase tracking-[0.4em] font-mono font-bold whitespace-nowrap">book your strategy call</span>
              <div className="w-px h-8 bg-white/30 group-hover:h-12 transition-all duration-500" />
              <ArrowRight size={14} className="-rotate-90 group-hover:translate-y-1 transition-transform" />
            </div>
          </motion.a>
        )}
      </AnimatePresence>

      {/* Mobile and Tablet Floating CTA - Small, orange/accent, bottom-right, always accessible */}
      <motion.a
        href="https://calendly.com/forgedonebusiness/30min"
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed right-4 bottom-4 z-[40] md:hidden flex items-center"
      >
        <div className="bg-accent text-white text-[10px] font-mono font-medium tracking-wider uppercase py-2 px-3.5 rounded-full flex items-center gap-1.5 shadow-2xl border border-white/10 active:scale-95 hover:bg-[#ff5146] transition-all duration-200 cursor-pointer">
          <span>Book Call</span>
          <ArrowRight size={10} />
        </div>
      </motion.a>
    </>
  );
};

export default function App() {
  const [legalType, setLegalType] = useState<"Privacy" | "Terms" | "Accessibility" | null>(null);

  useEffect(() => {
    // Initialize Tally if script is loaded
    const tally = (window as any).Tally;
    if (tally && typeof tally.loadEmbeds === 'function') {
      tally.loadEmbeds();
    }
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip">
      <Navbar />
      <FloatingCTA />
      <main className="relative z-10">
        <Hero />
        <MarqueeDivider />
        <Workflows />
        <ServicesSection />
        <BuildBrief />
        <CompetitiveEdge />
        <Manifesto />
        <FAQ />
      </main>
      <Footer onOpenLegal={(type) => setLegalType(type)} />
      <LegalModal 
        isOpen={!!legalType} 
        onClose={() => setLegalType(null)} 
        type={legalType} 
      />
    </div>
  );
}
