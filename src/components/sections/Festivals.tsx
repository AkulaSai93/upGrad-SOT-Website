"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Campus Events"
 *
 * Student life on the two campuses, event by event (first after the "Festival
 * Celebration" row on newtonschool.co's NST page), shown big so it reads as
 * the life of a college worth joining.
 *
 * PHOTOS TO REPLACE: the six pictures in /images/festivals are Figma AI
 * stand-ins, not photographs of our students. Swap in real photos from each
 * campus (same file names, landscape, about 1536x1024) before this goes live,
 * and correct each festival's campus below to match.
 *
 * Layout: the events in one long row of big photo cards, each filling most
 * of the screen's height: the picture edge to edge under a dark fade from the
 * foot, the event's name set huge over it in white, an "Event 01 / 06"
 * counter and the campus as a tag; square corners with the faculty posters'
 * corner handles. On desktop the section holds the screen while you scroll
 * and the row, running the full width of the screen, travels sideways like
 * walking past a wall of posters; on phones the cards scroll sideways by hand.
 *
 * Motion (GSAP, scrubbed by the scroll): the row slides from its first card to
 * its last, and inside each card the picture pans a little the other way, so
 * the photos have depth as they pass. The cards rise in when the section
 * arrives.
 */
const CAMPUS = {
  ssahe: "SSAHE, Tumkuru",
  adypu: "ADYPU, Pune",
} as const;

const FESTIVALS = [
  { img: "diwali", name: "Diwali", campus: CAMPUS.adypu },
  { img: "ganesh-chaturthi", name: "Ganesh Chaturthi", campus: CAMPUS.adypu },
  { img: "holi", name: "Holi", campus: CAMPUS.ssahe },
  { img: "garba", name: "Navratri & Garba Night", campus: CAMPUS.adypu },
  { img: "sankranti", name: "Makar Sankranti", campus: CAMPUS.ssahe },
  { img: "rajyotsava", name: "Karnataka Rajyotsava", campus: CAMPUS.ssahe },
] as const;

export function Festivals() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const row = q("[data-row]")[0] as HTMLElement;
          const frame = row.parentElement as HTMLElement;
          // as far as the row must travel for its last card to reach the
          // frame's right padding
          const travel = () => {
            const cs = getComputedStyle(frame);
            const inner =
              frame.clientWidth -
              parseFloat(cs.paddingLeft) -
              parseFloat(cs.paddingRight);
            return -Math.max(0, row.scrollWidth - inner);
          };
          gsap
            .timeline({
              scrollTrigger: {
                trigger: q("[data-track]")[0],
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            })
            .fromTo(row, { x: 0 }, { x: travel, ease: "none" }, 0)
            .fromTo(
              q("[data-pic]"),
              { xPercent: 6 },
              { xPercent: -6, ease: "none" },
              0,
            );
        },
      );
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          q("[data-card]"),
          { y: 40, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            stagger: 0.07,
            scrollTrigger: {
              trigger: q("[data-row]")[0],
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="festivals" className="bg-canvas">
      {/* lg+: a tall track; the screen inside holds while the row slides */}
      <div data-track className="relative lg:h-[420vh]">
        <div className="pb-8 pt-8 lg:sticky lg:top-0 lg:flex lg:h-[100svh] lg:flex-col lg:justify-start lg:overflow-hidden lg:pb-0 lg:pt-[calc(var(--header-h)+8px)]">
          <div className="container-page">
            <SectionHeading
              title="Campus"
              accent="Events"
              intro="Festivals, fests and nights to remember: there’s always something happening on campus."
            />
          </div>

          {/* the row runs the full width of the screen */}
          <div className="mt-8 snap-x snap-mandatory overflow-x-auto px-5 pb-3 pt-2 [scrollbar-width:none] lg:overflow-hidden lg:px-10 lg:py-[6px]">
            <ul
              data-row
              className="flex w-max gap-5 will-change-transform lg:gap-6"
            >
              {FESTIVALS.map((f, i) => (
                <li
                  key={f.img}
                  data-card
                  className="relative h-[440px] w-[84vw] shrink-0 snap-center border border-ink bg-ink sm:w-[520px] lg:h-[min(64svh,640px)] lg:w-[min(66vw,1040px)]"
                >
                  <CornerHandles />
                  <div className="absolute inset-0 overflow-hidden">
                    <div data-pic className="absolute inset-0 scale-[1.15]">
                      <Image
                        src={`/images/festivals/${f.img}.jpg`}
                        alt={`${f.name} at ${f.campus}`}
                        fill
                        sizes="(min-width: 1024px) 880px, 84vw"
                        className="object-cover"
                      />
                    </div>
                    {/* a dark fade from the foot so the name reads */}
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.45)_35%,rgba(0,0,0,0)_65%)]"
                    />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8 lg:p-10">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="rounded-[4px] bg-accent px-2.5 py-1 text-[12px] font-bold uppercase tracking-[0.12em]">
                        Event {String(i + 1).padStart(2, "0")} /{" "}
                        {String(FESTIVALS.length).padStart(2, "0")}
                      </span>
                      <span className="rounded-[4px] border border-white/40 px-2.5 py-1 text-[12px] font-semibold backdrop-blur-sm">
                        {f.campus}
                      </span>
                    </div>
                    <p className="mt-4 text-balance text-[clamp(2.25rem,5vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
                      {f.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
