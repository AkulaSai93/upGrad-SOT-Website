"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight, Play } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";
import type { Campus } from "./campuses";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** the section's colours, light and dark: it fades to dark while it holds
 *  the middle of the screen (as the faculty section does) */
const LIGHT = {
  "--ab-bg": "#ffffff",
  "--ab-fg": "#0b0d12",
  "--ab-body": "#3d4452",
  "--ab-line": "rgba(0,0,0,0.08)",
  "--ab-chip": "#ffffff",
  "--heading-fg": "#0b0d12",
  "--heading-muted": "#3d4452",
};
const DARK = {
  "--ab-bg": "#000000",
  "--ab-fg": "#ffffff",
  "--ab-body": "rgba(229,229,229,0.8)",
  "--ab-line": "rgba(255,255,255,0.16)",
  "--ab-chip": "#111216",
  "--heading-fg": "#ffffff",
  "--heading-muted": "rgba(229,229,229,0.8)",
};

/** whether the section fades to dark on scroll (keep in step with "about"
 *  in Navbar's DARK_SECTIONS, so the nav turns dark with it) */
const FADE_TO_DARK = true;

/** the right-hand links in the intro: the page's own sections */
const LINKS = [
  { label: "Program Fee Structure", href: "#fees" },
  { label: "Loans & Financing", href: "#loans" },
  { label: "Scholarships", href: "#scholarships" },
  { label: "Admission Process", href: "#admission" },
];

/**
 * About the university — sot.upgrad.com's own "about" copy and films for it,
 * then its facilities (Academic, Wellness & Fitness, Integrated Campus Living,
 * Sports): the photos and lines are the university page's.
 *
 * Layout after Masters' Union's "Learn at One of India's Biggest Corporate
 * Hubs": the heading alone at the top left; under it three columns on
 * desktop sitting on one baseline, a short summary
 * on the left, the university's main film (the virtual tour) in the middle and a column of links to
 * the page's sections (fees, loans, scholarships, admission) on the right,
 * each with an arrow; the film opens in the player overlay. Phones stack it
 * all. Then "Campus Facilities": a switch, one tab per group, and
 * that group's three places as a bento: one large photo on the left, two
 * stacked on the right, each titled in white over a dark foot. With a mouse
 * its line rises in under the title on hover; on touch screens the line is
 * always shown. On phones
 * the tabs stay on one line (scrolling sideways if they must) and the
 * photos become a swipeable row.
 *
 * Motion (GSAP): on a switch the photos wipe in from the right, one after
 * another, settling from a slight zoom, and the captions rise after them. The
 * tab highlight slides to the chosen tab. Reduced motion: they swap at once.
 */
