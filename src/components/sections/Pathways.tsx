"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Download } from "lucide-react";
import { CountUp } from "@/components/motion/CountUp";
import { LOGOS, LogoMark } from "@/components/sections/AlumniCompanies";
import { Reveal } from "@/components/motion/Reveal";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(useGSAP);

/** the section's colours, white at rest and black once you are in it */
const LIGHT = {
  "--pw-bg": "#ffffff",
  "--heading-fg": "#0b0d12",
  "--heading-muted": "#3d4452",
};
const DARK = {
  "--pw-bg": "#000000",
  "--heading-fg": "#ffffff",
  "--heading-muted": "rgba(255,255,255,0.65)",
};

/**
 * "One Degree, Three Pathways"
 *
 * Layout and motion after "Learn 'Practically' by Building Real Businesses"
 * on mastersunion.org: the site's centred heading, then one big white card
 * per pathway, each in the faculty posters' frame (square corners, corner handles). The section starts
 * white and fades to black once it reaches the middle of the screen (back to
 * white as you leave), the heading turning white with it. The cards are sticky at the same height under the
 * nav, so as you scroll each next card slides up over the last and they stack
 * (from lg; below it they simply follow one another).
 *
 * Each card: on the left a photo (Figma AI, public/images/pathways) under a
 * dark fade rising from the foot, the pathway's name set big and centred at its foot ("High Paying Jobs");
 * on the right a two-line title (the second line in
 * red, one type style throughout), a line of copy, two stat tiles (the
 * figure counts up; under it each tile has its own animated mark: the big
 * companies' logos sliding by, a ring filling with a dot orbiting, a mentor
 * chat typing, a growth line drawing in, a turning globe with pulsing pins,
 * and score bars filling) and a red "Download Brochure" button with a light line running round its edge.
 *
 * Copy is sot.upgrad.com's; the figures are the site's own (3000+ hiring
 * partners, 110K+ placements, 300+ global universities). Startup support has
 * no published figures, so its tiles name what it offers instead.
 */
type Tile = {
  label: string;
  value: string;
  viz: "logos" | "ring" | "chat" | "growth" | "globe" | "score";
};
type Path = {
  key: string;
  tag: string;
  title: [string, string];
  body: string;
  tiles: [Tile, Tile];
};

const PATHS: Path[] = [
  {
    key: "jobs",
    tag: "High Paying Jobs",
    title: ["Launch a High-Paying", "Tech Career"],
    body: "Get industry-ready with hands-on coding, hackathons and strong placement support.",
    tiles: [
      { label: "Hiring Partners", value: "3000+", viz: "logos" },
      { label: "Placements", value: "110K+", viz: "ring" },
    ],
  },
  {
    key: "startup",
    tag: "Startup Support",
    title: ["Build Your Own Startup,", "While You Study"],
    body: "Launch your startup while you study, with mentorship, incubation and seed funding.",
    tiles: [
      { label: "From day one", value: "Mentorship", viz: "chat" },
      { label: "When you’re ready", value: "Seed Funding", viz: "growth" },
    ],
  },
  {
    key: "research",
    tag: "Research & Higher Studies",
    title: ["Research Today, Study at", "Top Global Universities"],
    body: "Build research skills and prepare for GRE, IELTS and top global universities.",
    tiles: [
      { label: "Global Universities", value: "300+", viz: "globe" },
      { label: "Test prep", value: "GRE & IELTS", viz: "score" },
    ],
  },
];

/** true once the element has scrolled into view (and stays true) */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, seen] as const;
}

/** a rising trend line that draws itself in, a soft red area fading in
 *  under it, and a pulsing dot at its peak */
