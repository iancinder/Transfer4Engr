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

## Project structure

```
app/
  layout.tsx        # Fonts (Inter + IBM Plex Mono), metadata
  page.tsx          # Single-page composition
  assessment/
    page.tsx        # Free "Am I competitive?" assessment page
  globals.css       # Tailwind v4 theme tokens, a11y styles
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
lib/
  packages.ts       # Package data + pricing→form pre-select event
```

## Notes

- All motion respects `prefers-reduced-motion`.
- There is intentionally **no testimonials section or social proof** — the
  business is new. A commented placeholder in `app/page.tsx` marks where a
  testimonials component can go once real outcomes exist.
