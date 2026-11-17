"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { lenis } from "@/components/motion/SmoothScroll";

/**
 * The resume builder's features, after a client reference (melius.com's
 * Solutions): on plain white, the five
 * features as a deck of cards in the middle (the one in front: a photo,
 * its name and line; the other four peeking out above it, stacked), the
 * four that are not in front also floating round the deck as small
 * framed photos with a yellow label, and the five names as tabs under it. Every card in the deck is
 * as tall as the tallest, so the tabs never move.
 *
 * Copy is the ResumeCraft agent's own (the client's screenshot of it):
 * ATS Checker, Match My Resume, Create Resume, JD Based Resume and Resume
 * Gallery. Photos: Figma AI, SOT Website file.
 *
 * Motion: on desktop the stage is held in view while the page scrolls past
 * it, and the scroll turns the deck over: the front card lifts away to the
 * back and the next comes forward; the small cards float gently and swap
 * to the features still to come. A tab or a small card jumps to its
 * feature. On phones (and with reduced motion) there is no hold: the deck
 * turns with the tabs.
 */
const FEATURES = [
  {
    title: "ATS Checker",
    body: "Upload your resume PDF or paste text to get an instant ATS compatibility score. Receive detailed analysis with strengths and areas for improvement.",
    img: "/images/playground/feature-2.webp",
    alt: "A resume held up against a blue sky with a red check mark on it",
  },
  {
    title: "Match My Resume",
    body: "Upload your resume and job description to get instant matching insights. Our AI analyzes compatibility and provides actionable feedback to improve your application.",
    img: "/images/playground/feature-3.webp",
    alt: "A graduate shaking hands with an interviewer in a bright office",
  },
  {
    title: "Create Resume",
    body: "Create professional resumes with AI through multiple methods: choose from templates, connect via LinkedIn, or build with our agent.",
    img: "/images/playground/feature-1.webp",
    alt: "A student typing on a laptop at a sunny campus cafe",
  },
  {
    title: "JD Based Resume",
    body: "Create a tailored resume based on job description. Simply update your JD and old resume, and get a fresh, optimized resume that perfectly matches the job requirements.",
    img: "/images/playground/feature-5.webp",
    alt: "A student walking across campus smiling at a phone",
  },
  {
    title: "Resume Gallery",
    body: "Browse curated resume templates from FAANG and top tech companies. Access premium resume references and examples to inspire your own professional resume creation.",
    img: "/images/playground/feature-4.webp",
    alt: "Resumes in different layouts fanned out on a sunlit desk",
  },
];

const N = FEATURES.length;

/** each card's place in the deck by depth (0 = in front): how far it steps
    up (as a share of its own height) and how much narrower it is */
const DECK_Y = [0, -11, -19, -25, -29];
const DECK_S = [1, 0.86, 0.76, 0.68, 0.63];

/** where the four small cards float, round the deck (desktop) */
const SPOTS = [
  "left-[7%] top-[16%] w-[clamp(120px,10vw,150px)] rotate-[-3deg]",
  "right-[6%] top-[14%] w-[clamp(140px,12vw,175px)] rotate-[2.5deg]",
  "left-[3%] bottom-[18%] w-[clamp(140px,12vw,175px)] rotate-[2deg]",
  "right-[9%] bottom-[10%] w-[clamp(120px,10vw,150px)] rotate-[-2deg]",
];

