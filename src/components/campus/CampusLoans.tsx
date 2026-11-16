"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { LOANS, type Lender } from "./loans";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Third Party Credit Facility Providers — the education-loan lenders and
 * their terms, as sot.upgrad.com's university pages give them (see loans.ts).
 *
 * Layout: the heading and its line, centred. Then the lenders as an
 * accordion, a row each with its logo, name and a chevron; a click opens that
 * lender's terms under it (one open at a time) in the fee table's plain
 * style: a cool grey header (Loan Type and its loan types), a row per term, a
 * value spanning the columns where one holds for every type. On phones the
 * terms stack, each value under its loan type. Then the five notes, small, in
 * a numbered list.
 *
 * Motion: the list rises in (GSAP); a row opens and closes by sliding its
 * height. Reduced motion: shown as they are.
 */
export function CampusLoans() {
  const root = useRef<HTMLElement>(null);
  // the open lender, if any
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-loan-rise]",
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: "[data-loan-bar]",
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="loans" className="bg-canvas py-8 lg:py-20">
      <div className="container-page">
        <SectionHeading
          title="Third Party Credit"
          accent="Facility Providers"
          intro={LOANS.intro}
        />

        {/* the lenders, one row each; a click opens its terms */}
        <ul data-loan-bar className="mt-8 space-y-3 lg:mt-12">
          {LOANS.lenders.map((l, i) => {
            const on = open === i;
            return (
              <li
                key={l.name}
                data-loan-rise
                className="overflow-hidden rounded-[6px] border border-black/[0.08] bg-white"
              >
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`loan-${i}`}
                  onClick={() => setOpen(on ? null : i)}
                  className="flex w-full items-center gap-4 px-4 py-4 text-left sm:gap-6 sm:px-6 sm:py-5"
                >
                  <span className="relative h-10 w-14 shrink-0 sm:h-12 sm:w-16">
                    <Image
                      src={l.logo}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-contain"
                    />
                  </span>
                  <span className="flex-1 text-[15px] font-semibold text-ink sm:text-[17px]">
                    {l.name}
                  </span>
                  <ChevronDown
                    size={20}
                    aria-hidden
                    className={`shrink-0 text-muted transition-transform duration-300 ${on ? "rotate-180" : ""}`}
                  />
                </button>
                {/* the terms, sliding open */}
                <div
                  id={`loan-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                    on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden" inert={!on}>
                    <div className="px-4 pb-4 sm:px-6 sm:pb-6">
                      <Terms lender={l} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* the notes */}
        <div data-loan-rise className="mt-8 lg:mt-10">
          <h3 className="text-[14px] font-medium text-ink">Notes</h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[13px] leading-relaxed text-body marker:text-muted">
            {LOANS.notes.map((n) => (
              <li key={n.slice(0, 24)}>{n}</li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** a lender's terms: a table from tablets up, stacked on phones */
function Terms({ lender }: { lender: Lender }) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[6px] border border-black/[0.08] sm:block">
        <table className="w-full table-fixed text-[14px]">
          <thead>
            <tr className="bg-[#f6f7f9] text-left">
              <th
                scope="col"
                className="w-[32%] px-5 py-4 font-semibold text-ink"
              >
                Loan Type
              </th>
              {lender.columns.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className="border-l border-black/[0.08] px-5 py-4 font-semibold text-ink"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {lender.rows.map((r) => (
              <tr
                key={r.label}
                className="border-t border-black/[0.08] align-top"
              >
                <th
                  scope="row"
                  className="px-5 py-4 text-left font-medium text-ink"
                >
                  {r.label}
                </th>
                {r.values.map((v, i) => (
                  <td
                    key={i}
                    colSpan={r.values.length === 1 ? lender.columns.length : 1}
                    className="border-l border-black/[0.08] px-5 py-4 leading-relaxed text-body"
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="divide-y divide-black/[0.08] overflow-hidden rounded-[6px] border border-black/[0.08] sm:hidden">
        {lender.rows.map((r) => (
          <div key={r.label} className="px-4 py-3.5">
            <dt className="text-[13px] font-semibold text-ink">{r.label}</dt>
            <dd
              className={`mt-1.5 grid gap-3 text-[13px] leading-snug text-body ${r.values.length > 1 ? "grid-cols-2" : ""}`}
            >
              {r.values.map((v, i) => (
                <span key={i}>
                  {r.values.length > 1 && (
                    <span className="block text-[11px] font-medium text-muted">
                      {lender.columns[i]}
                    </span>
                  )}
                  {v}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}
