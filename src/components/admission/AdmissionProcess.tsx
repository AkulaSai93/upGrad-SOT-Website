"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Check } from "lucide-react";
import { GlowButton } from "@/components/site/GlowButton";
import { SOT_URL } from "@/components/site/contact";

gsap.registerPlugin(useGSAP);

/**
 * "Admission Process"
 *
 * Copy is sot.upgrad.com/admission's own (read 16 Nov 2026): the lead-in, the
 * six steps and every line under each (the test slots, the reattempt
 * policy, the interview's areas and length, the result times, the seat
 * block fee, what the admission letter holds).
 *
 * Layout, after a client reference (lusion.co, "Bold Ideas, Brought to
 * Life"): an editorial run. A big headline on the left with the lead-in and
 * Apply on the right; then the six steps, each a warm golden-hour photo among greenery (Figma AI, SOT Website file) beside its text, swapping sides step by step (stacked on
 * phones). Through it all one thick red
 * ribbon draws itself as you scroll, as on lusion.co:
 * it enters from beyond the left edge level with the headline, sweeps down
 * behind the headline and the lead-in, drops behind each step's render,
 * loops round its bottom corner and sweeps on behind the text to the next,
 * and leaves through the last render, off the right edge; on phones the same, across the narrow
 * screen.
 *
 * Motion: the ribbon is drawn down to a line two-thirds down the screen;
 * each step rises in as it comes into view. Light throughout. Reduced
 * motion: the ribbon is shown whole and every step in place.
 */
type Step = {
  short: string;
  title: string;
  intro?: string;
  label?: string;
  items?: string[];
  slots?: string[];
  note?: { k: string; v: string };
};

const STEPS: Step[] = [
  {
    short: "Apply",
    title: "Submit Your Application Online",
    items: [
      "Register using your 10-digit mobile number",
      "Verify your email ID and create a password on your dashboard",
      "Pay the application fee of ₹1000 + GST",
      "Fill in personal details, academic background, and relevant profile information under uGNET form",
      "Upload available marksheets and documents",
      "Select your preferred uGNET test slot",
    ],
  },
  {
    short: "uGNET",
    title: "Appear for the uGSOT Entrance Test (uGNET)",
    items: [
      "This is an online, proctored entrance assessment",
      "It tests your aptitude, logical thinking, fundamentals of math, problem-solving and verbal aptitude.",
    ],
    slots: ["11:00 AM – 1:00 PM", "3:00 PM – 5:00 PM"],
    note: {
      k: "Reattempt Policy",
      v: "One reattempt is allowed by paying ₹500 (if you miss or fail in the first attempt)",
    },
  },
  {
    short: "Interview",
    title: "Attend the Personal Interview",
    intro:
      "Once you clear uGNET, you can schedule your 1-on-1 Personal Interview directly from the dashboard.",
    label: "Interview Evaluation Areas",
    items: [
      "Career clarity & motivation",
      "Communication skills",
      "Analytical and problem-solving ability",
      "Algorithmic and logical thinking",
    ],
    note: { k: "Duration", v: "~30 minutes" },
  },
  {
    short: "Test Score",
    title: "Test Scores",
    items: [
      "You will get the uGNET result within 2 days of the exam",
      "The final scorecard with the interview results will be available within 7 days.",
      "Results are accessible via the student dashboard.",
    ],
  },
  {
    short: "Seat Blocking",
    title: "Counselling & Seat Blocking",
    items: [
      "Students who clear all stages proceed to counselling",
      "Select your preferred campus and specialization",
      "Once done, block your seat with a fee of ₹50,000.",
    ],
  },
  {
    short: "Admission Letter",
    title: "Official Admission Letter",
    intro:
      "Once you block your seat, you will receive the official uGSOT Admission Letter, which includes:",
    items: [
      "Complete fee structure",
      "Scholarship details (if applicable)",
      "Required document list",
      "Next steps & onboarding timeline",
    ],
  },
];

/** the section's colours (light) */
const LIGHT = {
  "--ap-bg": "#ffffff",
  "--ap-fg": "#0b0d12",
  "--ap-body": "#3d4452",
  "--ap-muted": "#6b7280",
  "--ap-line": "rgba(0,0,0,0.08)",
  "--ap-chip": "#f6f7f9",
  "--ap-tick": "#fde8ec",
  "--ap-num": "rgba(0,0,0,0.14)",
};

/** a smooth curve through points (Catmull-Rom as cubic Béziers) */
function smooth(pts: { x: number; y: number }[]) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

