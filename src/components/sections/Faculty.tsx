"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * "Taught by World's Top Tech and Academic Minds"
 *
 * Names and roles are sot.upgrad.com's (all 21 faculty).
 *
 * Layout after "Hear from Our Faculty about What They Teach" on
 * mastersunion.org, on black: the heading centred (light weight, the key
 * phrases heavier) with the intro under it; below, a coverflow of cards, and
 * under the cards the round prev/next arrows, centred. The active card sits centred at full
 * size; its neighbours step out to each side, smaller and dimmer, three deep,
 * the rest hidden. Fades into the black soften the strip's edges.
 *
 * Posters (public/images/faculty/posters-v6) are made in Masters' Union's card
 * style by scripts/faculty-posters, on the live site's card ground (near-black
 * frosted glass), with the cut-out portrait at the foot. Over each sit the
 * person's company logos (all of them, as sot.upgrad.com lists them) in white,
 * sized off the card so they keep a clear margin, with their name big under
 * them, both centred above the portrait; and the designation, small at the
 * foot. The cards are square-cornered, with the live site's "selection"
 * handles on all four corners and a fine light edge.
 *
 * The coverflow loops: arrows, a click on a side card, the arrow keys and a
 * horizontal swipe all move it, and it advances on its own every few seconds
 * until someone interacts with it.
 */
type Person = { name: string; role: string; img: string };

const FACULTY: Person[] = [
  { name: "Vishwa Mohan", role: "CEO of upGrad SOT", img: "vishwa-mohan" },
  {
    name: "Rishi Saraf",
    role: "Cofounder & CEO DevDynamics",
    img: "rishi-saraf",
  },
  {
    name: "Gaurav Kaushik",
    role: "Senior Staff Software Engineer & Problem Solving Track Lead",
    img: "gaurav-kaushik",
  },
  {
    name: "Gladden Rumao",
    role: "Staff Software AI Engineer",
    img: "gladden-rumao",
  },
  {
    name: "Jyoti Nigam",
    role: "Data Scientist at upGrad SOT",
    img: "jyoti-nigam",
  },
  {
    name: "Rishabh Bafna",
    role: "Senior AI Engineer & Lead Instructor",
    img: "rishabh-bafna",
  },
  { name: "Mithun S", role: "SDE II at Cisco", img: "mithun-s" },
  {
    name: "Piyush Jain",
    role: "Senior Mathematician and Lead Instructor",
    img: "piyush-jain",
  },
  {
    name: "Bhavishya Rao",
    role: "Mathematics Teaching Assistant",
    img: "bhavishya-rao",
  },
  { name: "Akash Tiwari", role: "SDE + Instructor", img: "akash-tiwari" },
  { name: "Rahul Yadav", role: "SDE 2 + Lead Instructor", img: "rahul-yadav" },
  { name: "Deepak Mishra", role: "SDE + Instructor", img: "deepak-mishra" },
  {
    name: "Drishti Aggarwal",
    role: "SDE + Instructor",
    img: "drishti-aggarwal",
  },
  {
    name: "Dhanshree",
    role: "Mathematics Teaching Assistant",
    img: "dhanshree",
  },
  { name: "Simran Pathania", role: "SDE + SME", img: "simran-pathania" },
  { name: "Jai Prasad B", role: "SDE + Instructor", img: "jai-prasad-b" },
  { name: "Avinash Agrawal", role: "SDE + Instructor", img: "avinash-agrawal" },
  {
    name: "Shivam Shrivastava",
    role: "SDE + Instructor",
    img: "shivam-shrivastava",
  },
  {
    name: "Ananya Saini",
    role: "Mathematics Teaching Assistant",
    img: "ananya-saini",
  },
  {
    name: "Shivam Pandey",
    role: "Mathematics Teaching Assistant",
    img: "shivam-pandey",
  },
  { name: "Yash Gautam", role: "SDE + Instructor", img: "yash-gautam" },
];

