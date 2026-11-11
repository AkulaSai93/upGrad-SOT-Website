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
 * public/images/campuses/cards, made in the style of Scaler's thumbnails:
 * the campus photo under a dark-to-red fade, the city set huge with a tilted
 * red "Campus" tag, the NAAC grade and programme as chips, and the partner
 * university named top right. Under it: an eyebrow, the university's name,
 * its location, three key highlights with icons and a full-width button.
 * Hovering a card lifts it and slowly zooms its poster.
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
              className="group flex flex-col overflow-hidden rounded-[10px] border border-line bg-surface shadow-[var(--shadow-sm)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[var(--shadow-lg)]"
            >
              <div className="relative aspect-video overflow-hidden bg-ink">
                <Image
                  src={`/images/campuses/cards/${c.key}.webp`}
                  alt={`${c.name}, ${c.location}`}
                  fill
                  quality={90}
                  sizes="(min-width: 1280px) 600px, (min-width: 1024px) 48vw, 100vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </div>

              <div className="flex flex-1 flex-col p-5 lg:px-7 lg:py-6">
                <p className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-accent">
                  {c.eyebrow}
                </p>
                <h3 className="mt-1.5 font-display text-[clamp(1.25rem,1.7vw,1.5rem)] font-bold leading-tight tracking-[-0.025em] text-ink">
                  {c.name}
                </h3>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-body">
                  <MapPin size={15} strokeWidth={2} aria-hidden />
                  {c.location}
                </p>

                <p className="mt-4 text-[11.5px] font-bold uppercase tracking-[0.16em] text-muted">
                  Key highlights
                </p>
                <ul className="mt-2.5 space-y-2">
                  {c.highlights.map(({ icon: Icon, text }) => (
                    <li key={text} className="flex items-center gap-2.5 text-[14px] leading-snug text-ink">
                      <span className="grid size-7 shrink-0 place-items-center rounded-[6px] bg-accent-soft text-accent">
                        <Icon size={14} strokeWidth={2} aria-hidden />
                      </span>
                      {text}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-5">
                  <Link
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-[6px] bg-accent px-6 py-3 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
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
