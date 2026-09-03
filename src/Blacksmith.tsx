import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Hammer, X, ArrowUp, Square } from "lucide-react";

/* Blacksmith: the assistant in the bottom-left corner.
   Talks to /api/blacksmith, which streams the reply back as SSE. */

type Msg = { role: "user" | "assistant"; content: string };

/* The navbar logo is the trigger on phones, so it needs to know whether
   Blacksmith is configured and how to open it, without threading state
   through App. */
const readyListeners = new Set<() => void>();
export const blacksmith = {
  ready: false,
  open() { window.dispatchEvent(new CustomEvent("blacksmith:open")); },
  subscribe(fn: () => void) { readyListeners.add(fn); return () => { readyListeners.delete(fn); }; },
  announce(value: boolean) { blacksmith.ready = value; readyListeners.forEach((fn) => fn()); },
};

const STORE_KEY = "forgedone.blacksmith.v1";
const MAX_CHARS = 1500;

const OPENERS = [
  "What does Forged.One actually do?",
  "What is an AI agent?",
  "How do I get a quote?",
];

function load(): Msg[] {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(messages: Msg[]) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(messages.slice(-20)));
  } catch {
    /* private mode, or storage disabled. The conversation just won't persist. */
  }
}

/** Renders the plain text a model returns: paragraphs, and links made clickable. */
const Rich = ({ text }: { text: string }) => (
  <>
    {text.split("\n").map((line, i) => (
      <span key={i} className="block">
        {line.split(/(https?:\/\/[^\s)]+)/g).map((part, j) =>
          /^https?:\/\//.test(part) ? (
            <a
              key={j}
              href={part}
              target={part.includes("forgedone.xyz") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="text-accent underline underline-offset-2 break-words"
            >
              {part.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            </a>
          ) : (
            part
          ),
        )}
      </span>
    ))}
  </>
);

