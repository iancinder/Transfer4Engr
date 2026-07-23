import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PostBody from "@/components/PostBody";
import PostCta from "@/components/PostCta";
import { formatDate, getPost, getPublishedPosts } from "@/lib/posts";
import { CONTACT_EMAIL, SITE_NAME, absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** Prerenders every published post at build time. */
export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  const url = `/blog/${slug}`;

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}),
      authors: ["Ian Sendelbach"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  /* Tells Google this is an article, who wrote it, and when it changed. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${slug}`),
    },
    author: {
      "@type": "Person",
      name: "Ian Sendelbach",
      email: CONTACT_EMAIL,
      url: absoluteUrl("/#about"),
    },
    publisher: { "@id": absoluteUrl("/#organization") },
    ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav />

      <main className="pt-16">
        <article className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
          <header className="pb-10 pt-12 sm:pt-16">
            <a
              href="/blog"
              className="font-mono text-xs text-ink-400 transition-colors hover:text-plum-600"
            >
              ← All posts
            </a>

            <h1 className="mt-6 text-3xl font-semibold leading-[1.15] tracking-tight text-ink-900 sm:text-4xl">
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-ink-400">
              <time dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
              <span aria-hidden="true">·</span>
              <span>{post.readingTime} min read</span>
              {post.updatedAt && post.updatedAt !== post.publishedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Updated {formatDate(post.updatedAt)}</span>
                </>
              )}
            </div>
          </header>

          {post.coverImage && (
            /* Fixed aspect ratio reserves the space, so no layout shift. */
            <div className="mb-10 aspect-[16/9] overflow-hidden rounded-sm border border-line bg-cream-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.coverAlt}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
          )}

          <PostBody node={post.node} />
        </article>

        <PostCta />
      </main>

      <Footer />
    </>
  );
}