/** per step out from the centre: offset (in card widths), scale, brightness
 *  and opacity — Masters' Union's coverflow values */
const STEPS = [
  { x: 0, scale: 1, bright: 1, alpha: 1 },
  { x: 1, scale: 0.89, bright: 0.9, alpha: 0.88 },
  { x: 1.89, scale: 0.78, bright: 0.75, alpha: 0.72 },
  { x: 2.66, scale: 0.68, bright: 0.6, alpha: 0.5 },
];
const AUTOPLAY_MS = 3500;

/** company logos as sot.upgrad.com shows them per faculty member
 *  (public/images/faculty/logos); w/h are the files' pixel sizes */
const LOGOS = {
  // the white-lettered version, to sit straight on the dark poster
  upgradsot: {
    src: "/images/logo-sot-white.png",
    alt: "upGrad School of Technology",
    w: 467,
    h: 144,
  },
  linkedin: { src: "linkedin.webp", alt: "LinkedIn", w: 614, h: 177 },
  walmart: { src: "walmart.webp", alt: "Walmart", w: 681, h: 177 },
  paypal: { src: "paypal.webp", alt: "PayPal", w: 638, h: 177 },
  oracle: { src: "oracle.webp", alt: "Oracle", w: 1033, h: 177 },
  pw: { src: "pw.webp", alt: "PhysicsWallah", w: 100, h: 100 },
  hotstar: { src: "hotstar.webp", alt: "Hotstar", w: 300, h: 100 },
  vmware: { src: "vmware.webp", alt: "VMware", w: 511, h: 100 },
  salesforce: { src: "salesforce.webp", alt: "Salesforce", w: 259, h: 177 },
  microsoft: { src: "microsoft.webp", alt: "Microsoft", w: 734, h: 177 },
  barclays: { src: "barclays.webp", alt: "Barclays", w: 513, h: 100 },
  cisco: { src: "cisco_dark.webp", alt: "Cisco", w: 176, h: 100 },
  ineuron: { src: "ineuron.webp", alt: "iNeuron", w: 367, h: 100 },
  krmangalam: {
    src: "kr-mangalam.png",
    alt: "K.R. Mangalam University",
    w: 128,
    h: 128,
  },
} as const;
type LogoKey = keyof typeof LOGOS;

/** everyone else on sot.upgrad.com carries the upGrad SOT logo alone */
const COMPANIES: Record<string, LogoKey[]> = {
  "vishwa-mohan": [
    "upgradsot",
    "linkedin",
    "walmart",
    "paypal",
    "oracle",
    "pw",
  ],
  "rishi-saraf": ["upgradsot", "hotstar", "vmware", "walmart"],
  "gaurav-kaushik": ["salesforce", "microsoft", "paypal"],
  "gladden-rumao": ["upgradsot", "barclays"],
  "mithun-s": ["upgradsot", "cisco", "ineuron"],
  "akash-tiwari": ["upgradsot", "krmangalam"],
};
/** logo height, in card widths, by how many a card carries: one can be big,
 *  a full set of six shares two rows of three, all inside the logo row */
const logoHeightFor = (n: number) =>
  n === 1 ? 0.1 : n === 2 ? 0.075 : n === 3 ? 0.07 : 0.06;

/** rough width of one uppercase character, in em, for the fit below */
const CHAR_EM = 0.68;
/** the name's size and lines, in card widths: one line when it fits big
 *  enough, else two lines split where they balance best — never more, and
 *  never taller than the gap between the logos and the head */
function nameLayout(name: string) {
  const one = 0.9 / (name.length * CHAR_EM);
  if (one >= 0.08) return { size: Math.min(one, 0.13), lines: [name] };
  const words = name.split(" ");
  let best = [name];
  let widest = Infinity;
  for (let i = 1; i < words.length; i++) {
    const pair = [words.slice(0, i).join(" "), words.slice(i).join(" ")];
    const w = Math.max(...pair.map((l) => l.length));
    if (w < widest) [best, widest] = [pair, w];
  }
  return { size: Math.min(0.9 / (widest * CHAR_EM), 0.105), lines: best };
}