function Growth() {
  const [ref, seen] = useSeen<SVGSVGElement>();
  const line = "M2 32 C 18 30, 26 22, 40 24 S 64 14, 78 15 S 104 6, 118 4";
  return (
    <svg
      ref={ref}
      aria-hidden
      viewBox="0 0 120 36"
      className="mt-3 h-9 w-full max-w-[150px] overflow-visible"
    >
      <defs>
        <linearGradient id="pw-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e4002b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#e4002b" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${line} L118 36 L2 36 Z`}
        fill="url(#pw-area)"
        className={`transition-opacity delay-700 duration-700 ${seen ? "opacity-100" : "opacity-0"}`}
      />
      <path
        d={line}
        fill="none"
        stroke="#e4002b"
        strokeWidth="2.2"
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray="1"
        style={{
          strokeDashoffset: seen ? 0 : 1,
          transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      <g
        className={`transition-opacity delay-[1200ms] duration-300 ${seen ? "opacity-100" : "opacity-0"}`}
      >
        <circle
          cx="118"
          cy="4"
          r="6"
          fill="#e4002b"
          opacity="0.25"
          className="origin-[118px_4px] animate-ping"
        />
        <circle cx="118" cy="4" r="3" fill="#e4002b" />
      </g>
    </svg>
  );
}

/** the big hiring companies (the alumni section's logos) sliding by in a
 *  strip, its ends fading out; it pauses under the pointer */
const BIG = LOGOS.slice(0, 8);
function LogoStrip() {
  return (
    <div aria-hidden className="marquee-mask mt-3 -mx-1">
      <div className="marquee-track">
        {[...BIG, ...BIG].map((l, i) => (
          <span
            key={i}
            className="mr-6 flex h-[26px] shrink-0 scale-[0.8] items-center"
          >
            <LogoMark logo={l} />
          </span>
        ))}
      </div>
    </div>
  );
}

/** a ring that fills round to three quarters, then a small dot keeps
 *  orbiting it */
function Ring() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} aria-hidden className="relative mt-3 size-10">
      <svg viewBox="0 0 40 40" className="size-full -rotate-90">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#e8e8ec"
          strokeWidth="4"
        />
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="none"
          stroke="#e4002b"
          strokeWidth="4"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          style={{
            strokeDashoffset: seen ? 0.25 : 1,
            transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>
      {/* the orbiting dot */}
      <span
        className={`absolute inset-0 transition-opacity delay-[1200ms] duration-300 motion-safe:animate-[spin_3.5s_linear_infinite] ${
          seen ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 rounded-full border-2 border-white bg-ink" />
      </span>
    </div>
  );
}

/** a mentoring chat: a question comes in, then a red reply bubble keeps
 *  "typing" */
function Chat() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <div ref={ref} aria-hidden className="mt-3 flex flex-col gap-1.5">
      <span
        className={`w-fit rounded-[8px] rounded-bl-[2px] bg-[#f0f0f2] px-2.5 py-1.5 text-[11px] leading-none text-body transition-all duration-500 ${
          seen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        How do I start?
      </span>
      <span
        className={`flex w-fit items-center gap-1 self-end rounded-[8px] rounded-br-[2px] bg-accent px-2.5 py-2 transition-all delay-500 duration-500 ${
          seen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className="size-1.5 rounded-full bg-white motion-safe:animate-bounce"
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </span>
    </div>
  );
}

/** a globe turning (its meridians sweep across), with red pins pulsing on it */
function Globe() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const pins = [
    { x: 14, y: 14, d: "0s" },
    { x: 27, y: 18, d: "0.6s" },
    { x: 20, y: 28, d: "1.2s" },
  ];
  return (
    <div
      ref={ref}
      aria-hidden
      className={`mt-3 transition-all duration-700 ${seen ? "scale-100 opacity-100" : "scale-75 opacity-0"}`}
    >
      <svg viewBox="0 0 40 40" className="size-10 overflow-visible">
        <circle
          cx="20"
          cy="20"
          r="16"
          fill="#fff5f6"
          stroke="#0b0d12"
          strokeWidth="1.4"
        />
        <ellipse
          cx="20"
          cy="20"
          rx="16"
          ry="6"
          fill="none"
          stroke="#0b0d12"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        <line
          x1="4"
          y1="20"
          x2="36"
          y2="20"
          stroke="#0b0d12"
          strokeOpacity="0.35"
          strokeWidth="1"
        />
        {/* meridians, sweeping round as the globe turns */}
        {[0, 1.4, 2.8].map((b) => (
          <ellipse
            key={b}
            cx="20"
            cy="20"
            rx="16"
            ry="16"
            fill="none"
            stroke="#0b0d12"
            strokeOpacity="0.45"
            strokeWidth="1"
          >
            <animate
              attributeName="rx"
              values="16;0.5;16"
              dur="4.2s"
              begin={`${b}s`}
              repeatCount="indefinite"
            />
          </ellipse>
        ))}
        {pins.map((p) => (
          <g key={p.d}>
            <circle cx={p.x} cy={p.y} r="2.2" fill="#e4002b" />
            <circle
              cx={p.x}
              cy={p.y}
              r="2.2"
              fill="none"
              stroke="#e4002b"
              strokeWidth="1"
            >
              <animate
                attributeName="r"
                values="2.2;6;2.2"
                dur="1.8s"
                begin={p.d}
                repeatCount="indefinite"
              />
              <animate
                attributeName="stroke-opacity"
                values="0.8;0;0.8"
                dur="1.8s"
                begin={p.d}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>
    </div>
  );
}

/** test scores: three bars filling up one after another */
function Score() {
  const [ref, seen] = useSeen<HTMLDivElement>();
  const bars = [92, 78, 86];
  return (
    <div
      ref={ref}
      aria-hidden
      className="mt-3 flex w-full max-w-[150px] flex-col gap-1.5"
    >
      {bars.map((w, i) => (
        <span
          key={i}
          className="block h-1.5 w-full overflow-hidden rounded-full bg-[#ececef]"
        >
          <span
            className="block h-full rounded-full bg-accent"
            style={{
              width: seen ? `${w}%` : "0%",
              opacity: 0.55 + i * 0.2,
              transition: `width 1.1s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.25}s`,
            }}
          />
        </span>
      ))}
    </div>
  );
}

/** each stat tile's own animated mark */
function TileViz({ viz }: { viz: Tile["viz"] }) {
  switch (viz) {
    case "logos":
      return <LogoStrip />;
    case "ring":
      return <Ring />;
    case "chat":
      return <Chat />;
    case "growth":
      return <Growth />;
    case "globe":
      return <Globe />;
    case "score":
      return <Score />;
  }
}

function Card({ path }: { path: Path }) {
  return (
    <article className="relative grid gap-6 border border-ink bg-white p-3 shadow-[0_-14px_30px_-12px_rgba(11,13,18,0.18)] sm:p-4 lg:min-h-[420px] lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:p-5">
      {/* the faculty posters' frame: square corners, a thin ink edge and a
          "selection" handle on each corner */}
      <CornerHandles />
      {/* the photo, with the pathway name big over it */}
      <div className="relative min-h-[260px] overflow-hidden rounded-[6px] bg-ink sm:min-h-[320px] lg:min-h-0">
        <Image
          src={`/images/pathways/${path.key}.webp`}
          alt=""
          fill
          sizes="(min-width: 1024px) 600px, 100vw"
          className="object-cover"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.8)_0%,rgba(0,0,0,0.35)_40%,rgba(0,0,0,0.05)_100%)]"
        />
        <p className="absolute inset-x-7 bottom-7 text-center text-[clamp(2rem,3.4vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:inset-x-10 sm:bottom-10">
          {path.tag}
        </p>
      </div>

      {/* the content */}
      <div className="flex flex-col justify-center px-2 pb-3 sm:px-3 lg:px-0 lg:pb-0 lg:pr-4">
        <h3 className="text-[clamp(1.5rem,2.3vw,2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
          {path.title[0]}
          <span className="block text-accent">{path.title[1]}</span>
        </h3>
        <p className="mt-3 max-w-[460px] text-[15px] leading-[1.6] text-body">
          {path.body}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {path.tiles.map((t) => (
            <div key={t.label} className="rounded-[8px] border border-line p-4">
              <p className="text-[13px] text-muted">{t.label}</p>
              <p className="mt-1 text-[clamp(1.125rem,1.7vw,1.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
                <CountUp value={t.value} />
              </p>
              <TileViz viz={t.viz} />
            </div>
          ))}
        </div>

        {/* red, with the site's moving line: a light sliver sweeping round the
            button's edge (the cta-glow used on the other CTAs) */}
        <Link
          href="#brochure"
          className="group/cta relative mt-6 inline-flex w-fit overflow-hidden rounded-[4px] bg-accent-hover p-[1.5px]"
        >
          <span
            aria-hidden
            style={{
              backgroundImage: "conic-gradient(transparent 200deg, #ffffff)",
            }}
            className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
          />
          <span className="relative z-[2] inline-flex items-center gap-2.5 rounded-[3px] bg-accent px-5 py-3 text-[14.5px] font-semibold text-white transition-colors group-hover/cta:bg-accent-hover">
            Download Brochure
            <Download size={16} strokeWidth={2} aria-hidden />
          </span>
        </Link>
      </div>
    </article>
  );
}

