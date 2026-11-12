"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(useGSAP);

/**
 * "Build Industry-Preferred Skills Through Practical Learning"
 *
 * Copy, subjects, skills and projects are sot.upgrad.com's (project lines
 * shortened). Project pictures are the 24 illustrations from the client's
 * Figma file (WwyVkKp6ax6XLGEw9hVViH, nodes 5:2 to 5:25, in project order):
 * each one's white window body is cut out (/images/curriculum/panels) and set
 * as a browser window, with one shared title bar, on the faculty cards' black
 * frosted glass in place of the original colour gradients, lit like Scaler's
 * project thumbnails (soft glows top-left and bottom-right, a faint beam).
 *
 * Layout after "The people teaching" on quadcse.com: under the site's usual
 * centred heading, one row per year. A single grey rail runs down the left of
 * all four; beside it, held in view while its row scrolls past, the year's
 * number big in red, its title and line. On the right, the year's panel after Scaler's curriculum
 * (scaler.com/school-of-technology): "Year 1 : Foundations" and its line,
 * "Projects you'll build" as a sideways slider of cards with prev/next arrows,
 * "Skills you'll build" as chips, and the subjects behind a "View Subject
 * List" toggle. Below lg each row stacks: the year's column, then its panel.
 *
 * Motion: a red line fills the rail from the top, scrubbed by the scroll
 * (quadcse.com's); each row's cards rise in, staggered, as it scrolls into
 * view. Below lg each year's column keeps a short rule of its own instead.
 */
type Project = { title: string; body: string; img: string };
type Year = {
  key: string;
  label: string;
  title: string;
  body: string;
  subjects: string[];
  skills: string[];
  projects: Project[];
};

