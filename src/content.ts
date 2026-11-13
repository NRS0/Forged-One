/**
 * The facts of the site, in one place.
 *
 * The page renders from this, and so do the things written for machines: the
 * JSON-LD in <head>, /llms.txt, and the sitemap date. They used to be typed out
 * separately, and they drifted. The FAQ schema carried five questions worded
 * one way while the page showed six worded another, which is the kind of
 * mismatch that gets structured data ignored.
 *
 * Change a service or an answer here and the page, the schema and llms.txt
 * all move together. Blacksmith still has its own copy in api/blacksmith.js.
 */

export const SITE = {
  name: "Forged One",
  alternateNames: ["Forged.One", "Forged 1"],
  url: "https://forgedone.xyz/",
  briefUrl: "https://brief.forgedone.xyz/",
  callUrl: "https://calendly.com/forgedonebusiness/30min",
  email: "forgedonebusiness@gmail.com",
  phone: "+1-246-827-5980",
  /* One sentence an answer engine can lift whole. Third person on purpose:
     quoted out of context, "we" has no subject. */
  summary:
    "Forged One is an AI automation studio based in Barbados. It builds custom software, AI agents and websites, and produces AI content and advertising, for businesses across the Caribbean and beyond.",
  sameAs: [
    "https://www.linkedin.com/company/forgedone/",
    "https://www.instagram.com/forgedone.xyz",
  ],
  knowsAbout: [
    "AI automation",
    "Autonomous AI agents",
    "Custom business software",
    "Data pipelines",
    "AI content",
    "AI product photography",
    "AI video",
    "AI advertising",
    "Web design",
    "Workflow automation",
  ],
};

export type Service = {
  n: string;
  name: string;
  desc: string;
  /** The brief track this row opens. Empty when the row books a call instead. */
  need: string;
  href?: string;
  cta?: string;
};

export const services: Service[] = [
  { n: "01", name: "Custom Software & Tools", desc: "Software built around the way you already work, instead of changing how you work to suit something you bought off the shelf.", need: "software" },
  { n: "02", name: "AI Agents", desc: "Software that handles a job start to finish on its own. It reads the message, checks your system, replies, and knows when to pass it to a person.", need: "agents" },
  { n: "03", name: "AI Content", desc: "Product shots, brand films, video and copy, made without a studio or a shoot day and finished to look shot rather than generated. Including the ads, which test themselves and put the money behind what works.", need: "content" },
  { n: "04", name: "Getting Your Data Straight", desc: "Getting your numbers out of the places they are stuck, cleaned up, and in one place you can actually look at.", need: "automations" },
  /* No track in the brief fits training a team, and twelve minutes of process
     mapping is the wrong ask for a course enquiry, so this row books a call
     instead of dropping someone into a form with no box for them. */
  { n: "05", name: "AI Courses", desc: "Teaching your team what these tools can and cannot do, so nobody is guessing when they make a decision.", need: "", href: SITE.callUrl, cta: "Book a call about" },
];

export const serviceUrl = (s: Service) =>
  s.href ?? `${SITE.briefUrl}${s.need ? `?need=${s.need}` : ""}`;

export type Faq = { q: string; a: string };

/**
 * Written to be quoted. Each question stands on its own without the page
 * around it ("something like this" means nothing to a model reading one
 * pair), and each answer gives the answer in its first sentence.
 *
 * Nothing here is new information. The added questions are the ones Blacksmith
 * already answers, in the words it was already given, so the page, the
 * assistant and the schema say the same thing. No prices, timelines or numbers
 * beyond what the page already committed to.
 */
export const faqs: Faq[] = [
  {
    q: "What does Forged One do?",
    a: "Forged One is an AI automation studio based in Barbados. We build custom software, AI agents and websites, and we make AI content: product shots, brand films, video, copy and ads. We also get scattered data into one place and teach teams what these tools can and cannot do.",
  },
  {
    q: "Where is Forged One based?",
    a: "Barbados. We work with businesses across the Caribbean and further afield, and everything we build is delivered remotely. Being in the region means we are in your timezone and we understand how business actually runs here.",
  },
  {
    q: "What does AI automation actually mean?",
    a: "Software that does a job your team does by hand today. It reads the email, pulls the details out, puts them where they belong, and only asks a person when something is unusual. No robots, no replacing anyone: just the copying and chasing taken off the pile.",
  },
  {
    q: "What is the difference between an AI automation, an AI agent and custom software?",
    a: "An automation fires on a trigger and finishes on its own, the same way every time. An agent handles a job that needs judgment, and stops when the judgment gets hard. Custom software is a tool your team opens and uses. Most real projects are a mix of the three.",
  },
  {
    q: "Do I need to understand any of the technology?",
    a: "No. You tell us what takes too long and what it costs you when it goes wrong. Picking the tools is our job, and you should not have to care which one we used any more than you care which brand of wrench a mechanic owns.",
  },
  {
    q: "What does a project cost, and how do we start?",
    a: "Start with the Build Brief. It takes about twelve minutes, asks what is slow or what you need built, and comes back with a scope and a price rather than a sales call. Small builds start in the low thousands; the brief asks for a budget band so we scope something real instead of guessing.",
  },
  {
    q: "How long does an AI automation project take?",
    a: "A single automation is usually two to four weeks from brief to running. A custom tool or an agent handling live conversations is longer, and we would rather ship a first version you can use in a month than a perfect one in six.",
  },
  {
    q: "Will AI automation replace my staff?",
    a: "No. We automate the copying, retyping and chasing, not the people. The Build Brief asks what must stay human, and we design to that answer. The person you hired for judgment gets to spend their day using it.",
  },
  {
    q: "Is my business too small for AI automation?",
    a: "Size matters less than repetition. If two people spend hours a week on the same task, there is something to build. Four people doing the same thing twice a week is plenty to work with.",
  },
  {
    q: "How is this different from just using ChatGPT?",
    a: "A chat window helps one person once. We build the thing that runs whether or not anyone remembers to open it, on your data, inside your process.",
  },
  {
    q: "Does Forged One build websites?",
    a: "Yes, every kind. Marketing sites, shops, booking systems, customer portals, and sites with software running behind them. If it lives at a web address, we build it.",
  },
  {
    q: "Is my data safe with Forged One?",
    a: "Your answers in the Build Brief stay in your own browser until you press send. For a build, what we need and where it lives is agreed before anything is written, and we sign a non-disclosure agreement before any real business data changes hands.",
  },
  {
    q: "We tried automation before and it did not stick. Why would this be different?",
    a: "Usually it did not stick because it was bought, not built: a subscription that assumed a way of working nobody here uses. We start from your process, agree one number that has to move, and hand over something your team can run without us.",
  },
];
