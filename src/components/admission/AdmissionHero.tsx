"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Phone } from "lucide-react";
import { GlowButton } from "@/components/site/GlowButton";
import { PHONE } from "@/components/site/contact";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The admission page's hero.
 *
 * Copy is sot.upgrad.com/admission's own (read 16 Nov 2026): "Admissions Open
 * for 2026", the welcome line, the eligibility criteria, the admissions
 * number and Apply Now.
 *
 * Layout from the Figma design (SOT Website, node 213:12548): one screen
 * tall on desktop, a wide campus photo (Figma AI, node 213:12545) full
 * bleed behind it all, its open sky above and the campus low on the
 * horizon; over the sky the copy, centred: the label, the headline, the
 * welcome line, the two calls to action and the eligibility as a row of
 * small checks. The foot fades into the page's white. On phones the photo is a block under
 * the copy (cropped to the centre), its sky fading into a matching sky
 * behind the copy.
 *
 * Motion (GSAP): the photo settles from a slight zoom and the copy rises in
 * line by line. On scroll (scrubbed) the copy drifts up and fades and the
 * photo zooms in slowly. Reduced motion: shown as they are.
 */
const ELIGIBILITY = [
  "Below 20 years of age before July 2026",
  "Minimum 50% in PCM in Class 12",
  "Passed 12th in 2024/2025 or appearing in 2026",
];

export function AdmissionHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(
            "[data-hero-photo]",
            { scale: 1.08 },
            { scale: 1, duration: 2 },
            0,
          )
          .fromTo(
            "[data-hero-line]",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07 },
            0.1,
          );

        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.6,
            },
          })
          .to("[data-hero-copy]", { yPercent: -30, autoAlpha: 0 }, 0)
          .to("[data-hero-zoom]", { scale: 1.12 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="admission-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#9ac9f6_0%,#bcdbf7_45%,#e7ebec_100%)] pt-24 lg:h-[max(100svh,760px)] lg:pb-0 lg:pt-[88px] [@media(min-width:1024px)_and_(max-height:820px)]:pt-[76px]"
    >
      <div
        data-hero-copy
        className="container-page relative z-10 flex flex-col items-center text-center"
      >
        <p
          data-hero-line
          className="inline-flex items-center gap-2 rounded-[4px] border border-black/[0.06] bg-white px-3 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-ink"
        >
          <span className="relative flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/60" />
            <span className="relative size-2 rounded-full bg-accent" />
          </span>
          Admissions Open
        </p>
        <h1
          id="admission-title"
          data-hero-line
          className="mt-3 max-w-[760px] text-balance font-display text-[clamp(2.25rem,4.4vw,3.75rem)] font-medium leading-[1.04] tracking-[-0.035em] text-ink"
        >
          Admissions Open <span className="text-accent">for 2026</span>
        </h1>
        <p
          data-hero-line
          className="mt-4 max-w-[754px] text-balance text-[15.5px] leading-[1.6] text-[#294454] lg:text-[16px]"
        >
          Welcome to uGSOT (upGrad School of Technology). Our admissions process
          is designed to identify students with strong fundamentals, curiosity,
          and the potential to grow into future tech leaders.
        </p>

        <div
          data-hero-line
          className="mt-6 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <GlowButton
            href="#process"
            streak="#0b0d12"
            className="[&>span:last-child]:py-[10.5px] max-sm:w-full max-sm:[&>span:last-child]:w-full max-sm:[&>span:last-child]:justify-center max-sm:[&>span:last-child]:py-3 max-sm:[&>span:last-child]:text-[16px]"
          >
            Apply Now
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </GlowButton>
          <a
            href={PHONE.href}
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-5 py-[11px] text-[15px] font-semibold text-ink transition-colors hover:border-ink max-sm:w-full max-sm:py-[12.5px] max-sm:text-[16px]"
          >
            <Phone size={15} aria-hidden />
            Call {PHONE.label}
          </a>
        </div>

        {/* the eligibility */}
        <ul
          data-hero-line
          className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12.5px] text-[#294454] max-sm:flex-col"
        >
          {ELIGIBILITY.map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-accent text-white">
                <Check size={10} strokeWidth={3} aria-hidden />
              </span>
              {t}
            </li>
          ))}
        </ul>
      </div>

      {/* the campus: full bleed on desktop, behind the copy; on phones a
          block under the copy (so it never runs under the text), its sky
          fading into the section's matching sky */}
      <div
        data-hero-zoom
        className="relative mt-6 h-[clamp(240px,66vw,400px)] origin-bottom [mask-image:linear-gradient(180deg,transparent_0%,#000_22%)] lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[12%] lg:mt-0 lg:h-auto"
      >
        <div data-hero-photo className="absolute inset-0">
          <Image
            src="/images/admission/hero-campus-v5.webp"
            alt="A university campus under an open morning sky"
            fill
            priority
            sizes="100vw"
            className="origin-bottom object-cover object-bottom max-lg:scale-[1.6]"
          />
        </div>
      </div>

      {/* the foot fades into the page's white */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-16 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_100%)] lg:h-24"
      />
    </section>
  );
}
