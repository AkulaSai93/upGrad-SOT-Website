"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Bell,
  CalendarClock,
  Check,
  Clock,
  FileText,
  LayoutDashboard,
  Monitor,
  Phone,
  Search,
  Trophy,
  Wallet,
} from "lucide-react";
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
 * and cut off by it (taking whatever height the copy leaves), a preview of a uGNET candidate dashboard built in the
 * page (not a screenshot): a sidebar, a greeting, the exam's facts as four
 * stat cards and the four steps to a result, the third (attempt the exam)
 * the one to do next. It is an illustration of the process, not a real
 * account. Phones drop the sidebar and show two stat cards a row.
 *
 * Motion (GSAP): the copy rises in line by line, then the preview lifts in
 * from below. Reduced motion: shown as they are.
 */
const FACTS = [
  { label: "Exam mode", value: "Online", Icon: Monitor },
  { label: "Duration", value: "2 hours", Icon: Clock },
  { label: "Result", value: "In 2 days", Icon: Trophy },
  { label: "Application fee", value: "₹1,000", Icon: Wallet },
];

const STEPS = [
  {
    title: "Create your account",
    note: "WhatsApp number and basic details",
    done: true,
  },
  {
    title: "Register for uGNET",
    note: "Pay the ₹1,000 application fee",
    done: true,
  },
  {
    title: "Attempt the exam",
    note: "Pick a slot for the 2-hour online test",
    next: true,
  },
  { title: "Result declaration", note: "Your score within 2 days" },
];

const SIDEBAR = [
  { label: "Dashboard", Icon: LayoutDashboard, on: true },
  { label: "My test", Icon: FileText },
  { label: "Book a slot", Icon: CalendarClock },
  { label: "Results", Icon: Trophy },
];

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
          className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent"
        >
          National Entrance Test · uGNET 2026
        </p>
        <h1
          id="ugnet-title"
          data-hero-line
          className="mx-auto mt-3 max-w-[860px] text-balance font-display text-[clamp(2.25rem,4.4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
        >
          One test to your <span className="text-accent">AI-First B.Tech</span>{" "}
          in Computer Science
        </h1>
        <p
          data-hero-line
          className="mx-auto mt-4 max-w-[620px] text-balance text-[15.5px] leading-[1.6] text-body lg:text-[16px]"
        >
          uGNET evaluates your technical reasoning, problem-solving ability,
          computational thinking and readiness for a rigorous computer science
          engineering curriculum.
        </p>

        <div
          data-hero-line
          className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
          className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] text-body"
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

        {/* the preview: a uGNET candidate dashboard, cut off by the section's foot */}
        <div
          data-hero-preview
          aria-hidden
          className="relative mx-auto mt-10 w-full max-w-[1040px] lg:mt-10 lg:min-h-[260px] lg:flex-1"
        >
          <div className="h-[380px] overflow-hidden rounded-t-[12px] border border-b-0 border-black/[0.08] bg-white p-2 text-left shadow-[0_-20px_60px_-30px_rgba(228,0,43,0.35)] sm:h-[440px] lg:h-full">
            <div className="flex h-full overflow-hidden rounded-[8px] border border-black/[0.06]">
              {/* sidebar */}
              <div className="hidden w-[200px] shrink-0 border-r border-black/[0.06] bg-[#fafafa] p-4 md:block">
                <div className="flex items-center gap-2">
                  <span className="grid size-7 place-items-center rounded-[6px] bg-accent font-display text-[12px] font-semibold text-white">
                    uG
                  </span>
                  <span className="font-display text-[15px] font-medium text-ink">
                    uGNET
                  </span>
                </div>
                <p className="mt-6 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                  Main
                </p>
                <ul className="mt-2 space-y-1">
                  {SIDEBAR.map(({ label, Icon, on }) => (
                    <li
                      key={label}
                      className={`flex items-center gap-2 rounded-[6px] px-2.5 py-2 text-[12.5px] ${
                        on
                          ? "border border-accent/30 bg-white font-semibold text-ink"
                          : "text-body"
                      }`}
                    >
                      <Icon size={14} className={on ? "text-accent" : ""} />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* main */}
              <div className="min-w-0 flex-1 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-display text-[15px] font-medium text-ink">
                      Welcome to uGNET 2026
                    </p>
                    <p className="text-[12px] text-muted">
                      Your path to the AI-First B.Tech
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden items-center gap-2 rounded-[6px] border border-black/[0.08] px-3 py-1.5 text-[12px] text-muted sm:flex">
                      <Search size={13} />
                      Search
                    </span>
                    <span className="grid size-8 place-items-center rounded-full border border-black/[0.08] text-ink">
                      <Bell size={13} />
                    </span>
                    <span className="whitespace-nowrap rounded-[6px] bg-accent px-3 py-1.5 text-[12px] font-semibold text-white">
                      Book a slot
                    </span>
                  </div>
                </div>

                <p className="mt-5 text-[13px] font-semibold text-ink">
                  Your exam
                </p>
                <ul className="mt-2.5 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                  {FACTS.map(({ label, value, Icon }) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 rounded-[8px] border border-black/[0.08] p-3"
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-[6px] bg-accent-soft text-accent">
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[11px] text-muted">
                          {label}
                        </span>
                        <span className="block font-display text-[15px] font-medium text-ink">
                          {value}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-5 text-[13px] font-semibold text-ink">
                  Your steps to a result
                </p>
                <ol className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
                  {STEPS.map((s, i) => (
                    <li
                      key={s.title}
                      className={`flex items-start gap-3 rounded-[8px] border p-3 ${
                        s.next
                          ? "border-accent/40 bg-accent-soft"
                          : "border-black/[0.08]"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-[12px] font-semibold ${
                          s.done
                            ? "bg-ink text-white"
                            : s.next
                              ? "bg-accent text-white"
                              : "border border-black/[0.08] text-muted"
                        }`}
                      >
                        {s.done ? <Check size={13} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[13px] font-semibold text-ink">
                          {s.title}
                        </span>
                        <span className="mt-0.5 block text-[11.5px] leading-snug text-body">
                          {s.note}
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
