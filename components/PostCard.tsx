import { formatDate, type PostSummary } from "@/lib/posts";

/**
 * One row in a post list. Flat bordered card with a plum hover border, to
 * match the HowItWorks step cards.
 */
export default function PostCard({ post }: { post: PostSummary }) {
  return (
    <li className="h-full">
      <a
        href={`/blog/${post.slug}`}
        className="group block h-full rounded-sm border border-line bg-cream-50 p-6 transition-colors hover:border-plum-400"
      >
        <time
          dateTime={post.publishedAt}
          className="font-mono text-xs text-ink-400"
        >
          {formatDate(post.publishedAt)}
        </time>
        <h2 className="mt-3 text-lg font-semibold tracking-tight text-ink-900 transition-colors group-hover:text-plum-600">
          {post.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {post.description}
        </p>
        <span
          aria-hidden="true"
          className="mt-4 inline-block font-mono text-xs text-plum-600"
        >
          Read →
        </span>
      </a>
    </li>
  );
}
