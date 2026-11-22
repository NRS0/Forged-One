# Articles

Each article is one file in `src/articles/`, registered in the list in `src/articles.ts`, newest first. The fields every article needs are described in the `Article` type in that file. The page, its schema, the sitemap, `llms.txt` and the RSS feed all come from the same object.

Each article also gets a repost kit here, like `what-to-automate-first-repost.md`, for the Medium and LinkedIn copies.

## Crediting an author

Optional. An article with no `author` is credited to Forged One, the way the first article is. Add one only with details the person has agreed to publish.

```ts
author: {
  name: "Their name",
  jobTitle: "Their role at Forged One",
  url: "https://a-page-about-them",
  sameAs: ["https://www.linkedin.com/in/their-profile/"],
  bio: "One or two sentences about them, in the third person.",
},
```

| Field | Needed | What it does |
| --- | --- | --- |
| `name` | Yes | Shown as "By …" in the date line under the headline, and at the foot of the article. The schema's author. |
| `jobTitle` | No | Shown under their name at the foot of the article. The schema's `jobTitle`. |
| `url` | No | Their name at the foot of the article links here. A page on this site, their own site, or a profile. The schema's `url`. |
| `sameAs` | No | Their profiles elsewhere, full addresses. Not shown on the page; it tells search engines these profiles are the same person. |
| `bio` | No | One or two sentences, shown at the foot of the article. The schema's `description`. |

With an author, the article's schema names them as a `Person` who `worksFor` Forged One. Forged One stays the publisher. Without one, the page and the schema are exactly as before.

Keep the bio to what is true and already public. The same rule as the rest of the site applies: no clients, results or numbers that cannot be shown.
