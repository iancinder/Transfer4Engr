import { collection, config, fields } from "@keystatic/core";

/**
 * Keystatic CMS configuration.
 *
 * Storage mode is chosen by whether the GitHub App is configured, not by
 * NODE_ENV. Keying off the app slug means the site still builds cleanly
 * before the App exists (and if the credentials are ever removed), instead
 * of failing the build with a missing-config error.
 *
 *   - GitHub mode: edits are committed to the repo via the Keystatic GitHub
 *     App, which triggers a Vercel rebuild. Requires all four env vars.
 *   - Local mode:  edits write straight to the working tree. No auth, no
 *     network — this is what runs on localhost.
 *
 * Posts are single `.mdoc` files with YAML frontmatter, so a post plus its
 * images lands as one reviewable commit.
 */
const GITHUB_APP_SLUG = process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG;

export default config({
  storage:
    GITHUB_APP_SLUG && process.env.NODE_ENV !== "development"
      ? {
          kind: "github",
          repo: { owner: "iancinder", name: "Transfer4Engr" },
        }
      : { kind: "local" },

  ui: {
    brand: { name: "Transfer4Engr" },
  },

  collections: {
    posts: collection({
      label: "Blog posts",
      slugField: "title",
      path: "content/posts/*",
      /* Body is stored as the file's markdown content, not a frontmatter key. */
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "publishedAt"],

      schema: {
        title: fields.slug({
          name: {
            label: "Title",
            description:
              "Also the <h1> and the browser tab title. Lead with the phrase people actually search for.",
            validation: { isRequired: true },
          },
          slug: {
            label: "URL slug",
            description:
              "Becomes /blog/<slug>. Keep the search phrase in it, e.g. transferring-into-ut-ece. Avoid changing it after publishing — the old URL will 404.",
          },
        }),

        description: fields.text({
          label: "Meta description",
          description:
            "The grey summary line under your title in Google results. Aim for 120–160 characters; write it as a promise to the searcher.",
          multiline: true,
          validation: { isRequired: true, length: { min: 50, max: 160 } },
        }),

        publishedAt: fields.date({
          label: "Published date",
          defaultValue: { kind: "today" },
          validation: { isRequired: true },
        }),

        updatedAt: fields.date({
          label: "Last updated",
          description:
            "Set this when you materially revise a post — Google surfaces freshness for admissions content that changes yearly.",
        }),

        draft: fields.checkbox({
          label: "Draft",
          description:
            "Drafts are excluded from the blog index, the sitemap, and search engines. Uncheck to publish.",
          defaultValue: false,
        }),

        coverImage: fields.image({
          label: "Cover image",
          description:
            "Optional. Shown at the top of the post and used as the social sharing card.",
          directory: "public/blog",
          publicPath: "/blog/",
        }),

        coverAlt: fields.text({
          label: "Cover image alt text",
          description:
            "Describe the image for screen readers and search engines. Leave blank only if purely decorative.",
        }),

        content: fields.markdoc({
          label: "Content",
          options: {
            image: {
              directory: "public/blog",
              publicPath: "/blog/",
            },
          },
        }),
      },
    }),
  },
});
