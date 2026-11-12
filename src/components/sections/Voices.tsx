"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Voices from Big Tech"
 *
 * Layout from the client's reference ("Our clients"), on white: the heading
 * centred, then one quote at a time: a square portrait in natural colour,
 * framed by thin grid lines that cross at its corners and run across the
 * content column (fading at their ends), and the quote, name and role to its right. The quotes rotate on their own every few
 * seconds (paused under the pointer or focus, not under reduced motion),
 * each change fading the new one in; a pager under the quote picks one.
 *
 * SAMPLE CONTENT — REPLACE BEFORE LAUNCH: the people below are fictional
 * stand-ins (names, roles and quotes written for layout only; portraits in
 * /images/voices are Figma AI images of non-real people). Swap in real
 * leaders from MAANG companies with their approved quotes and photos. Do not
 * attribute quotes to real people who have not given them.
 */
type Voice = { name: string; role: string; quote: string; img: string };

const VOICES: Voice[] = [
  {
    name: "Arjun Mehta",
    role: "Engineering Director, Big Tech",
    quote:
      "The engineers who stand out are the ones who have actually built things, not just studied them.",
    img: "sample-1",
  },
  {
    name: "Priya Raman",
    role: "Principal Product Manager, Big Tech",
    quote:
      "AI is changing how software gets made. Students who learn to build with it from day one will lead the next decade.",
    img: "sample-2",
  },
  {
    name: "Karan Iyer",
    role: "Staff Software Engineer, Big Tech",
    quote:
      "Strong fundamentals plus real projects: that is exactly what we look for when we hire.",
    img: "sample-3",
  },
];

const AUTOPLAY_MS = 6000;

export function Voices() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const v = VOICES[active];

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setInterval(
      () => setActive((a) => (a + 1) % VOICES.length),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(t);
  }, [paused]);

  return (
    <section
      id="voices"
      className="relative overflow-hidden bg-canvas pb-2 pt-10 lg:pb-2 lg:pt-10"
    >
      <div className="container-page">
        <SectionHeading
          title="Voices from"
          accent="Big Tech"
          intro="What leaders from the world’s top tech companies say about building the next generation of engineers."
        />
      </div>

      {/* the stage: portrait on the grid lines, quote beside it */}
      <div
        className="relative mt-12 lg:mt-16"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="container-page">
          <div className="relative mx-auto max-w-[1000px]">
            <div className="relative grid items-center gap-8 lg:grid-cols-[252px_1fr] lg:gap-10">
              {/* the portrait, with grid lines through its edges */}
              <div className="relative mx-auto size-[220px] sm:size-[252px]">
                {/* horizontal lines at its top and bottom, across the content
                    column only, fading at their ends */}
                {["top-0", "bottom-0"].map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`pointer-events-none absolute ${pos} left-1/2 h-px w-[min(100vw,560px)] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(11,13,18,0)_0%,rgba(11,13,18,0.14)_20%,rgba(11,13,18,0.14)_80%,rgba(11,13,18,0)_100%)] lg:left-[-48px] lg:w-[calc(100%*1000/252+96px)] lg:max-w-[1096px] lg:translate-x-0`}
                  />
                ))}
                {/* vertical lines at its left and right, running past it */}
                {["left-0", "right-0"].map((pos) => (
                  <span
                    key={pos}
                    aria-hidden
                    className={`pointer-events-none absolute ${pos} top-1/2 h-[calc(100%+160px)] w-px -translate-y-1/2 bg-[linear-gradient(180deg,rgba(11,13,18,0)_0%,rgba(11,13,18,0.14)_25%,rgba(11,13,18,0.14)_75%,rgba(11,13,18,0)_100%)]`}
                  />
                ))}

                <div
                  key={v.img}
                  className="animate-rise relative size-full overflow-hidden rounded-[6px] bg-ink"
                >
                  <Image
                    src={`/images/voices/${v.img}.webp`}
                    alt={v.name}
                    fill
                    sizes="252px"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* the quote */}
              <figure
                key={v.name}
                aria-live="polite"
                className="animate-rise max-w-[520px] text-center max-lg:mx-auto lg:text-left"
              >
                <blockquote className="text-[clamp(1.25rem,2vw,1.625rem)] font-medium leading-[1.4] tracking-[-0.01em] text-ink">
                  &ldquo;{v.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5">
                  <span className="block text-[16px] font-medium text-ink">
                    {v.name}
                  </span>
                  <span className="mt-1 block text-[14px] text-muted">
                    {v.role}
                  </span>
                </figcaption>
              </figure>
            </div>

            {/* the pager: a dot per voice, the shown one stretched */}
            <div className="relative mt-10 flex items-center justify-center gap-1.5 lg:mt-12 lg:justify-start lg:pl-[calc(252px+2.5rem)]">
              {VOICES.map((p, i) => (
                <button
                  key={p.img}
                  type="button"
                  aria-label={`Show ${p.name}`}
                  aria-current={i === active}
                  onClick={() => setActive(i)}
                  className="grid h-6 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out ${
                      i === active
                        ? "w-10 bg-ink"
                        : "w-1.5 bg-ink/25 hover:bg-ink/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
