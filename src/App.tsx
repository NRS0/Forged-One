/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ArrowUpRight,
  Menu, 
  X,
  Plus,
  ArrowDown,
  ChevronRight,
  Zap,
  Shield,
  Target,
  Cpu
} from "lucide-react";
import { useState, useRef, useEffect, ReactNode } from "react";

// --- Components ---

const Reveal = ({ children, width = "fit-content" }: { children: ReactNode, width?: "fit-content" | "100%" }) => {
  const ref = useRef(null);
  return (
    <div ref={ref} className="relative overflow-hidden" style={{ width }}>
      <motion.div
        initial={{ y: 75, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
      >
        {children}
      </motion.div>
    </div>
  );
};

const Modal = ({ isOpen, onClose, children }: { isOpen: boolean, onClose: () => void, children: ReactNode }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center p-8 md:p-12"
      >
        <div 
          className="absolute inset-0 bg-bg/90 backdrop-blur-sm cursor-pointer" 
          onClick={onClose}
        />
        <motion.div 
          initial={{ scale: 0, rotate: -15, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 15, opacity: 0 }}
          transition={{ 
            type: "spring", 
            damping: 25, 
            stiffness: 120,
            duration: 0.6
          }}
          className="relative bg-paper w-full max-w-2xl p-16 md:p-24 rounded-[3.5rem] border-[12px] border-bg/5 z-10 overflow-hidden shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-10 right-10 text-bg/40 hover:text-accent transition-colors z-20"
          >
            <X size={28} />
          </button>
          <div className="relative z-10 h-full flex flex-col justify-center text-center">
            {children}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotConfig = { damping: 30, stiffness: 250 };
  const ringConfig = { damping: 20, stiffness: 100 };

  const dotX = useSpring(mouseX, dotConfig);
  const dotY = useSpring(mouseY, dotConfig);
  const ringX = useSpring(mouseX, ringConfig);
  const ringY = useSpring(mouseY, ringConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = target.closest('a, button, [role="button"]');
      setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-10 h-10 border border-accent rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 0.6 : 0,
        }}
        animate={{
          scale: isHovering ? 1.8 : 1,
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] mix-blend-difference will-change-transform"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isVisible ? 1 : 0,
        }}
        animate={{
          scale: isHovering ? 0.4 : 1,
        }}
      />
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 w-full z-[1000] transition-all duration-500 ${scrolled ? "bg-paper py-4 shadow-xl" : "bg-paper py-6 border-b border-bg/5"}`}>
      <div className="max-w-[1800px] mx-auto flex justify-between items-center px-8 md:px-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
            <img 
              src="https://imglink.cc/cdn/-G5PGyVsCf.png" 
              alt="FORGED 1 Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="flex flex-col -gap-1">
            <span className="text-bg/40 text-[10px] uppercase tracking-[0.3em] font-bold transition-colors">AI Leadership</span>
          </div>
        </motion.div>

        <div className="flex items-center gap-12">
          <div className="hidden lg:flex items-center gap-8">
            {["Curriculum", "Workflows", "Edge", "Manifesto"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-[10px] uppercase tracking-[0.4em] text-bg/60 hover:text-bg transition-colors font-bold"
              >
                {item}
              </a>
            ))}
          </div>
          <button 
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-4 text-bg"
          >
            <div className="w-12 h-12 border border-bg/20 group-hover:border-bg flex items-center justify-center transition-colors relative overflow-hidden">
              <Menu size={20} className="group-hover:translate-y-10 transition-transform duration-300" />
              <Menu size={20} className="absolute -translate-y-10 group-hover:translate-y-0 transition-transform duration-300 text-bg" />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 bg-paper z-[2000] flex flex-col p-12 md:p-24"
          >
            <div className="flex justify-between items-center mb-24">
              <span className="font-display text-4xl text-bg">NAVIGATION</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-16 h-16 border border-bg/10 flex items-center justify-center hover:bg-bg hover:text-paper transition-all group"
              >
                <X size={32} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                <div className="flex flex-col gap-6">
                  {["Home", "Curriculum", "Workflows", "Edge", "Manifesto", "Apply"].map((item, idx) => (
                    <motion.a 
                      key={item}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      href={`#${item.toLowerCase()}`}
                      onClick={() => setIsOpen(false)}
                      className="text-bg text-6xl md:text-8xl font-display hover:text-accent hover:pl-8 transition-all duration-500 group flex items-center gap-8"
                    >
                      <span className="text-bg/20 text-sm font-body opacity-20 group-hover:opacity-100 transition-opacity">0{idx + 1}</span>
                      {item}
                    </motion.a>
                  ))}
                </div>
                <div className="flex flex-col justify-end gap-12 border-l border-bg/5 pl-12">
                  <div className="flex flex-col gap-4">
                    <span className="text-accent text-[10px] uppercase tracking-[0.4em] font-bold">Inquiries</span>
                    <a href="mailto:forge@forged1.ai" className="text-bg text-4xl font-display hover:text-accent transition-colors">FORGE@FORGED1.AI</a>
                  </div>
                  <div className="flex gap-12">
                    {["Instagram", "Twitter", "LinkedIn"].map(social => (
                      <a key={social} href="#" className="text-bg/40 text-[10px] uppercase tracking-widest hover:text-bg transition-colors font-bold">{social}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => (prev < 94 ? prev + 1 : 94));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative h-screen flex flex-col justify-center items-center px-8 overflow-hidden">
      <motion.div style={{ y, opacity }} className="relative z-10 text-center">
        <Reveal>
          <span className="text-accent text-[12px] uppercase tracking-[0.8em] font-bold mb-8 block">EST. 2026 — INDUSTRIAL AI</span>
        </Reveal>
        
        <motion.h1 
          className="text-[18vw] md:text-[14vw] font-display leading-[0.8] tracking-tight flex flex-col items-center"
        >
          <span className="glitch-text" data-text="FORGED">FORGED</span>
          <span className="flex items-center gap-4 text-gold">
            <span className="w-[10vw] h-2 bg-accent hidden md:block"></span>
            ONE
            <span className="w-[10vw] h-2 bg-accent hidden md:block"></span>
          </span>
        </motion.h1>

        <div className="mt-16 flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <div className="flex flex-col items-center">
            <span className="text-6xl font-display text-paper">{count}%</span>
            <span className="text-[10px] uppercase tracking-widest text-paper/40">Market Readiness</span>
          </div>
          <div className="w-px h-12 bg-paper/10 hidden md:block"></div>
          <p className="max-w-md text-paper/60 text-sm md:text-base leading-relaxed font-light">
            The definitive AI business leadership course for the industrial age. 
            Master the workflows that define the next decade of industry leadership.
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-16 bg-accent text-bg px-12 py-6 font-display text-2xl tracking-widest hover:bg-gold transition-colors relative group"
        >
          ENROLL NOW
          <div className="absolute inset-0 border border-accent translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
        </motion.button>
      </motion.div>

      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/20 blur-[120px] rounded-full"></div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-paper/20"
      >
        <ArrowDown size={32} strokeWidth={1} />
      </motion.div>
    </section>
  );
};

