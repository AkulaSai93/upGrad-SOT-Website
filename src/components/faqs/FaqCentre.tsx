"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";
import { TOPICS } from "./data";

gsap.registerPlugin(useGSAP);

/**
 * The FAQs page: every answer from sot.upgrad.com/allFAQs on one page.
 *
 * Layout: a light hero in the admission page's style (a campus photo low
 * across it, the headline and a line centred on its sky), then, after a
 * client reference (quadcse.com/faqs), the answers: on desktop a sticky
 * topic list on the left (numbered, the one in view marked red, with its
 * count) and the topics down the right, each a big red number, a title and
 * a line over its questions as cards like the home page's FAQs (no
 * numbers), which open one at a time (the + square turns red, to ×); on phones the topics become a sticky row of chips. A link to Get in
 * Touch closes the list.
 */

const pad = (n: number) => String(n).padStart(2, "0");

export function FaqCentre() {
  const root = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [active, setActive] = useState(TOPICS[0].id);

  // every topic, each answer keeping its index
  const shown = useMemo(
    () =>
      TOPICS.map((t) => ({ ...t, list: t.faqs.map((f, i) => ({ ...f, i })) })),
    [],
  );

  // the topic in view, for the list and the chips
  useEffect(() => {
    const onScroll = () => {
      let cur = shown[0]?.id;
      for (const t of shown) {
        const el = document.getElementById(`faq-${t.id}`);
        if (el && el.getBoundingClientRect().top < 170) cur = t.id;
      }
      if (cur) setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [shown]);

  // keep the active chip in view on phones
  useEffect(() => {
    document
      .getElementById(`chip-${active}`)
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [active]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -166 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-hero-line]",
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.07,
            ease: "expo.out",
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* the hero, as the admission page's: a campus photo (Figma AI, SOT
          Website file) across the lower part, its sky melting into the
          hero's own sky above, the headline and its line centred over it */}
      <section
        aria-labelledby="faq-title"
        className="relative overflow-hidden bg-[linear-gradient(180deg,#a3ccf5_0%,#bbdbfa_45%,#d4e8f7_100%)] pt-24 lg:h-[max(96svh,760px)] lg:pt-[112px]"
      >
        <div
          data-hero-copy
          className="container-page relative z-10 text-center"
        >
          <h1
            id="faq-title"
            data-hero-line
            className="mx-auto max-w-[900px] text-balance font-display text-[clamp(2.25rem,5vw,4.25rem)] font-medium leading-[1.04] tracking-[-0.04em] text-ink"
          >
            Frequently Asked <span className="text-accent">Questions</span>
          </h1>
          <p
            data-hero-line
            className="mx-auto mt-4 max-w-[640px] text-balance text-[15.5px] leading-[1.6] text-[#294454] lg:text-[17px]"
          >
            Everything you need to know about uGNET, admissions, fees, outcomes
            and our AI agents, all in one place.
          </p>
        </div>

        {/* the campus: a block under the copy on phones, the lower part of
            the hero on desktop; its sky fades into the hero's */}
        <div className="relative mt-8 h-[clamp(220px,60vw,380px)] [mask-image:linear-gradient(180deg,transparent_0%,#000_28%)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[28%] lg:mt-0 lg:h-auto lg:[mask-image:linear-gradient(180deg,transparent_0%,#000_22%)]">
          <Image
            src="/images/faqs/hero-campus.webp"
            alt="Students on a university lawn talking with a mentor"
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom max-lg:origin-bottom max-lg:scale-[1.5]"
          />
        </div>

        {/* the foot fades into the page's white */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_100%)] lg:h-24"
        />
      </section>

      {/* phones: the topics as a sticky row of chips */}
      <nav
        aria-label="FAQ topics"
        className="sticky top-[96px] z-20 border-b border-black/[0.08] bg-white/95 backdrop-blur lg:hidden"
      >
        <div className="flex gap-2 overflow-x-auto px-4 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {shown.map((t) => (
            <button
              key={t.id}
              id={`chip-${t.id}`}
              type="button"
              onClick={() => goTo(`faq-${t.id}`)}
              className={`shrink-0 whitespace-nowrap rounded-[6px] border px-4 py-2 text-[13px] font-medium transition-colors ${
                active === t.id
                  ? "border-ink bg-ink text-white"
                  : "border-black/[0.1] bg-white text-ink"
              }`}
            >
              {t.title}
            </button>
          ))}
        </div>
      </nav>

      {/* the answers */}
      <section className="bg-canvas py-10 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-16">
          {/* desktop: the topic list, in view while the answers scroll */}
          <aside className="hidden lg:block">
            <div className="sticky top-[148px]">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Topics
              </p>
              <ul className="mt-3 grid">
                {shown.map((t) => {
                  const n = TOPICS.findIndex((x) => x.id === t.id) + 1;
                  const on = active === t.id;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => goTo(`faq-${t.id}`)}
                        className={`flex w-full items-center gap-3 py-1.5 pr-1 text-left text-[13.5px] transition-colors ${
                          on
                            ? "font-medium text-accent"
                            : "text-body hover:text-ink"
                        }`}
                      >
                        <span
                          className={`w-5 text-[11.5px] tabular-nums ${on ? "text-accent" : "text-muted"}`}
                        >
                          {pad(n)}
                        </span>
                        <span className="min-w-0 flex-1 truncate whitespace-nowrap">
                          {t.title}
                        </span>
                        <span className="text-[11.5px] tabular-nums text-muted">
                          {t.list.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/contact"
                className="group mt-6 inline-flex items-center gap-1 text-[13.5px] font-medium text-ink hover:text-accent"
              >
                Still have a question?
                <ArrowUpRight
                  size={15}
                  aria-hidden
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </aside>

          <div className="grid gap-14 lg:gap-20">
            {shown.map((t) => {
              const n = TOPICS.findIndex((x) => x.id === t.id) + 1;
              return (
                <section
                  key={t.id}
                  id={`faq-${t.id}`}
                  aria-labelledby={`faq-${t.id}-title`}
                  className="scroll-mt-[164px]"
                >
                  <div className="flex items-start gap-4 lg:gap-5">
                    <span className="font-display text-[clamp(2.5rem,4.4vw,3.75rem)] font-medium leading-[0.85] tracking-[-0.05em] text-accent">
                      {pad(n)}
                    </span>
                    <div>
                      <h2
                        id={`faq-${t.id}-title`}
                        className="font-display text-[clamp(1.375rem,2.2vw,1.75rem)] font-medium leading-tight tracking-[-0.025em] text-ink"
                      >
                        {t.title}
                      </h2>
                      <p className="mt-1 text-[14px] text-muted">{t.sub}</p>
                    </div>
                  </div>

                  {/* the questions as cards, as on the home page's FAQs
                      (without the numbers) */}
                  <ul className="mt-6 flex flex-col gap-3 lg:mt-8">
                    {t.list.map((f) => {
                      const key = `${t.id}-${f.i}`;
                      const on = open === key;
                      return (
                        <li
                          key={key}
                          id={`faq-${key}`}
                          className={`scroll-mt-[164px] rounded-[6px] border bg-white transition-colors duration-300 ${
                            on
                              ? "border-ink/20"
                              : "border-black/[0.08] hover:border-ink/20"
                          }`}
                        >
                          <button
                            type="button"
                            aria-expanded={on}
                            aria-controls={`faq-${key}-a`}
                            onClick={() => setOpen(on ? null : key)}
                            className="flex w-full items-center gap-4 px-4 py-3.5 text-left sm:gap-6 sm:px-5"
                          >
                            <span className="flex-1 text-[14.5px] font-semibold leading-snug text-ink lg:text-[15px]">
                              {f.q}
                            </span>
                            <span
                              aria-hidden
                              className={`grid size-7 shrink-0 place-items-center rounded-[5px] transition-colors duration-300 ${
                                on
                                  ? "bg-accent text-white"
                                  : "bg-ink/[0.05] text-ink"
                              }`}
                            >
                              <Plus
                                size={15}
                                strokeWidth={2.25}
                                className={`transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "rotate-45" : ""}`}
                              />
                            </span>
                          </button>
                          <div
                            id={`faq-${key}-a`}
                            role="region"
                            className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                          >
                            <div className="overflow-hidden">
                              <p className="max-w-[820px] px-4 pb-4 text-[14.5px] leading-relaxed text-body sm:px-5 sm:pr-16">
                                {f.a}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}

            {/* phones: the way out */}
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1 text-[14.5px] font-medium text-ink lg:hidden"
            >
              Still have a question?
              <ArrowUpRight size={15} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