/** the name in big uppercase, centred, sized off the card width so the side
 *  cards' scale-down carries it */
function Name({ name }: { name: string }) {
  const { size, lines } = nameLayout(name);
  return (
    <span
      style={{ fontSize: `calc(var(--card-w) * ${size.toFixed(3)})` }}
      className="block w-full px-2 text-center font-extrabold uppercase leading-[0.95] tracking-[-0.035em] text-white [text-shadow:0_4px_14px_rgba(0,0,0,0.3)]"
    >
      {lines.map((l) => (
        <span key={l} className="block whitespace-nowrap">
          {l}
        </span>
      ))}
    </span>
  );
}

/** the person's company logos in white, centred above the name, as Masters'
 *  Union places its logo on its cards */
function Logos({ img }: { img: string }) {
  const keys = COMPANIES[img] ?? ["upgradsot"];
  const h = logoHeightFor(keys.length);
  return (
    <span className="flex w-full justify-center">
      {/* the logo row: 78% of the card, centred, so even six logos keep a
          clear margin to the card's edges */}
      <span className="flex w-[78%] flex-wrap items-center justify-center gap-x-[calc(var(--card-w)*0.035)] gap-y-[calc(var(--card-w)*0.03)]">
        {keys.map((k) => {
          const l = LOGOS[k];
          return (
            <Image
              key={k}
              src={
                l.src.startsWith("/") ? l.src : `/images/faculty/logos/${l.src}`
              }
              alt={l.alt}
              width={l.w}
              height={l.h}
              style={{
                height: `calc(var(--card-w) * ${h})`,
                width: `calc(var(--card-w) * ${((h * l.w) / l.h).toFixed(4)})`,
              }}
              className="object-contain brightness-0 invert"
            />
          );
        })}
      </span>
    </span>
  );
}

