"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check, Download, FileText, Gauge } from "lucide-react";
import { GlowButton } from "@/components/site/GlowButton";
import { Thumb } from "./ResumeSamples";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The AI Playground's resume builder (ResumeCraft agent) hero.
 *
 * Layout after a client reference (onefin.framer.website), in light
 * colours: a soft sky with a glow; in the middle a big sheet of a real
 * resume (a second page behind it), rising out of a frosted glass panel,
 * its foot melting away;
 * two soft cards behind it and, over its edges, cards tilted as if pinned in the air: the ATS score as a ring,
 * keywords matched, a job match bar and the PDF with a Download button.
 * The visual fills the first screen with the headline at its foot (on one
 * line); the line and the two calls to action follow just below the fold
 * and come into view as the page scrolls, as on the reference.
 *
 * Motion (GSAP): the page rises in, the cards fly in from a wider tilt
 * and settle, then float gently; the copy rises in. On scroll (scrubbed),
 * as on the reference, the copy scrolls up as it is while the visual
 * behind it moves up more slowly and fades, the cards drifting outwards. Reduced motion: shown as
 * they are.
 */
type Side = "l" | "r";

/** a floating card: drifts on scroll (outer), flies in (middle), bobs (inner) */
function FloatCard({
  side,
  pos,
  tilt,
  delay,
  children,
}: {
  side: Side;
  pos: string;
  tilt: string;
  delay: string;
  children: React.ReactNode;
}) {
  return (
    <div data-drift={side} className={`absolute z-20 ${pos}`}>
      <div data-hero-card>
        <div
          className={`animate-[rh-float_7s_ease-in-out_infinite] max-sm:scale-[0.72] sm:scale-[0.82] lg:scale-[0.86] ${side === "l" ? "origin-left" : "origin-right"} rounded-[12px] border border-white/80 bg-white/90 shadow-[0_18px_40px_-16px_rgba(31,61,85,0.35)] backdrop-blur ${tilt}`}
          style={{ animationDelay: delay }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export function ResumeHero({
  createHref = "#create",
  atsHref = "#ats-score",
}: {
  createHref?: string;
  atsHref?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(
            "[data-hero-page]",
            { y: 90, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.4 },
            0,
          )
          .fromTo(
            "[data-hero-card]",
            {
              autoAlpha: 0,
              scale: 0.7,
              y: 80,
              rotate: (i: number) => (i % 2 ? 28 : -28),
            },
            {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              rotate: 0,
              duration: 1.3,
              stagger: 0.09,
            },
            0.25,
          )
          .fromTo(
            "[data-hero-line]",
            { y: 28, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07 },
            0.35,
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
          .to("[data-hero-stage]", { y: 280, autoAlpha: 0.3 }, 0)
          .to("[data-drift='l']", { x: -36, y: -24 }, 0)
          .to("[data-drift='r']", { x: 36, y: -24 }, 0);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="resume-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#7fb8ee_0%,#a9d2f5_30%,#e6f1fb_58%,#f4f9fe_80%,#ffffff_100%)] pb-14 pt-24 lg:min-h-[max(100svh,820px)] lg:pb-24 lg:pt-[84px]"
    >
      <style>{`@keyframes rh-float{0%,100%{translate:0 0}50%{translate:0 -12px}}@media (prefers-reduced-motion:reduce){[class*="rh-float"]{animation:none!important}}`}</style>

      {/* the glow behind it all */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[8%] h-[70%] w-[min(1100px,120vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.85),rgba(255,255,255,0)_70%)]"
      />

      {/* the stage: the resume rising out of the glass, the
          cards round and over it, two soft ones behind */}
      <div
        data-hero-stage
        className="relative mx-auto h-[clamp(340px,96vw,440px)] w-[min(1240px,100%)] px-4 lg:h-[clamp(540px,71svh,780px)]"
      >
        {/* the frosted glass panel */}
        <div
          aria-hidden
          className="absolute inset-x-[3%] bottom-0 h-[56%] rounded-[36px] border border-white/70 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] backdrop-blur-xl lg:inset-x-[12%] lg:rounded-[48px]"
        />

        {/* two soft cards behind */}
        <div
          aria-hidden
          className="absolute left-[18%] top-[34%] hidden -rotate-[14deg] rounded-[16px] bg-white/70 p-5 opacity-50 blur-[2.5px] lg:block"
        >
          <p className="text-[15px] text-body">Templates</p>
          <p className="mt-1 font-display text-[44px] font-medium leading-none text-ink/80">
            20+
          </p>
          <p className="mt-3 h-3 w-28 rounded-full bg-[#1d8a3e]/30" />
        </div>
        <div
          aria-hidden
          className="absolute right-[19%] top-[40%] hidden rotate-[10deg] rounded-[14px] bg-white/70 px-5 py-3 opacity-50 blur-[2.5px] lg:block"
        >
          <p className="text-[15px] font-semibold text-ink/70">
            Interview ready ↗
          </p>
        </div>

        {/* the resume itself, a big sheet rising out of the glass, a
            second page behind it */}
        <div
          data-hero-page
          className="absolute left-1/2 top-0 z-10 w-[clamp(240px,64vw,320px)] -translate-x-1/2 [mask-image:linear-gradient(180deg,#000_30%,rgba(0,0,0,0.55)_58%,transparent_88%)] lg:w-[clamp(420px,38vw,640px)]"
        >
          <div
            aria-hidden
            className="absolute inset-0 translate-x-[6%] translate-y-[3%] rotate-[4deg] rounded-[6px] bg-white/70 shadow-[0_20px_50px_-24px_rgba(31,61,85,0.35)]"
          />
          <div className="relative overflow-hidden rounded-[6px] bg-white shadow-[0_40px_90px_-30px_rgba(31,61,85,0.55)]">
            <Thumb role="Software Engineer" style="Classic" />
          </div>
        </div>

        {/* a soft overlay over the foot of the stage, so the headline sits on
            a clean ground (the cards stay above it) */}
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 z-[15] h-[58%] w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(230,241,251,0)_0%,rgba(230,241,251,0.7)_45%,rgba(236,245,253,0.95)_80%,rgba(240,247,253,0.85)_100%)]"
        />

        {/* the cards, over the page's edges */}
        <FloatCard
          side="l"
          pos="left-[1%] top-[12%] lg:left-[17%] lg:top-[14%]"
          tilt="-rotate-[9deg]"
          delay="0s"
        >
          <div className="flex items-center gap-4 p-3.5 lg:p-5">
            <span
              className="grid size-14 place-items-center rounded-full lg:size-[76px]"
              style={{
                background:
                  "conic-gradient(#e4002b 0 91%, rgba(11,13,18,0.08) 91% 100%)",
              }}
            >
              <span className="grid size-11 place-items-center rounded-full bg-white text-[17px] font-semibold text-ink lg:size-[60px] lg:text-[22px]">
                91
              </span>
            </span>
            <span>
              <span className="block text-[12px] text-body lg:text-[13.5px]">
                ATS score
              </span>
              <span className="block font-display text-[16px] font-semibold text-ink lg:text-[21px]">
                Excellent
              </span>
              <span className="block text-[12px] font-semibold text-[#1d8a3e] lg:text-[13.5px]">
                +49 points
              </span>
            </span>
          </div>
        </FloatCard>

        <FloatCard
          side="l"
          pos="left-[3%] top-[60%] hidden sm:block lg:left-[22%] lg:top-[66%]"
          tilt="rotate-[6deg]"
          delay="-2.5s"
        >
          <div className="flex items-center gap-3 px-4 py-3 lg:px-5 lg:py-4">
            <span className="grid size-7 place-items-center rounded-full bg-[#1d8a3e] text-white lg:size-8">
              <Check size={15} strokeWidth={3} aria-hidden />
            </span>
            <span className="text-[14px] text-body lg:text-[16px]">
              Keywords matched <b className="font-semibold text-ink">18 / 20</b>
            </span>
          </div>
        </FloatCard>

        <FloatCard
          side="r"
          pos="right-[1%] top-[8%] lg:right-[16%] lg:top-[10%]"
          tilt="rotate-[9deg]"
          delay="-1.2s"
        >
          <div className="w-[180px] p-3.5 lg:w-[290px] lg:p-5">
            <span className="block text-[12px] text-body lg:text-[13.5px]">
              Job match
            </span>
            <span className="mt-0.5 block font-display text-[15px] font-semibold leading-snug text-ink lg:text-[20px]">
              Software Engineer Intern
            </span>
            <span className="mt-3 flex items-center gap-3">
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/[0.07]">
                <span className="block h-full w-[94%] rounded-full bg-accent" />
              </span>
              <span className="text-[13px] font-semibold text-ink lg:text-[16px]">
                94%
              </span>
            </span>
          </div>
        </FloatCard>

        <FloatCard
          side="r"
          pos="right-[2%] top-[58%] lg:right-[19%] lg:top-[64%]"
          tilt="-rotate-[7deg]"
          delay="-3.6s"
        >
          <div className="flex items-center gap-3 py-2.5 pl-4 pr-2.5 lg:py-3 lg:pl-5 lg:pr-3">
            <FileText size={20} aria-hidden className="text-accent" />
            <span className="text-[14px] font-medium text-ink lg:text-[16px]">
              resume.pdf
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-ink px-3 py-2 text-[13px] font-semibold text-white lg:text-[14px]">
              <Download size={14} aria-hidden />
              Download
            </span>
          </div>
        </FloatCard>
      </div>

      {/* the copy, over the foot of the stage */}
      <div
        data-hero-copy
        className="container-page relative z-30 -mt-[clamp(8px,4vw,60px)] flex flex-col items-center text-center"
      >
        <h1
          id="resume-title"
          data-hero-line
          className="whitespace-nowrap font-display text-[clamp(1.25rem,6.4vw,6.25rem)] font-medium leading-[1] tracking-[-0.045em] text-ink"
        >
          Build Your{" "}
          <span className="whitespace-nowrap text-accent">ATS-Friendly</span>{" "}
          Resumes
        </h1>
        <p
          data-hero-line
          className="mt-5 max-w-[760px] text-balance text-[16px] leading-[1.6] text-[#1f3d55] lg:text-[20px]"
        >
          Create professional, ATS-friendly resumes with AI. Match your resume
          to job descriptions, check ATS compatibility, and land your dream job
          faster.
        </p>

        <div
          data-hero-line
          className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
        >
          <GlowButton
            href={createHref}
            streak="#0b0d12"
            className="[&>span:last-child]:px-7 [&>span:last-child]:py-[14px] [&>span:last-child]:text-[16.5px] max-sm:w-full max-sm:[&>span:last-child]:w-full max-sm:[&>span:last-child]:justify-center max-sm:[&>span:last-child]:py-3 max-sm:[&>span:last-child]:text-[16px]"
          >
            Create for free
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </GlowButton>
          <a
            href={atsHref}
            className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-7 py-[15px] text-[16.5px] font-semibold text-ink transition-colors hover:border-ink max-sm:w-full max-sm:py-[12.5px] max-sm:text-[16px]"
          >
            <Gauge size={16} aria-hidden />
            Check ATS Score
          </a>
        </div>
      </div>
    </section>
  );
}