export function Pathways() {
  const section = useRef<HTMLElement>(null);

  // when the section reaches the middle of the screen it fades to black in
  // one timed tween (not scrubbed, so there is no muddy grey half-state), and
  // back to white when you scroll out of it, as the dark sections do; the nav
  // follows (see Navbar's DARK_SECTIONS)
  useGSAP(
    () => {
      const el = section.current;
      if (!el) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const to = (vars: typeof LIGHT) =>
        gsap.to(el, {
          ...vars,
          duration: reduced ? 0 : 0.6,
          ease: "power2.out",
          overwrite: true,
        });
      // measured live on every scroll (not cached trigger positions, which go
      // stale as the sticky cards and images settle), so the whole section,
      // every card included, stays black while it is on screen
      let dark: boolean | null = null;
      const check = () => {
        const r = el.getBoundingClientRect();
        const now =
          r.top < window.innerHeight * 0.55 &&
          r.bottom > window.innerHeight * 0.45;
        if (now !== dark) {
          dark = now;
          to(now ? DARK : LIGHT);
        }
      };
      check();
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", check);
      return () => {
        window.removeEventListener("scroll", check);
        window.removeEventListener("resize", check);
      };
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      id="pathways"
      className="bg-[var(--pw-bg)] py-16 lg:py-16"
      style={LIGHT as React.CSSProperties}
    >
      <div className="container-page">
        <SectionHeading
          title="One Degree,"
          accent="Three Pathways"
          intro="A successful tech career, your own startup, or pursue higher education."
        />

        {/* the cards stack: each is sticky at the same height, so the next
            slides up over the last as you scroll */}
        <div className="mt-12 flex flex-col gap-8 lg:mt-16 lg:gap-[22vh] lg:pb-[6vh]">
          {PATHS.map((path) => (
            <Reveal
              key={path.key}
              className="lg:sticky lg:top-[calc(var(--header-h)+40px)]"
            >
              <Card path={path} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
