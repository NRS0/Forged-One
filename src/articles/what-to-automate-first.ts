import type { Article } from "../articles";

/* Every claim about Forged One here is already on the site: content.ts,
   pages.ts, the home page, or what Blacksmith is told in api/blacksmith.js.
   The businesses in "Four jobs worth looking at first" and the arithmetic in
   "Hours back against how buildable it is" are illustrations, not clients. */
const article: Article = {
  slug: "what-to-automate-first",
  title: "What to Automate First in a Caribbean Business | Forged One",
  description:
    "Repetition beats size. How to find the work worth automating first in a Caribbean business, weigh hours against how buildable it is, and what to leave alone.",
  h1: "What to automate first in a Caribbean business",
  lead: "Automate the job your team repeats most, not the problem that feels biggest. The best first build is work that runs the same way every week, eats real hours, and is mostly copying, retyping and chasing: the same WhatsApp questions, orders retyped from email, documents chased from every new client. Leave the judgment calls with people.",
  published: "2026-11-22",
  keywords: [
    "what to automate first",
    "business automation in the Caribbean",
    "AI automation Barbados",
    "automating repetitive work",
    "small business automation",
  ],
  sections: [
    {
      h: "Repetition beats size",
      body: [
        "Ask an owner what they want to automate and the answer is often the biggest headache in the building. Month end. The system nobody has had time to replace. Whatever went wrong last week.",
        "That is rarely the right first build. Big problems are tangled, full of exceptions and opinions. The right first build is smaller and duller: a job that happens every day or every week, the same way each time, that nobody mentions any more because everyone has got used to doing it.",
        "Size matters less than repetition. If two people spend hours a week on the same task, there is something to build. Four people doing the same thing twice a week is plenty to work with. You do not need a big company to have a big pile of copying.",
        "The tell is usually in how people describe the work:",
        [
          "\"It only takes a few minutes.\" Said about something that happens all day.",
          "\"I just copy it across.\" From one inbox, screen or spreadsheet into another.",
          "\"Did they send it yet?\" The same document, chased from the same kind of customer, every time.",
          "\"Only one person knows how that works.\" The process lives in someone's head, and stops when they are on leave.",
        ],
      ],
    },
    {
      h: "Four jobs worth looking at first",
      body: [
        "These are examples, not a checklist. If one of them sounds like your Tuesday, start there.",
        "The same questions on WhatsApp. A hotel, villa or tour operator answers the same few questions all day: rates, availability, what is included, how to get there. An [AI agent](/services/ai-agents) can pick them up wherever they land, on WhatsApp, email, web chat or the phone, check your system, reply, and pass the conversation to a person when it needs one. The guest with an unusual request still gets a person. The tenth \"is breakfast included?\" of the morning does not need one.",
        "Orders retyped from email. A distributor gets orders by email, as attachments in every format or typed straight into the message, and someone retypes each one into the accounts system. That is textbook [AI automation](/services/ai-automation): read the email, pull the details out, put them where they belong, and only ask a person when something is unusual. The orders reach the warehouse without a phone call, and the person who used to retype them checks the odd ones instead.",
        "Documents chased from every new client. An accountant, an insurer or a law firm asks every new client for the same documents, then chases the ones that do not arrive. Software is good at this. It knows what is missing, sends the reminder, files what comes back, and tells a person when the file is complete or the client has gone quiet.",
        "Figures pasted between spreadsheets. Every Friday someone copies the week's sales, stock or bookings from one spreadsheet into another so a manager can read them on Monday. It is slow, and one wrong paste makes the whole report wrong. Pulling the numbers out of the places they are stuck and into [one place you can actually look at](/services/data) takes the job away, and the wrong paste with it.",
      ],
    },
    {
      h: "Hours back against how buildable it is",
      body: [
        "With a shortlist in hand, judge each job on two things: the hours you would get back, and how buildable it looks. The best first build does well on both.",
        "Hours first. How often does the job run? How many minutes from start to finish? How many people touch one run? Then the question that matters most: how much of that time is copying, retyping and chasing, rather than thinking? Only that part comes back.",
        "For example, a ten-minute job that runs thirty times a week is five hours, every week, before anyone has made a mistake. Then add the mistakes. A wrong order or a missed document takes time to put right, and that time counts too.",
        "Then buildability. Ask:",
        [
          "Is it done the same way each time, or does it depend on who is doing it?",
          "Does the information arrive in the same shape each time, or in every format at once?",
          "Can you get the data out? If a system exports its data or has an API, it can usually be built around.",
          "Where does the judgment sit? One clear step a person can keep is fine. Judgment in every step means the job is not ready.",
        ],
        "A big job with messy inputs can lose to a smaller one that is clean, and that is fine. The first build should be the one most likely to work, because a working first build is what earns the second. Judge from real examples, not the tidy version you remember. Twenty real records beat a hundred clean fake ones.",
      ],
    },
    {
      h: "What not to automate",
      body: [
        "The line is judgment. Pricing an awkward job. Answering a complaint from a customer you have had for years. Deciding whether to extend credit. Anything where the right answer depends on who is asking and what happened last time stays with a person.",
        "That rarely means the whole job stays manual. Most jobs are a repetitive half wrapped around a judgment. Automate the half that is copying and chasing, and hand the judgment to a person with everything they need already in front of them. The important half of any agent is where it stops, so agree before anything is built what it can do on its own, where it must stop, and how it hands over.",
        "None of this is about fewer people. The person you hired for judgment should spend their day using it, not pasting between two spreadsheets.",
        "A few more to leave alone, for now:",
        [
          "Jobs that happen a few times a year. The hours are not there.",
          "A process that changes every month. Settle it first, then automate it.",
          "Anything your team says must stay human. Ask them, and design to the answer.",
        ],
        "And not every fix needs AI. A quoting tool that gets the maths right, or a dashboard that shows the real numbers, is often better as plain [custom software](/services/custom-software) with no model behind it at all.",
      ],
    },
    {
      h: "Start with one job and one number",
      body: [
        "Find the repetitive half. Build only that. Measure one number.",
        "Take the job at the top of your list and agree, before anything is built, the one number that has to move. Hours a week spent retyping orders. How long a WhatsApp enquiry waits for its first reply. How many client files are still missing a document on Friday. If nobody can name the number, the job is not defined yet.",
        "Keep the first version small. A single automation is usually two to four weeks from brief to running, and a first version your team uses beats a perfect one they are still waiting for. Once one job is off the pile, the next one on the list is easier to see.",
        "If automation did not stick last time, it was probably bought rather than built: a subscription that assumed a way of working nobody here uses. Start from your own process instead.",
      ],
    },
    {
      h: "Let the brief do the sorting",
      body: [
        "If you would rather not do the arithmetic on the back of an invoice, the [Build Brief](https://brief.forgedone.xyz/) does it with you. It takes about twelve minutes. You describe the jobs eating your team's time, with much the same questions as above: how often, how long, how many people, how much of it is copying and chasing, and where the judgment sits. Two or three jobs is the sweet spot.",
        "It scores each job on the hours you would get back against how buildable it looks, and ranks them against each other. Your answers stay in your own browser until you press send, and the brief is yours whether or not you work with us. Send it, and what comes back within two working days is a written scope, not a sales call.",
        "We are based in Barbados and build for businesses [across the Caribbean](/caribbean), delivered remotely. Wherever you are, start with the dull job. Nobody will miss doing it.",
      ],
    },
  ],
  related: [
    { label: "AI automation", href: "/services/ai-automation" },
    { label: "AI agents", href: "/services/ai-agents" },
    { label: "AI automation in the Caribbean", href: "/caribbean" },
  ],
};

export default article;
