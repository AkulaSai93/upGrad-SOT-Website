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
 * The uGNET page's hero.
 *
 * Copy is sot.upgrad.com/uGNET's own (read 16 Nov 2026): what uGNET is, what
 * it evaluates, the eligibility, the mode, the 2-hour test, the ₹1,000 fee
 * and the result within 2 days.
 *
 * Layout from the Figma design (SOT Website, node 209:11056): one screen
 * tall on desktop on a sky-blue gradient, centred, a small label, the
 * headline, the line under it and two calls to action (apply, call
 * admissions), with the eligibility as two small checks; at the foot a
 * cut-out of a student with a laptop on a cloud, running just past the
 * section's edge.
 *
 * A soft white overlay at the foot fades the sky into the page, so there is
 * no hard edge where the next section starts.
 *
 * Motion (GSAP): the copy rises in line by line, then the student lifts in
 * from below. On scroll (scrubbed) the copy drifts up and fades, the sky
 * slides slower than the page and the student grows and rises, as if
 * coming towards you. Reduced motion: shown as they are, no scroll effect.
 */

export function UgnetHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(
            "[data-hero-line]",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 },
          )
          .fromTo(
            "[data-hero-preview]",
            { y: 80, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.3 },
            0.35,
          );

        // the scroll effect, tied to the hero leaving the screen
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
          .to("[data-hero-copy]", { yPercent: -35, autoAlpha: 0 }, 0)
          .to("[data-hero-sky]", { yPercent: 18 }, 0)
          .to("[data-hero-cloud]", { scale: 1.18, yPercent: -12 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="ugnet-title"
      className="relative flex flex-col overflow-hidden bg-canvas pt-28 lg:h-[max(100svh,720px)] lg:pt-28"
    >
      {/* the sky behind it all, full width (Figma 209:11105) */}
      <div
        aria-hidden
        data-hero-sky
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#8dcaec_0%,#b4dff5_55%,#eaf7fd_100%)]"
      />

      <div className="container-page relative flex min-h-0 flex-1 flex-col text-center">
        <div data-hero-copy className="relative z-10 flex flex-col">
          <p
            data-hero-line
            className="relative z-10 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#294454]"
          >
            National Entrance Test · <span className="lowercase">u</span>GNET
            2026
          </p>
          <h1
            id="ugnet-title"
            data-hero-line
            className="relative z-10 mx-auto mt-3 max-w-[860px] text-balance font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
          >
            One test to your{" "}
            <span className="text-accent">AI-First B.Tech</span> in Computer
            Science
          </h1>
          <p
            data-hero-line
            className="relative z-10 mx-auto mt-4 max-w-[620px] text-balance text-[15.5px] leading-[1.6] text-[#294454] lg:text-[16px]"
          >
            uGNET evaluates your technical reasoning, problem-solving ability,
            computational thinking and readiness for a rigorous computer science
            engineering curriculum.
          </p>

          <div
            data-hero-line
            className="relative z-10 mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center"
          >
            <GlowButton
              href="#apply"
              streak="#0b0d12"
              className="[&>span:last-child]:py-[10.5px] max-sm:w-full max-sm:[&>span:last-child]:w-full max-sm:[&>span:last-child]:justify-center max-sm:[&>span:last-child]:py-3 max-sm:[&>span:last-child]:text-[16px]"
            >
              Apply for uGNET
              <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
            </GlowButton>
            <a
              href={PHONE.href}
              className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-5 py-[11px] text-[15px] font-semibold text-ink transition-colors hover:border-ink max-sm:w-full max-sm:py-[12.5px] max-sm:text-[16px]"
            >
              <Phone size={15} aria-hidden />
              {PHONE.label}
            </a>
          </div>

          <ul
            data-hero-line
            className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] text-[#294454]"
          >
            {["Minimum 50% in PCM", "Below 20 years as of July 2026"].map(
              (t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <span className="grid size-4 place-items-center rounded-full bg-accent text-white">
                    <Check size={10} strokeWidth={3} aria-hidden />
                  </span>
                  {t}
                </li>
              ),
            )}
          </ul>
        </div>

        {/* the student on a cloud, centred at the foot and running just past
            it; the frame crops the cut-out as the Figma frame does */}
        <div
          data-hero-preview
          className="relative mx-auto mt-8 aspect-[485/390] w-[min(485px,88vw)] translate-y-4 lg:mt-auto"
        >
          <div
            data-hero-cloud
            className="pointer-events-none absolute inset-0 origin-bottom overflow-hidden"
          >
            <Image
              src="/images/ugnet/hero-student-cloud.webp"
              alt="A student with a laptop, sitting on a cloud"
              width={1600}
              height={1067}
              priority
              sizes="(min-width: 640px) 680px, 124vw"
              className="absolute left-[-27.68%] top-[-16.04%] h-[116.03%] w-[139.9%] max-w-none"
            />
          </div>
        </div>
      </div>

      {/* the overlay: the sky fades into the page's white at the foot */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_55%,#fff_100%)] lg:h-44"
      />
    </section>
  );
}
