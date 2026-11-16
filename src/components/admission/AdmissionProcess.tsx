"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Check } from "lucide-react";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Admission Process"
 *
 * Copy is sot.upgrad.com/admission's own (read 16 Nov 2026): the lead-in, the
 * six steps with their short names and titles, and every line under each
 * (the test slots, the reattempt policy, the interview's areas and length,
 * the result times, the seat block fee, what the admission letter holds).
 *
 * Layout, after Newton School of Technology's admission page: on desktop a
 * card on the left that stays in view (a short line and Apply Now, red with
 * a white button, as the home page's scholarship card) and the
 * six steps down the right as a timeline, every step open (no accordion), a
 * numbered node on the line beside each card (on phones, as the home page's
 * process: plain steps by small dots, no boxes, the red card after them), and, as on Scaler's process,
 * a real photo only where it helps (the test, the interview, the letter;
 * Figma AI, SOT Website file) in a small frame beside the step's text (under it on phones). On phones the facts card comes
 * first, then the timeline.
 *
 * Motion (GSAP): the line fills red as you scroll through the steps, and
 * each step's node turns red as it reaches the middle of the screen.
 * Reduced motion: the line is shown full.
 */
type Step = {
  short: string;
  title: string;
  intro?: string;
  label?: string;
  items?: string[];
  slots?: string[];
  note?: { k: string; v: string };
  /** a real photo of the step, only where it helps */
  photo?: { src: string; alt: string };
};

const STEPS: Step[] = [
  {
    short: "Apply",
    title: "Submit Your Application Online",
    items: [
      "Register using your 10-digit mobile number",
      "Verify your email ID and create a password on your dashboard",
      "Pay the application fee of ₹1000 + GST",
      "Fill in personal details, academic background, and relevant profile information under uGNET form",
      "Upload available marksheets and documents",
      "Select your preferred uGNET test slot",
    ],
  },
  {
    short: "uGSOT Test",
    photo: {
      src: "/images/admission/photo-test.webp",
      alt: "A student taking the online uGNET test on a laptop at home",
    },
    title: "Appear for the uGSOT Entrance Test (uGNET)",
    items: [
      "This is an online, proctored entrance assessment",
      "It tests your aptitude, logical thinking, fundamentals of math, problem-solving and verbal aptitude.",
    ],
    slots: ["11:00 AM – 1:00 PM", "3:00 PM – 5:00 PM"],
    note: {
      k: "Reattempt Policy",
      v: "One reattempt is allowed by paying ₹500 (if you miss or fail in the first attempt)",
    },
  },
  {
    short: "Interview",
    photo: {
      src: "/images/admission/photo-interview.webp",
      alt: "A student in a one-on-one video interview",
    },
    title: "Attend the Personal Interview",
    intro:
      "Once you clear uGNET, you can schedule your 1-on-1 Personal Interview directly from the dashboard.",
    label: "Interview Evaluation Areas",
    items: [
      "Career clarity & motivation",
      "Communication skills",
      "Analytical and problem-solving ability",
      "Algorithmic and logical thinking",
    ],
    note: { k: "Duration", v: "~30 minutes" },
  },
  {
    short: "Test Score",
    title: "Test Scores",
    items: [
      "You will get the uGNET result within 2 days of the exam",
      "The final scorecard with the interview results will be available within 7 days.",
      "Results are accessible via the student dashboard.",
    ],
  },
  {
    short: "Seat Blocking",
    title: "Counselling & Seat Blocking",
    items: [
      "Students who clear all stages proceed to counselling",
      "Select your preferred campus and specialization",
      "Once done, block your seat with a fee of ₹50,000.",
    ],
  },
  {
    short: "Admission Letter",
    photo: {
      src: "/images/admission/photo-letter.webp",
      alt: "A student and her parents reading her admission letter",
    },
    title: "Official Admission Letter",
    intro:
      "Once you block your seat, you will receive the official uGSOT Admission Letter, which includes:",
    items: [
      "Complete fee structure",
      "Scholarship details (if applicable)",
      "Required document list",
      "Next steps & onboarding timeline",
    ],
  },
];

export function AdmissionProcess() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-process-fill]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-process-steps]",
              start: "top 55%",
              end: "bottom 55%",
              scrub: 0.4,
            },
          },
        );
        gsap.utils.toArray<HTMLElement>("[data-process-step]").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            onEnter: () => el.setAttribute("data-on", ""),
            onLeaveBack: () => el.removeAttribute("data-on"),
          });
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-process-fill]", { scaleY: 1 });
        gsap.utils
          .toArray<HTMLElement>("[data-process-step]")
          .forEach((el) => el.setAttribute("data-on", ""));
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="process" className="bg-canvas py-10 lg:py-16">
      <div className="container-page">
        <SectionHeading
          title="Admission"
          accent="Process"
          intro="A simple, transparent journey from application to admission."
        />

        <div className="mx-auto mt-8 grid max-w-[1120px] gap-6 lg:mt-12 lg:grid-cols-[340px_minmax(0,1fr)] lg:items-start lg:gap-12">
          {/* the red card, in view while the steps scroll by */}
          <aside className="relative border border-black/[0.08] bg-accent p-6 text-white max-lg:order-last sm:p-7 lg:sticky lg:top-28">
            <CornerHandles />
            <h3 className="font-display text-[clamp(1.375rem,2vw,1.75rem)] font-medium leading-[1.15] tracking-[-0.02em]">
              Six steps to your seat
            </h3>
            <p className="mt-3 text-[14.5px] leading-relaxed text-white/85">
              Apply online, take uGNET, clear the interview and receive your
              admission letter, all in six simple steps.
            </p>
            {/* white, with the hero CTA's dark sliver sweeping round the
                edge, as on the home page's scholarship card */}
            <a
              href="https://sot.upgrad.com/admission"
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta relative mt-8 flex w-full overflow-hidden rounded-[6px] p-[2px]"
            >
              <span
                aria-hidden
                style={{
                  backgroundImage:
                    "conic-gradient(transparent 200deg, #0b0d12)",
                }}
                className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
              />
              <span className="relative z-[2] flex w-full items-center justify-center gap-2 rounded-[4px] bg-white px-6 py-3.5 text-[15.5px] font-semibold text-ink transition-colors duration-200 group-hover/cta:bg-white/90">
                Apply Now
                <ArrowUpRight
                  size={18}
                  strokeWidth={2}
                  aria-hidden
                  className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                />
              </span>
            </a>
            <a
              href="tel:18002108080"
              className="mt-3 block whitespace-nowrap text-center text-[12.5px] text-white/80 hover:text-white"
            >
              For admissions please contact{" "}
              <span className="font-semibold text-white">1800 210 8080</span>
            </a>
          </aside>

          {/* the six steps on a line */}
          <ol
            data-process-steps
            className="relative grid gap-10 md:gap-4 lg:gap-5"
          >
            {/* the line, and its red fill */}
            <span
              aria-hidden
              className="absolute bottom-6 left-[15.5px] top-4 w-px bg-black/[0.08] md:left-[17px] md:top-6 lg:left-[19px]"
            />
            <span
              aria-hidden
              data-process-fill
              className="absolute bottom-6 left-[15.5px] top-4 w-px origin-top bg-accent md:left-[17px] md:top-6 lg:left-[19px]"
            />

            {STEPS.map((s, i) => (
              <li
                key={s.title}
                data-process-step
                className="group relative grid grid-cols-[32px_minmax(0,1fr)] gap-6 md:grid-cols-[36px_minmax(0,1fr)] md:gap-3 lg:grid-cols-[40px_minmax(0,1fr)] lg:gap-5"
              >
                {/* the node */}
                {/* on phones a dot with a soft halo, as on the home page's
                    process; from tablets up the step's number */}
                <span className="relative z-[1] grid size-8 place-items-center rounded-full bg-[#eeeff1] transition-colors duration-500 group-data-[on]:bg-[#fbd9df] md:mt-4 md:size-9 md:border md:border-black/[0.08] md:bg-white md:font-display md:text-[13px] md:font-medium md:text-ink md:group-data-[on]:border-accent md:group-data-[on]:bg-accent md:group-data-[on]:text-white lg:size-10 lg:text-[14px]">
                  <span className="size-3.5 rounded-full bg-ink/25 transition-colors duration-500 group-data-[on]:bg-accent md:hidden" />
                  <span className="max-md:hidden">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <article
                  className={`group/card relative max-md:[&>span]:hidden md:border md:border-black/[0.08] md:bg-white md:p-4 lg:p-5 ${s.photo ? "md:grid md:grid-cols-[minmax(0,1fr)_220px] md:items-start md:gap-x-6 md:gap-y-0 lg:grid-cols-[minmax(0,1fr)_230px]" : ""}`}
                >
                  <CornerHandles />
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-accent">
                      Step {i + 1} · {s.short}
                    </p>
                    <h3 className="mt-1.5 font-display text-[17px] font-medium leading-snug tracking-[-0.02em] text-ink lg:text-[19px]">
                      {s.title}
                    </h3>
                    {s.intro && (
                      <p className="mt-2 text-[14px] leading-[1.6] text-body">
                        {s.intro}
                      </p>
                    )}
                    {s.label && (
                      <p className="mt-3 text-[13px] font-semibold text-ink">
                        {s.label}
                      </p>
                    )}
                    {s.items && (
                      <ul className={`grid gap-2 ${s.label ? "mt-2" : "mt-3"}`}>
                        {s.items.map((t) => (
                          <li
                            key={t}
                            className="flex items-start gap-2.5 text-[14px] leading-snug text-body"
                          >
                            <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                              <Check size={11} strokeWidth={3} aria-hidden />
                            </span>
                            {t}
                          </li>
                        ))}
                      </ul>
                    )}
                    {s.slots && (
                      <div className="mt-4">
                        <p className="text-[13px] font-semibold text-ink">
                          There are two available slots:
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {s.slots.map((t) => (
                            <span
                              key={t}
                              className="rounded-[4px] border border-black/[0.08] bg-[#f6f7f9] px-3 py-1.5 text-[13px] font-medium tabular-nums text-ink"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  {/* the step's photo, where it helps: a small frame on the
                      right from tablets up, under the text on phones;
                      only the photo zooms on hover */}
                  {s.photo && (
                    <div className="relative mt-4 aspect-[16/9] overflow-hidden rounded-[4px] bg-[#eef1f4] md:mt-0 md:aspect-[4/3]">
                      <Image
                        src={s.photo.src}
                        alt={s.photo.alt}
                        fill
                        sizes="(min-width: 768px) 240px, 100vw"
                        className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:scale-[1.04]"
                      />
                    </div>
                  )}
                  {/* the note runs the card's full width (beside the photo
                      too), so it fits on one line on desktop */}
                  {s.note && (
                    <p className="mt-4 border-t border-black/[0.08] pt-3 text-[13px] md:mt-3 leading-[1.55] text-body md:col-span-2">
                      <span className="font-semibold text-ink">
                        {s.note.k}:
                      </span>{" "}
                      {s.note.v}
                    </p>
                  )}
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
