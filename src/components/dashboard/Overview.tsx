"use client";

import Image from "next/image";
import {
  ArrowDown,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  Phone,
  Quote,
} from "lucide-react";
import { CompanyLogos } from "@/components/site/CompanyLogos";
import { CornerHandles } from "@/components/site/CornerHandles";
import { EMAIL, PHONE } from "@/components/site/contact";
import { GlowButton } from "@/components/site/GlowButton";
import { ApplicationFee } from "./ApplicationFee";
import { useApp } from "./DashboardShell";
import { ProfilingView } from "./ProfilingView";
import { SlotView } from "./SlotView";
import { UgnetFormView } from "./UgnetFormView";
import { firstName } from "./application";
import { STEPS, stepStates } from "./steps";

/**
 * The dashboard's home, in the website's own visual language (photos:
 * Figma AI, SOT Website file):
 *
 * - a welcome banner (students on campus under a blue sky), the greeting
 *   and the one thing to do next on the site's glowing button;
 * - three quick facts (progress, the uGNET date, the programme);
 * - the step the applicant is on, its form right here to fill in (the
 *   rail beside it lists every step, so there is no second list here);
 * - a student's words (from the home page's testimonials), the company
 *   logos the site runs, and the admissions helpline.
 */

/** the uGNET date the site shows (HeroFacts) */
const UGNET_DATE = new Date("2027-01-12T00:00:00");

/** each step that has a page, by its id */
const STEP_VIEWS: Record<string, () => React.JSX.Element> = {
  "application-fee": ApplicationFee,
  "ugnet-form": UgnetFormView,
  profiling: ProfilingView,
  "ugnet-slot": SlotView,
};

export function Overview() {
  const app = useApp();
  const states = stepStates(app);
  const nextIndex = states.indexOf("current");
  const next = STEPS[nextIndex];
  const done = states.filter((s) => s === "done").length;
  const days = Math.max(
    0,
    Math.ceil((UGNET_DATE.getTime() - new Date().setHours(0, 0, 0, 0)) / 864e5),
  );

  // the step to show: the one to do next, or (when that has no page yet)
  // the latest one finished
  const shown =
    (next && STEP_VIEWS[next.id] ? next : undefined) ??
    STEPS.filter((s, i) => STEP_VIEWS[s.id] && states[i] === "done").at(-1) ??
    STEPS[0];
  const StepView = STEP_VIEWS[shown.id];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      {/* the welcome banner: students on campus under a blue sky */}
      <section className="relative overflow-hidden rounded-[8px] bg-[linear-gradient(180deg,#e3eefe_0%,#b0d9fd_50%,#d4eafe_100%)]">
        {/* the photo, always whole (nobody cut off): on phones a strip
            across the top fading into the sky below it; on wider screens
            at the right at the banner's full height, its left edge fading
            into the matching sky behind the copy */}
        <div className="relative aspect-[1600/686] w-full [mask-image:linear-gradient(180deg,#000_70%,transparent)] md:absolute md:inset-y-0 md:right-0 md:w-auto md:[mask-image:linear-gradient(90deg,transparent_0%,#000_28%)]">
          <Image
            src="/images/dashboard/banner.webp"
            alt=""
            fill
            priority
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
          />
        </div>
        <div className="relative z-[1] px-5 pb-5 max-md:-mt-6 sm:px-7 md:max-w-[55%] md:py-6 xl:max-w-[560px]">
          <p className="inline-flex items-center gap-2 rounded-[4px] bg-white/70 px-2.5 py-0.5 text-[11.5px] font-semibold text-[#294454] backdrop-blur">
            <span className="size-1.5 rounded-full bg-accent" />
            AI-First B.Tech · 2027 intake
          </p>
          <h1 className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink">
            Hi, {firstName(app.profile.name)}.{" "}
            <span className="text-accent">
              {done === 0 ? "Let's begin." : "Keep going."}
            </span>
          </h1>
          <p className="mt-1.5 max-w-[440px] text-[14px] leading-[1.5] text-[#294454]">
            {next
              ? `Up next: ${next.title}. ${next.line}.`
              : "Every step is done. We will be in touch soon."}
          </p>
          <GlowButton
            href="#current-step"
            streak="#0b0d12"
            size="sm"
            className="mt-4"
          >
            {done === 0 ? "Start your application" : `Go to ${shown.title}`}
            <ArrowDown size={14} strokeWidth={2.2} aria-hidden />
          </GlowButton>
        </div>
      </section>

      {/* quick facts */}
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          {
            Icon: Check,
            label: "Progress",
            value: `${done} of ${STEPS.length} steps`,
            note: `${Math.round((done / STEPS.length) * 100)}% complete`,
          },
          {
            Icon: CalendarDays,
            label: "uGNET 2027",
            value: "12 Jan, 2027",
            note: days > 0 ? `${days} days to go` : "Test day is here",
          },
          {
            Icon: Clock3,
            label: "Programme",
            value: "4 years",
            note: "B.Tech in CSE · 8 semesters",
          },
        ].map(({ Icon, label, value, note }) => (
          <div
            key={label}
            className="relative rounded-[8px] border border-black/[0.08] bg-white p-4"
          >
            <CornerHandles />
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-[6px] bg-accent-soft text-accent">
                <Icon size={18} aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">
                  {label}
                </p>
                <p className="font-display text-[18px] font-medium leading-tight tracking-[-0.02em] text-ink">
                  {value}
                </p>
              </div>
            </div>
            <p className="mt-2 text-[12.5px] text-muted">{note}</p>
          </div>
        ))}
      </div>

      {/* the step they are on, its form right here */}
      <div id="current-step" className="scroll-mt-24">
        <StepView />
      </div>

      {/* a student's words, and the people they learn from */}
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
        <figure className="relative overflow-hidden rounded-[8px] bg-ink p-6 text-white">
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-10 size-52 rounded-full bg-accent/35 blur-3xl"
          />
          <Quote
            size={26}
            strokeWidth={0}
            className="relative fill-accent"
            aria-hidden
          />
          <blockquote className="relative mt-3 text-[15.5px] leading-[1.55]">
            uGNET introduced me to a more modern, AI-focused B.Tech and gave me
            clarity on what to choose.
          </blockquote>
          <figcaption className="relative mt-5 flex items-center gap-3">
            <Image
              src="/images/students/Sanskriti.png"
              alt=""
              width={40}
              height={40}
              className="size-10 rounded-full object-cover object-top ring-2 ring-white/25"
            />
            <span>
              <span className="block text-[14px] font-semibold">
                Sanskriti Singh
              </span>
              <span className="block text-[12.5px] text-white/60">
                uGSOT student
              </span>
            </span>
          </figcaption>
        </figure>

        <div className="flex flex-col justify-between gap-5 rounded-[8px] border border-black/[0.08] bg-white p-6">
          <CompanyLogos
            compact
            tone="light"
            markHeight={26}
            trackWidth="lg:w-full"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/[0.06] pt-5">
            <div>
              <p className="text-[14.5px] font-semibold text-ink">
                Questions about your application?
              </p>
              <p className="text-[13px] text-muted">
                Our admissions team is happy to help.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={PHONE.href}
                className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-black/[0.1] px-3.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink"
              >
                <Phone size={15} aria-hidden />
                {PHONE.label}
              </a>
              <a
                href={EMAIL.href}
                aria-label="Email admissions"
                className="inline-flex h-10 items-center gap-2 rounded-[6px] border border-black/[0.1] px-3.5 text-[13.5px] font-medium text-ink transition-colors hover:border-ink"
              >
                <Mail size={15} aria-hidden />
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
