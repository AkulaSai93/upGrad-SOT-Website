"use client";

import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import {
  ECOSYSTEM_CARDS,
  type EcosystemCard,
} from "@/components/site/EcosystemCards";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Backed by upGrad's Learning Ecosystem"
 *
 * The heading, then the numbers as stat cards in a four-column bento: a wide
 * card and two small, then two small and a wide one. Each card is white with
 * a light sticker edge (1px black top/left, 2.5px bottom/right): the number big, its title and a grey line, and the upGrad
 * brand it belongs to — large on the right of a wide card, a wordmark at the
 * foot of a small one. The cards rise in on scroll; on hover the whole card lifts, grows a touch
 * and tilts slightly (no shadow), with a little spring; the
 * numbers count up.
 */
type Stat = {
  value: string;
  title: string;
  sub: string;
  brand: string;
  wide?: boolean;
};

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

const brand = (name: string) => ECOSYSTEM_CARDS.find((c) => c.name === name)!;

/** a brand's logo on its own: the design's logo slot (iw x ih) at `width`,
 *  cropped as on the ecosystem tiles */
function BrandLogo({ c, width }: { c: EcosystemCard; width: number }) {
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

function StatCard({ stat }: { stat: Stat }) {
  const c = brand(stat.brand);
  // the shield and the square marks are near-square; the wordmarks are wide
  const squareish = c.iw / c.ih < 1.6;
  return (
    // the wrapper takes the scroll-in (GSAP writes inline translate/scale/
    // rotate on it, which would override hover classes); the card inside
    // takes the hover
    <div data-reveal-item className={stat.wide ? "sm:col-span-2" : ""}>
      <div
        className={`flex h-full min-h-[170px] rounded-[10px] border-solid border-black bg-white px-5 py-5 transition-[translate,scale,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:-rotate-1 hover:scale-[1.03] sm:px-6 ${
          stat.wide ? "items-center justify-between gap-6" : "flex-col"
        }`}
        style={{ borderWidth: "1px 2.5px 2.5px 1px" }}
      >
        <div>
          <p
            className={`font-display font-bold leading-none tracking-[-0.04em] text-ink ${
              stat.wide
                ? "text-[clamp(2.75rem,4.4vw,4rem)]"
                : "text-[clamp(2.25rem,3.2vw,3rem)]"
            }`}
          >
            <CountUp value={stat.value} />
          </p>
          <h3 className="mt-3 text-[18px] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[19px]">
            {stat.title}
          </h3>
          <p className="mt-1 text-[14px] leading-snug text-body sm:text-[15px]">
            {stat.sub}
          </p>
        </div>
        {stat.wide ? (
          <BrandLogo c={c} width={squareish ? 96 : 150} />
        ) : (
          <div className="mt-auto pt-4">
            <BrandLogo c={c} width={squareish ? 40 : 120} />
          </div>
        )}
      </div>
    </div>
  );
}

export function Legacy() {
  return (
    <section id="legacy" className="bg-canvas">
      <div className="container-page flex flex-col items-center gap-12 pb-6 pt-12 lg:gap-14 lg:pb-8 lg:pt-28">
        <SectionHeading
          title="Backed by"
          accent="upGrad’s Learning Ecosystem"
          intro="A legacy of 10+ years in higher education, driving learning, hiring, and career success."
        />

        {/* bento: wide + two small, then two small + wide */}
        <Reveal
          stagger={0.08}
          className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {STATS.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
