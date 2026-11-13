"use client";

import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import {
  ECOSYSTEM_CARDS,
  type EcosystemCard,
} from "@/components/site/EcosystemCards";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Backed by upGrad's Learning Ecosystem"
 *
 * Six stat cards in two rows of four columns, each row a wide card and
 * two small ones: Learners (the upGrad shield large on its right),
 * Universities and Placements; then Corporate Clients, Internships and
 * Hiring Partners (the Rekrut mark on its right). Small cards carry their
 * brand's logo at the foot. Cards are white with square corners, a thin
 * grey frame and the corner handles used across the site; they rise in on
 * scroll, the numbers count up, and on hover a card lifts, grows a touch
 * and tilts slightly.
 */
const brand = (name: string) => ECOSYSTEM_CARDS.find((c) => c.name === name)!;

/** a brand's logo on its own: the design's logo slot, cropped as on the
 *  ecosystem tiles, `width` wide (a CSS length) */
function BrandLogo({ c, width }: { c: EcosystemCard; width: string }) {
  return (
    <span
      className="relative block shrink-0 overflow-hidden"
      style={{ width, aspectRatio: `${c.iw} / ${c.ih}` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/ecosystem/${c.file}`}
        alt={c.name}
        className={`pointer-events-none absolute max-w-none ${c.crop ? "" : "inset-0 size-full object-cover"}`}
        style={
          c.crop
            ? {
                width: c.crop.w,
                height: c.crop.h,
                left: c.crop.left,
                top: c.crop.top,
              }
            : undefined
        }
      />
    </span>
  );
}

type Stat = {
  value: string;
  title: string;
  sub: string;
  brand: string;
  /** wide cards span two columns, the logo large on their right */
  wide?: boolean;
};

// in grid order: Learners (wide), Universities, Placements; then Corporate
// Clients, Internships, Hiring Partners (wide)
const STATS: Stat[] = [
  {
    value: "10 M+",
    title: "Learners",
    sub: "across upGrad’s learning ecosystem",
    brand: "upGrad",
    wide: true,
  },
  {
    value: "300+",
    title: "Global Universities",
    sub: "across 70+ countries",
    brand: "upGrad Abroad",
  },
  {
    value: "110K+",
    title: "Placements",
    sub: "careers launched by learners",
    brand: "upGrad KnowledgeHut",
  },
  {
    value: "600+",
    title: "Corporate Clients",
    sub: "trained annually",
    brand: "upGrad Enterprise",
  },
  {
    value: "28L+",
    title: "Internships",
    sub: "enabled for learners",
    brand: "Internshala",
  },
  {
    value: "3000+",
    title: "Hiring Partners",
    sub: "hiring from the upGrad ecosystem",
    brand: "upGrad Rekrut",
    wide: true,
  },
];

function StatCard({ stat }: { stat: Stat }) {
  const c = brand(stat.brand);
  // the shield and the square marks are near-square; the wordmarks are wide
  const squareish = c.iw / c.ih < 1.6;
  return (
    // the wrapper takes the scroll-in (GSAP writes inline transforms on
    // it); the card inside takes the hover
    <div data-reveal-item className={stat.wide ? "col-span-2" : ""}>
      <div
        className={`relative flex h-full min-h-[150px] border border-black/[0.08] bg-white px-5 py-5 transition-[translate,scale,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.03] sm:px-7 sm:py-6 ${
          stat.wide
            ? "items-center justify-between gap-6"
            : "flex-col justify-between gap-4"
        }`}
      >
        <CornerHandles />
        <div>
          <p
            className={`font-display font-bold leading-none tracking-[-0.045em] text-ink ${
              stat.wide
                ? "text-[clamp(2.5rem,4.4vw,4rem)]"
                : "text-[clamp(2.125rem,3.2vw,3rem)]"
            }`}
          >
            <CountUp value={stat.value} />
          </p>
          <h3 className="mt-3 text-[17px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[20px]">
            {stat.title}
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-snug text-body sm:text-[16px]">
            {stat.sub}
          </p>
        </div>
        {stat.wide ? (
          <BrandLogo
            c={c}
            width={squareish ? "min(112px, 24vw)" : "min(190px, 32vw)"}
          />
        ) : (
          <BrandLogo c={c} width={squareish ? "48px" : "min(150px, 100%)"} />
        )}
      </div>
    </div>
  );
}

export function Legacy() {
  return (
    <section id="legacy" className="bg-canvas">
      <div className="container-page flex flex-col items-center gap-10 pb-6 pt-12 lg:gap-12 lg:pb-8 lg:pt-16">
        <SectionHeading
          title="Backed by"
          accent="upGrad’s Learning Ecosystem"
          intro="A legacy of 10+ years in higher education, driving learning, hiring, and career success."
        />

        {/* two rows of four columns: a wide card and two small ones each */}
        <Reveal
          stagger={0.08}
          className="grid w-full grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