/** one of the four "selection" handles on the card's corners */
function Handle({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute z-[3] size-2.5 border border-ink bg-white ${className}`}
    />
  );
}

export function Faculty() {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const swipe = useRef<number | null>(null);
  const n = FACULTY.length;

  const go = (i: number) => setActive(((i % n) + n) % n);
  const step = (d: number) => {
    setAuto(false);
    go(active + d);
  };

  useEffect(() => {
    if (!auto || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = window.setInterval(
      () => setActive((a) => (a + 1) % n),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(t);
  }, [auto, n]);

  const onDown = (e: PointerEvent) => {
    swipe.current = e.clientX;
  };
  const onUp = (e: PointerEvent) => {
    if (swipe.current === null) return;
    const dx = e.clientX - swipe.current;
    swipe.current = null;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
  };

  const p = FACULTY[active];

  return (
    <section id="faculty" className="bg-black py-16 lg:py-20">
      <div className="container-page">
        <Reveal className="flex flex-col items-center text-center">
          <div className="max-w-[820px]">
            <h2 className="font-display text-[clamp(1.625rem,2.4vw,2rem)] font-normal leading-[1.25] tracking-[-0.02em] text-[#e5e5e5]">
              Taught by{" "}
              <span className="font-semibold text-white">
                World&rsquo;s Top Tech
              </span>{" "}
              and{" "}
              <span className="font-semibold text-accent">Academic Minds</span>
            </h2>
            <p className="mt-3 text-[15px] leading-[1.6] text-[#e5e5e5]/80 sm:text-[16px]">
              Industry experts and innovators who turn real-world experience
              into transformative learning.
            </p>
          </div>
        </Reveal>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Faculty"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") step(-1);
            if (e.key === "ArrowRight") step(1);
          }}
          onPointerDown={onDown}
          onPointerUp={onUp}
          onPointerCancel={() => (swipe.current = null)}
          className="relative mt-12 h-[calc(var(--card-h)+12px)] touch-pan-y select-none overflow-hidden outline-none [--card-h:calc(var(--card-w)*16/9)] [--card-w:200px] focus-visible:ring-2 focus-visible:ring-white/40 sm:[--card-w:236px] lg:mt-14 lg:[--card-w:256px]"
        >
          {/* fades into the black over the left and right edges */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-20 w-6 bg-gradient-to-r from-black to-transparent sm:w-12 lg:w-16"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-20 w-6 bg-gradient-to-l from-black to-transparent sm:w-12 lg:w-16"
          />
          {FACULTY.map((f, i) => {
            // shortest way round the loop from the active card
            let d = i - active;
            if (d > n / 2) d -= n;
            if (d < -n / 2) d += n;
            const s = STEPS[Math.min(Math.abs(d), STEPS.length - 1)];
            const hidden = Math.abs(d) >= STEPS.length;
            return (
              <button
                key={f.img}
                type="button"
                tabIndex={-1}
                aria-hidden={d !== 0}
                aria-label={`${f.name}, ${f.role}`}
                onClick={() => d !== 0 && step(d)}
                style={{
                  transform: `translateX(calc(${Math.sign(d) * s.x} * var(--card-w))) scale(${s.scale})`,
                  filter: `brightness(${s.bright})`,
                  opacity: hidden ? 0 : s.alpha,
                  zIndex: 10 - Math.abs(d),
                  pointerEvents: hidden ? "none" : undefined,
                }}
                className="absolute left-1/2 top-[6px] -ml-[calc(var(--card-w)/2)] h-[var(--card-h)] w-[var(--card-w)] transition-[transform,opacity,filter] duration-[520ms] ease-[cubic-bezier(0.32,0,0.2,1)]"
              >
                {/* the card itself, square-cornered */}
                <span className="absolute inset-0 overflow-hidden border border-white/20 bg-[#08080a]">
                  <Image
                    src={`/images/faculty/posters-v6/${f.img}.webp`}
                    alt=""
                    fill
                    sizes="256px"
                    draggable={false}
                    className="object-cover"
                  />
                  {/* logos, then the name big and centred under them, as
                      Masters' Union sets its logo and title */}
                  <span className="absolute inset-x-0 top-[9%] flex flex-col items-center gap-[calc(var(--card-w)*0.045)]">
                    <Logos img={f.img} />
                    <Name name={f.name} />
                  </span>
                  {/* the designation, small at the foot */}
                  <span className="absolute inset-x-3 bottom-[5%] text-balance text-center text-[11.5px] font-medium leading-snug text-white/90 [text-shadow:0_1px_4px_rgba(0,0,0,0.5)] sm:text-[12.5px]">
                    {f.role}
                  </span>
                </span>
                {/* "selection" handles on the four corners */}
                <Handle className="-left-[5px] -top-[5px]" />
                <Handle className="-right-[5px] -top-[5px]" />
                <Handle className="-bottom-[5px] -left-[5px]" />
                <Handle className="-bottom-[5px] -right-[5px]" />
              </button>
            );
          })}
        </div>

        {/* the arrows, centred under the cards */}
        <div className="mt-8 flex justify-center gap-3 lg:mt-10">
          {[
            { d: -1, label: "Previous faculty", Icon: ArrowLeft },
            { d: 1, label: "Next faculty", Icon: ArrowRight },
          ].map(({ d, label, Icon }) => (
            <button
              key={d}
              type="button"
              aria-label={label}
              onClick={() => step(d)}
              className="grid size-12 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              <Icon size={18} strokeWidth={2} aria-hidden />
            </button>
          ))}
        </div>

        {/* who's in the centre card, for screen readers */}
        <p aria-live="polite" className="sr-only">
          {p.name}, {p.role}
        </p>
      </div>
    </section>
  );
}
