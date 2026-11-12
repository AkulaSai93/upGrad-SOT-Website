"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BadgeCheck, GraduationCap, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Campuses"
 *
 * Copy and links from sot.upgrad.com (the two partner universities, their
 * NAAC grades, locations and "Explore" pages); the SSAHE facts come from its
 * university page (see campus/campuses.ts).
 *
 * Layout after "Explore Programmes" on scaler.com/school-of-technology: two
 * big cards side by side (stacked below lg). Each opens with a 16:9 poster —
 * public/images/campuses/cards-v2, made in the style of Scaler's thumbnails:
 * the campus photo under a dark fade with only the city set huge and a
 * tilted red "Campus" tag (no logo, chips or address, which the card below
 * already gives). Under it: an eyebrow, the university's name on one line
 * (from sm; on phones it may wrap), its location, three key highlights and a full-width button. The card is
 * kept clean as Scaler's is: white, a hairline edge, 8px corners, no shadow;
 * the eyebrow and "Key highlights" in red; each highlight's icon on a small
 * lit tile (a light-deep-light red sheen, white glyph). Hovering a card lifts
 * it a touch and slowly zooms its poster.
 */
const CAMPUSES = [
  {
    key: "ssahe",
    eyebrow: "Tumkuru Campus · Karnataka",
    name: "Sri Siddhartha Academy of Higher Education",
    location: "Tumkuru (Outer Bangalore), Karnataka",
    highlights: [
      { icon: BadgeCheck, text: "NAAC A+ accredited, UGC recognised and AICTE approved" },
      { icon: MapPin, text: "70+ acre green campus in Tumkuru, Outer Bangalore" },
      { icon: GraduationCap, text: "AI-First B.Tech in Computer Science, 4 years / 8 semesters" },
    ],
    href: "https://sot.upgrad.com/university/ssahe",
  },
  {
    key: "adypu",
    eyebrow: "Pune Campus · Maharashtra",
    name: "Ajeenkya DY Patil University",
    location: "Pune, Maharashtra",
    highlights: [
      { icon: BadgeCheck, text: "NAAC A accredited university" },
      { icon: MapPin, text: "Campus in Pune, one of India's leading tech and startup hubs" },
      { icon: GraduationCap, text: "AI-First B.Tech in Computer Science with upGrad School of Technology" },
    ],
    href: "https://sot.upgrad.com/university/adypu",
  },
] as const;

export function Campuses() {
  return (
    <section id="campuses" className="bg-canvas py-12 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Our"
          accent="Campuses"
          intro={
            <>
              uGSOT is collaborating with cutting-edge university campuses across India,
              <br className="hidden sm:block" /> giving students world-class learning spaces
              right where innovation thrives
            </>
          }
        />

        <Reveal stagger={0.12} className="mt-12 grid gap-6 lg:mt-14 lg:grid-cols-2 lg:gap-8">
          {CAMPUSES.map((c) => (
            <article
              key={c.key}
              data-reveal-item
              className="group flex flex-col overflow-hidden rounded-[8px] border border-line bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1"
            >
              <div className="relative aspect-video overflow-hidden bg-ink">
                <Image
                  src={`/images/campuses/cards-v2/${c.key}.webp`}
                  alt={`${c.name}, ${c.location}`}
                  fill
                  quality={90}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 lg:p-6">
                <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
                  {c.eyebrow}
                </p>
                <h3 className="mt-2 text-[clamp(1.125rem,1.55vw,1.5rem)] font-medium leading-tight sm:whitespace-nowrap tracking-[-0.02em] text-ink">
                  {c.name}
                </h3>
                <p className="mt-1.5 text-[14px] text-body">{c.location}</p>

                <p className="mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-accent">
                  Key highlights
                </p>
                <ul className="mt-3 space-y-3">
                  {c.highlights.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-3 text-[14px] leading-snug text-ink">
                      {/* Scaler's lit icon tile: a diagonal light-deep-light
                          sheen in the brand red with a white glyph */}
                      <span
                        className="grid size-8 shrink-0 place-items-center rounded-[4px] text-white"
                        style={{
                          backgroundImage:
                            "linear-gradient(135deg, #ff8fa3 0%, var(--accent) 42%, var(--accent) 58%, #ffb3c0 100%)",
                        }}
                      >
                        <Icon size={16} strokeWidth={2} aria-hidden />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-6">
                  <Link
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[4px] bg-accent px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Explore campus
                    <ArrowUpRight size={17} strokeWidth={2} aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