export function CampusAbout({ campus }: { campus: Campus }) {
  const root = useRef<HTMLElement>(null);
  const [group, setGroup] = useState(0);
  const [playing, setPlaying] = useState<Video | null>(null);
  const items = campus.facilities[group].items;

  // fades to black when the section reaches the middle of the screen and
  // back to white as you leave, measured live on every scroll; the nav
  // follows (Navbar's DARK_SECTIONS)
  useGSAP(
    () => {
      const el = root.current;
      if (!el || !FADE_TO_DARK) return;
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      let dark: boolean | null = null;
      const check = () => {
        const r = el.getBoundingClientRect();
        const now =
          r.top < window.innerHeight * 0.55 &&
          r.bottom > window.innerHeight * 0.45;
        if (now !== dark) {
          dark = now;
          gsap.to(el, {
            ...(now ? DARK : LIGHT),
            duration: reduced ? 0 : 0.6,
            ease: "power2.out",
            overwrite: true,
          });
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
    { scope: root },
  );
  const main = campus.videos[0];

  // the bento wipes in whenever the group changes (and on first arrival)
  const first = useRef(true);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: first.current
            ? {
                trigger: "[data-bento]",
                start: "top 80%",
                toggleActions: "play none none none",
              }
            : undefined,
        });
        tl.fromTo(
          "[data-photo]",
          { clipPath: "inset(0 0 0 100%)" },
          {
            clipPath: "inset(0 0 0 0%)",
            duration: 1.1,
            stagger: 0.1,
            // let a lifted card (and its shadow) reach past its cell
            clearProps: "clipPath",
          },
          0,
        )
          .fromTo(
            "[data-photo] img",
            { scale: 1.15 },
            { scale: 1, duration: 1.6, stagger: 0.1 },
            0,
          )
          .fromTo(
            "[data-cap]",
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.1 },
            0.4,
          );
        first.current = false;
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [group] },
  );

  return (
    <section
      ref={root}
      id="about"
      className="overflow-x-clip bg-[var(--ab-bg)] py-8 lg:py-20"
      style={LIGHT as React.CSSProperties}
    >
      <div className="container-page">
        {/* the intro: the heading alone at the top left; under it, all
            sitting on one baseline, the short copy (left), the campus large
            (middle) and links to the page's sections (right) */}
        <div data-about-copy>
          <SectionHeading title={campus.name} align="left" />
        </div>
        <div className="mt-8 grid gap-8 lg:mt-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-12">
          <div className="max-lg:order-2">
            <h3 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] font-medium leading-snug tracking-[-0.02em] text-[var(--ab-fg)]">
              Four decades of excellence on a{" "}
              <span className="text-accent">70+ acre green campus</span>
            </h3>
            <p className="mt-4 max-w-[420px] text-[15px] leading-[1.65] text-[var(--ab-body)]">
              {campus.summary}
            </p>
          </div>

          {/* the university's main film (the virtual tour) in the middle;
              it opens in the player overlay */}
          {main && (
            <div className="max-lg:order-1">
              <MainFilm campus={campus} v={main} onPlay={setPlaying} />
            </div>
          )}

          <ul className="max-lg:order-3">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`group flex items-center justify-between gap-4 py-5 text-[15.5px] font-semibold text-[var(--ab-fg)] transition-colors hover:text-accent ${
                    i < LINKS.length - 1
                      ? "border-b border-[var(--ab-line)]"
                      : ""
                  }`}
                >
                  {l.label}
                  <span className="grid size-11 shrink-0 place-items-center rounded-[6px] border border-[var(--ab-line)] transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    <ArrowUpRight size={18} strokeWidth={2} aria-hidden />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* the campus, a group at a time */}
        <h3 className="mt-14 text-center font-display text-[clamp(1.25rem,2vw,1.75rem)] font-medium tracking-[-0.025em] text-[var(--ab-fg)] lg:mt-24">
          Campus <span className="text-accent">Facilities</span>
        </h3>

        {/* one tab per group, on one line (it scrolls sideways on a narrow
            phone) */}
        <div className="mt-6 flex justify-center lg:mt-8">
          <div
            role="tablist"
            aria-label="Campus facilities"
            className="flex max-w-full gap-1 overflow-x-auto rounded-[4px] border border-[var(--ab-line)] bg-[var(--ab-chip)] p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {campus.facilities.map((g, i) => (
              <button
                key={g.group}
                type="button"
                role="tab"
                aria-selected={i === group}
                onClick={() => setGroup(i)}
                className={`shrink-0 whitespace-nowrap rounded-[3px] px-2 py-1.5 text-[12.5px] font-semibold transition-colors duration-300 sm:px-3.5 sm:text-[13.5px] ${
                  i === group
                    ? "bg-[var(--ab-fg)] text-[var(--ab-bg)]"
                    : "text-[var(--ab-body)] hover:text-[var(--ab-fg)]"
                }`}
              >
                {/* on phones just the first word before "&", so all four fit */}
                <span className="sm:hidden">{g.group.split(" & ")[0]}</span>
                <span className="max-sm:hidden">{g.group}</span>
              </button>
            ))}
          </div>
        </div>

        {/* the group's three places: one large, two stacked (a swipeable row on phones) */}
        <ul
          key={group}
          data-bento
          role="tabpanel"
          className="mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto [scrollbar-width:none] max-lg:-mx-5 max-lg:px-5 lg:mt-8 lg:grid lg:h-[560px] lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:grid-rows-2 lg:gap-4 lg:overflow-visible"
        >
          {items.map((it, i) => (
            <li
              key={it.title}
              data-photo
              className={`group relative aspect-[4/5] w-[78vw] max-w-[340px] shrink-0 snap-center sm:aspect-[4/3] lg:aspect-auto lg:w-auto lg:max-w-none ${
                i === 0 ? "lg:row-span-2" : ""
              }`}
            >
              <div className="relative size-full overflow-hidden rounded-[6px] bg-ink">
                <div className="absolute inset-0">
                  <Image
                    src={`/images/campuses/${campus.slug}/${it.img}.webp`}
                    alt={it.title}
                    fill
                    quality={90}
                    sizes={
                      i === 0
                        ? "(min-width: 1024px) 60vw, 80vw"
                        : "(min-width: 1024px) 40vw, 80vw"
                    }
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_35%,rgba(0,0,0,0.5)_70%,rgba(0,0,0,0.85)_100%)] transition-opacity duration-500 [@media(hover:hover)]:opacity-80 [@media(hover:hover)]:group-hover:opacity-100"
                />
                <div
                  data-cap
                  className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6"
                >
                  <h3
                    className={`font-display font-medium leading-tight tracking-[-0.02em] ${
                      i === 0
                        ? "text-[clamp(1.125rem,2vw,1.625rem)]"
                        : "text-[clamp(1.0625rem,1.5vw,1.25rem)]"
                    }`}
                  >
                    {it.title}
                  </h3>
                  {/* the line: always shown on touch screens, revealed on hover elsewhere */}
                  <div className="grid grid-rows-[1fr] transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)]:grid-rows-[0fr] [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100">
                    <p className="min-h-0 overflow-hidden">
                      <span className="block max-w-[420px] pt-1.5 text-[13px] leading-snug text-white/85 lg:text-[14px]">
                        {it.text}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {playing && (
        <VideoPlayer video={playing} onClose={() => setPlaying(null)} />
      )}
    </section>
  );
}

