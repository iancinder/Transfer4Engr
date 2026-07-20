"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* Root-relative anchors so links work from any page, not just "/". */
const LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About" },
  { href: "/#faq", label: "FAQ" },
];

/**
 * Sticky top navigation: flat, solid background with a hairline bottom
 * border. Collapses to a disclosure menu on small screens.
 */
export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-cream-50/95 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"
      >
        <a
          href="/"
          className="text-base font-semibold tracking-tight text-ink-900"
        >
          Transfer<span className="text-plum-500">4</span>Engr
        </a>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-mono text-[13px] text-ink-500 transition-colors hover:text-plum-600"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#questionnaire"
            className="rounded-sm bg-plum-600 px-4 py-2 font-mono text-[13px] font-medium text-cream-50 transition-colors hover:bg-plum-500"
          >
            Start your application
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-ink-900 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 22 22"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path d="M4 4l14 14M18 4L4 18" />
            ) : (
              <path d="M3 6h16M3 11h16M3 16h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="overflow-hidden border-t border-line md:hidden"
          >
            <div className="flex flex-col px-4 pb-5 pt-2">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line px-1 py-3 font-mono text-sm text-ink-700 hover:text-plum-600"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#questionnaire"
                onClick={() => setMenuOpen(false)}
                className="mt-4 rounded-sm bg-plum-600 px-4 py-3 text-center font-mono text-sm font-medium text-cream-50"
              >
                Start your application
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
