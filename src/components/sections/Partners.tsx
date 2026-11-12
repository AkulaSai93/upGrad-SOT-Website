"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Our Partners"
 *
 * Figma HOWFOSvIxaWIA2rZi55F0e node 41:6397: a full-width band on a dark
 * gradient, the heading in white, and three white partner cards in a row,
 * the middle one larger (the design's 440 x 370, made taller here, up to
 * 460 x 439, so the footer has room; the sides are 0.9 of it),
 * square-cornered with a "selection" handle on each corner like the faculty
 * cards, and a pager under them (a dot per partner, the middle
 * card's stretched into a long light pill).
 * Each card, kept clean: the partner's picture across the top, then under a
 * hairline a centred footer: the logo, large, in a fixed slot, each at its own
 * height so they read as one size (the wordmarks trimmed of their padding,
 * the square mark a little taller), then the role and one line of copy.
 * Logos are the design's; the pictures (public/images/partners, Figma AI)
 * show what each partnership means for students: training models on GPU
 * workstations (NVIDIA), building an app on a database (MongoDB), and
 * building an Indian-language voice assistant (the voice-AI partner).
 *
 * Motion: the cards are a loop. Every few seconds (not under reduced motion,
 * and paused while the pointer or focus is on it) the next partner slides
 * into the middle; a click on a side card, a swipe or the arrow keys do the
 * same. As the middle card changes, the background crossfades to that
 * partner's primary colour: NVIDIA's green, MongoDB's forest green, and the
 * voice-AI partner's orange (from its logo), each glowing behind the middle
 * card in the design's layout (Figma 41:6398).
 *
 * COPY TO CONFIRM: the design gives all three cards the same placeholder
 * lines ("Data platform partner" / "Powering data-driven innovation…");
 * each partner's own lines go in PARTNERS below.
 */
type Partner = {
  key: string;
  name: string;
  photo: string;
  /** the logo file's size, and its height in the card at 440 wide */
  logo: { src: string; w: number; h: number; show: number; square?: boolean };
  role: string;
  line: string;
  /** the band's background while this partner is in the middle */
  bg: string;
};

const PARTNERS: Partner[] = [
  {
    key: "nvidia",
    name: "NVIDIA",
    photo: "nvidia-lab.webp",
    logo: { src: "nvidia-logo-trim.png", w: 456, h: 88, show: 32 },
    role: "Data platform partner",
    line: "Powering data-driven innovation and modern application development.",
    // NVIDIA's green (#76b900): a bright glow behind the middle card over
    // a deeper green diagonal
    bg: [
      "radial-gradient(59.2% 102.5% at 50% 45%, rgba(118,185,0,0.9) 0%, rgba(118,185,0,0) 42%)",
      "radial-gradient(105.7% 182.9% at 7% 13%, rgba(160,220,40,0.22) 0%, rgba(160,220,40,0) 27%)",
      "linear-gradient(134.12deg, #2f4f00 8.57%, #5a8f00 53.31%, #263f00 91.43%)",
    ].join(", "),
  },
  {
    key: "mongodb",
    name: "MongoDB",
    photo: "mongodb-build.webp",
    logo: { src: "mongodb-logo-trim.png", w: 2026, h: 534, show: 40 },
    role: "Data platform partner",
    line: "Powering data-driven innovation and modern application development.",
    // MongoDB's forest green (#00684a), its bright green (#00ed64) glowing
    bg: [
      "radial-gradient(59.2% 102.5% at 50% 45%, rgba(0,237,100,0.55) 0%, rgba(0,237,100,0) 40%)",
      "radial-gradient(105.7% 182.9% at 7% 13%, rgba(0,237,100,0.16) 0%, rgba(0,237,100,0) 27%)",
      "linear-gradient(134.12deg, #023430 8.57%, #00684a 53.31%, #001e2b 91.43%)",
    ].join(", "),
  },
  {
    key: "voice-ai",
    name: "Voice AI partner",
    photo: "voice-ai-lab.webp",
    logo: { src: "voice-ai-logo.png", w: 400, h: 400, show: 50, square: true },
    role: "Data platform partner",
    line: "Powering data-driven innovation and modern application development.",
    // the voice-AI partner's orange (its logo's), with an amber glow
    bg: [
      "radial-gradient(59.2% 102.5% at 50% 45%, rgba(255,179,71,0.6) 0%, rgba(255,179,71,0) 40%)",
      "radial-gradient(105.7% 182.9% at 7% 13%, rgba(255,214,120,0.2) 0%, rgba(255,214,120,0) 27%)",
      "linear-gradient(134.12deg, #8a2c10 8.57%, #e8612c 53.31%, #6e1f0c 91.43%)",
    ].join(", "),
  },
];

const AUTOPLAY_MS = 4500;

/** a length in the card, given at the design's 440-wide size */
const at = (px: number) => `calc(var(--cw) * ${(px / 440).toFixed(4)})`;

function Card({ p }: { p: Partner }) {
  return (
    <span className="flex size-full flex-col overflow-hidden border border-white/20 bg-white">
      {/* the picture */}
      <span className="relative block h-[58%] shrink-0 border-b border-black/10">
        <Image
          src={`/images/partners/${p.photo}`}
          alt=""
          fill
          sizes="(min-width: 1024px) 440px, 80vw"
          className="object-cover"
        />
      </span>
      {/* the footer: logo slot, then role and line, all centred */}
      <span
        className="flex flex-1 flex-col items-center justify-center text-center"
        style={{ padding: `${at(20)} ${at(40)}`, gap: at(14) }}
      >
        <span
          className="flex items-center justify-center"
          style={{ height: at(50) }}
        >
          <Image
            src={`/images/partners/${p.logo.src}`}
            alt={p.name}
            width={p.logo.w}
            height={p.logo.h}
            sizes="240px"
            className={`w-auto max-w-none ${p.logo.square ? "rounded-[6px]" : ""}`}
            style={{ height: at(p.logo.show) }}
          />
        </span>
        <span className="block">
          <span className="block text-[14px] font-semibold leading-tight text-ink">
            {p.role}
          </span>
          <span className="mt-1 line-clamp-2 block text-[12.5px] leading-[1.5] text-body">
            {p.line}
          </span>
        </span>
      </span>
    </span>
  );
}

export function Partners() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const swipe = useRef<number | null>(null);
  const n = PARTNERS.length;
  const go = (i: number) => setActive(((i % n) + n) % n);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setInterval(
      () => setActive((a) => (a + 1) % n),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(t);
  }, [paused, n]);

  const onDown = (e: PointerEvent) => {
    swipe.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      id="partners"
      className="relative overflow-hidden py-12 lg:py-10"
      style={
        {
          "--heading-fg": "#ffffff",
          "--heading-muted": "rgba(255,255,255,0.88)",
        } as React.CSSProperties
      }
    >
      {/* the backgrounds, one per partner, crossfading to the middle card's */}
      {PARTNERS.map((p, i) => (
        <span
          key={p.key}
          aria-hidden
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ background: p.bg, opacity: i === active ? 1 : 0 }}
        />
      ))}

      <div className="relative">
        <div className="container-page">
          <SectionHeading
            title="Our"
            accent="Partners"
            accentClassName="text-white"
            intro="Building what’s next, together"
          />
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Partners"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") go(active - 1);
            if (e.key === "ArrowRight") go(active + 1);
          }}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (swipe.current = null)}
          // --cw: the middle card's width (440 in the design); the side
          // cards are 0.9 of it and sit one card-width out, so the 22px gap
          // holds at the design's size
          className="relative mx-auto mt-8 h-[calc(var(--cw)*420/440)] touch-pan-y select-none outline-none [--cw:min(78vw,340px)] focus-visible:ring-2 focus-visible:ring-white/50 md:[--cw:min(31vw,460px)] lg:mt-10"
        >
          {PARTNERS.map((p, i) => {
            // shortest way round the loop from the middle card
            let d = i - active;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const mid = d === 0;
            return (
              <button
                key={p.key}
                type="button"
                tabIndex={-1}
                aria-hidden={!mid}
                aria-label={`${p.name}: ${p.role}`}
                onClick={() => !mid && go(i)}
                style={{
                  transform: `translateX(calc(-50% + ${d} * var(--cw) * 1.0)) scale(${mid ? 1 : 0.9})`,
                  zIndex: mid ? 2 : 1,
                }}
                className={`absolute left-1/2 top-0 block h-full w-[var(--cw)] text-left transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.32,0,0.2,1)] ${
                  mid
                    ? "shadow-[0_24px_60px_-20px_rgba(0,0,0,0.55)]"
                    : "cursor-pointer"
                }`}
              >
                <Card p={p} />
                {/* "selection" handles on the four corners, as on the faculty
                    cards; dimmer on the side cards */}
                <CornerHandles dim={!mid} />
              </button>
            );
          })}
        </div>

        {/* the pager under the cards: a dot per partner, the middle card's
            stretched into a long light pill; each picks its partner */}
        <div className="mt-8 flex items-center justify-center gap-1.5 lg:mt-10">
          {PARTNERS.map((p, i) => (
            <button
              key={p.key}
              type="button"
              aria-label={`Show ${p.name}`}
              aria-current={i === active}
              onClick={() => go(i)}
              className="grid h-6 place-items-center outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span
                className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ease-out ${
                  i === active
                    ? "w-10 bg-white/90"
                    : "w-1.5 bg-white/35 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>

        {/* which partner is in the middle, for screen readers */}
        <p aria-live="polite" className="sr-only">
          {PARTNERS[active].name}
        </p>
      </div>
    </section>
  );
}
