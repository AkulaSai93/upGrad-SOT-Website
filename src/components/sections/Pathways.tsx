"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Download } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(useGSAP);

/** the section's colours, white at rest and black once you are in it */
const LIGHT = { "--pw-bg": "#ffffff", "--heading-fg": "#0b0d12", "--heading-muted": "#3d4452" };
const DARK = { "--pw-bg": "#000000", "--heading-fg": "#ffffff", "--heading-muted": "rgba(255,255,255,0.65)" };

/**
 * "One Degree, Three Pathways"
 *
 * Layout and motion after "Learn 'Practically' by Building Real Businesses"
 * on mastersunion.org: the site's centred heading, then one big white card
 * per pathway, each with the site's black sticker edge. The section starts
 * white and fades to black once it reaches the middle of the screen (back to
 * white as you leave), the heading turning white with it. The cards are sticky at the same height under the
 * nav, so as you scroll each next card slides up over the last and they stack
 * (from lg; below it they simply follow one another).
 *
 * Each card: on the left a photo (Figma AI, public/images/pathways) under a
 * dark fade rising from the foot, the pathway's name set big and centred at its foot ("High Paying Jobs");
 * on the right a two-line title (the second line in
 * red, one type style throughout), a line of copy, two stat tiles (a small bar chart in one,
 * student faces in the other) and a red "Download Brochure" button with a light line running round its edge.
 *
 * Copy is sot.upgrad.com's; the figures are the site's own (3000+ hiring
 * partners, 110K+ placements, 300+ global universities). Startup support has
 * no published figures, so its tiles name what it offers instead.
 */
type Tile = { label: string; value: string; viz: "bars" | "faces" };
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
      { label: "Hiring Partners", value: "3000+", viz: "bars" },
      { label: "Placements", value: "110K+", viz: "faces" },
    ],
  },
  {
    key: "startup",
    tag: "Startup Support",
    title: ["Build Your Own Startup,", "While You Study"],
    body: "Launch your startup while you study, with mentorship, incubation and seed funding.",
    tiles: [
      { label: "From day one", value: "Mentorship", viz: "bars" },
      { label: "When you’re ready", value: "Seed Funding", viz: "faces" },
    ],
  },
  {
    key: "research",
    tag: "Research & Higher Studies",
    title: ["Research Today, Study at", "Top Global Universities"],
    body: "Build research skills and prepare for GRE, IELTS and top global universities.",
    tiles: [
      { label: "Global Universities", value: "300+", viz: "bars" },
      { label: "Test prep", value: "GRE & IELTS", viz: "faces" },
    ],
  },
];

const FACES = ["Aditya", "Ishan", "Mahadeb", "Sanskriti"];

/** a small rising bar chart, Masters' Union's "Revenue Generated" mark */
function Bars() {
  const heights = [28, 40, 34, 52, 62, 78, 92];
  return (
    <div aria-hidden className="mt-3 flex h-8 items-end gap-1">
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-2 rounded-t-[2px] bg-accent"
          style={{ height: `${h}%`, opacity: 0.35 + (i / heights.length) * 0.65 }}
        />
      ))}
    </div>
  );
}

/** a row of student faces, Masters' Union's "Participating Teams" mark */
function Faces() {
  return (
    <div aria-hidden className="mt-3 flex">
      {FACES.map((f, i) => (
        <span
          key={f}
          className="relative -ml-2 size-8 overflow-hidden rounded-full border-2 border-white bg-sunken first:ml-0"
          style={{ zIndex: FACES.length - i }}
        >
          <Image src={`/images/students/${f}.png`} alt="" fill sizes="32px" className="object-cover object-top" />
        </span>
      ))}
    </div>
  );
}

function Card({ path }: { path: Path }) {
  return (
    <article
      className="grid gap-6 rounded-[8px] border-solid border-black bg-white p-3 shadow-[0_-14px_30px_-12px_rgba(11,13,18,0.18)] sm:p-4 lg:min-h-[420px] lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:p-5"
      // the site's sticker edge: thin top/left, thicker bottom/right
      style={{ borderWidth: "1px 2.5px 2.5px 1px" }}
    >
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
        <p className="mt-3 max-w-[460px] text-[15px] leading-[1.6] text-body">{path.body}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {path.tiles.map((t) => (
            <div key={t.label} className="rounded-[8px] border border-line p-4">
              <p className="text-[13px] text-muted">{t.label}</p>
              <p className="mt-1 text-[clamp(1.125rem,1.7vw,1.5rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
                {t.value}
              </p>
              {t.viz === "bars" ? <Bars /> : <Faces />}
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
            style={{ backgroundImage: "conic-gradient(transparent 200deg, #ffffff)" }}
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
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const to = (vars: typeof LIGHT) =>
        gsap.to(el, { ...vars, duration: reduced ? 0 : 0.6, ease: "power2.out", overwrite: true });
      // measured live on every scroll (not cached trigger positions, which go
      // stale as the sticky cards and images settle), so the whole section,
      // every card included, stays black while it is on screen
      let dark: boolean | null = null;
      const check = () => {
        const r = el.getBoundingClientRect();
        const now = r.top < window.innerHeight * 0.55 && r.bottom > window.innerHeight * 0.45;
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
      className="bg-[var(--pw-bg)] py-16 lg:py-24"
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
            <Reveal key={path.key} className="lg:sticky lg:top-[calc(var(--header-h)+40px)]">
              <Card path={path} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
