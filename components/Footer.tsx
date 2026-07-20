/**
 * Site footer. Intentionally no social icons — the business is new and we
 * don't fake presence. TODO: add real social links here when they exist.
 */
export default function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-semibold tracking-tight text-ink-900">
              Transfer<span className="text-plum-500">4</span>Engr
            </p>
            <a
              href="mailto:iansendelbach@gmail.com"
              className="mt-2 inline-block font-mono text-xs text-plum-600 underline-offset-4 hover:underline"
            >
              iansendelbach@gmail.com
            </a>
          </div>
          <div className="max-w-sm">
            <p className="font-mono text-xs leading-relaxed text-ink-400">
              Transfer4Engr is an independent consulting service and is not
              affiliated with, endorsed by, or sponsored by any university.
            </p>
            <p className="mt-3 font-mono text-xs text-ink-400">
              &copy; {new Date().getFullYear()} Transfer4Engr. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
