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
vercel env add ANTHROPIC_API_KEY production
```

Paste a key from console.anthropic.com, then redeploy. On mount the widget
calls `GET /api/blacksmith`, which reports whether the key is set; if it is
not, the widget renders nothing at all. An unconfigured deployment therefore
shows no button rather than a button that fails.

### How it works

- `claude-opus-5`, streamed back as server-sent events so the answer appears
  as it is written. Effort is set to `low` because this is a short-answer FAQ,
  not a reasoning task.
- The system prompt lives server-side only. It carries the services, the four
  brief tracks with their deep links, the location, the contact details, and
  the house voice, and it forbids invented prices, timelines, clients and
  statistics.
- Refusal fallbacks are on (`fallbacks: "default"`), so a declined answer is
  retried on another model inside the same call rather than dying.
- Guards: POST only, at most 20 turns and 1500 characters a message, roles
  restricted to user and assistant, 40 messages an hour per IP.
- The conversation lives in `sessionStorage` (`forgedone.blacksmith.v1`), so it
  survives a page navigation but not a new tab. Clear wipes it.

### Changing what it knows

Edit `SYSTEM` in `api/blacksmith.js`. That string is the whole of its
knowledge; it has no retrieval and no access to the page. If a service changes
on the site, change it there too, or Blacksmith will keep describing the old
one.
