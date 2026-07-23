import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import PostCard from "@/components/PostCard";
import { getPublishedPosts } from "@/lib/posts";

/* Shown on the page. */
const SUBHEADING =
  "What works and how to get it to work for you. Knowledge and opinions are from lived experience.";

/*
 * Shown in search results. Kept separate from the subheading so it can name
 * the things people actually search for — the on-page copy reads as voice,
 * this has to read as a match for the query.
 */
const DESCRIPTION =
  "Guides, advice, and retrospectives on transferring into engineering programs — timelines, essays, course planning, and what admissions committees look for.";

export const metadata: Metadata = {
  title: "Blog",
  description: DESCRIPTION,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Transfer4Engr",
    description: DESCRIPTION,
    url: "/blog",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <Nav />

      <main className="pt-16">
        <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 sm:pb-28">
          <header className="pb-10 pt-12 sm:pt-16">
            <Reveal>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
                Blog
              </p>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900 sm:text-5xl">
                Guides, advice, and retrospectives.
              </h1>
              <p className="mt-4 text-base leading-relaxed text-ink-500">
                {SUBHEADING}
              </p>
            </Reveal>
          </header>

          {posts.length === 0 ? (
            <p className="rounded-sm border border-line bg-cream-100 p-6 font-mono text-sm text-ink-500">
              No posts yet — check back soon.
            </p>
          ) : (
            <ul className="grid gap-4">
              {posts.map((post, i) => (
                <Reveal key={post.slug} delay={i * 0.06}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </ul>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
