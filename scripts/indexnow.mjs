/**
 * Tells IndexNow (Bing, Yandex, Seznam, Naver and the rest) that the site's
 * pages exist or have changed, so they recrawl now rather than whenever they
 * next get round to it.
 *
 *   npm run indexnow             read the live sitemap and send every address
 *   npm run indexnow -- --dry-run   show what would be sent, send nothing
 *
 * Run it after a deploy is live, never during the build: the build runs before
 * the new pages are served, so a ping then would point engines at the old ones.
 *
 * It reads the sitemap from the live site rather than from dist/, so what it
 * sends is what is actually being served. IndexNow only accepts addresses on
 * the host that holds the key, so anything in the sitemap on another host
 * (the Build Brief, on brief.forgedone.xyz) is left out and listed.
 *
 * The key is public by design: it is served at /<key>.txt from public/, and
 * that file is how IndexNow checks the request came from whoever runs the
 * site. Change the key here and rename that file together.
 */
const HOST = 'forgedone.xyz';
const KEY = 'b39061e3d390c0841882e266c1edba82';
const SITE = `https://${HOST}`;
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const SITEMAP = `${SITE}/sitemap.xml`;
const ENDPOINT = 'https://api.indexnow.org/indexnow';
const MAX_URLS = 10000; // IndexNow's limit for one request

const dryRun = process.argv.includes('--dry-run');

const fail = (message) => {
  console.error(`[indexnow] ${message}`);
  process.exit(1);
};

async function text(url) {
  const res = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.text();
}

const unescapeXml = (t) =>
  t.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

/* ── the addresses ── */
let sitemap;
try {
  sitemap = await text(SITEMAP);
} catch (error) {
  fail(`could not read the sitemap: ${error.message}`);
}

const all = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)].map((m) => unescapeXml(m[1]));
const urlList = [];
const skipped = [];
for (const url of all) {
  let host;
  try {
    host = new URL(url).host;
  } catch {
    skipped.push(url);
    continue;
  }
  (host === HOST ? urlList : skipped).push(url);
}

if (urlList.length === 0) fail(`the sitemap at ${SITEMAP} lists no addresses on ${HOST}`);
if (urlList.length > MAX_URLS) fail(`${urlList.length} addresses is over IndexNow's ${MAX_URLS} a request; send them in batches`);

/* ── the key has to be live, or IndexNow refuses the whole request ── */
let keyLive = false;
try {
  keyLive = (await text(KEY_LOCATION)).trim() === KEY;
} catch {
  keyLive = false;
}

console.log(`[indexnow] ${urlList.length} addresses on ${HOST}:`);
for (const url of urlList) console.log(`  ${url}`);
if (skipped.length) {
  console.log(`[indexnow] left out, not on ${HOST}:`);
  for (const url of skipped) console.log(`  ${url}`);
}

if (!keyLive) {
  const message = `the key file is not live at ${KEY_LOCATION} (or does not hold the key). Deploy first, then run this again.`;
  if (dryRun) console.warn(`[indexnow] warning: ${message}`);
  else fail(message);
}

const body = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };

if (dryRun) {
  console.log('[indexnow] dry run, nothing sent. The request would be:');
  console.log(`POST ${ENDPOINT}`);
  console.log(JSON.stringify(body, null, 2));
  process.exit(0);
}

/* ── the ping ── */
const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

/* 200: received. 202: received, the key is still being checked. Anything else
   is a refusal: 400 bad request, 403 key not valid, 422 an address not on the
   host, 429 too many requests. */
const reply = (await res.text()).trim();
if (res.status === 200 || res.status === 202) {
  console.log(`[indexnow] sent ${urlList.length} addresses: ${res.status} ${res.statusText}`);
} else {
  fail(`IndexNow answered ${res.status} ${res.statusText}${reply ? `: ${reply}` : ''}`);
}
