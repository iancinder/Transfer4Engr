import Reveal from "./Reveal";
import PostCard from "./PostCard";
import { getPublishedPosts } from "@/lib/posts";

/**
 * Three most recent posts, surfaced on the homepage.
 *
 * This is an SEO play as much as a UX one: the homepage carries the most
 * authority, so linking posts from it gets them crawled and ranked sooner.
 * Renders nothing at all until at least one post exists.
 */
export default async function LatestPosts() {
  const posts = (await getPublishedPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
            From the blog
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
              What I wish someone had told me.
            </h2>
            <a
              href="/blog"
              className="font-mono text-[13px] text-plum-600 underline-offset-4 hover:underline"
            >
              All posts →
            </a>
          </div>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.08}>
              <PostCard post={post} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
