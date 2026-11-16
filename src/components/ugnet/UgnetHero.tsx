"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Monitor, Phone } from "lucide-react";
import { GlowButton } from "@/components/site/GlowButton";

gsap.registerPlugin(useGSAP);

/**
 * The uGNET page's hero.
 *
 * Copy is sot.upgrad.com/uGNET's own (read 16 Nov 2026): what uGNET is, what
 * it evaluates, the eligibility, the mode, the 2-hour test, the ₹1,000 fee
 * and the result within 2 days.
 *
 * Layout after the client's reference (an AI exam tool's landing page):
 * one screen tall on desktop, centred on a soft tinted ground, a small label, the headline, the line
 * under it and two calls to action (apply, call admissions), with the
 * eligibility as two small checks. Under it, rising into the section's foot
 * (taking whatever height the copy leaves), after a client reference: a
 * student with a laptop on a cloud (generated with Figma AI in the SOT
 * Website file), its edges fading into the ground, with dark cards floating
 * around it: the 2-hour online test, the score within 2 days, and the
 * scholarships (₹7 Cr+, up to 100% of tuition). Phones show the image
 * alone.
 *
 * Motion (GSAP): the copy rises in line by line, then the preview lifts in
 * from below. Reduced motion: shown as they are.
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
      {/* the soft tinted ground behind the copy and the preview, full width */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,#ffffff_0%,rgba(255,255,255,0)_70%),linear-gradient(180deg,#fff7f8_0%,#ffe9ec_55%,#ffd3da_100%)]"
      />

      <div className="container-page relative flex min-h-0 flex-1 flex-col text-center">
        <p
          data-hero-line
          className="relative z-10 text-[12px] font-semibold uppercase tracking-[0.16em] text-accent"
        >
          National Entrance Test · uGNET 2026
        </p>
        <h1
          id="ugnet-title"
          data-hero-line
          className="relative z-10 mx-auto mt-3 max-w-[860px] text-balance font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
        >
          One test to your <span className="text-accent">AI-First B.Tech</span>{" "}
          in Computer Science
        </h1>
        <p
          data-hero-line
          className="relative z-10 mx-auto mt-4 max-w-[620px] text-balance text-[15.5px] leading-[1.6] text-body lg:text-[16px]"
        >
          uGNET evaluates your technical reasoning, problem-solving ability,
          computational thinking and readiness for a rigorous computer science
          engineering curriculum.
        </p>

        <div
          data-hero-line
          className="relative z-10 mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <GlowButton href="#apply" streak="#0b0d12">
            Apply for uGNET
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </GlowButton>
          <a
            href="tel:18002108080"
            className="inline-flex items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-5 py-[13px] text-[15px] font-semibold text-ink transition-colors hover:border-ink"
          >
            <Phone size={15} aria-hidden />
            1800 210 8080
          </a>
        </div>

        <ul
          data-hero-line
          className="relative z-10 mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] text-body"
        >
          {["Minimum 50% in PCM", "Below 20 years as of July 2026"].map((t) => (
            <li key={t} className="inline-flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-accent text-white">
                <Check size={10} strokeWidth={3} aria-hidden />
              </span>
              {t}
            </li>
          ))}
        </ul>

        {/* the visual: a student on a cloud (Figma AI), its edges fading into
            the ground, with floating cards about the test around it */}
        <div
          data-hero-preview
          className="relative mx-auto mt-6 w-full max-w-[1120px] max-lg:h-[340px] sm:max-lg:h-[440px] lg:mt-4 lg:min-h-[300px] lg:flex-1"
        >
          <Image
            src="/images/ugnet/hero-cloud.webp"
            alt="A student with a laptop, sitting on a cloud"
            fill
            priority
            sizes="(min-width: 1024px) 1120px, 100vw"
            className="pointer-events-none origin-bottom scale-[1.3] object-contain object-bottom [mask-image:radial-gradient(ellipse_45%_70%_at_50%_62%,#000_60%,transparent_100%)] lg:scale-[1.25]"
          />

          {/* left: the test itself */}
          <div className="animate-bob absolute left-0 top-[12%] hidden w-[230px] items-center gap-3 rounded-[12px] bg-ink p-3 text-left text-white shadow-[0_20px_40px_-20px_rgba(11,13,18,0.5)] md:flex lg:left-[4%]">
            <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-accent">
              <Monitor size={18} aria-hidden />
            </span>
            <span className="text-[13.5px] leading-snug">
              2-hour online test,
              <span className="block text-white/60">
                pick a slot that suits you
              </span>
            </span>
          </div>

          <div
            className="animate-bob absolute bottom-[14%] left-0 hidden w-[230px] rounded-[12px] bg-ink p-3.5 text-left text-white shadow-[0_20px_40px_-20px_rgba(11,13,18,0.5)] md:block lg:left-[6%]"
            style={{ animationDelay: "-1.4s" }}
          >
            <p className="text-[13.5px]">Your uGNET score</p>
            <p className="text-[11.5px] text-white/55">Result declaration</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[12.5px]">
                <span className="grid size-5 place-items-center rounded-full bg-accent">
                  <Check size={11} strokeWidth={3} aria-hidden />
                </span>
                Within 2 days
              </span>
              <span className="font-display text-[15px] font-medium text-[#ffb3be]">
                160 marks
              </span>
            </div>
          </div>

          {/* right: the scholarships */}
          <div
            className="animate-bob absolute right-0 top-[4%] hidden w-[250px] rounded-[14px] bg-ink p-4 text-left text-white shadow-[0_24px_48px_-20px_rgba(11,13,18,0.55)] md:block lg:right-[4%]"
            style={{ animationDelay: "-2.6s" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[13.5px]">Scholarships</span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-[11px] font-semibold">
                Up to 100%
              </span>
            </div>
            <p className="mt-3 font-display text-[26px] font-medium leading-none">
              ₹7 Cr+
              <span className="ml-1 text-[12px] font-normal text-white/60">
                set aside
              </span>
            </p>
            <div className="mt-3 rounded-[10px] bg-[linear-gradient(135deg,#e4002b_0%,#ff6b7f_100%)] p-3">
              <p className="text-[11px] text-white/80">
                Eligible students can have
              </p>
              <p className="mt-0.5 text-[13px] font-semibold">
                up to 100% of tuition covered
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