const Marquee = ({ direction = "left", text }: { direction?: "left" | "right", text: string }) => {
  return (
    <div className="py-12 border-y border-paper/10 overflow-hidden flex bg-bg relative z-20">
      <motion.div 
        animate={{ x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="text-6xl md:text-8xl font-display text-paper/10 outline-text">{text}</span>
            <Plus className="text-accent" size={40} />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const Manifesto = () => {
  const text = "AI is not a tool. It is a fundamental shift in the architecture of value. Those who treat it as a feature will be replaced by those who treat it as a foundation. FORGED 1 is the crucible where legacy leadership is burned away to reveal the industrial elite.";
  const words = text.split(" ");

  return (
    <section id="manifesto" className="py-64 px-8 md:px-24 bg-bg">
      <div className="max-w-6xl mx-auto">
        <span className="text-accent text-[10px] uppercase tracking-[0.8em] font-bold mb-12 block">THE MANIFESTO</span>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          {words.map((word, i) => (
            <Word key={i} progress={i / words.length}>{word}</Word>
          ))}
        </div>
      </div>
    </section>
  );
};

const Word = ({ children, progress }: { children: string, progress: number, key?: any }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "start 50%"]
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [10, 0]);

  return (
    <motion.span 
      ref={ref} 
      style={{ opacity, x }}
      className="text-4xl md:text-7xl font-display text-paper tracking-tight"
    >
      {children}
    </motion.span>
  );
};

const HorizontalScroll = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const sections = [
    { title: "THE ARCHITECTURE", desc: "Understanding the neural foundations of modern business.", icon: <Cpu size={48} /> },
    { title: "STRATEGIC FORGE", desc: "Building proprietary AI models for industry dominance.", icon: <Target size={48} /> },
    { title: "PROCESS KINETICS", desc: "Automating the high-value decision cycles.", icon: <Zap size={48} /> },
    { title: "LEGACY SHIELD", desc: "Protecting market share against algorithmic disruption.", icon: <Shield size={48} /> },
  ];

  return (
    <section id="curriculum" ref={targetRef} className="relative h-[300vh] bg-bg">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-24 px-24">
          <div className="flex flex-col justify-center min-w-[600px]">
            <span className="text-accent text-[10px] uppercase tracking-[0.8em] font-bold mb-8 block">CURRICULUM</span>
            <h2 className="text-8xl md:text-[10rem] font-display leading-[0.8] text-paper">THE<br/>CRUCIBLE</h2>
            <p className="mt-12 text-paper/40 max-w-md text-xl font-light">
              Four intensive modules designed to strip away inefficiency and rebuild your leadership for the AI era.
            </p>
          </div>
          {sections.map((s, i) => (
            <div key={i} className="min-w-[500px] h-[600px] bg-paper/5 border border-paper/10 p-16 flex flex-col justify-between group hover:border-accent transition-colors">
              <div className="text-accent group-hover:scale-110 transition-transform duration-500">{s.icon}</div>
              <div>
                <span className="text-gold text-sm mb-4 block font-bold">MODULE 0{i + 1}</span>
                <h3 className="text-6xl font-display text-paper mb-6">{s.title}</h3>
                <p className="text-paper/60 text-lg font-light leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const UseCases = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const cases = [
    { 
      id: "01", 
      title: "Are You Tracking the AI Developments That Will Define Your Industry?", 
      category: "Decision Support",
      popupContent: "Is really a question about awareness, timing, and competitive positioning. AI is not evolving evenly—it’s advancing in sharp, uneven bursts across specific domains (creative production, finance, healthcare, logistics, etc.). That means the developments that matter most to you are not the headlines everyone is sharing, but the niche breakthroughs that directly impact your workflows, costs, and output quality."
    },
    { id: "02", title: "Customer Intelligence", category: "Marketing" },
    { id: "03", title: "Process Autonomy", category: "Operations" },
    { id: "04", title: "Talent Optimization", category: "HR" }
  ];

  return (
    <section id="workflows" className="py-32 px-8 md:px-12 bg-bg relative z-10">
      <div className="flex flex-col gap-4 mb-24">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold tracking-widest text-accent">01</span>
          <div className="h-px flex-1 bg-paper/10"></div>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <h2 className="text-7xl md:text-9xl font-display tracking-tight text-paper">WORKFLOWS</h2>
          <p className="text-[10px] uppercase tracking-[0.4em] text-paper/40 max-w-[200px] leading-relaxed">
            Practical applications for immediate industrial ROI
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-paper/10 border-y border-paper/10">
        {cases.map((c) => (
          <motion.div 
            key={c.id}
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            onClick={() => c.popupContent && setActiveModal(c.id)}
            className={`bg-bg p-12 md:p-20 flex flex-col items-center justify-center text-center aspect-square group relative ${c.popupContent ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="absolute top-8 md:top-12 left-8 md:left-12 right-8 md:right-12 flex justify-between items-start">
              <span className="text-[10px] font-bold tracking-widest text-paper/20">{c.id}</span>
              {c.popupContent && <ArrowUpRight className="text-paper/20 group-hover:text-accent transition-colors" />}
            </div>
            <div className="max-w-[90%]">
              <span className="text-accent text-[10px] uppercase tracking-[0.4em] mb-6 block font-bold">{c.category}</span>
              <h3 className={`font-display tracking-wider ${c.id === "01" ? "text-4xl md:text-5xl leading-[1.1]" : "text-6xl md:text-8xl"} text-paper`}>
                {c.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal 
        isOpen={activeModal === "01"} 
        onClose={() => setActiveModal(null)}
      >
        <div className="flex flex-col gap-10 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-accent text-[10px] uppercase tracking-[0.6em] font-bold">Deep Dive Analysis</span>
            <h3 className="text-3xl md:text-5xl font-display leading-[1.1] tracking-tight text-bg">
              {cases[0].title}
            </h3>
          </div>

          <div className="w-24 h-px bg-bg/10"></div>
          
          <p className="text-lg md:text-xl leading-relaxed text-bg/80 font-light max-w-prose font-body">
            {cases[0].popupContent}
          </p>

          <button 
            onClick={() => setActiveModal(null)}
            className="mt-6 group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold py-4 px-8 rounded-full border border-bg/10 hover:bg-bg hover:text-paper transition-all"
          >
            Return to Workflows
          </button>
        </div>
      </Modal>
    </section>
  );
};

const CompetitiveEdge = () => {
  return (
    <section id="edge" className="py-64 px-8 md:px-12 bg-paper text-bg relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex flex-col gap-4 mb-24">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-bold tracking-widest text-accent">02</span>
            <div className="h-px flex-1 bg-bg/10"></div>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="text-7xl md:text-9xl font-display tracking-tight text-bg">THE EDGE</h2>
            <p className="text-[10px] uppercase tracking-[0.4em] text-bg/40 max-w-[200px] leading-relaxed">
              Why AI is the new baseline for industrial competition
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-24 mt-32">
          <div className="md:col-span-6">
            <div className="aspect-[4/5] bg-bg/5 relative overflow-hidden group">
              <img 
                src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
                alt="Industrial AI" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-accent/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
          <div className="md:col-span-5 md:col-start-8 flex flex-col justify-center gap-12">
            <Reveal>
              <p className="text-4xl md:text-6xl font-display leading-[0.9] text-bg">
                "THE GREATEST RISK ISN'T AI ITSELF, BUT BEING THE LAST TO UNDERSTAND ITS POTENTIAL."
              </p>
            </Reveal>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-px bg-accent"></div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-bg/60 font-bold">Market Dominance</span>
              </div>
              <p className="text-bg/60 font-body text-lg leading-relaxed">
                Early adopters are capturing 3x more market share through AI-driven insights and automated decision cycles. The industrial landscape is being re-forged in real-time.
              </p>
              <button className="flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] font-bold group">
                READ THE WHITE PAPER <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-32 px-8 md:px-12 bg-bg border-t border-paper/5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-24">
        <div className="md:col-span-4">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-16 h-16 flex items-center justify-center overflow-hidden">
              <img 
                src="https://imglink.cc/cdn/-G5PGyVsCf.png" 
                alt="FORGED 1 Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="text-gold text-[10px] uppercase tracking-[0.3em] font-bold">AI Leadership</span>
          </div>
          <p className="text-paper/40 text-sm leading-relaxed max-w-xs font-body">
            A boutique education platform for the next generation of industrial leaders. Re-forging leadership for the algorithmic age.
          </p>
        </div>

        <div className="md:col-span-2 md:col-start-7">
          <span className="text-accent text-[10px] uppercase tracking-[0.4em] mb-8 block font-bold">NAVIGATION</span>
          <div className="flex flex-col gap-4">
            {["Curriculum", "Workflows", "Edge", "Manifesto", "Apply"].map(item => (
              <a key={item} href="#" className="text-sm text-paper/60 hover:text-accent transition-colors font-bold uppercase tracking-widest">{item}</a>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 md:col-start-10">
          <span className="text-accent text-[10px] uppercase tracking-[0.4em] mb-8 block font-bold">NEWSLETTER</span>
          <div className="flex border-b border-paper/10 pb-4 group focus-within:border-accent transition-colors">
            <input 
              type="email" 
              placeholder="JOIN THE FORGE" 
              className="bg-transparent flex-1 text-sm outline-none text-paper placeholder:text-paper/20 font-display tracking-widest"
            />
            <button className="text-paper/40 hover:text-accent transition-colors"><ArrowRight size={20} /></button>
          </div>
        </div>
      </div>
      
      <div className="mt-32 pt-12 border-t border-paper/5 flex flex-col md:flex-row justify-between gap-8">
        <p className="text-[10px] uppercase tracking-[0.4em] text-paper/20 font-bold">© 2026 FORGED 1 — ALL RIGHTS RESERVED</p>
        <div className="flex gap-12">
          {["Privacy", "Terms", "Cookies"].map(item => (
            <a key={item} href="#" className="text-[10px] uppercase tracking-[0.4em] text-paper/20 hover:text-paper transition-colors font-bold">{item}</a>
          ))}
        </div>
      </div>
    </footer>
  );
};

// --- Main App ---

export default function App() {
  return (
    <div className="min-h-screen bg-bg selection:bg-accent selection:text-bg">
      <div className="noise-overlay" />
      <CustomCursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Marquee direction="left" text="INDUSTRIAL INTELLIGENCE" />
        <Manifesto />
        <HorizontalScroll />
        <Marquee direction="right" text="ALGORITHMIC DOMINANCE" />
        <UseCases />
        <CompetitiveEdge />
      </main>
      <Footer />
    </div>
  );
}
