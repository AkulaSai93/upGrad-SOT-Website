import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Early Wins from Our First Batch"
 *
 * Layout after "Stellar Career Prospects" on scaler.com/school-of-technology:
 * a bento of four clean cards (white, hairline edge, 8px corners). On the
 * left, a wide card with a label, a big headline (its key phrase in red) and
 * a photo fading in on the right, with two small stat cards under it; on the
 * right, a tall card that runs the full height. On phones, as Scaler lays
 * its "Stellar Career Prospects" out: the wide card with its photo under the
 * copy, the two small cards side by side, then the tall card turned on its
 * side (portraits left, copy right). Every card has the faculty
 * posters' frame (square corners, a thin ink edge, a handle on each corner)
 * and its programme's colour instead of the brand red:
 * ICPC's blue (from its logo) on the ICPC cards, the brand red on the
 * ambassadors card. The two small cards fill with that colour on hover;
 * the tall one stays still. Kept clean: short lines,
 * one red phrase per card. As newtonschool.co marks its ICPC card, the
 * ICPC Foundation logo (from icpc.foundation) heads the ICPC card.
 *
 * Copy and photos come from upGrad School of Technology's LinkedIn posts:
 * the ICPC post ("First batch. First semester. Two ICPC regional
 * qualifications!") and the Google Student Ambassadors post. The photos
 * (public/images/achievements) are the people from those posters, cropped
 * clear of the posters' text.
 */
const ICPC_TEAM = ["Aashish Tiwari", "Utkarsh Tuwani", "Ayushman Tiwari"];
const AMBASSADORS = [
  { name: "Sakcham Goyal", img: "gsa-sakcham-v2" },
  { name: "Preetam G", img: "gsa-preetam-v2" },
];

// the faculty posters' frame: square corners, a thin ink edge, and a
// "selection" handle on each corner (CornerHandles, inside each card)
const card = "relative border border-[#cfd1d7] bg-white";
// each card takes its programme's colour (--tint for its text, --tint-fill on
// hover, --on-tint for the text over the fill): ICPC's blue, from the ICPC
// Foundation logo, and the brand red for the Google Student Ambassadors
const ICPC = {
  "--tint": "#4c82c3",
  "--tint-fill": "#4c82c3",
  "--on-tint": "#ffffff",
  "--on-tint-soft": "rgba(255,255,255,0.85)",
} as React.CSSProperties;
const BRAND = {
  "--tint": "var(--accent)",
  "--tint-fill": "var(--accent)",
  "--on-tint": "#ffffff",
  "--on-tint-soft": "rgba(255,255,255,0.85)",
} as React.CSSProperties;
// the small cards fill with their colour on hover
const hoverFill =
  "group transition-colors duration-300 hover:bg-[var(--tint-fill)]";

export function Achievements() {
  return (
    <section id="achievements" className="bg-canvas py-8 lg:py-16">
      <div className="container-page">
        <SectionHeading
          title="Early Wins from"
          accent="Our First Batch"
          intro="Our founding batch is already competing and leading on the world’s biggest tech stages."
        />

        <Reveal
          stagger={0.08}
          className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:mt-14 lg:grid-cols-3"
        >
          {/* ICPC: the wide card, the team photo fading in on the right */}
          <article
            data-reveal-item
            className={`${card} col-span-2 flex flex-col sm:min-h-[260px] sm:flex-row`}
            style={ICPC}
          >
            <CornerHandles />
            <div className="relative z-[1] flex flex-col justify-center p-5 sm:max-w-[50%] sm:p-6 lg:px-8 lg:py-6">
              <Image
                src="/images/achievements/icpc-foundation.webp"
                alt="ICPC Foundation"
                width={480}
                height={341}
                className="h-12 w-auto self-start"
              />
              <p className="mt-4 text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--tint)]">
                ICPC Asia Regionals 2026
              </p>
              <h3 className="mt-2 text-[clamp(1.5rem,2.3vw,2rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ink">
                First batch, first semester:
                <span className="block text-[var(--tint)]">
                  2 ICPC Regionals
                </span>
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.6] text-body">
                Qualified for ICPC Asia Amritapuri and Kanpur.
              </p>
            </div>
            {/* on phones, the photo under the copy, fading in from the top */}
            <div
              className="relative h-[200px] sm:hidden"
              style={{
                maskImage: "linear-gradient(to bottom, transparent, #000 35%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent, #000 35%)",
              }}
            >
              <Image
                src="/images/achievements/icpc-team.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-[50%_30%]"
              />
            </div>
            {/* from sm, the photo on the right, faded out on its left into
                the card's white */}
            <div
              className="absolute inset-y-0 right-0 hidden w-[60%] sm:block"
              style={{
                maskImage: "linear-gradient(to right, transparent, #000 40%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent, #000 40%)",
              }}
            >
              <Image
                src="/images/achievements/icpc-team.webp"
                alt={`${ICPC_TEAM.join(", ")}, ICPC regional qualifiers`}
                fill
                sizes="(min-width: 1024px) 480px, 58vw"
                className="object-cover object-[60%_30%]"
              />
            </div>
          </article>

          {/* Google Student Ambassadors: the tall card on the right */}
          <article
            data-reveal-item
            className={`${card} order-last col-span-2 flex flex-row lg:order-none lg:col-span-1 lg:row-span-2 lg:flex-col`}
            style={BRAND}
          >
            <CornerHandles />
            {/* the two portraits fill the card down to its copy and, as the
                ICPC photo does on its left, fade out at their foot into the
                card's white, each name set on the fade */}
            <div className="grid w-[48%] shrink-0 grid-cols-2 gap-px bg-white lg:w-auto lg:flex-1">
              {AMBASSADORS.map((a) => (
                <div
                  key={a.img}
                  className="relative h-full min-h-[200px] overflow-hidden bg-white lg:min-h-[240px]"
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      maskImage:
                        "linear-gradient(to bottom, #000 45%, transparent)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, #000 45%, transparent)",
                    }}
                  >
                    <Image
                      src={`/images/achievements/${a.img}.webp`}
                      alt={`${a.name}, Google Student Ambassador`}
                      fill
                      sizes="(min-width: 1024px) 200px, 50vw"
                      className="object-cover object-[50%_20%]"
                    />
                  </div>
                  <p className="absolute inset-x-2 bottom-2 text-[12px] font-semibold leading-tight text-ink sm:inset-x-3 sm:text-[14px]">
                    {a.name}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--tint)] sm:text-[12px] sm:tracking-[0.16em]">
                Google Student Ambassadors
              </p>
              <p className="mt-2 text-[clamp(2rem,4vw,3.5rem)] font-semibold leading-none sm:mt-3 tracking-[-0.03em] text-[var(--tint)]">
                2
              </p>
              <p className="mt-2 text-[13px] leading-[1.5] text-body sm:mt-3 sm:text-[14.5px] sm:leading-[1.6]">
                Representing our community in one of the world’s biggest tech
                ecosystems.
              </p>
            </div>
          </article>

          {/* the two small stat cards under the wide one */}
          {[
            {
              value: "1 month",
              text: "From day one of classes to clearing the ICPC Prelims",
            },
            {
              value: "3 students",
              text: `${ICPC_TEAM.slice(0, -1).join(", ")} and ${ICPC_TEAM.at(-1)}`,
            },
          ].map((s) => (
            <article
              key={s.value}
              data-reveal-item
              className={`${card} ${hoverFill} col-span-1 flex flex-col justify-center px-4 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6`}
              style={ICPC}
            >
              <CornerHandles />
              <p className="text-[clamp(1.5rem,3vw,2.75rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--tint)] transition-colors duration-300 group-hover:text-[var(--on-tint)]">
                {s.value}
              </p>
              <p className="mt-2 text-[13px] leading-[1.5] text-body transition-colors sm:mt-3 sm:text-[14.5px] sm:leading-[1.6] duration-300 group-hover:text-[var(--on-tint-soft)]">
                {s.text}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
