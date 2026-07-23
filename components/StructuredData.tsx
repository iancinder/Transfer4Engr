import { CONTACT_EMAIL, SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";

/**
 * Site-wide JSON-LD: who runs this and what it is.
 *
 * Only verifiable facts go in here — no invented address, phone, rating, or
 * social profiles. Google penalizes structured data that contradicts the page.
 */
const GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": absoluteUrl("/#website"),
      url: absoluteUrl("/"),
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      publisher: { "@id": absoluteUrl("/#organization") },
      inLanguage: "en-US",
    },
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": absoluteUrl("/#organization"),
      name: SITE_NAME,
      url: absoluteUrl("/"),
      description: SITE_DESCRIPTION,
      email: CONTACT_EMAIL,
      serviceType: "College transfer admissions consulting",
      areaServed: { "@type": "Country", name: "United States" },
      founder: { "@id": absoluteUrl("/#founder") },
      knowsAbout: [
        "Engineering transfer admissions",
        "University of Texas at Austin",
        "Electrical and Computer Engineering",
        "Transfer application essays",
      ],
    },
    {
      "@type": "Person",
      "@id": absoluteUrl("/#founder"),
      name: "Ian Sendelbach",
      email: CONTACT_EMAIL,
      jobTitle: "Transfer admissions consultant",
      description:
        "Transferred into Electrical and Computer Engineering at UT Austin with a 4.00 engineering GPA.",
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "The University of Texas at Austin",
      },
    },
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAPH) }}
    />
  );
}