export const Blacksmith = () => {
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scroller = useRef<HTMLDivElement | null>(null);
  const input = useRef<HTMLTextAreaElement | null>(null);
  const abort = useRef<AbortController | null>(null);

  useEffect(() => {
    let live = true;
    fetch("/api/blacksmith")
      .then((r) => (r.ok ? r.json() : { ready: false }))
      .then((d) => {
        if (!live) return;
        setReady(Boolean(d.ready));
        blacksmith.announce(Boolean(d.ready));
      })
      .catch(() => { if (live) { setReady(false); blacksmith.announce(false); } });
    return () => { live = false; };
  }, []);

  useEffect(() => setMessages(load()), []);
  useEffect(() => { if (messages.length) save(messages); }, [messages]);

  /* stick to the bottom as the answer streams in */
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, streaming]);

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 120);
  }, [open]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("blacksmith:open", onOpen);
    return () => window.removeEventListener("blacksmith:open", onOpen);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const stop = useCallback(() => {
    abort.current?.abort();
    abort.current = null;
    setStreaming(false);
  }, []);

  const ask = useCallback(async (question: string) => {
    const text = question.trim();
    if (!text || streaming) return;

    setError(null);
    setDraft("");
    const history = [...messages, { role: "user" as const, content: text }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setStreaming(true);

    const controller = new AbortController();
    abort.current = controller;

    try {
      const res = await fetch("/api/blacksmith", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "I couldn't reach the forge just then.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split("\n\n");
        buffer = frames.pop() || "";

        for (const frame of frames) {
          const evt = /^event: (.+)$/m.exec(frame)?.[1];
          const raw = /^data: (.+)$/m.exec(frame)?.[1];
          if (!evt || !raw) continue;
          const data = JSON.parse(raw);

          if (evt === "delta") {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = {
                role: "assistant",
                content: next[next.length - 1].content + data.text,
              };
              return next;
            });
          } else if (evt === "error") {
            setError(data.message);
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError((err as Error).message || "Something went wrong at my end.");
      }
    } finally {
      abort.current = null;
      setStreaming(false);
      /* drop the placeholder if nothing ever arrived */
      setMessages((prev) =>
        prev.length && prev[prev.length - 1].role === "assistant" && !prev[prev.length - 1].content
          ? prev.slice(0, -1)
          : prev,
      );
    }
  }, [messages, streaming]);

  const clear = () => {
    stop();
    setMessages([]);
    setError(null);
    try { sessionStorage.removeItem(STORE_KEY); } catch { /* nothing to clear */ }
  };

  const waiting =
    streaming && messages.length > 0 && !messages[messages.length - 1].content;

  if (!ready) return null;

  return (
    <>
      {/* the button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        aria-label={open ? "Close Blacksmith" : "Ask Blacksmith"}
        aria-expanded={open}
        className={`fixed left-4 bottom-4 z-[70] items-center gap-2.5 rounded-full bg-[#161616] backdrop-blur border border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.6)] py-2 pl-2 pr-5 hover:border-accent hover:bg-[#1d1d1d] transition-colors cursor-pointer ${open ? "hidden" : "hidden sm:flex"}`}
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
          {open ? <X size={16} /> : <Hammer size={16} />}
        </span>
        <span className="flex flex-col items-start leading-none">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-white">Blacksmith</span>
          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-accent">Ask us anything</span>
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Blacksmith, the Forged.One assistant"
            className="fixed z-[69] flex flex-col overflow-hidden border border-line bg-surface shadow-2xl
                       inset-x-0 bottom-0 top-0 rounded-none
                       sm:inset-auto sm:left-4 sm:bottom-20 sm:top-auto sm:w-[380px] sm:h-[min(560px,calc(100vh-8rem))] sm:rounded-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-4">
              <div>
                <p className="font-serif text-xl tracking-wide text-secondary leading-none">BLACKSMITH</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-accent">
                  Forged.One, on call
                </p>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clear}
                    className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted hover:text-secondary transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="text-muted hover:text-secondary transition-colors cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* conversation */}
            <div ref={scroller} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="text-sm text-secondary leading-relaxed">
                    Ask me what we build, how the agents work, or how to get a quote.
                    I answer from what is on this site.
                  </p>
                  <div className="flex flex-col gap-2">
                    {OPENERS.map((q) => (
                      <button
                        key={q}
                        onClick={() => ask(q)}
                        className="text-left text-sm text-secondary border border-line rounded-xl px-3 py-2 hover:border-accent/50 hover:text-white transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-2xl rounded-br-sm bg-accent px-3.5 py-2 text-sm text-white"
                        : "max-w-[92%] text-sm leading-relaxed text-secondary"
                    }
                  >
                    {m.role === "assistant" ? <Rich text={m.content} /> : m.content}
                  </div>
                </div>
              ))}

              {waiting && (
                <div className="flex gap-1.5 pt-1" aria-label="Blacksmith is typing">
                  {[0, 1, 2].map((d) => (
                    <motion.span
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-accent"
                      animate={{ opacity: [0.25, 1, 0.25] }}
                      transition={{ duration: 1.1, repeat: Infinity, delay: d * 0.18 }}
                    />
                  ))}
                </div>
              )}

              {error && (
                <p className="rounded-xl border border-accent/40 bg-accent/5 px-3 py-2 text-sm text-secondary">
                  {error}
                </p>
              )}

              <div aria-live="polite" className="sr-only">
                {streaming ? "Blacksmith is replying" : ""}
              </div>
            </div>

            {/* composer */}
            <div className="border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <div className="flex items-end gap-2">
                <textarea
                  ref={input}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value.slice(0, MAX_CHARS))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      ask(draft);
                    }
                  }}
                  rows={1}
                  placeholder="Ask about the work"
                  aria-label="Your question"
                  className="flex-1 resize-none bg-transparent text-sm text-secondary placeholder:text-muted focus:outline-none max-h-28 py-2"
                />
                <button
                  onClick={() => (streaming ? stop() : ask(draft))}
                  disabled={!streaming && !draft.trim()}
                  aria-label={streaming ? "Stop" : "Send"}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-white disabled:opacity-30 disabled:cursor-default hover:bg-[#ff5146] transition-colors cursor-pointer"
                >
                  {streaming ? <Square size={12} /> : <ArrowUp size={14} />}
                </button>
              </div>
              <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.15em] text-muted">
                AI, so check anything that matters. Or email forgedonebusiness@gmail.com
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
