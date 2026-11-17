"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { lenis } from "@/components/motion/SmoothScroll";
import { PROSE } from "@/components/site/prose";
import content from "./content.json";

export type LegalKey =
  "privacy-policy" | "terms-and-conditions" | "admission-policy";

type Doc = {
  title: string;
  updated: string;
  toc: { id: string; text: string }[];
  html: string;
};

const DOCS = content as Record<LegalKey, Doc>;

const OTHERS: { key: LegalKey; href: string }[] = [
  { key: "privacy-policy", href: "/privacy-policy" },
  { key: "terms-and-conditions", href: "/terms-and-conditions" },
  { key: "admission-policy", href: "/terms-and-conditions/admission-policy" },
];

/** the legal text's own section blocks: a gap between them, a softer note
    for the opening "Related legal policies" block */
const SECTIONS =
  "[&_section]:scroll-mt-28 [&_section+section]:mt-[2.5em] [&_section>*+*]:mt-[1em] [&_section>h2:first-child]:mt-0 [&>section:not([id])]:rounded-[8px] [&>section:not([id])]:bg-[#f3f5f7] [&>section:not([id])]:p-5 [&>section:not([id])]:text-[14.5px] [&>section:not([id])>p:first-child]:font-semibold [&>section:not([id])>p:first-child]:text-ink";

/**
 * A legal page (Privacy Policy, Terms & Conditions, Admission Policy).
 *
 * The text is sot.upgrad.com's, verbatim, saved as plain HTML (no scripts
 * or styles); links between the three point at these pages. On the blogs
 * page's soft grey band: "Legal", the title, the last-updated date and
 * the other two policies; then on desktop a contents list that stays in
 * view (the section in view red, a click scrolls to it) beside the text.
 */
export function LegalPage({ doc: key }: { doc: LegalKey }) {
  const doc = DOCS[key];
  const [active, setActive] = useState(doc.toc[0]?.id);

  useEffect(() => {
    const onScroll = () => {
      let cur = doc.toc[0]?.id;
      for (const t of doc.toc) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 150) cur = t.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [doc]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -100 });
    else
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 100,
        behavior: "smooth",
      });
  };

  return (
    <>
      <section className="bg-[#f3f5f7] pb-10 pt-[100px] lg:pb-14 lg:pt-[128px]">
        <div className="container-page max-w-[1200px]">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
            Legal
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4.4vw,3.25rem)] font-medium leading-[1.08] tracking-[-0.035em] text-ink">
            {doc.title}
          </h1>
          <p className="mt-3 text-[14px] text-muted">
            Last updated: {doc.updated}
          </p>
          <nav
            aria-label="Other policies"
            className="mt-6 flex flex-wrap gap-2"
          >
            {OTHERS.filter((o) => o.key !== key).map((o) => (
              <Link
                key={o.key}
                href={o.href}
                className="rounded-[6px] border border-black/[0.1] bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink/30"
              >
                {DOCS[o.key].title}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="bg-canvas py-10 lg:py-16">
        <div className="container-page grid max-w-[1200px] gap-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16">
          {/* desktop: the contents, in view while the text scrolls */}
          <aside className="hidden lg:block">
            <div className="sticky top-[100px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Contents
              </p>
              <ol
                data-lenis-prevent
                className="mt-3 grid max-h-[calc(100svh-160px)] gap-0.5 overflow-y-auto pr-1 [scrollbar-width:thin]"
              >
                {doc.toc.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => goTo(t.id)}
                      className={`w-full border-l-2 py-1.5 pl-4 text-left text-[13.5px] leading-snug transition-colors ${
                        active === t.id
                          ? "border-accent font-medium text-accent"
                          : "border-black/[0.08] text-body hover:text-ink"
                      }`}
                    >
                      {t.text}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          <article
            className={`min-w-0 max-w-[820px] ${PROSE} ${SECTIONS}`}
            dangerouslySetInnerHTML={{ __html: doc.html }}
          />
        </div>
      </section>
    </>
  );
}
