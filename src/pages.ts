/**
 * The pages beyond the home page: one per service, plus the Caribbean and
 * Barbados.
 *
 * The home page can only rank for one thing, and for months that one thing was
 * our own name. Someone searching "AI agents for business" or "AI automation
 * Barbados" needs a page that is about exactly that, with its own address,
 * title and answers.
 *
 * The rule for the copy is the same as for the FAQ: nothing here is new
 * information. Every claim comes from the home page, from what Blacksmith is
 * told in api/blacksmith.js, or from what the Build Brief asks. No prices,
 * clients, timelines or numbers that were not already published. The two place
 * pages say where we are and how working together works from there; they do
 * not claim clients or an office anywhere. The "for example" lists on them are
 * illustrations of repetitive work, not case studies.
 */
import { SITE, type Faq } from "./content";

const brief = (need?: string) => `${SITE.briefUrl}${need ? `?need=${need}` : ""}`;

/** A paragraph is a string. A list is an array of strings. */
export type Body = Array<string | string[]>;

export type Block = {
  h: string;
  body: Body;
  /** Links out of the block, drawn as rows. */
  links?: { label: string; href: string }[];
};

export type PageData = {
  path: string;
  kind: "service" | "place";
  /** Short name: the breadcrumb, the footer link, the related list. */
  name: string;
  title: string;
  description: string;
  h1: string;
  /** The first thing on the page, written to be quoted whole. */
  lead: string;
  blocks: Block[];
  faqs: Faq[];
  cta: { heading: string; text: string; label: string; href: string };
  /** The step above this page in the trail, when it has an address. */
  parent?: { name: string; href: string };
  /** For a page about one country: its name, as schema.org wants it. */
  country?: string;
};

/* The same close on every page that leads to the brief. */
const briefCta = (need?: string) => ({
  heading: "Twelve minutes instead of two discovery calls.",
  text: "Start with the Build Brief. Your answers stay in your own browser until you press send, and what comes back is a written scope within two working days, not a sales call. The brief is yours either way.",
  label: "Start the brief",
  href: brief(need),
});

const TIMELINE_LONGER =
  "Longer than a single automation, which is usually two to four weeks. We would rather ship a first version you can use in a month than a perfect one in six.";

const DATA_SAFE: Faq = {
  q: "Is my data safe with Forged One?",
  a: "Your answers in the Build Brief stay in your own browser until you press send. For a build, what we need and where it lives is agreed before anything is written, and we sign a non-disclosure agreement before any real business data changes hands.",
};

/* ─────────────────────────────── SERVICES ─────────────────────────────── */

