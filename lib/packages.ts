/**
 * Single source of truth for the three service packages, shared by the
 * pricing cards and the questionnaire's package-select slide.
 */

export interface ServicePackage {
  /** Stable id used for pre-selection events, form values, and checkout. */
  id: string;
  name: string;
  /** Human-facing display price, e.g. "$349". */
  price: string;
  /**
   * Amount charged, in cents (USD). This is the authoritative figure sent to
   * Stripe — `price` above is only for display. Keep the two in sync.
   */
  priceCents: number;
  tagline: string;
  bullets: string[];
  mostPopular?: boolean;
}

export const PACKAGES: ServicePackage[] = [
  {
    id: "essay-application-review",
    name: "Essay & Application Review",
    price: "$349",
    priceCents: 34900,
    tagline:
      "Four weeks of back-and-forth email to sharpen your essays and rewrite your application.",
    bullets: [
      "Four weeks of email correspondence — as many exchanges as you need",
      "Line-by-line essay revisions with the reasoning behind every change",
      "Application rewriting: activities, short answers, and supplements",
    ],
  },
  {
    id: "review-plus-strategy-call",
    name: "Review + Strategy Session",
    price: "$599",
    priceCents: 59900,
    tagline:
      "Everything in the review tier, plus a 90-minute 1:1 to work through strategy live.",
    bullets: [
      "Everything in Essay & Application Review",
      "One 90-minute 1:1 meeting on application logistics and strategy",
      "Bring specific essay or application questions — we solve them together",
    ],
    mostPopular: true,
  },
  {
    id: "full-application-partnership",
    name: "Full Application Partnership",
    price: "$999",
    priceCents: 99900,
    tagline:
      "End-to-end partnership across your entire application, from first idea to submit.",
    bullets: [
      "Up to four 90-minute 1:1 calls across your application timeline",
      "Help with every part: professor outreach for research, finding clubs, and framing your reason to transfer",
      "Unlimited email correspondence throughout",
    ],
  },
];

/** The form also offers an explicit "not sure" option. */
export const NOT_SURE_OPTION = "Not sure yet";

export const PACKAGE_FORM_OPTIONS = [
  ...PACKAGES.map((p) => p.name),
  NOT_SURE_OPTION,
];

/* ------------------------------------------------------------------ */
/* Pricing-card → questionnaire pre-selection.                         */
/*                                                                     */
/* The pricing section and the questionnaire are far apart in the      */
/* tree, so we use a tiny custom DOM event instead of threading state  */
/* through the page. Cards dispatch; the questionnaire listens.        */
/* ------------------------------------------------------------------ */

export const PACKAGE_SELECT_EVENT = "t4e:select-package";

export function dispatchPackageSelect(packageName: string) {
  window.dispatchEvent(
    new CustomEvent<string>(PACKAGE_SELECT_EVENT, { detail: packageName })
  );
}
