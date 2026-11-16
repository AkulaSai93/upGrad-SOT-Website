"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { GlowButton } from "@/components/site/GlowButton";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Who Should Apply for uGNET?"
 *
 * Copy is sot.upgrad.com/uGNET's own (read 16 Nov 2026): the lead-in and the
 * four kinds of student who typically apply, each line verbatim; the short
 * titles over them are ours, a few words each.
 *
 * Layout: the heading and lead-in centred, then the four as cards in a row
 * (two by two on tablets, stacked on phones), after a client reference: each
 * card's illustration full bleed at the top (solid 3D icon tiles, objects
 * and avatars on a pastel gradient, no glass, generated with Figma AI in the SOT Website
 * file), fading into the white card, and the title and the page's line on
 * its white foot. Under them Apply. The cards rise in one after another; on
 * hover a card lifts and its illustration zooms gently.
 */
const WHO = [
  {
    title: "Silicon Valley-style learning",
    line: "Pursuing Computer Science Engineering through a Silicon Valley-style, application-driven approach",
    img: "/images/ugnet/who-v4-1.webp",
  },
  {
    title: "Tech meets entrepreneurship",
    line: "Learning how technology and entrepreneurship intersect, including foundational exposure to startup thinking alongside a B.E/ B.Tech in Computer Science and AI",
    img: "/images/ugnet/who-v4-2.webp",
  },
  {
    title: "A path to a Master's or PhD",
    line: "Building a strong academic and technical foundation during their B.E/B.Tech, with the intent to pursue advanced studies such as Master's or PhD programs",
    img: "/images/ugnet/who-v4-3.webp",
  },
  {
    title: "Learning from practitioners",
    line: "Learning from industry practitioners through applied projects, structured coursework, and real-world problem statements",
    img: "/images/ugnet/who-v2-4.webp",
  },
];

export function UgnetWho() {
  return (
    <section id="who" className="bg-canvas pb-6 pt-14 lg:pb-8 lg:pt-20">
      <div className="container-page">
        <SectionHeading
          title="Who Should Apply"
          accent="for uGNET?"
          intro="uGNET is the entrance test for students seeking admission to upGrad School of Technology's partner university campuses. Your uGNET score is used to evaluate admission eligibility."
          // wide enough that the line runs to two lines
          className="[&>p]:max-w-[900px] [&>p]:text-pretty"
        />

        <Reveal
          stagger={0.08}
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-5"
        >
          {WHO.map(({ title, line, img }) => (
            <div key={title} data-reveal-item>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[6px] border border-black/[0.08] bg-white transition-[translate,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_48px_-28px_rgba(11,13,18,0.3)]">
                {/* the illustration, full bleed, fading into the card */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 480px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_90%)]"
                  />
                </div>
                {/* the copy, on the illustration's white foot */}
                <div className="relative -mt-14 flex flex-1 flex-col px-5 pb-5 lg:-mt-16 lg:px-6 lg:pb-6">
                  <h3 className="font-display text-[16px] font-medium leading-snug tracking-[-0.02em] text-ink lg:text-[17px]">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.6] text-body">
                    {line}
                  </p>
                </div>
              </article>
            </div>
          ))}
        </Reveal>

        <div className="mt-10 flex flex-col items-center gap-4 text-center lg:mt-12">
          <GlowButton href="#apply" streak="#0b0d12">
            Apply for uGNET
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </GlowButton>
        </div>
      </div>
    </section>
  );
}