const servicePages: PageData[] = [
  {
    path: "/services/ai-automation",
    kind: "service",
    name: "AI Automation",
    title: "AI Automation for Caribbean Businesses | Forged One",
    description:
      "AI automation takes the copying, retyping and chasing off your team. Forged One builds it around your process, from Barbados, for businesses across the Caribbean.",
    h1: "AI automation",
    lead: "AI automation is software that does a job your team does by hand today. Forged One builds it around the way your business already runs, for companies in Barbados and across the Caribbean.",
    blocks: [
      {
        h: "What gets automated",
        body: [
          "The jobs nobody enjoys and everybody does anyway: copying, chasing, retyping, checking.",
          [
            "Invoices that file themselves.",
            "Orders that reach the warehouse without a phone call.",
            "Quotes that go out the same day.",
          ],
          "It reads the email, pulls the details out, puts them where they belong, and only asks a person when something is unusual. The work still gets done. Your people just stop being the ones doing the boring half of it.",
        ],
      },
      {
        h: "Automation or agent",
        body: [
          "An automation fires on a trigger and finishes on its own, the same way every time. An agent handles a job that needs judgment, and stops when the judgment gets hard.",
          "From your side they are the same ask: work you would rather not do by hand any more. So the Build Brief treats them as one track, and most real projects are a mix.",
        ],
        links: [{ label: "AI agents", href: "/services/ai-agents" }],
      },
      {
        h: "How we pick what to build",
        body: [
          ["Find the repetitive half.", "Build only that.", "Measure one number."],
          "The Build Brief scores each job on the hours you would get back against how buildable it looks, then ranks them against each other. Before anything is built, we agree the one number that has to move.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long does an AI automation take to build?",
        a: "A single automation is usually two to four weeks from brief to running.",
      },
      {
        q: "Will AI automation work with the tools we already use?",
        a: "Usually, yes. If a tool exports its data or has an API, we can build around it. The Build Brief asks what you run on and whether you can get the information out.",
      },
      {
        q: "What do you need from us to start an automation?",
        a: "The Build Brief, then usually a real sample of the data, and one person who can answer questions. Twenty real records beat a hundred clean fake ones.",
      },
      {
        q: "What does AI automation cost?",
        a: "It depends on scope. Small builds start in the low thousands. The Build Brief asks for a budget band, and what comes back is a scope and a price rather than a sales call.",
      },
    ],
    cta: briefCta("agents"),
  },
  {
    path: "/services/ai-agents",
    kind: "service",
    name: "AI Agents",
    title: "AI Agents for Business in the Caribbean | Forged One",
    description:
      "An AI agent handles a job start to finish: it reads the message, checks your system, replies, and knows when to pass it to a person. Built in Barbados by Forged One.",
    h1: "AI agents",
    lead: "An AI agent is software that handles a job start to finish on its own. It reads the message, checks your system, replies, and knows when to pass it to a person. Forged One builds agents for businesses in Barbados and across the Caribbean.",
    blocks: [
      {
        h: "Where an agent works",
        body: [
          "Enquiries arrive on WhatsApp, email, web chat and the phone. An agent can pick them up wherever they land.",
          "It works on your data, inside your process. A chat window helps one person once. An agent is the thing that runs whether or not anyone remembers to open it.",
        ],
      },
      {
        h: "The half that matters",
        body: [
          "The important half of any agent is where it stops. An agent handles a job that needs judgment, and hands over when the judgment gets hard.",
          "So before anything is built, we agree what it can do on its own, where it must stop, and how it hands over to a person.",
        ],
      },
      {
        h: "What the brief asks",
        body: [
          "The agent track of the Build Brief asks:",
          [
            "What it should handle, and where it works.",
            "Who it deals with, and how that is handled today.",
            "What it needs to know to answer.",
            "What it can do on its own, and where it must stop.",
            "Whether it changes anything in your systems.",
            "How many enquiries a day, and how it should sound.",
            "How it hands over to a person.",
          ],
        ],
      },
    ],
    faqs: [
      {
        q: "Which channels can an AI agent work on?",
        a: "WhatsApp, email, web chat or the phone. The Build Brief asks which ones it should work on.",
      },
      {
        q: "Will an AI agent replace my staff?",
        a: "No. We automate the copying, retyping and chasing, not the people. The Build Brief asks what must stay human, and we design to that answer.",
      },
      {
        q: "How is an AI agent different from using ChatGPT?",
        a: "A chat window helps one person once. An agent runs whether or not anyone remembers to open it, on your data, inside your process.",
      },
      { q: "How long does an AI agent take to build?", a: TIMELINE_LONGER },
    ],
    cta: briefCta("agents"),
  },
  {
    path: "/services/custom-software",
    kind: "service",
    name: "Custom Software",
    title: "Custom Business Software, With or Without AI | Forged One",
    description:
      "Custom software built around the way your business runs, with AI built in where it helps or none at all. Quoting tools, portals, dashboards and booking systems, built in Barbados.",
    h1: "Custom software, with AI or without",
    lead: "Custom software is a tool built around the way you already work, instead of changing how you work to suit something you bought off the shelf. Forged One builds it with AI inside where AI does the job better, and without it where it does not, for businesses in Barbados and across the Caribbean.",
    blocks: [
      {
        h: "What we build",
        body: [
          ["Quoting tools.", "Customer portals.", "Internal dashboards.", "Booking systems."],
          "Anything that is currently a spreadsheet nobody trusts.",
        ],
      },
      {
        h: "With AI, or without",
        body: [
          "Not every problem needs AI. A quoting tool that gets the maths right, a portal your customers can log into, a dashboard that shows the real numbers: none of that needs a model behind it, and it is better without one.",
          "Where AI does earn its place, we build it in. Reading documents that arrive in every format, sorting what comes in, drafting the reply, finding the answer in your own records.",
          "You do not need to know which one you need before you start. Picking the tools is our job.",
        ],
      },
      {
        h: "Built, not bought",
        body: [
          "Most tools that did not stick were bought, not built: a subscription that assumed a way of working nobody here uses.",
          "We start from your process, agree one number that has to move, and hand over something your team can run without us.",
        ],
      },
      {
        h: "What the brief asks",
        body: [
          "The custom software track of the Build Brief asks:",
          [
            "What you are building, and what it replaces.",
            "Who uses it, and what it has to do.",
            "What must work on day one, and what can wait.",
            "Logins, and where it runs.",
            "What it has to talk to.",
          ],
        ],
      },
    ],
    faqs: [
      {
        q: "When does a business need custom software?",
        a: "When no tool does the job, or the tool you have does not fit.",
      },
      {
        q: "Does custom software have to use AI?",
        a: "No. Plenty of good business software has no AI in it at all. We build AI in only where it does a job better than plain software would, such as reading documents or sorting enquiries, and leave it out everywhere else.",
      },
      { q: "How long does custom software take to build?", a: TIMELINE_LONGER },
      {
        q: "Will custom software connect to the systems we already have?",
        a: "Usually, yes. If a system exports its data or has an API, we can build around it. The Build Brief asks what the new tool has to talk to.",
      },
    ],
    cta: briefCta("software"),
  },
  {
    path: "/services/ai-content",
    kind: "service",
    name: "AI Content",
    title: "AI Content, Product Photography and Video | Forged One",
    description:
      "Product shots, brand films, video and copy made without a studio or a shoot day, finished to look shot rather than generated. AI content from Forged One, Barbados.",
    h1: "AI content and advertising",
    lead: "AI content is product shots, brand films, video and copy made without a studio or a shoot day, and finished to look shot rather than generated. Forged One makes it for brands in Barbados and across the Caribbean.",
    blocks: [
      {
        h: "What we make",
        body: [
          ["Product photography.", "Brand films and video.", "Stills and copy.", "Whole content libraries."],
          "Client ready without a studio, a crew or a shoot day, at a volume nobody could photograph by hand.",
        ],
      },
      {
        h: "The standard",
        body: [
          "Generated, and finished to a standard you would put your name on. The point is work that looks shot, not work that looks generated.",
        ],
      },
      {
        h: "Ads that test themselves",
        body: [
          "The ads are part of it. They test themselves, drop what is not working and put the money behind what is, so you see what each dollar brought back.",
        ],
      },
      {
        h: "What the brief asks",
        body: [
          "The content track of the Build Brief asks:",
          [
            "What you are making, and what it is for.",
            "How much, how often, and where it goes.",
            "Who makes it now, and how long it takes.",
            "What has to stay recognisably yours.",
            "What we can work from, and who approves it.",
            "What would make you cringe.",
          ],
        ],
      },
    ],
    faqs: [
      {
        q: "Does AI content look generated?",
        a: "It should not. Everything is finished to a standard that stands next to a real shoot, which is the whole point of it.",
      },
      {
        q: "Does Forged One make product photography and video?",
        a: "Yes. Product shots, brand films, video, stills and copy, at volume, without a studio or a shoot day.",
      },
      {
        q: "Does Forged One run the ads as well?",
        a: "Yes. The ads are part of the content work. They test themselves, drop what is not working and put the money behind what is.",
      },
    ],
    cta: briefCta("content"),
  },
  {
    path: "/services/data",
    kind: "service",
    name: "Data",
    title: "Business Data Cleanup and Reporting | Forged One, Barbados",
    description:
      "Your numbers pulled out of the places they are stuck, cleaned up, and put in one place you can actually look at. Data work from Forged One, Barbados.",
    h1: "Getting your data straight",
    lead: "Getting your data straight means pulling your numbers out of the places they are stuck, cleaning them up, and putting them in one place you can actually look at. Forged One does it for businesses in Barbados and across the Caribbean.",
    blocks: [
      {
        h: "What it answers",
        body: [
          "You already hold the answers about your customers. They are just spread across four systems and nobody has time to look.",
          ["Who buys twice.", "Who never came back.", "Who is about to leave.", "What they all have in common."],
          "Once that is in one place, you stop guessing who to call and what to say to them.",
        ],
      },
      {
        h: "What we need from you",
        body: [
          "The Build Brief asks what you run on, where the information lives, and whether you can get it out.",
          "A real sample helps and is never required, and you can strip the names out first. Twenty real records beat a hundred clean fake ones.",
        ],
      },
    ],
    faqs: [
      DATA_SAFE,
      {
        q: "Will this work with the systems we already use?",
        a: "Usually, yes. If a system exports its data or has an API, we can pull from it. The Build Brief asks where your information lives and whether you can get it out.",
      },
      {
        q: "Do we need to share real data to get a scope?",
        a: "No. A sample is helpful, never required, and you can strip the names out first.",
      },
    ],
    cta: briefCta("automations"),
  },
  {
    path: "/services/websites",
    kind: "service",
    name: "Websites",
    title: "Web Design in Barbados and the Caribbean | Forged One",
    description:
      "Websites of every kind: marketing sites, shops, booking systems, customer portals, and sites with software running behind them. Built in Barbados by Forged One.",
    h1: "Websites",
    lead: "Forged One builds websites of every kind, from a few pages that have to look right and load fast to a site with a system running behind it. If it lives at a web address, we build it.",
    blocks: [
      {
        h: "What we build",
        body: [
          [
            "Marketing and brochure sites.",
            "Shops.",
            "Booking systems.",
            "Customer portals.",
            "Sites with software running behind them.",
            "Rebuilds of the site you have.",
          ],
        ],
      },
      {
        h: "Website or custom software",
        body: [
          "A shop or a booking system is a website first. Custom software comes into it only when there is a system behind the site that no website alone would cover.",
          "You can pick both in the Build Brief.",
        ],
        links: [{ label: "Custom software", href: "/services/custom-software" }],
      },
      {
        h: "What the brief asks",
        body: [
          "The website track of the Build Brief asks:",
          [
            "What kind of site, and what someone has to be able to do on it.",
            "What is there today, and roughly how many pages.",
            "What it connects to, and what we can work from.",
            "Whether there is a site you want to stand next to.",
            "Who updates it once it is live.",
            "What would make it a failure.",
          ],
        ],
      },
    ],
    faqs: [
      {
        q: "Does Forged One build small marketing websites?",
        a: "Yes. A few pages that explain the business and have to look right and load fast are as much our work as a shop or a portal.",
      },
      {
        q: "Can Forged One rebuild our existing website?",
        a: "Yes. A rebuild of what you have is on the website track of the Build Brief, which asks what is there today.",
      },
      {
        q: "Does Forged One build online shops and booking systems?",
        a: "Yes. A shop or a booking system is a website first, and we build both.",
      },
    ],
    cta: briefCta("website"),
  },
  {
    path: "/services/ai-courses",
    kind: "service",
    name: "AI Courses",
    title: "AI Courses for Business Teams | Forged One, Barbados",
    description:
      "AI courses that teach your team what these tools can and cannot do. Built for leaders, not engineers. No technical background needed. From Forged One, Barbados.",
    h1: "AI courses for teams",
    lead: "Forged One teaches teams what AI tools can and cannot do, so nobody is guessing when they make a decision. The courses are built for leaders, not engineers.",
    blocks: [
      {
        h: "Who it is for",
        body: ["No technical background needed, and it fits around a working week."],
      },
      {
        h: "Knowing what matters",
        body: [
          "Most of what you read about AI will never touch your business. A little of it will change it.",
          "The things that matter to you are rarely the ones making headlines. They are the small, specific tools that happen to fit the way your business runs. Knowing which is which is the point.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does my team need a technical background for an AI course?",
        a: "No. The courses are built for leaders, not engineers, and they fit around a working week.",
      },
      {
        q: "How do we book an AI course with Forged One?",
        a: "Book a call. Courses are not part of the Build Brief, so a thirty-minute call is the way to start.",
      },
    ],
    cta: {
      heading: "Tell us where your team is starting from.",
      text: "There is no form for this one. Book a thirty-minute call and we will take it from there.",
      label: "Book a call",
      href: SITE.callUrl,
    },
  },
];

/* ─────────────────────────────── COUNTRIES ─────────────────────────────── */

const whatWeBuild: Block = {
  h: "What we build",
  body: ["Software, agents and websites on one side. AI content and advertising on the other."],
  links: servicePages.map((p) => ({ label: p.name, href: p.path })),
};

const remoteSteps: Block = {
  h: "How working together works",
  body: [
    [
      "You fill in the Build Brief. About twelve minutes.",
      "We come back with a written scope within two working days.",
      "Everything is built and delivered remotely.",
    ],
    "If you would rather talk it through first, book a thirty-minute call.",
  ],
};

const SMALL: Faq = {
  q: "Is my business too small for AI automation?",
  a: "Size matters less than repetition. If two people spend hours a week on the same task, there is something to build.",
};

/* Two place pages, not one per island. A page for every country would be the
   same page ten times with the name swapped, and it would claim a presence we
   do not have. One page says honestly what we are to the region. One says
   what we are at home. */
const placePages: PageData[] = [
  {
    path: "/caribbean",
    kind: "place",
    name: "Caribbean",
    title: "AI Automation in the Caribbean | Forged One",
    description:
      "AI automation, AI agents, custom software and websites for businesses across the Caribbean, built by a studio based in Barbados. Delivered remotely.",
    h1: "AI automation in the Caribbean",
    lead: "Forged One builds AI automation, AI agents, custom software and websites for businesses across the Caribbean. We are a Caribbean studio based in Barbados, and everything is built and delivered remotely.",
    blocks: [
      {
        h: "In the region, not overseas",
        body: [
          "We are based in Barbados and work with businesses across the Caribbean and further afield. Being in the region means we understand how business actually runs here.",
          "Barbados keeps the same time as Trinidad and Tobago, Guyana and the Eastern Caribbean all year, and is one hour ahead of Jamaica. Your working day is ours.",
        ],
      },
      {
        h: "Where we work",
        body: [
          "Anywhere in the region. Everything is built and delivered remotely, so a business in Jamaica, Trinidad and Tobago, Guyana, The Bahamas, Saint Lucia, Grenada or Antigua and Barbuda gets the same service as one in Barbados.",
        ],
        links: [{ label: "Barbados", href: "/caribbean/barbados" }],
      },
      remoteSteps,
      {
        h: "The kind of work we mean",
        body: [
          "Size matters less than repetition. If two people spend hours a week on the same task, there is something to build. For example:",
          [
            "A hotel or tour operator answering the same questions on WhatsApp.",
            "A distributor retyping orders from email into the accounts system.",
            "A professional firm chasing the same documents from every new client.",
            "A team pasting the same figures between two spreadsheets every Friday.",
          ],
        ],
      },
      whatWeBuild,
    ],
    faqs: [
      {
        q: "Is there an AI automation company in the Caribbean?",
        a: "Yes. Forged One is an AI automation studio based in Barbados, building for businesses across the Caribbean. We build custom software, AI agents and websites, and make AI content.",
      },
      {
        q: "Which Caribbean countries does Forged One work in?",
        a: "Any of them. We are based in Barbados and everything is built and delivered remotely, so a business in Jamaica, Trinidad and Tobago, Guyana, The Bahamas, Saint Lucia, Grenada, Antigua and Barbuda or anywhere else in the region gets the same service as one in Barbados.",
      },
      {
        q: "Does Forged One need to visit our office?",
        a: "No. The Build Brief replaces the first two discovery calls, and everything we build is delivered remotely. If you would rather talk first, book a thirty-minute call.",
      },
      {
        q: "What is the time difference between Barbados and the rest of the Caribbean?",
        a: "None with Trinidad and Tobago, Guyana and the Eastern Caribbean, which keep the same time as Barbados all year. Jamaica is one hour behind.",
      },
      {
        q: "Can an AI agent answer our customers on WhatsApp?",
        a: "Yes. An agent can pick up enquiries wherever they arrive: WhatsApp, email, web chat or the phone. It hands over to a person when the judgment gets hard.",
      },
    ],
    cta: briefCta(),
  },
  {
    path: "/caribbean/barbados",
    kind: "place",
    name: "Barbados",
    country: "Barbados",
    parent: { name: "Caribbean", href: "/caribbean" },
    title: "AI Automation in Barbados | Forged One",
    description:
      "Forged One is an AI automation studio based in Barbados. Custom software, AI agents, websites and AI content for Barbadian businesses.",
    h1: "AI automation in Barbados",
    lead: "Forged One is an AI automation studio based in Barbados. We build custom software, AI agents and websites, and make AI content, for Barbadian businesses that want the repetitive half of the work off their team.",
    blocks: [
      {
        h: "Built here",
        body: [
          "We are based in Barbados. Same island, same timezone, same working week, and we understand how business actually runs here.",
          "You can reach us on a local number: 246-827-5980.",
        ],
      },
      {
        h: "The kind of work we mean",
        body: [
          "Size matters less than repetition. If two people spend hours a week on the same task, there is something to build. For example:",
          [
            "A villa or tour business answering the same booking questions on WhatsApp.",
            "A distributor retyping orders from email into the accounts system.",
            "A professional firm chasing the same documents from every new client.",
            "A retailer whose stock, sales and customer lists live in three different places.",
          ],
        ],
      },
      whatWeBuild,
    ],
    faqs: [
      {
        q: "Is there an AI automation company in Barbados?",
        a: "Yes. Forged One is an AI automation studio based in Barbados. We build custom software, AI agents and websites, and make AI content, for businesses here and across the Caribbean.",
      },
      {
        q: "How do I start an AI project in Barbados?",
        a: "Start with the Build Brief. It takes about twelve minutes, asks what is slow or what you need built, and comes back with a written scope within two working days. Or call 246-827-5980.",
      },
      {
        q: "What does AI automation cost in Barbados?",
        a: "It depends on scope. Small builds start in the low thousands. The Build Brief asks for a budget band, so we scope something real instead of guessing.",
      },
      SMALL,
    ],
    cta: briefCta(),
  },
];

/* Every service sits under the Services section of the home page. */
for (const p of servicePages) p.parent = { name: "Services", href: "/#services" };

export const pages: PageData[] = [...servicePages, ...placePages];
export const servicePageList = servicePages;
export const placePageList = placePages;

/** Trailing slashes and index.html are the same page. */
export const normalisePath = (pathname: string) =>
  pathname.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";

export const pageFor = (pathname: string) => {
  const path = normalisePath(pathname);
  return pages.find((p) => p.path === path);
};
