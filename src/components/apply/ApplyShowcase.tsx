"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Quote } from "lucide-react";

/**
 * The photo side of /apply: a run of slides, each on its own background,
 * after the mix of stories Scaler's school page cycles through: the
 * campus, a student's words, the first batch's early wins, another
 * student. Every slide has a photo that fades in and slowly settles (a
 * gentle zoom out) while its copy rises in; the dots below jump to any
 * slide. They turn every few seconds, and hold on the first under
 * prefers-reduced-motion.
 *
 * Copy is the site's own: the students' words are from the home page's
 * testimonials, the wins from its "Early Wins from Our First Batch". The
 * wins sit on a Figma AI image of students in a bright, daylit AI lab
 * (SOT Website file), the students on the side the form leaves open.
 */
type Slide =
  | { kind: "headline"; bg: string; title: string; body: string }
  | {
      kind: "quote";
      bg: string;
      quote: string;
      name: string;
      photo: string;
    }
  | {
      kind: "stats";
      bg: string;
      title: string;
      stats: { value: string; label: string }[];
    };

const SLIDES: Slide[] = [
  {
    kind: "headline",
    bg: "/images/admission/hero-campus-v5.webp",
    title: "Your AI-First B.Tech starts here.",
    body: "Apply in a minute with your mobile number, then take uGNET to secure your seat.",
  },
  {
    kind: "quote",
    bg: "/images/festivals/holi.jpg",
    quote:
      "I was confused between BITS, VIT, SRM, Manipal and state exams. uGNET introduced me to a more modern, AI-focused B.Tech and gave me clarity on what to choose.",
    name: "Sanskriti Singh",
    photo: "/images/students/Sanskriti.png",
  },
  {
    kind: "stats",
    bg: "/images/apply/ai-lab-day.webp",
    title: "Early wins from our first batch.",
    stats: [
      { value: "2", label: "ICPC regional qualifications" },
      { value: "1 month", label: "From first class to ICPC Prelims" },
      { value: "2", label: "Google Student Ambassadors" },
    ],
  },
  {
    kind: "quote",
    bg: "/images/festivals/garba.jpg",
    quote:
      "I chose uGSOT for its future-ready curriculum, coding from Day 1, and its strong support for paid internships and placements.",
    name: "Ishan Kumar",
    photo: "/images/students/Ishan.png",
  },
];

const SLIDE_MS = 6000;

/** the slide on show, turning on its own; `go` jumps to one */
export function useShowcase() {
  const [index, setIndex] = useState(0);

  // restarts on every change, so a jump gets a full turn before the next
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setTimeout(
      () => setIndex((i) => (i + 1) % SLIDES.length),
      SLIDE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [index]);

  return { index, go: setIndex };
}

/** every slide's photo, stacked; the one on show fades in and settles */
export function ShowcaseBackdrop({ index }: { index: number }) {
  return (
    <>
      {SLIDES.map((s, i) => (
        <Image
          key={s.bg}
          src={s.bg}
          alt=""
          fill
          priority={i === 0}
          sizes="100vw"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? "scale(1)" : "scale(1.08)",
            transition: `opacity 1.2s ease, transform ${i === index ? SLIDE_MS + 1200 : 1200}ms ease-out`,
          }}
          className="object-cover motion-reduce:!transition-none"
        />
      ))}
    </>
  );
}

function SlideBody({ slide }: { slide: Slide }) {
  if (slide.kind === "headline") {
    return (
      <>
        <h2 className="max-w-[520px] font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white">
          {slide.title}
        </h2>
        <p className="mt-3 max-w-[440px] text-[14.5px] leading-[1.55] text-white/75">
          {slide.body}
        </p>
      </>
    );
  }

  if (slide.kind === "quote") {
    return (
      <figure className="max-w-[540px]">
        <Quote
          size={28}
          className="fill-accent text-accent"
          strokeWidth={0}
          aria-hidden
        />
        <blockquote className="mt-3 font-display text-[clamp(1.15rem,1.8vw,1.5rem)] font-medium leading-[1.35] tracking-[-0.015em] text-white">
          {slide.quote}
        </blockquote>
        <figcaption className="mt-5 flex items-center gap-3">
          <Image
            src={slide.photo}
            alt=""
            width={44}
            height={44}
            className="size-11 rounded-full object-cover object-top ring-2 ring-white/30"
          />
          <span>
            <span className="block text-[14.5px] font-semibold text-white">
              {slide.name}
            </span>
            <span className="block text-[12.5px] text-white/65">
              uGSOT student
            </span>
          </span>
        </figcaption>
      </figure>
    );
  }

  return (
    <>
      <h2 className="max-w-[520px] font-display text-[clamp(1.6rem,3vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.03em] text-white">
        {slide.title}
      </h2>
      <dl className="mt-5 grid max-w-[560px] grid-cols-3 gap-2 sm:mt-6 sm:gap-3">
        {slide.stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[8px] border border-white/15 bg-white/[0.08] p-3 backdrop-blur-md sm:p-4"
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="font-display text-[clamp(1.4rem,2.2vw,1.9rem)] font-medium leading-none tracking-[-0.02em] text-white">
              {s.value}
            </dd>
            <dd className="mt-2 text-[11.5px] leading-[1.4] text-white/70 sm:text-[12.5px]">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </>
  );
}

/** the copy for the slide on show, with the dots that pick a slide */
export function ShowcaseSlides({
  index,
  go,
}: {
  index: number;
  go: (i: number) => void;
}) {
  return (
    <div>
      <div className="grid items-end">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            aria-hidden={i !== index}
            className={`[grid-area:1/1] transition-[opacity,transform] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              i === index
                ? "translate-y-0 opacity-100 delay-300 duration-700"
                : "pointer-events-none translate-y-3 opacity-0 duration-300"
            }`}
          >
            <SlideBody slide={s} />
          </div>
        ))}
      </div>
      <div className="mt-6 flex gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show slide ${i + 1}`}
            aria-current={i === index}
            onClick={() => go(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
