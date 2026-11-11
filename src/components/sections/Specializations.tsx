"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "New-Gen Engineering Specializations"
 *
 * Copy from sot.upgrad.com — heading, intro and the six domains.
 *
 * Layout follows the "Across the globe, teens are choosing TKS" block on
 * tks.world, under the site's usual centred heading: a stack of full-width
 * rows divided by hairlines.
 * Each row is three columns — a small label, one giant word, a short line —
 * bottom-aligned so the label and line sit on the big word's baseline. Below
 * lg a row stacks (label, word, line).
 *
 * Motion is all GSAP. As each row scrolls in its giant word rises out of a
 * mask with a slight tilt (TKS's split-line reveal) and the label and line
 * fade up after it. On desktop with a fine pointer, hovering a row dims the
 * others, nudges its word right, and a preview card carrying that domain's
 * illustration (public/images/specializations/v9) follows the cursor,
 * crossfading between domains as you move down the list. Touch screens get
 * the illustration as a small thumbnail on the label line instead.
 */
const SPECIALIZATIONS = [
  {
    title: "Artificial Intelligence & Machine Learning",
    label: "Artificial Intelligence",
    word: "AI & ML",
    body: "Build intelligent systems that learn and adapt",
    key: "aiml",
  },
  {
    title: "FullStack Web Development",
    label: "FullStack",
    word: "Web Dev",
    body: "Create modern web applications end-to-end",
    key: "webdev",
  },
  {
    title: "Quantum Computing",
    label: "Quantum",
    word: "Computing",
    body: "Explore next-generation computational power",
    key: "quantum",
  },
  {
    title: "Blockchain",
    label: "Web3",
    word: "Blockchain",
    body: "Master decentralized technologies and Web3",
    key: "blockchain",
  },
  {
    title: "Cybersecurity",
    label: "Cyber",
    word: "Security",
    body: "Protect systems with advanced security practices",
    key: "cybersecurity",
  },
  {
    title: "Cloud Innovation",
    label: "Cloud",
    word: "Innovation",
    body: "Design scalable cloud-native architectures",
    key: "cloud",
  },
] as const;

export function Specializations() {
  const root = useRef<HTMLElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // scroll reveal: each row as it enters
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const q = gsap.utils.selector(root);
        q("[data-row]").forEach((row) => {
          const r = gsap.utils.selector(row);
          gsap
            .timeline({
              defaults: { ease: "expo.out" },
              scrollTrigger: { trigger: row, start: "top 88%" },
            })
            .fromTo(row, { "--rule": 0 }, { "--rule": 1, duration: 1.4 }, 0)
            .fromTo(
              r("[data-word]"),
              { yPercent: 120, rotate: 5 },
              { yPercent: 0, rotate: 0, duration: 1.3 },
              0,
            )
            .fromTo(
              r("[data-fade]"),
              { y: 20, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 },
              0.15,
            );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // cursor-following preview (desktop, fine pointer only)
  const moveX = useRef<gsap.QuickToFunc | null>(null);
  const moveY = useRef<gsap.QuickToFunc | null>(null);

  useGSAP(
    () => {
      const card = preview.current;
      if (!card) return;
      gsap.set(card, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
      moveX.current = gsap.quickTo(card, "x", { duration: 0.6, ease: "power3.out" });
      moveY.current = gsap.quickTo(card, "y", { duration: 0.6, ease: "power3.out" });
      return () => gsap.killTweensOf(card);
    },
    { scope: root },
  );

  // cursor position relative to the list, where the card is positioned
  const local = (e: PointerEvent) => {
    const box = list.current!.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !list.current) return;
    const { x, y } = local(e);
    moveX.current?.(x);
    moveY.current?.(y);
  };

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !list.current || !preview.current) return;
    // start from the cursor so the card doesn't fly in from the corner
    const { x, y } = local(e);
    moveX.current?.(x, x);
    moveY.current?.(y, y);
    gsap.to(preview.current, { scale: 1, autoAlpha: 1, duration: 0.5, ease: "expo.out", overwrite: "auto" });
  };

  const onLeave = () => {
    setHovered(null);
    if (!preview.current) return;
    gsap.to(preview.current, { scale: 0, autoAlpha: 0, duration: 0.35, ease: "power3.in", overwrite: "auto" });
  };

  return (
    <section
      ref={root}
      id="specializations"
      className="relative bg-canvas py-16 lg:py-28"
    >
      <div className="container-page relative">
        <SectionHeading
          title="New-Gen Engineering"
          accent="Specializations"
          intro={
            <>
              Explore future-focused domains shaping the next decade of
              technology
              <br className="hidden sm:block" /> AI / ML, Cloud, Blockchain and
              many more
            </>
          }
        />

        <div
          ref={list}
          onPointerEnter={onEnter}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative mt-14 lg:mt-24"
        >
          {SPECIALIZATIONS.map((spec, i) => {
            const n = String(i + 1).padStart(2, "0");
            const dim = hovered !== null && hovered !== i;
            return (
              <article
                key={spec.key}
                data-row
                aria-label={spec.title}
                onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(i)}
                className={`relative grid grid-cols-1 gap-y-3 py-6 transition-opacity duration-500 lg:grid-cols-[3fr_7fr_2fr] lg:items-end lg:gap-x-[18px] lg:py-6 ${
                  dim ? "lg:opacity-30" : ""
                }`}
              >
                {/* hairline that draws in from the left */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-[var(--rule,1)] bg-line-strong"
                />

                <div
                  data-fade
                  className="flex items-center justify-between gap-4 lg:pb-[0.35rem]"
                >
                  <p className="flex items-baseline gap-3 text-[15px] font-semibold text-ink">
                    <span
                      className={`font-mono text-[12px] transition-colors duration-300 ${
                        hovered === i ? "text-accent" : "text-muted"
                      }`}
                    >
                      {n}
                    </span>
                    {spec.label}
                  </p>
                  {/* touch / small screens: the art as a thumbnail */}
                  <span className="relative size-14 shrink-0 overflow-hidden rounded-[6px] bg-ink lg:hidden">
                    <Image
                      src={`/images/specializations/v9/${spec.key}.webp`}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </span>
                </div>

                {/* the giant word, in a mask so it can rise into view */}
                <div className="-mb-[0.24em] overflow-clip pb-[0.24em] text-[clamp(2.5rem,5.2vw,4.75rem)]">
                  <h3
                    data-word
                    className="origin-bottom-left whitespace-nowrap font-display font-semibold leading-[0.95] tracking-[-0.045em] text-ink"
                  >
                    <span
                      className={`inline-block transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        hovered === i ? "lg:translate-x-6" : ""
                      }`}
                    >
                      {spec.word}
                    </span>
                  </h3>
                </div>

                <p
                  data-fade
                  className="max-w-[420px] text-[14.5px] leading-[1.5] text-body lg:pb-[0.35rem]"
                >
                  {spec.body}
                </p>
              </article>
            );
          })}

          {/* cursor-following preview: every domain's art stacked, the
              hovered one shown */}
          <div
            ref={preview}
            aria-hidden
            className="pointer-events-none invisible absolute left-0 top-0 z-20 hidden aspect-[4/3] w-[clamp(260px,24vw,360px)] overflow-hidden rounded-[8px] bg-ink shadow-[var(--shadow-lg)] lg:block"
          >
            {SPECIALIZATIONS.map((spec, i) => (
              <Image
                key={spec.key}
                src={`/images/specializations/v9/${spec.key}.webp`}
                alt=""
                fill
                quality={90}
                sizes="360px"
                className={`object-cover transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  hovered === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

