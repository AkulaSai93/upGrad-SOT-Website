"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * "Build Industry-Preferred Skills Through Practical Learning"
 *
 * Copy, subjects, skills and projects are sot.upgrad.com's (project lines
 * shortened). Project pictures (/images/curriculum/photos) are photo-style
 * scenes of students building each project, generated with Figma AI to stand
 * in until real photos of the campus are shot.
 *
 * Layout after "The people teaching" on quadcse.com: under the site's usual
 * centred heading, one row per year. A single grey rail runs down the left of
 * all four; beside it, on the left of each row and held in view while its
 * cards scroll past, the year's number big in red, its title and line. On the right, its
 * skills (chips) and subjects (a numbered list) side by side in one quiet
 * panel, and under them the year's six projects as a sideways slider of cards
 * (picture, title and line) with
 * prev/next arrows beside its label. Below lg each row
 * stacks: the year's column, then the rest.
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

/** a small label over each block on the right */
function Label({ children }: { children: string }) {
  return (
    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted">{children}</p>
  );
}

/** the year's skills and subjects, side by side in one quiet panel */
function SkillsAndSubjects({ year }: { year: Year }) {
  return (
    <div className="grid gap-6 rounded-[8px] border border-line bg-sunken/40 p-5 sm:p-6 md:grid-cols-2 md:gap-8">
      <div>
        <Label>Skills you&rsquo;ll build</Label>
        <ul className="mt-3 flex flex-wrap gap-2">
          {year.skills.map((sk) => (
            <li
              key={sk}
              className="rounded-[4px] border border-line bg-surface px-3 py-1.5 text-[13px] font-medium text-ink"
            >
              {sk}
            </li>
          ))}
        </ul>
      </div>
      <div className="md:border-l md:border-line md:pl-8">
        <Label>Subjects</Label>
        <ol className="mt-3 space-y-2">
          {year.subjects.map((sub, i) => (
            <li key={sub} className="flex gap-3 text-[13.5px] leading-snug text-ink">
              <span className="w-5 shrink-0 font-semibold tabular-nums text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {sub}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

/** one project: its picture, title and line */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-reveal-item
      className="group flex w-[260px] shrink-0 snap-start flex-col overflow-hidden rounded-[8px] sm:w-[280px] border border-line bg-surface shadow-[var(--shadow-sm)] transition-shadow duration-500 hover:shadow-[var(--shadow-md)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sunken">
        <Image
          src={`/images/curriculum/photos/${project.img}.webp`}
          alt=""
          fill
          sizes="280px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h4 className="text-[14.5px] font-bold leading-snug text-ink">{project.title}</h4>
        <p className="mt-1 text-[13px] leading-snug text-body">{project.body}</p>
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
            { d: -1 as const, label: "Previous projects", Icon: ArrowLeft, off: ends.start },
            { d: 1 as const, label: "Next projects", Icon: ArrowRight, off: ends.end },
          ].map(({ d, label, Icon, off }) => (
            <button
              key={d}
              type="button"
              aria-label={label}
              disabled={off}
              onClick={() => slide(d)}
              className="grid size-10 place-items-center rounded-[4px] border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35"
            >
              <Icon size={17} strokeWidth={2} aria-hidden />
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
  // top reaches the middle of the screen, full when its bottom does
  useGSAP(
    () => {
      gsap.fromTo(
        "[data-rail-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: list.current, start: "top center", end: "bottom center", scrub: true },
        },
      );
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
              <div className="min-w-0 space-y-8">
                <SkillsAndSubjects year={year} />
                <ProjectSlider projects={year.projects} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