export function AdmissionProcess() {
  const root = useRef<HTMLElement>(null);
  const run = useRef<HTMLDivElement>(null);
  // the ribbon, laid out from where the renders and the card actually sit
  const [d, setD] = useState("");

  useLayoutEffect(() => {
    const box = run.current;
    if (!box) return;
    const draw = () => {
      const o = box.getBoundingClientRect();
      const W = o.width;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const rect = (el: Element) => {
        const r = el.getBoundingClientRect();
        return {
          l: r.left - o.left,
          r: r.right - o.left,
          t: r.top - o.top,
          b: r.bottom - o.top,
          cx: r.left - o.left + r.width / 2,
        };
      };
      const imgs = [...box.querySelectorAll("[data-visual]")].map(rect);
      const rows = [...box.querySelectorAll("[data-wstep]")].map(rect);

      if (!imgs.length) return;
      const pts: { x: number; y: number }[] = [];
      const head = box.querySelector("[data-head]");
      const h = head ? rect(head) : { l: 0, r: W, t: 0, b: 0, cx: W / 2 };
      // as on lusion.co: in from beyond the left edge, level with the
      // headline, sweeping down and right behind the headline and the
      // lead-in towards the first render
      // (starting off the screen's left edge, not just the column's)
      const off = -o.left - 60;
      pts.push({ x: off, y: h.t + (h.b - h.t) * 0.22 });
      pts.push({ x: W * (wide ? 0.2 : 0.42), y: h.t + (h.b - h.t) * 0.5 });
      pts.push({ x: W * (wide ? 0.3 : 0.6), y: h.b + (wide ? 50 : 24) });
      imgs.forEach((im, i) => {
        const w = im.r - im.l;
        // which bottom corner it loops round: the outer one on desktop,
        // left and right in turn on phones
        const left = wide ? im.cx < W / 2 : i % 2 === 0;
        const R = Math.min(wide ? 150 : 78, w * 0.3);
        const s = left ? 1 : -1;
        const edge = left ? im.l : im.r;
        // drop in behind the render from the top
        pts.push({ x: im.cx - s * w * 0.15, y: im.t + 24 });
        if (i === imgs.length - 1) {
          // the last one: through it and away off the right edge, the way
          // it first came in from the left
          const h2 = im.b - im.t;
          pts.push({ x: im.cx - w * 0.05, y: im.b - h2 * 0.3 });
          if (wide) {
            // out under it, then a long sweep off the right edge
            // (kept inside the section's own bottom space)
            const floor = o.height + 8;
            pts.push({ x: im.cx + w * 0.15, y: Math.min(im.b + 40, floor) });
            pts.push({ x: im.r + 40, y: Math.min(im.b + 24, floor - 10) });
            pts.push({ x: W + o.left + 90, y: im.b - h2 * 0.2 });
          } else {
            // phones: the picture is the section's last thing, so leave
            // from behind it, off the right edge, never into the next
            // section
            pts.push({ x: W + o.left + 90, y: im.b - h2 * 0.45 });
          }
          return;
        }
        // out under it near the corner, a wide swing round the corner and
        // up its outer side, then back in behind it
        pts.push({ x: edge + s * w * 0.22, y: im.b + R * 0.55 });
        pts.push({ x: edge - s * R * 0.45, y: im.b + R * 0.35 });
        pts.push({ x: edge - s * R * 0.8, y: im.b - R * 0.6 });
        pts.push({ x: edge - s * R * 0.2, y: im.b - R * 1.35 });
        pts.push({ x: edge + s * R * 0.7, y: im.b - R * 1.1 });
        // then out under the far side, sweeping on to the next render
        // (behind the text, as on lusion.co)
        const next = rows[i + 1];
        if (wide) {
          pts.push({ x: im.cx + s * w * 0.3, y: im.b + R * 0.9 });
          if (next) {
            pts.push({
              x: W * (left ? 0.62 : 0.38),
              y: (rows[i].b + next.t) / 2 + 20,
            });
          }
        } else if (next) {
          // phones: one clean point below the picture, on the far side
          // (two close points here curled the ribbon into a knot)
          pts.push({ x: W * (left ? 0.72 : 0.28), y: im.b + R * 1.1 });
        }
      });
      setD(smooth(pts));
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // the ribbon draws and the steps wake, measured live on every scroll
  // (the sections above shift as their images load, so fixed trigger
  // points would go stale)
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const path =
          root.current?.querySelector<SVGPathElement>("[data-ribbon]");
        if (!path || !d) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        gsap.set(path, { strokeDashoffset: len });
        const setDraw = gsap.quickTo(path, "strokeDashoffset", {
          duration: 0.6,
          ease: "power2.out",
        });
        // how far down the ribbon has reached at points along its length
        // (the running lowest point, as it curls back up in places)
        const N = 500;
        const ys: number[] = [];
        let low = -Infinity;
        for (let k = 0; k <= N; k++) {
          low = Math.max(low, path.getPointAtLength((len * k) / N).y);
          ys.push(low);
        }
        const steps = gsap.utils.toArray<HTMLElement>("[data-wstep]");
        const update = () => {
          const box = run.current?.getBoundingClientRect();
          if (!box) return;
          const line = window.innerHeight * 0.66;
          const y = line - box.top;
          let k = 0;
          while (k < N && ys[k + 1] <= y) k++;
          setDraw(len * (1 - k / N));
          steps.forEach((el) =>
            el.toggleAttribute(
              "data-on",
              el.getBoundingClientRect().top < window.innerHeight * 0.96,
            ),
          );
        };
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
          window.removeEventListener("scroll", update);
          window.removeEventListener("resize", update);
        };
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.utils
          .toArray<HTMLElement>("[data-wstep]")
          .forEach((el) => el.setAttribute("data-on", ""));
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [d], revertOnUpdate: true },
  );

  return (
    <section
      ref={root}
      id="process"
      aria-labelledby="process-title"
      className="overflow-x-clip bg-[var(--ap-bg)] py-10 lg:py-16"
      style={LIGHT as React.CSSProperties}
    >
      <div className="container-page">
        <div ref={run} className="relative mx-auto max-w-[1120px]">
          {/* the ribbon, behind everything */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          >
            {d && (
              <path
                data-ribbon
                d={d}
                fill="none"
                stroke="#e4002b"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="[stroke-width:16px] lg:[stroke-width:26px]"
              />
            )}
          </svg>

          {/* the headline, and the lead-in with Apply */}
          <div
            data-head
            className="relative grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16"
          >
            <h2
              id="process-title"
              className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.045em] text-[var(--ap-fg)]"
            >
              Admission
              <br />
              Process
            </h2>
            <div className="lg:pb-3">
              <p className="max-w-[440px] text-[15.5px] leading-[1.65] text-[var(--ap-body)] lg:text-[16px]">
                A simple, transparent journey from application to admission.
              </p>
              <GlowButton
                href={`${SOT_URL}/admission`}
                streak="#0b0d12"
                className="mt-6 max-sm:w-full max-sm:[&>span:last-child]:w-full max-sm:[&>span:last-child]:justify-center"
              >
                Apply Now
                <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
              </GlowButton>
            </div>
          </div>

          {/* the steps, a render beside the text, sides swapping */}
          <ol className="relative mt-12 grid gap-14 lg:mt-16 lg:gap-20">
            {STEPS.map((s, i) => {
              const flip = i % 2 === 1;
              return (
                <li
                  key={s.title}
                  data-wstep
                  className="group grid items-center gap-6 lg:grid-cols-2 lg:gap-16"
                >
                  <div
                    data-visual
                    className={`relative aspect-[16/10] w-full translate-y-8 lg:max-w-[460px] overflow-hidden rounded-[10px] bg-[#eef0e6] opacity-0 transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[on]:translate-y-0 group-data-[on]:opacity-100 max-lg:order-2 ${flip ? "lg:order-2 lg:justify-self-end" : ""}`}
                  >
                    <Image
                      src={`/images/admission/step-v6-${i + 1}.webp`}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 540px, 100vw"
                      className="object-cover"
                    />
                  </div>

                  <div
                    data-text
                    className={`max-lg:order-1 translate-y-8 opacity-0 transition-[opacity,transform] delay-150 duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[on]:translate-y-0 group-data-[on]:opacity-100 ${flip ? "lg:order-1" : ""}`}
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="font-display text-[clamp(3rem,6vw,5rem)] font-medium leading-none tracking-[-0.05em] text-[var(--ap-num)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent">
                        Step {i + 1} of {STEPS.length}
                      </span>
                    </div>
                    <h3 className="mt-4 max-w-[480px] font-display text-[clamp(1.375rem,2.4vw,2rem)] font-medium leading-[1.15] tracking-[-0.025em] text-[var(--ap-fg)]">
                      {s.title}
                    </h3>
                    <StepBody s={s} />
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

/** a step's lines: intro, list, test slots and note */
function StepBody({ s }: { s: Step }) {
  return (
    <div className="max-w-[500px]">
      {s.intro && (
        <p className="mt-4 text-[15px] leading-[1.65] text-[var(--ap-body)]">
          {s.intro}
        </p>
      )}
      {s.label && (
        <p className="mt-4 text-[13.5px] font-semibold text-[var(--ap-fg)]">
          {s.label}
        </p>
      )}
      {s.items && (
        <ul className={`grid gap-2.5 ${s.label ? "mt-2.5" : "mt-5"}`}>
          {s.items.map((t) => (
            <li
              key={t}
              className="flex items-start gap-3 text-[14.5px] leading-snug text-[var(--ap-body)]"
            >
              <span className="mt-0.5 grid size-[18px] shrink-0 place-items-center rounded-full bg-[var(--ap-tick)] text-accent">
                <Check size={11} strokeWidth={3} aria-hidden />
              </span>
              {t}
            </li>
          ))}
        </ul>
      )}
      {s.slots && (
        <div className="mt-5">
          <p className="text-[13.5px] font-semibold text-[var(--ap-fg)]">
            There are two available slots:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {s.slots.map((t) => (
              <span
                key={t}
                className="rounded-[4px] border border-[var(--ap-line)] bg-[var(--ap-chip)] px-3 py-1.5 text-[13px] font-medium tabular-nums text-[var(--ap-fg)]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      )}
      {s.note && (
        <p className="mt-5 border-t border-[var(--ap-line)] pt-4 text-[13.5px] leading-[1.55] text-[var(--ap-body)]">
          <span className="font-semibold text-[var(--ap-fg)]">{s.note.k}:</span>{" "}
          {s.note.v}
        </p>
      )}
    </div>
  );
}
