# Transfer4Engr

Marketing site + intake questionnaire for **Transfer4Engr**, a one-on-one
consulting service that helps students transfer into US engineering programs.

Built with Next.js (App Router), TypeScript, Tailwind CSS v4, and Framer
Motion. No backend or database — the questionnaire emails submissions via
[Web3Forms](https://web3forms.com).

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Wire up form emails (Web3Forms)

1. Go to [web3forms.com](https://web3forms.com) and create a free access key
   **using `iansendelbach@gmail.com`** — that's the address submissions will
   be delivered to.
2. Copy `.env.example` to `.env.local` and paste the key:

   ```bash
   NEXT_PUBLIC_WEB3FORMS_KEY=your-real-key-here
   ```

3. Restart the dev server. Until a real key is set, the form falls back to
   the placeholder `YOUR_WEB3FORMS_ACCESS_KEY_HERE` (defined in
   `components/form-ui.tsx`) and submissions will fail.

The form includes a hidden `botcheck` honeypot field for basic spam
protection, which Web3Forms filters automatically.

## Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In [Vercel](https://vercel.com), click **Add New → Project** and import
   the repo. Vercel auto-detects Next.js; no build settings needed.
3. Under **Settings → Environment Variables**, add:
   - **Name:** `NEXT_PUBLIC_WEB3FORMS_KEY`
   - **Value:** your Web3Forms access key
4. Deploy. Redeploy after changing env vars so the new value is baked in.

## Writing blog posts

Posts are `.mdoc` files in `content/posts/`, edited through
[Keystatic](https://keystatic.com) and committed to this repo. Publishing a
post is a git commit, which triggers a Vercel rebuild.

**Locally:** run `npm run dev` and open
[localhost:3000/keystatic](http://localhost:3000/keystatic). Edits write
straight to your working tree — commit and push when you're happy.

**In production:** open [transfer4engr.com/keystatic](https://transfer4engr.com/keystatic),
sign in with GitHub, and hit Publish. This requires the one-time GitHub App
setup below.

### One-time GitHub App setup

1. Run `npx keystatic create-github-app` and follow the browser flow. Name the
   app something like `transfer4engr-content` and install it on the
   `iancinder/Transfer4Engr` repo only.
2. The command writes four values into `.env.local`. Copy all four into
   **Vercel → Settings → Environment Variables**:
   - `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
   - `KEYSTATIC_GITHUB_CLIENT_ID`
   - `KEYSTATIC_GITHUB_CLIENT_SECRET`
   - `KEYSTATIC_SECRET`
3. Redeploy.

Until `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` is set, the deployed editor runs
in local mode and cannot save — Vercel's filesystem is read-only. Everything
else on the site builds and works normally.

### Post fields

`Draft` keeps a post out of the blog index, the sitemap, and search results,
but it still renders on `localhost` so you can preview it. Uncheck it to
publish.

The `URL slug` becomes `/blog/<slug>` — avoid changing it after publishing,
since the old URL will 404 and lose any ranking it earned.

## SEO

- `app/sitemap.ts` picks up published posts automatically; no code change is
  needed when you publish.
- Every post emits `BlogPosting` JSON-LD and a generated social card
  (`app/blog/[slug]/opengraph-image.tsx`).
- `lib/site.ts` holds the canonical origin used by every canonical tag.
- After deploying new posts, they'll be discovered via the sitemap in
  [Google Search Console](https://search.google.com/search-console) — no
  manual resubmission needed.

## Project structure

```
app/
  layout.tsx        # Fonts, site metadata, canonical/OG defaults
  page.tsx          # Single-page composition
  assessment/
    page.tsx        # Free "Am I competitive?" assessment page
  blog/
    page.tsx        # Post index
    [slug]/
      page.tsx            # Post + BlogPosting JSON-LD
      opengraph-image.tsx # Generated social card
  keystatic/        # Editor UI (noindex)
  api/keystatic/    # Editor commit + OAuth handler
  sitemap.ts        # Static routes + published posts
  robots.ts
  globals.css       # Tailwind v4 theme tokens, a11y styles, .prose-t4e
components/
  Nav.tsx           # Sticky nav with mobile menu
  Hero.tsx          # Headline + primary CTA
  HowItWorks.tsx    # Four-step overview
  Pricing.tsx       # Three package cards (pre-select via custom event)
  About.tsx         # Founder story
  Faq.tsx           # Accessible accordion
  Questionnaire.tsx # Multi-step form → Web3Forms
  AssessmentForm.tsx # /assessment multi-step form (sessionStorage drafts)
  form-ui.tsx       # Shared form primitives (inputs, radios, selects, motion)
  Footer.tsx
  Reveal.tsx        # Shared scroll-reveal wrapper
  PostCard.tsx      # Post row, used by index + homepage
  PostBody.tsx      # Markdoc → React, heading anchors, safe links
  PostCta.tsx       # End-of-post assessment CTA
  LatestPosts.tsx   # Three newest posts on the homepage
  StructuredData.tsx # Site-wide Organization/WebSite/Person JSON-LD
lib/
  packages.ts       # Package data + pricing→form pre-select event
  posts.ts          # Keystatic reader, draft filtering, reading time
  site.ts           # Canonical origin + absolute URL helper
content/
  posts/*.mdoc      # Blog posts (edited via /keystatic)
keystatic.config.ts # Collection schema + storage mode
```

## Notes

- All motion respects `prefers-reduced-motion`.
- There is intentionally **no testimonials section or social proof** — the
  business is new. A commented placeholder in `app/page.tsx` marks where a
  testimonials component can go once real outcomes exist.