const YEARS: Year[] = [
  {
    key: "y1",
    label: "Year 1",
    title: "Foundations",
    body: "Build strong fundamentals in programming, math, and core computer science.",
    subjects: [
      "Python",
      "Engineering Mathematics I",
      "Web Essentials",
      "Data Structures & Algorithms I",
      "FrontEnd Development",
      "Engineering Mathematics II",
      "Java",
    ],
    skills: [
      "Python",
      "Java",
      "Engineering Mathematics",
      "DSA",
      "Frontend (HTML, CSS, JS, React)",
      "Linux",
      "Git & GitHub",
    ],
    projects: [
      {
        title: "Online Reporting & Flight Booking Platform",
        body: "Search, book and report on flights.",
        img: "y1-1",
      },
      {
        title: "Dynamic UI with JSON Configs",
        body: "Change layouts and forms without code.",
        img: "y1-2",
      },
      {
        title: "Distributed Payment Processor",
        body: "Fault-tolerant payments with reliable webhooks.",
        img: "y1-3",
      },
      {
        title: "API Gateway: Rate Limiting & Circuit Breaker",
        body: "Manage traffic and handle failures gracefully.",
        img: "y1-4",
      },
      {
        title: "Automated Assignment Evaluation System",
        body: "Auto-grade Python code with tests and CI.",
        img: "y1-5",
      },
      {
        title: "React-Based Student Dashboard",
        body: "Timetable, announcements and events in one view.",
        img: "y1-6",
      },
    ],
  },
  {
    key: "y2",
    label: "Year 2",
    title: "Core Tech",
    body: "Dive deep into algorithms, data structures, and system design fundamentals.",
    subjects: [
      "Engineering Mathematics III",
      "Data Structures & Algorithms II",
      "Database Management Systems",
      "Backend Development (MERN)",
      "Operating Systems",
      "Generative AI & Agentic Systems",
      "Cloud Computing Fundamentals",
    ],
    skills: [
      "Advanced DSA",
      "SQL & DBMS",
      "Backend (MERN)",
      "Operating Systems",
      "Generative AI",
      "Cloud Computing",
    ],
    projects: [
      {
        title: "Real-Time IoT Healthcare Management",
        body: "Live patient data from IoT devices.",
        img: "y2-1",
      },
      {
        title: "End-to-End Web Contact Center with WebRTC",
        body: "Browser-based calls with live agent management.",
        img: "y2-2",
      },
      {
        title: "Multi-Language Encrypted Chat Platform",
        body: "End-to-end encrypted, multi-language chat.",
        img: "y2-3",
      },
      {
        title: "Real-Time Collaborative Document Editor",
        body: "Many users editing one document live.",
        img: "y2-4",
      },
      {
        title: "Student Performance Analytics Dashboard",
        body: "Turn marks data into visual insights.",
        img: "y2-5",
      },
      {
        title: "IoT Smart Monitoring Setup",
        body: "Live temperature and humidity with alerts.",
        img: "y2-6",
      },
    ],
  },
  {
    key: "y3",
    label: "Year 3",
    title: "Advanced AI & Quantum",
    body: "Explore cutting-edge technologies including AI, ML, and quantum computing.",
    subjects: [
      "Internship I (6 Months)",
      "Compiler Design",
      "Artificial Intelligence",
      "Computer Organization & Architecture",
      "Deep Learning",
      "Cybersecurity Essentials",
      "Software Engineering",
      "Quantum Programming",
    ],
    skills: [
      "Compiler Design",
      "Artificial Intelligence",
      "Computer Architecture",
      "Deep Learning",
      "Software Engineering",
      "Quantum Programming",
    ],
    projects: [
      {
        title: "Automated Vulnerability Management",
        body: "Automate dependency scans and security patches.",
        img: "y3-1",
      },
      {
        title: "Multi-Tenant SaaS with Tenant Isolation",
        body: "One platform, securely isolated per organisation.",
        img: "y3-2",
      },
      {
        title: "Image Recognition Attendance System",
        body: "Mark attendance with face recognition.",
        img: "y3-3",
      },
      {
        title: "Smart Campus Navigation App",
        body: "Search and route around campus on a map.",
        img: "y3-4",
      },
      {
        title: "Cloud Deployment + Monitoring Pipeline",
        body: "Containerise, deploy and monitor with CI/CD.",
        img: "y3-5",
      },
      {
        title: "Fraud Detection for Transactions",
        body: "Flag suspicious transactions with ML.",
        img: "y3-6",
      },
    ],
  },
  {
    key: "y4",
    label: "Year 4",
    title: "Industry & Innovation",
    body: "Real-world industry projects and innovative solutions for complex problems.",
    subjects: [
      "Computer Networks",
      "Deep Learning",
      "Capstone Project Phase I",
      "Real-World Product Development & Agile Project Management",
      "Theory of Computation (TOC)",
      "IoT & Edge Computing for Intelligent Systems",
      "AI-Native Cloud Architecture & Distributed Systems",
      "Capstone Project Phase II",
    ],
    skills: [
      "Computer Networks",
      "Deep Learning",
      "Product Dev",
      "Agile",
      "Cloud & Distributed Systems",
      "Advanced DSA & System Design",
    ],
    projects: [
      {
        title: "Enterprise Helpdesk & Ticket System",
        body: "Track issues with roles, SLAs and dashboards.",
        img: "y4-1",
      },
      {
        title: "Supply Chain Tracker with Blockchain",
        body: "Tamper-proof shipment tracking.",
        img: "y4-2",
      },
      {
        title: "Smart Waste Segregation IoT System",
        body: "Sort waste with sensors and alerts.",
        img: "y4-3",
      },
      {
        title: "Credit Card Fraud Alert Platform",
        body: "Real-time fraud alerts on the cloud.",
        img: "y4-4",
      },
      {
        title: "Smart Parking System with Analytics",
        body: "Live parking availability and analytics.",
        img: "y4-5",
      },
      {
        title: "Personalized Learning Recommendation Engine",
        body: "Suggest courses from learner behaviour.",
        img: "y4-6",
      },
    ],
  },
];

/** the year's column: number, title and line */
function YearColumn({ year, index }: { year: Year; index: number }) {
  return (
    <div className="relative border-l border-line pl-5 sm:pl-7 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:border-0">
      {/* below lg, a red tick tops the column's own rule */}
      <span aria-hidden className="absolute -left-px top-0 h-16 w-[2px] bg-accent lg:hidden" />
      <p className="flex items-start font-display font-extrabold leading-none tracking-[-0.05em] text-accent">
        <span className="text-[clamp(3.5rem,5vw,4.5rem)]">{String(index + 1).padStart(2, "0")}</span>
        <span className="ml-1 mt-1.5 text-[12px] font-bold uppercase tracking-[0.12em]">Year</span>
      </p>
      <h3 className="mt-3 text-[20px] font-bold leading-tight tracking-[-0.02em] text-ink">
        {year.title}
      </h3>
      <p className="mt-2 max-w-[280px] text-[14.5px] leading-[1.6] text-body">{year.body}</p>
    </div>
  );
}

/** a block's label in the year panel, with Scaler's accent bar */
function Label({ children, tone = "accent" }: { children: string; tone?: "accent" | "ink" }) {
  return (
    <h4
      className={`border-l-[3px] border-accent pl-3 text-[17px] font-semibold leading-tight ${
        tone === "accent" ? "text-accent" : "text-ink"
      }`}
    >
      {children}
    </h4>
  );
}

/** the year's panel, after the curriculum on scaler.com/school-of-technology:
 *  its title and line, the projects slider, the skills as chips, and the
 *  subject list behind a "View Subject List" toggle */