/** the main film in the intro, tall like the reference's photo: it plays
 *  silently on a loop (cropped to cover the frame, the campus still showing
 *  until it starts), and a click opens it with sound in the player overlay */
function MainFilm({
  campus,
  v,
  onPlay,
}: {
  campus: Campus;
  v: Campus["videos"][number];
  onPlay: (v: Video) => void;
}) {
  const [on, setOn] = useState(false);
  const thumb = `/images/campuses/${campus.slug}/${v.thumb}.webp`;
  return (
    <button
      type="button"
      onClick={() =>
        onPlay({
          id: v.vimeo,
          name: v.title,
          thumb,
          src: `https://player.vimeo.com/video/${v.vimeo}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`,
        })
      }
      aria-label={`Play: ${v.title}`}
      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[8px] bg-ink outline-none [container-type:size] focus-visible:ring-2 focus-visible:ring-accent lg:aspect-[8/7]"
    >
      {/* the campus still until the film starts (the film's own thumbnail
          has its title across it, which this frame would crop) */}
      <Image
        src={campus.poster}
        alt=""
        fill
        quality={90}
        sizes="(min-width: 1024px) 40vw, 100vw"
        className="object-cover"
      />
      {/* the 16:9 film, sized to cover the frame whatever its shape */}
      <iframe
        src={`https://player.vimeo.com/video/${v.vimeo}?background=1&autoplay=1&loop=1&muted=1&dnt=1`}
        title={`${v.title} (silent preview)`}
        allow="autoplay; fullscreen; picture-in-picture"
        loading="lazy"
        tabIndex={-1}
        onLoad={() => setOn(true)}
        className={`pointer-events-none absolute left-1/2 top-1/2 h-[max(100cqh,56.25cqw)] w-[max(100cqw,177.78cqh)] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${
          on ? "opacity-100" : "opacity-0"
        }`}
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0)_45%)] transition-colors duration-300 group-hover:bg-black/20"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink transition-all duration-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-white lg:size-[72px]"
      >
        <Play
          size={22}
          fill="currentColor"
          strokeWidth={0}
          className="translate-x-[1px]"
        />
      </span>
      <span className="absolute bottom-4 left-5 text-left text-[15px] font-semibold text-white lg:bottom-5 lg:left-6">
        {v.title}
      </span>
    </button>
  );
}
