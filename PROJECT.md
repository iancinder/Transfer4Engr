Build: Transfer4Engr — engineering transfer consulting landing page

Build a complete, production-ready marketing website for a solo consulting business called Transfer4Engr. It helps students across the US transfer into engineering programs. Deliver a polished, creative, single-page site plus a multi-step questionnaire that emails submissions to the founder.

Stack & deployment


Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion.
Target deployment is Vercel. Keep everything Vercel-native; no server/database required (form uses a third-party endpoint, see below).
Mobile-first and fully responsive. Accessible (semantic HTML, keyboard-navigable, visible focus states, reduced-motion support via prefers-reduced-motion).
Clean component structure so it's easy to iterate on later.


Brand & aesthetic


Vibe: creative, sleek, and vibrant — not a generic template. Think a soft cherry-blossom theme: gentle pinks and warm whites, with an animated layer of cherry-blossom petals drifting slowly down the background (subtle, performant, disabled under reduced-motion). One or two deeper accent colors (e.g. a plum/rose and a soft charcoal for text) so it reads premium, not saccharine.
Smooth Framer Motion transitions between sections and on the questionnaire slides.
Modern, confident typography. Generous spacing. It should feel like a real, trustworthy service a student would pay ~$200–$750 for.
Do NOT use any University of Texas logos, trademarks, or imply official university affiliation.


Page sections (single page, anchor-scroll nav)


Sticky nav — Transfer4Engr wordmark left; anchor links (How it works, Services, About, FAQ) and a primary "Start your application" button that scrolls to the questionnaire.
Hero — Big headline about getting into engineering as a transfer. Subhead selling the outcome. Primary CTA button → questionnaire. Petals animate here most visibly.
How it works — 3–4 simple steps (e.g. 1. Fill out the questionnaire → 2. Pick your package / free intro fit → 3. We build your strategy → 4. You submit a stronger application). Icon or number per step, animated in on scroll.
Services / Pricing — three pricing cards:

Essay Review & Revision — $199. Deep review and line-by-line revision of your transfer application essay(s).
Freshman-Year Transfer Strategy — $349. For students currently at a school they're unhappy with who plan to transfer. A strategy roadmap for your freshman year — courses, extracurriculars, positioning — to maximize your transfer odds, plus a 1:1 Zoom call. Mark this card "Most Popular."
Full Application Package — $749. Everything: multiple application-review sessions and essay reviews across your whole transfer application, start to finish.
Each card: name, price, 3–4 bullet points, and a button that scrolls to the questionnaire (pre-selecting that package if feasible).



About the founder — Ian Sendelbach. Copy points to weave in naturally (rewrite into compelling prose, don't just list): transferred into UT Austin ECE (Electrical & Computer Engineering); did it after one year at a 4-year out-of-state program (keep the specific school vague — say "a 4-year out-of-state program"); 4.00 engineering GPA; packed that year with what admissions actually rewards — undergraduate research, an IEEE officer role, robotics subteam lead, and competitive powerlifting; and wrote a standout transfer essay. The angle: "I just did this, successfully, and I'll show you exactly how." Authentic and specific, not braggy.
FAQ — accordion, 5–6 real questions, e.g.: Who is this for? Do you work with any engineering major / any school? What do you actually deliver? How do sessions work (Zoom / async)? How far in advance should I start? How do payments work? Write helpful, honest answers.
Questionnaire (the main conversion element — see next section).
Footer — Transfer4Engr, contact email iansendelbach@gmail.com, small print, current year. No fake social links; leave social icons out unless placeholders are clearly marked as TODO.


Do NOT invent testimonials, reviews, star ratings, "students helped" counts, or any social proof. The business is new. Build credibility from the founder's real story instead. If a testimonials section is visually desired, insert a clearly-commented placeholder that renders nothing by default.

The questionnaire (KevAdmissions-style multi-step form)

A slideshow-style form: one question per slide, with a progress bar/indicator, Next and Back arrows, and smooth Framer Motion slide transitions. Support keyboard (Enter advances when valid; arrows optional). Validate required fields before advancing. On the final slide show a review summary of their answers, then a Submit button. On success, show a friendly confirmation state ("Thanks — Ian will email you back at {their email}"). On error, show a retry message.

Slides (in order):


First & last name — required.
Email — required (validate format; this is how Ian replies to them).
Phone / preferred contact method — optional.
Which package are you interested in? — single-select: Essay Review & Revision / Freshman-Year Transfer Strategy / Full Application Package / Not sure yet. (If a pricing-card button set a package, pre-select it.)
Where are you right now? — e.g. community college, a 4-year university, high school, other (short text or select + "other").
Which school(s) are you applying to transfer into? — text.
Intended engineering major — text.
Current GPA — text/number.
Current extracurriculars / experience (research, clubs, work, projects, etc.) — textarea.
What's your biggest challenge or anything else you want Ian to know? — textarea, optional.
Review & submit.


Form submission — email delivery

Wire the form to Web3Forms (https://web3forms.com) so submissions email the founder with no backend:


POST the form data as JSON to https://api.web3forms.com/submit.
Include an access_key field. Put the key in an env var NEXT_PUBLIC_WEB3FORMS_KEY and read it in the client, with a clearly-commented placeholder "YOUR_WEB3FORMS_ACCESS_KEY_HERE" as fallback so it's obvious what to swap in. (Add a .env.local example and note it in the README.)
Set a clear subject like "New Transfer4Engr inquiry from {name}" and include every answer in the payload so the email is readable.
Handle loading, success, and error states in the UI. Don't lose the user's answers on error.
Add a honeypot field (Web3Forms supports a botcheck field) for basic spam protection.


Deliverables


A working Next.js project I can npm install && npm run dev and then deploy to Vercel.
A short README with: how to run locally, where to paste the Web3Forms access key (and that I should register Web3Forms with iansendelbach@gmail.com so submissions go there), and how to deploy to Vercel (including adding NEXT_PUBLIC_WEB3FORMS_KEY in Vercel's env settings).
Clean, commented code. Reasonable component breakdown (Hero, HowItWorks, Pricing, About, FAQ, Questionnaire, Footer, PetalBackground, etc.).


Build the whole thing now. Make strong, tasteful design decisions where I haven't specified — aim for a site that looks genuinely custom and premium.