export function ResumeFeatures({ id = "features" }: { id?: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [held, setHeld] = useState(false);

  // desktop with motion: the stage is held and the scroll picks the card
  useEffect(() => {
    const mq = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const sync = () => setHeld(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!held) return;
    const onScroll = () => {
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const run = r.height - window.innerHeight;
      const p = Math.min(1, Math.max(0, -r.top / run));
      setProgress(p);
      setActive(Math.min(N - 1, Math.floor(p * N)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [held]);

  // phones: keep the lit tab in view in its row
  useEffect(() => {
    const tab = document.getElementById(`ft-tab-${active}`);
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    row.scrollTo({
      left: tab.offsetLeft - row.clientWidth / 2 + tab.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  // a tab or a small card: scroll to that card's stretch (or just turn)
  const goTo = (i: number) => {
    const el = track.current;
    if (!held || !el) return setActive(i);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const run = el.offsetHeight - window.innerHeight;
    const y = top + ((i + 0.5) / N) * run;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  /** the cards still to come, in order: the small floating ones */
  const upcoming = Array.from(
    { length: N - 1 },
    (_, k) => (active + 1 + k) % N,
  );

  // the heading scrolls away before the stage is held, leaving the stage
  // the whole screen for the deck
  const heading = (
    <div className="container-page text-center">
      <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
        Choose Your <span className="text-accent">Resume Path</span>
      </h2>
      <p className="mt-2 text-[15px] text-body">
        Select the perfect tool to match your resume building goals and skill
        level
      </p>
    </div>
  );

  const stage = (
    <div className="relative flex h-full flex-col items-center justify-center">
      {/* the small cards, floating round the deck (desktop) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden lg:block"
      >
        {upcoming.map((fi, k) => {
          const f = FEATURES[fi];
          return (
            <button
              key={k}
              type="button"
              tabIndex={-1}
              onClick={() => goTo(fi)}
              style={{
                transform: `translateY(${(k % 2 ? 1 : -1) * (progress * 60 - 30)}px)`,
              }}
              className={`pointer-events-auto absolute transition-transform duration-300 ease-out ${SPOTS[k]}`}
            >
              <span
                className={`block animate-[rf-float_6s_ease-in-out_infinite] rounded-[6px] border border-black/[0.06] bg-white p-1.5 shadow-[0_14px_34px_-14px_rgba(11,13,18,0.25)] transition-transform duration-500 hover:-translate-y-1.5 ${
                  k % 2 ? "[animation-delay:-3s]" : ""
                }`}
              >
                <span
                  key={fi}
                  className="relative block aspect-square animate-[rf-fade_600ms_ease-out] overflow-hidden rounded-[4px]"
                >
                  <Image
                    src={f.img}
                    alt=""
                    fill
                    sizes="175px"
                    className="object-cover"
                  />
                  <span className="absolute right-0 top-3 rounded-l-[3px] bg-[#fdf28a] px-2 py-1 text-[11.5px] font-medium text-ink">
                    {f.title}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* the deck, arranged as melius.com's: the cards behind step up and
          in, narrower each time, like a fanned pile seen from the front,
          each showing a strip of its photo */}
      <div className="relative mt-[clamp(120px,17svh,156px)] grid w-full max-w-[340px] lg:max-w-[min(340px,38svh)]">
        {FEATURES.map((f, i) => {
          const d = (i - active + N) % N; // 0 = in front
          return (
            <article
              key={f.title}
              aria-hidden={d !== 0}
              style={{
                transform: `translateY(${DECK_Y[d]}%) scale(${DECK_S[d]})`,
                zIndex: N - d,
              }}
              className={`origin-top rounded-[6px] border border-black/[0.06] bg-[#fbfbfa] p-2.5 shadow-[0_18px_40px_-18px_rgba(11,13,18,0.3)] transition-[transform,z-index] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                d === 0 ? "relative" : ""
              } flex flex-col [grid-area:1/1]`}
            >
              <div
                className={`relative aspect-[6/5] overflow-hidden rounded-[4px] bg-[#eef0f2]`}
              >
                <Image
                  src={f.img}
                  alt={d === 0 ? f.alt : ""}
                  fill
                  sizes="340px"
                  className={`object-cover transition-transform duration-[1200ms] ease-out ${d === 0 ? "scale-100" : "scale-110"}`}
                />
              </div>
              <div
                className={`px-1.5 pb-1.5 pt-4 transition-opacity duration-500 ${d === 0 ? "opacity-100" : "opacity-0"}`}
              >
                <h3 className="font-display text-[clamp(1.5rem,2.4vw,2rem)] font-medium leading-tight tracking-[-0.025em] text-ink">
                  {f.title}
                </h3>
                <p className="mt-2 text-[14px] leading-[1.55] text-body">
                  {f.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      {/* the tabs */}
      <div
        role="tablist"
        aria-label="Features"
        className="relative z-10 mt-5 flex gap-1 overflow-x-auto rounded-[8px] max-lg:-mr-4 max-lg:self-stretch max-lg:rounded-r-none max-lg:border-r-0 lg:max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border border-black/[0.06] bg-white p-1 shadow-[0_8px_24px_-12px_rgba(11,13,18,0.2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FEATURES.map((f, i) => (
          <button
            key={f.title}
            id={`ft-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => goTo(i)}
            className={`shrink-0 whitespace-nowrap rounded-[6px] px-3.5 py-2 text-[13px] font-medium transition-colors duration-300 ${
              active === i
                ? "bg-accent text-white"
                : "text-ink hover:bg-black/[0.04]"
            }`}
          >
            {f.title}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section id={id} className="relative bg-canvas">
      {/* the small cards' float and swap, kept with the section */}
      <style>{`@keyframes rf-float{0%,100%{translate:0 0}50%{translate:0 -10px}}@keyframes rf-fade{from{opacity:0;scale:.96}to{opacity:1;scale:1}}@media (prefers-reduced-motion:reduce){[class*="rf-float"],[class*="rf-fade"]{animation:none!important}}`}</style>
      {held ? (
        <>
          <div className="pt-10 lg:pt-14">{heading}</div>
          <div ref={track} className="relative h-[460svh]">
            <div className="sticky top-0 h-svh overflow-hidden pb-6 pt-[72px]">
              <div className="container-page h-full">{stage}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-16">
          {heading}
          <div className="container-page mt-4">{stage}</div>
        </div>
      )}
    </section>
  );
}
