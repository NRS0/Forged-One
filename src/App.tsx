/**
 * FORGED 1, AI for Business Leaders
 * Redesigned: assertive minimalism inspired by missioncontrol.co
 */

import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, animate } from "motion/react";
import { ArrowRight, ArrowDown, Plus } from "lucide-react";
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
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    return scrollY.on("change", (latest) => setScrolled(latest > 50));
  }, [scrollY]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? "bg-white/90 backdrop-blur-xl border-b border-black/5 shadow-sm py-3" : "bg-white py-5 border-b border-black/5"}`}>
      <div className="flex justify-between items-center px-8 md:px-16">
        <motion.a href="#" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-4"
        >
          <img 
            src="https://imglink.cc/cdn/-G5PGyVsCf.png" 
            alt="FORGED 1 Logo" 
            className="h-10 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-main/40 text-[8px] uppercase tracking-[0.4em] hidden md:inline">AI for Business Leaders</span>
          </div>
        </motion.a>

        <div className="flex items-center gap-12">
          <motion.a href="#contact" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="hidden lg:flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] font-bold text-accent hover:text-accent/80 transition-colors duration-300"
          >
            <span>Book a Strategy Call</span>
          </motion.a>

          <motion.a href="#services" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] font-medium text-main/60 hover:text-accent transition-colors duration-300"
          >
            <span className="hidden md:inline">Our Services</span>
            <div className="w-10 h-10 border border-main/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
              <ArrowRight size={13} className="text-main group-hover:text-white transition-colors" />
            </div>
          </motion.a>
        </div>
      </div>
    </nav>
  );
};

/* ─────────────────────────────── HERO ─────────────────────────────── */

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const taglines = [
    { text: "Strategy", accent: true },
    { text: "Leadership", accent: false },
    { text: "Decision-Making", accent: true },
  ];
  const [activeTag, setActiveTag] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setActiveTag(i => (i + 1) % taglines.length), 3000);
    return () => clearInterval(interval);
  }, [taglines.length]);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 pt-40 overflow-hidden">
      {/* background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="https://imglink.cc/cdn/yilKLu3tUf.mp4" type="video/mp4" />
      </video>

      {/* ambient glow removed */}

      <motion.div style={{ opacity }} className="relative z-10">
        {/* eyebrow */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-8 h-px bg-accent" />
          <span className="text-[9px] uppercase tracking-[0.6em] text-accent">Next-Gen AI Solutions</span>
        </motion.div>

        {/* headline */}
        <motion.div style={{ y: y1 }}>
          <h1 className="font-serif leading-none tracking-[0.02em] uppercase flex flex-col">
            <motion.img
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              src="https://imglink.cc/cdn/P7zm8Tr4Cq.png"
              alt="FORGED 1"
              className="h-[14vw] md:h-[10vw] w-auto object-contain self-start mb-4"
              referrerPolicy="no-referrer"
            />
            <motion.span
              initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
              className="block text-[6vw] md:text-[3.5vw] text-secondary tracking-[0.1em]"
            >
              AI FOR BUSINESS
            </motion.span>
          </h1>

          {/* rotating tagline */}
          <div className="mt-8 h-8 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTag}
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className={`text-[9px] uppercase tracking-[0.5em] font-mono ${taglines[activeTag].accent ? "text-accent" : "text-secondary"}`}>
                  {taglines[activeTag].text}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* stats + CTA row */}
        <motion.div 
          style={{ y: y2 }} 
          className="mt-64 grid grid-cols-2 md:grid-cols-12 gap-8 border-t border-line pt-10 relative"
        >
          {/* full-width gradient overlay for visibility */}
          <div className="absolute top-0 bottom-[-100vh] left-[-100vw] right-[-100vw] -z-10 bg-linear-to-b from-main via-main/90 to-main opacity-95" />
          
          {[
            { n: "3X", label: "Increase in efficiency" },
            { n: "75%", label: "Boost sales outreach" },
            { n: "1st", label: "In market" },
          ].map(({ n, label }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-2 flex flex-col gap-2"
            >
              <span className="font-serif text-5xl text-secondary leading-none">
                <Counter value={n} />
              </span>
              <span className="text-[9px] uppercase tracking-[0.5em] text-accent font-mono">{label}</span>
            </motion.div>
          ))}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }} className="md:col-start-8 md:col-span-5 flex flex-col gap-6"
          >
            <p className="text-base md:text-lg leading-relaxed text-secondary font-light">
              We build the autonomous systems that define the next decade of industrial dominance.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* scroll indicator */}
      <motion.div 
        style={{ opacity: scrollIndicatorOpacity }}
        animate={{ y: [0, 10, 0] }} 
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-secondary z-20"
      >
        <span className="text-[8px] uppercase tracking-[0.5em] font-mono">Scroll</span>
        <ArrowDown size={18} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

/* ─────────────────────────────── MARQUEE ─────────────────────────────── */

const MarqueeDivider = () => {
  const items = ["Strategy", "Generative AI", "Leadership", "Prompt Engineering", "AI Ethics", "ROI Measurement", "Team Building", "ML Lifecycle"];
  const doubled = [...items, ...items];
  return (
    <div className="py-8 border-y border-line overflow-hidden bg-surface marquee-mask">
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

const SectionHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle: string }) => {
  const { ref, inView } = useInView();
  return (
    <div ref={ref} className="flex flex-col gap-6 mb-20">
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
          className="text-6xl md:text-[7rem] font-serif tracking-wider uppercase text-secondary leading-[0.85]"
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
    <section id="workflows" className="py-28 px-8 md:px-16">
      <SectionHeader number="01" title="Workflows" subtitle="Practical applications for immediate ROI" />
      <div className="flex flex-col">
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
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group border-t border-line last:border-b"
    >
      <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-16 py-10 md:py-14 cursor-default">
        {/* left: number + category */}
        <div className="md:w-40 shrink-0 flex md:flex-col items-center md:items-start gap-4 md:gap-2">
          <span className="text-[9px] font-mono font-medium tracking-widest text-accent">{id}</span>
          <span className="text-[9px] font-mono uppercase tracking-[0.4em] text-accent">{category}</span>
        </div>
        {/* middle: title + description */}
        <div className="flex-1 flex flex-col gap-3">
          <h3 className="text-3xl md:text-4xl font-serif tracking-tight text-secondary group-hover:text-accent transition-colors duration-500 leading-[0.95]">
            {title}
          </h3>
          <p className="text-sm text-secondary font-light leading-relaxed max-w-lg">
            {description}
          </p>
          {/* expandable detail */}
          <div className={`accordion-content ${hovered ? "open" : ""}`}>
            <div className="accordion-inner">
              <p className="text-sm text-secondary font-light leading-relaxed max-w-lg pt-3 border-t border-line mt-3">
                {detail}
              </p>
            </div>
          </div>
        </div>
        {/* right: arrow indicator */}
        <div className="shrink-0 self-center md:self-start">
          <motion.div
            animate={{ rotate: hovered ? 45 : 0, scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
            className="w-10 h-10 border border-secondary/10 flex items-center justify-center group-hover:border-accent transition-colors duration-300"
          >
            <Plus size={14} className="text-accent group-hover:text-accent transition-colors" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────── SERVICES ─────────────────────────────── */

const ServicesSection = () => {
  const services = [
    { n: "01", name: "Intelligent Chatbots", desc: "Advanced conversational interfaces built on custom LLMs for 24/7 customer engagement and support.", color: "#FFFFFF" },
    { n: "02", name: "AI Advertising", desc: "Algorithmic ad optimization and automated creative generation for maximum conversion at minimum spend.", color: "#FF3B2F" },
    { n: "03", name: "Data Collection", desc: "Automated harvesting and structured extraction of complex datasets from across the digital landscape.", color: "#FFFFFF" },
    { n: "04", name: "Autonomous AI Agents", desc: "Custom-built agents capable of executing multi-step complex workflows with minimal human oversight.", color: "#FF3B2F" },
    { n: "05", name: "AI Courses", desc: "Boutique education programs designed to equip business leaders with the literacy to lead AI initiatives confidently.", color: "#FFFFFF" },
  ];

  return (
    <section id="services" className="py-28 px-8 md:px-16 border-t border-line">
      <SectionHeader number="02" title="Services" subtitle="End-to-end AI integration for modern enterprise" />

      {/* vertical card list */}
      <div className="flex flex-col">
        {services.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.04}>
            <div className="group border-t border-line last:border-b flex items-center gap-6 md:gap-12 py-8 md:py-12 cursor-default hover:bg-secondary/[0.02] transition-colors duration-500 px-2 md:px-4">
              <span className="font-serif text-4xl md:text-5xl leading-none shrink-0" style={{ color: s.color }}>{s.n}</span>
              <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 md:gap-12">
                <h3 className="text-xl md:text-3xl font-serif tracking-tight text-secondary group-hover:text-accent transition-colors duration-400 md:w-1/3">
                  {s.name}
                </h3>
                <p className="text-sm text-secondary font-light leading-relaxed max-w-lg flex-1">
                  {s.desc}
                </p>
              </div>
              <div className="w-16 h-px bg-secondary/5 group-hover:w-24 group-hover:bg-accent/40 transition-all duration-500 shrink-0" />
            </div>
          </Reveal>
        ))}
      </div>

      {/* total stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 mt-16 border border-line">
        {[
          { n: "500k+", label: "Data Points/Day" },
          { n: "24/7", label: "Agent Uptime" },
          { n: "4.2x", label: "Avg. ROI Increase" },
        ].map(({ n, label }) => (
          <Reveal key={label}>
            <div className="bg-main p-10 flex flex-col gap-2 text-center border-b md:border-b-0 md:border-r border-line last:border-r-0 last:border-b-0">
              <span className="font-serif text-5xl md:text-6xl text-secondary">
                <Counter value={n} />
              </span>
              <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent">{label}</span>
            </div>
          </Reveal>
        ))}
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
    <section id="edge" ref={ref} className="py-28 px-8 md:px-16 bg-surface border-t border-line relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-accent/2 blur-[180px] pointer-events-none" />

      <SectionHeader number="03" title="The Edge" subtitle="Why AI literacy is the new baseline" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 items-center">
        {/* video */}
        <div className="md:col-span-7">
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
        <div className="md:col-span-5 flex flex-col justify-center gap-10">
          <Reveal>
            <p className="text-3xl md:text-[2.6rem] font-serif leading-[1.05] tracking-wide text-secondary">
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
            <div className="flex flex-wrap gap-8 md:gap-12">
              {[
                { n: "3×", label: "More market share" },
                { n: "60%", label: "Cost reduction" },
                { n: "18mo", label: "Ahead of laggards" },
              ].map(({ n, label }) => (
                <div key={label} className="flex flex-col gap-1">
                  <span className="font-serif text-4xl text-accent">{n}</span>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-accent">{label}</span>
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
    <section id="manifesto" ref={ref} className="py-36 px-8 md:px-16 border-t border-line overflow-hidden">
      <motion.div style={{ scale }}>
        <div className="flex items-center gap-4 mb-16">
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
      q: "Who is this course for?",
      a: "Business leaders, managers, and decision-makers who want to understand AI without needing to code. Whether you're in strategy, operations, marketing, or HR, this course gives you the literacy to lead AI initiatives confidently."
    },
    {
      q: "How long does it take to complete?",
      a: "The complete course runs 1 hour and 41 minutes across 29 lectures. It's designed to be consumed in one focused session or spread across a week, whatever fits your schedule."
    },
    {
      q: "Do I need technical experience?",
      a: "No. This course is built for non-technical leaders. We focus on strategic understanding, decision frameworks, and practical application, not coding or data science."
    },
    {
      q: "What makes this different from other AI courses?",
      a: "Most AI courses teach you how to build models. This one teaches you how to wield them. It's designed for the people who fund, direct, and scale AI, not the people who code it."
    },
    {
      q: "Is there a certificate?",
      a: "Yes. Upon completion, you'll receive a FORGED 1 certificate demonstrating your AI leadership competency, a credential recognized by our network of industry partners."
    },
  ];

  return (
    <section className="py-28 px-8 md:px-16 border-t border-line bg-surface">
      <SectionHeader number="04" title="FAQ" subtitle="Common questions answered" />
      <div className="max-w-3xl">
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

const Footer = () => (
  <footer className="py-20 px-8 md:px-16 border-t border-line">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
      <div className="md:col-span-4">
        <div className="flex flex-col gap-4 mb-8">
          <img 
            src="https://imglink.cc/cdn/P7zm8Tr4Cq.png" 
            alt="FORGED 1 Logo" 
            className="h-10 w-auto object-contain self-start"
            referrerPolicy="no-referrer"
          />
          <span className="text-[8px] uppercase tracking-[0.4em] font-mono text-accent">AI for Business Leaders</span>
        </div>
        <p className="text-secondary text-sm leading-relaxed max-w-xs">
          A boutique education platform for the next generation of industry leaders.
        </p>
      </div>

      <div className="md:col-span-2 md:col-start-6">
        <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent mb-6 block">Navigate</span>
        <div className="flex flex-col gap-3">
          {["Workflows", "Services", "The Edge", "Manifesto"].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-secondary hover:text-accent transition-colors tracking-wide">{item}</a>
          ))}
        </div>
      </div>

      <div className="md:col-span-3 md:col-start-9">
        <span className="text-[9px] uppercase tracking-[0.5em] font-mono text-accent mb-6 block">Contact</span>
        <a href="mailto:hello@forged1.ai" className="text-lg font-serif text-secondary hover:text-accent transition-colors">hello@forged1.ai</a>
        <div className="flex gap-8 mt-8">
          {["LinkedIn", "X / Twitter", "YouTube"].map(s => (
            <a key={s} href="#" className="text-[9px] uppercase tracking-widest font-mono text-accent hover:text-accent transition-colors">{s}</a>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 md:col-start-12 flex flex-col justify-between">
        <a href="#services" className="group inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.5em] font-mono font-medium text-accent hover:text-accent transition-colors">
          <span>Our Services</span>
          <div className="w-10 h-10 border border-secondary/10 flex items-center justify-center group-hover:border-accent group-hover:bg-accent transition-all duration-300">
            <ArrowRight size={12} className="group-hover:text-main transition-colors" />
          </div>
        </a>
      </div>
    </div>

    <div className="mt-16 pt-8 border-t border-line flex flex-col md:flex-row justify-between gap-6">
      <p className="text-[9px] uppercase tracking-[0.5em] font-mono text-secondary/12">© 2026 Forged 1, All rights reserved</p>
      <div className="flex gap-10">
        {["Privacy", "Terms", "Accessibility"].map(l => (
          <a key={l} href="#" className="text-[9px] uppercase tracking-[0.4em] font-mono text-secondary/12 hover:text-secondary transition-colors">{l}</a>
        ))}
      </div>
    </div>
  </footer>
);

/* ─────────────────────────────── FLOATING CTA ─────────────────────────────── */

const FloatingCTA = () => {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => setVisible(latest > 300));
  }, [scrollY]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href="#contact"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-[60] hidden md:flex items-center"
        >
          <div className="bg-accent text-white py-6 px-4 [writing-mode:vertical-lr] rotate-180 flex items-center gap-4 hover:pr-8 transition-all duration-500 group shadow-2xl border-l border-white/10 cursor-pointer">
            <span className="text-[10px] uppercase tracking-[0.4em] font-mono font-bold whitespace-nowrap">Book a Free Strategy Call</span>
            <div className="w-px h-8 bg-white/30 group-hover:h-12 transition-all duration-500" />
            <ArrowRight size={14} className="-rotate-90 group-hover:translate-y-1 transition-transform" />
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <FloatingCTA />
      <main className="relative z-10">
        <Hero />
        <MarqueeDivider />
        <Workflows />
        <ServicesSection />
        <CompetitiveEdge />
        <Manifesto />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