function YearPanel({ year, index }: { year: Year; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="min-w-0 rounded-[8px] border-solid border-black bg-white p-5 sm:p-8"
      // Figma 20:4571: 1px top/left, 3px bottom/right
      style={{ borderWidth: "1px 3px 3px 1px" }}
    >
      <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] font-medium leading-[1.25] tracking-[-0.02em] text-ink">
        Year {index + 1} : {year.title}
      </h3>
      <p className="mt-2 text-[15px] leading-[1.6] text-body">{year.body}</p>

      <div className="mt-8">
        <ProjectSlider projects={year.projects} />
      </div>

      <div className="mt-8">
        <Label tone="ink">Skills you&rsquo;ll build</Label>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {year.skills.map((sk) => (
            <li
              key={sk}
              className="rounded-[4px] border-[0.5px] border-black bg-white/60 px-3.5 py-2 text-[14px] leading-[14px] text-ink"
            >
              {sk}
            </li>
          ))}
        </ul>
      </div>

      {/* the black frame only shows once the list is open */}
      <div
        className={`mt-8 overflow-hidden rounded-[4px] border transition-colors duration-300 ${
          open ? "border-black" : "border-transparent"
        }`}
      >
        {/* the toggle bar, from Figma (HOWFOSvIxaWIA2rZi55F0e, node 20:4571):
            a red gradient, white label and white book / double-chevron icons */}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          // no browser focus ring on click (it drew a blue edge); keyboard
          // focus still shows, as a white inset ring on the red
          className="flex w-full items-center justify-between rounded-[4px] px-5 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
          style={{
            backgroundImage:
              "linear-gradient(179.72deg, rgb(231, 0, 11) 2.94%, rgb(193, 0, 7) 50%, rgb(159, 7, 18) 97.06%), linear-gradient(90deg, #fff 0%, #fff 100%)",
          }}
        >
          <span className="flex items-center gap-2">
            <span className="relative size-6 shrink-0 overflow-clip">
              <span className="absolute inset-[12.5%_18.75%]">
                <span className="absolute inset-[-3.33%_-4%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/curriculum/icons/subject-book-white.svg" alt="" className="block size-full max-w-none" />
                </span>
              </span>
            </span>
            <span className="text-[14px] font-medium leading-[21.56px] text-white">View Subject List</span>
          </span>
          <span
            className={`relative size-6 shrink-0 overflow-clip transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <span className="absolute inset-y-1/4 left-[29.17%] right-[29.17%]">
              <span className="absolute inset-[-5%_-6%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/curriculum/icons/subject-chevrons-white.svg" alt="" className="block size-full max-w-none" />
              </span>
            </span>
          </span>
        </button>
        <div
          className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ol className="grid gap-x-8 gap-y-2.5 px-5 py-4 sm:grid-cols-2">
              {year.subjects.map((sub, i) => (
                <li key={sub} className="flex gap-4 text-[14.5px] leading-snug text-ink">
                  <span className="w-5 shrink-0 font-semibold tabular-nums text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {sub}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

/** the faculty cards' black frosted glass: a glossy sheen over near-black,
 *  the faintest lift at the foot */
const GLASS = [
  "linear-gradient(125deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 32%, rgba(255,255,255,0) 50%)",
  "linear-gradient(180deg, #040405 0%, #08080a 70%, rgba(20,21,24,0.96) 100%)",
].join(", ");

/** one project: its illustration as a browser window on black glass, then its
 *  title and line */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-reveal-item
      className="group flex w-[260px] shrink-0 snap-start flex-col rounded-[8px] border border-black bg-white p-2.5 sm:w-[280px]"
    >
      <div className="relative h-[145px] shrink-0 overflow-hidden rounded-[6px]" style={{ background: GLASS }}>
        {/* frosted vertical bands */}
        <span
          aria-hidden
          className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0)_0px,rgba(255,255,255,0.06)_10px,rgba(255,255,255,0.015)_22px,rgba(0,0,0,0.3)_34px,rgba(255,255,255,0)_44px)] blur-[3px]"
        />
        {/* soft light, as on Scaler's project thumbnails: a bright glow in
            from the top-left, a gentler one at the bottom-right, and a faint
            diagonal beam between; it brightens a touch on hover */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: [
              "radial-gradient(70% 90% at 0% 0%, rgba(255,255,255,0.32), rgba(255,255,255,0) 60%)",
              "radial-gradient(60% 80% at 100% 100%, rgba(255,255,255,0.16), rgba(255,255,255,0) 60%)",
              "linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.07) 46%, rgba(255,255,255,0) 62%)",
            ].join(", "),
          }}
        />
        {/* the window, in a soft glass frame: one title bar for all, then the
            illustration's white body (any spare room is the same white) */}
        <div className="absolute inset-x-[13%] inset-y-[9%] rounded-[7px] bg-white/10 p-[5px] ring-1 ring-white/15 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]">
          <div className="flex size-full flex-col overflow-hidden rounded-[4px] bg-white">
            <div className="flex h-[13px] shrink-0 items-center gap-[3px] bg-[#f3f4f6] px-[6px]">
              <span className="size-[4px] rounded-full bg-[#5fb878]" />
              <span className="size-[4px] rounded-full bg-[#f2c94c]" />
              <span className="size-[4px] rounded-full bg-[#e5484d]" />
            </div>
            <div className="relative min-h-0 flex-1">
              <Image
                src={`/images/curriculum/panels/${project.img}.webp`}
                alt=""
                fill
                sizes="200px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
        <h4 className="text-balance text-[15px] font-semibold leading-[20.625px] tracking-[-0.025em] text-black">{project.title}</h4>
        <p className="mt-1 text-[13px] leading-[17.875px] text-body">{project.body}</p>
      </div>
    </article>
  );
}

/** the year's projects in a sideways row: arrows step it a card or two at a
 *  time (each greyed at its end), and it swipes or scrolls by touch too */
function ProjectSlider({ projects }: { projects: Project[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });

  const sync = () => {
    const el = track.current;
    if (!el) return;
    setEnds({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  };

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const slide = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // one card and its gap, or two when the row is wide
    const card = el.querySelector("article");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * (el.clientWidth > 700 ? 2 : 1), behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Label>Projects you&rsquo;ll build</Label>
        <div className="flex gap-2">
          {[
            { d: -1 as const, label: "Previous projects", icon: "arrow-prev", off: ends.start },
            { d: 1 as const, label: "Next projects", icon: "arrow-next", off: ends.end },
          ].map(({ d, label, icon, off }) => (
            <button
              key={d}
              type="button"
              aria-label={label}
              disabled={off}
              onClick={() => slide(d)}
              className="grid size-10 place-items-center rounded-[4px] border border-[#d9d9d2] transition-colors hover:border-ink disabled:pointer-events-none disabled:opacity-35"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/images/curriculum/icons/${icon}.svg`} alt="" width={17} height={17} />
            </button>
          ))}
        </div>
      </div>
      <Reveal
        stagger={0.07}
        className="mt-4 overflow-hidden"
      >
        <div
          ref={track}
          onScroll={sync}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((pr) => (
            <ProjectCard key={pr.img} project={pr} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}

export function Curriculum() {
  const list = useRef<HTMLDivElement>(null);

  // the red line fills the rail as the years scroll by: empty when the list's
  // top reaches the middle of the screen, full when its bottom does. Measured
  // live on every scroll rather than from cached trigger positions, which go
  // stale as the sections above settle (images, the stacked Pathways cards)
  // and left the line already full
  useGSAP(
    () => {
      const el = list.current;
      const fill = el?.querySelector<HTMLElement>("[data-rail-fill]");
      if (!el || !fill) return;
      const update = () => {
        const r = el.getBoundingClientRect();
        const mid = window.innerHeight / 2;
        const p = r.height ? Math.min(1, Math.max(0, (mid - r.top) / r.height)) : 0;
        fill.style.transform = `scaleY(${p})`;
      };
      update();
      window.addEventListener("scroll", update, { passive: true });
      window.addEventListener("resize", update);
      return () => {
        window.removeEventListener("scroll", update);
        window.removeEventListener("resize", update);
      };
    },
    { scope: list },
  );

  return (
    <section id="curriculum" className="bg-canvas py-12 lg:py-28">
      <div className="container-page">
        <SectionHeading
          title="Build Industry Preferred Skills Through"
          accent="Practical Learning"
          breakBeforeAccent
          intro="A structured learning journey designed with input from industry experts."
        />

        <div ref={list} className="relative mt-12 space-y-16 lg:mt-16 lg:space-y-24">
          {/* from lg, one rail down the whole list and the red line that
              fills it with the scroll, as on quadcse.com */}
          <span aria-hidden className="absolute inset-y-0 left-0 !mt-0 hidden w-[2px] bg-ink/10 lg:block" />
          <span
            aria-hidden
            data-rail-fill
            // starts empty via transform, not Tailwind's scale-y-0: that sets
            // the separate CSS scale property, which would stack with GSAP's
            style={{ transform: "scaleY(0)" }}
            className="absolute inset-y-0 left-0 !mt-0 hidden w-[2px] origin-top bg-accent will-change-transform lg:block"
          />
          {YEARS.map((year, i) => (
            <div
              key={year.key}
              className="grid gap-8 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start lg:gap-12"
            >
              <YearColumn year={year} index={i} />
              <YearPanel year={year} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
