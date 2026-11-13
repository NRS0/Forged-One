<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/a7891828-f3bc-471d-9907-553fb9655540

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Blacksmith, the site assistant

A chat widget in the bottom-left corner that answers questions about the
services and points people at the Build Brief or a call.

```
src/Blacksmith.tsx    the widget: button, panel, streaming, history
api/blacksmith.js     the endpoint: system prompt, guards, SSE stream
```

**It needs one environment variable and will not appear without it.**

```bash
vercel env add OLLAMA_API_KEY production
```

Paste an Ollama Cloud key from ollama.com, then redeploy. On mount the widget
calls `GET /api/blacksmith`, which reports whether the key is set; if it is
not, the widget renders nothing at all. An unconfigured deployment therefore
shows no button rather than a button that fails.

### How it works

- `gemma4:31b` on Ollama Cloud, `POST https://ollama.com/api/chat` with a
  bearer token. Ollama streams newline-delimited JSON; the function reassembles
  those lines, including objects split across network reads, and re-emits the
  text to the browser as server-sent events so the answer appears as it is
  written.
- Two optional overrides: `OLLAMA_MODEL` to run a different tag without a code
  change, and `OLLAMA_ENDPOINT` to point at a self-hosted Ollama instead of the
  cloud. `OLLAMA_TIMEOUT_MS` exists for tests.
- The system prompt lives server-side only. It carries the services, the four
  brief tracks with their deep links, the location, the contact details, and
  the house voice, and it forbids invented prices, timelines, clients and
  statistics.
- Guards: POST only, at most 20 turns and 1500 characters a message, roles
  restricted to user and assistant, 40 messages an hour per IP, and a 60 second
  ceiling on the upstream call.
- Failures reach the visitor as a readable line: a rejected key, an unreachable
  model, a hung upstream and an empty answer each say what to do next rather
  than hanging or leaking a stack trace.
- The conversation lives in `sessionStorage` (`forgedone.blacksmith.v1`), so it
  survives a page navigation but not a new tab. Clear wipes it.

### Changing what it knows

Edit `SYSTEM` in `api/blacksmith.js`. That string is the whole of its
knowledge; it has no retrieval and no access to the page. If a service changes
on the site, change it there too, or Blacksmith will keep describing the old
one.

## Pages

The site is the home page plus one page per service and per country. They are
all listed in `src/pages.ts`, and that file is the whole of each page: its
address, title, description, copy and questions.

```
src/pages.ts     the content of every page that is not the home page
src/Page.tsx     how one of them is drawn
src/Root.tsx     picks the page for the address
```

To add a page, add an entry to `src/pages.ts`. The build writes it to its own
HTML file, gives it its own title and schema, links it from every footer, and
adds it to the sitemap and `llms.txt`. There is no router: each page is a real
file, and links between them are ordinary links.

The copy follows one rule: nothing on a page that the home page, Blacksmith or
the Build Brief does not already say. The country pages say where we are and
how working together works. They do not claim clients or an office anywhere.

## What search and answer engines read

`src/content.ts` holds the services and the FAQ. The page renders from it, and
at build time `scripts/prerender.mjs` writes three things from the same file:

```
<head> JSON-LD     the organisation, the services and every FAQ answer
dist/llms.txt      the page as plain markdown, for models
dist/sitemap.xml   every page, with the deploy date as <lastmod>
```

Edit an answer in `src/content.ts` and all of them follow. The schema is never
typed by hand, so it cannot disagree with what a visitor sees. Blacksmith is
the one copy that does not follow: its knowledge still lives in `api/blacksmith.js`.
