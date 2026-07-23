/**
 * End-of-post conversion block. Every post funnels to the free assessment —
 * that's the point of writing them.
 */
export default function PostCta() {
  return (
    <section className="mt-16 border-t border-line bg-cream-100 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-400">
          Free transfer assessment
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink-900 sm:text-3xl">
          Wondering where you actually stand?
        </h2>
        <p className="mt-4 text-base leading-relaxed text-ink-500">
          Tell me about your situation and I&apos;ll give you an honest read on
          what&apos;s realistic — free, reviewed personally, and back to you by
          email within 48 hours.
        </p>
        <a
          href="/assessment"
          className="mt-8 inline-block rounded-sm bg-plum-600 px-6 py-3.5 text-center font-mono text-sm font-medium text-cream-50 transition-colors hover:bg-plum-500"
        >
          Get my free assessment
        </a>
      </div>
    </section>
  );
}
