/**
 * Single source of truth for the three service packages, shared by the
 * pricing cards and the questionnaire's package-select slide.
 */

export interface ServicePackage {
  /** Stable id used for pre-selection events and form values. */
  id: string;
  name: string;
  price: string;
  tagline: string;
  bullets: string[];
  mostPopular?: boolean;
}

export const PACKAGES: ServicePackage[] = [
  {
    id: "essay-review",
    name: "Essay Review & Revision",
    price: "$199",
    tagline:
      "Deep review and line-by-line revision of your transfer application essay(s).",
    bullets: [
      "Line-by-line edits with the reasoning behind every change",
      "Structural feedback: what to cut, what to expand, what to lead with",
      "Positioning advice so your story reads like an engineer's, not a template's",
      "Two revision rounds so the final draft is genuinely yours",
    ],
  },
  {
    id: "freshman-strategy",
    name: "Freshman-Year Transfer Strategy",
    price: "$349",
    tagline:
      "At a school you're unhappy with? A roadmap for the year that gets you out — and in.",
    bullets: [
      "Semester-by-semester course plan built around transfer credit and GPA",
      "Extracurricular strategy: what admissions actually rewards, and how to get it",
      "Personal positioning: the narrative your application will be built on",
      "1:1 Zoom strategy call to pressure-test the whole plan together",
    ],
    mostPopular: true,
  },
  {
    id: "full-package",
    name: "Full Application Package",
    price: "$749",
    tagline:
      "Everything, start to finish — strategy, essays, and review across your whole application.",
    bullets: [
      "Multiple 1:1 application-review sessions from first draft to submit",
      "Unlimited essay reviews across every school on your list",
      "School list and major-fit strategy tailored to your record",
      "Final full-application audit before you hit submit",
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
