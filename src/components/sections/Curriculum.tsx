"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Reveal } from "@/components/motion/Reveal";
import { lenis } from "@/components/motion/SmoothScroll";
import { CornerHandles } from "@/components/site/CornerHandles";
import { SectionHeading } from "@/components/site/SectionHeading";
import { VideoPlayer, type Video } from "@/components/site/VideoPlayer";
import { Minus, Play, Plus } from "lucide-react";

gsap.registerPlugin(useGSAP);

/**
 * "Build Industry-Preferred Skills Through Practical Learning"
 *
 * Copy, subjects, skills and projects are sot.upgrad.com's (project lines
 * shortened). Project pictures are the 24 illustrations from the client's
 * Figma file (WwyVkKp6ax6XLGEw9hVViH, nodes 5:2 to 5:25, in project order),
 * each on its own colour gradient (/images/curriculum/figma).
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

/** a pillar's column: its number big in red, its title and line */
function PillarColumn({ pillar, index }: { pillar: Pillar; index: number }) {
  return (
    <div className="relative lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:pl-7">
      <p className="font-display text-[clamp(3.5rem,5vw,4.5rem)] font-extrabold leading-none tracking-[-0.05em] text-accent">
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3 className="mt-3 text-[22px] font-bold leading-tight tracking-[-0.02em] text-ink">
        {pillar.title}
      </h3>
      <p className="mt-2 max-w-[280px] text-[14.5px] leading-[1.6] text-body">
        {pillar.body}
      </p>
    </div>
  );
}

/** a block's label in the year panel, with Scaler's accent bar */
function Label({
  children,
  tone = "accent",
}: {
  children: string;
  tone?: "accent" | "ink";
}) {
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

/** a year's content, after the curriculum on scaler.com/school-of-technology:
 *  its title and line, the projects slider, the skills as chips, and the
 *  subject list behind a "View Subject List" toggle. `skillsTone` colours the
 *  skills label (red in the tabbed card, Figma 38:6053) */
function YearBody({
  year,
  index,
  skillsTone = "ink",
  compact = false,
  hideTitle = false,
}: {
  year: Year;
  index: number;
  skillsTone?: "accent" | "ink";
  /** the tabbed card: tighter gaps between the blocks, and the title alone
   *  ("Foundations"), since the tab above already names the year */
  compact?: boolean;
  /** leave the title out (the accordion bar above already shows it) */
  hideTitle?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const gap = compact ? "mt-6" : "mt-8";
  return (
    <>
      {!hideTitle && (
        <h3 className="text-[clamp(1.375rem,2vw,1.75rem)] font-medium leading-[1.25] tracking-[-0.02em] text-ink">
          {compact ? year.title : `Year ${index + 1} : ${year.title}`}
        </h3>
      )}
      <p
        className={`${hideTitle ? "" : "mt-2"} text-[15px] leading-[1.6] text-body`}
      >
        {year.body}
      </p>

      <div className={gap}>
        <ProjectSlider projects={year.projects} />
      </div>

      <div className={gap}>
        <Label tone={skillsTone}>Skills you&rsquo;ll build</Label>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {year.skills.map((sk) => (
            <li
              key={sk}
              className="rounded-[4px] bg-[#f4f4f5] px-3.5 py-2 text-[14px] leading-[14px] text-[#3a3a3a]"
            >
              {sk}
            </li>
          ))}
        </ul>
      </div>

      {/* the black frame only shows once the list is open */}
      <div
        className={`${gap} overflow-hidden rounded-[4px] border transition-colors duration-300 ${
          open ? "border-black" : "border-transparent"
        }`}
      >
        {/* the toggle bar: a soft charcoal (ink on hover), white
            label and white book / double-chevron icons (Figma 20:4571) */}
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          // no browser focus ring on click (it drew a blue edge); keyboard
          // focus still shows, as a white inset ring on the black
          className="flex w-full items-center justify-between rounded-[4px] bg-[#2b2e36] px-5 py-4 text-left outline-none transition-colors duration-300 hover:bg-ink focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
        >
          <span className="flex items-center gap-2">
            <span className="relative size-6 shrink-0 overflow-clip">
              <span className="absolute inset-[12.5%_18.75%]">
                <span className="absolute inset-[-3.33%_-4%]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/curriculum/icons/subject-book-white.svg"
                    alt=""
                    className="block size-full max-w-none"
                  />
                </span>
              </span>
            </span>
            <span className="text-[14px] font-medium leading-[21.56px] text-white">
              View Subject List
            </span>
          </span>
          <span
            className={`relative size-6 shrink-0 overflow-clip transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          >
            <span className="absolute inset-y-1/4 left-[29.17%] right-[29.17%]">
              <span className="absolute inset-[-5%_-6%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/curriculum/icons/subject-chevrons-white.svg"
                  alt=""
                  className="block size-full max-w-none"
                />
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
                <li
                  key={sub}
                  className="flex gap-4 text-[14.5px] leading-snug text-ink"
                >
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
    </>
  );
}

type Pillar = {
  key: string;
  title: string;
  body: string;
  /** the label over its row of videos */
  label: string;
  videos: { id: string; title: string }[];
};

/** "What makes uGSOT built for the AI age", in four pillars, each with a row
 *  of Shorts from the school's YouTube channel (@upGradSchoolofTechnology)
 *  that shows it; thumbnails in /images/journey. Captions are shortened from
 *  the videos' titles. */
const PILLARS: Pillar[] = [
  {
    key: "y1",
    title: "Start Strong",
    body: "From day one: orientation, first-week guides and a founding batch building it together.",
    label: "On campus",
    videos: [
      { id: "LUiEPZiMc6M", title: "Founding Batch 2026–30 kicks off" },
      { id: "hC4YxBgeQ0E", title: "Orientation day on campus" },
      { id: "heOBtPAl24w", title: "First week of college survival guide" },
      { id: "8cT_bD0GTBg", title: "7 first-year mistakes to avoid" },
    ],
  },
  {
    key: "y2",
    title: "Learn By Building",
    body: "Coding battles, real projects, and building AI rather than just using it.",
    label: "Building",
    videos: [
      { id: "rnMH5swIn94", title: "A real student coding battle" },
      { id: "T5QwtXlf02Y", title: "Don’t wait for final year to build" },
      { id: "b_rZ-y54QKE", title: "Everyone uses AI. Who builds it?" },
      { id: "CHeadHnjVU4", title: "Build the model, not a wrapper app" },
    ],
  },
  {
    key: "y3",
    title: "Go Deep in AI & Quantum",
    body: "Get ahead on the tech that comes next, and land internships that get you hired.",
    label: "AI, quantum & internships",
    videos: [
      { id: "hYx1y8ilkWo", title: "Why learn quantum computing now" },
      {
        id: "sEF2j8xC91w",
        title: "If you knew how AI worked, what would you build?",
      },
      {
        id: "drNgH8I1RCE",
        title: "Degrees get interviews, internships get you hired",
      },
      { id: "pnjbJgI50-w", title: "International vs. Indian internships" },
    ],
  },
  {
    key: "y4",
    title: "Launch Your Career",
    body: "Hiring, startups and funding: be ready for what comes after graduation.",
    label: "Careers & startups",
    videos: [
      { id: "UfcYFWNynfc", title: "What tech hiring looks like now" },
      { id: "MqrKN3rYzc8", title: "When your university backs your startup" },
      { id: "ge_-IHtkR1g", title: "Why funding should come fifth, not first" },
      { id: "U9lIlNb6m7c", title: "Future-proof your career for 2030" },
    ],
  },
];

/** one Short, as on scaler.com's "What makes SST": the upright thumbnail
 *  with a play button, then its caption */
function VideoCard({
  v,
  onOpen,
}: {
  v: { id: string; title: string };
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Play video: ${v.title}`}
      className="group flex w-[180px] shrink-0 snap-start flex-col rounded-[4px] border border-line bg-white p-2 text-left outline-none transition-colors hover:border-ink focus-visible:ring-2 focus-visible:ring-accent sm:w-[196px]"
    >
      <span className="relative block aspect-[9/16] overflow-hidden rounded-[2px] bg-ink">
        <Image
          src={`/images/journey/${v.id}.webp`}
          alt=""
          fill
          sizes="200px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-accent"
        >
          <Play
            size={16}
            fill="currentColor"
            strokeWidth={0}
            className="translate-x-[1px]"
          />
        </span>
      </span>
      <span className="line-clamp-2 px-1 pb-1 pt-2.5 text-[13.5px] font-semibold leading-snug text-ink">
        {v.title}
      </span>
    </button>
  );
}

/** a year's Shorts in a sideways row with prev/next arrows (each greyed at
 *  its end); it swipes or scrolls by touch too */
function VideoRow({
  pillar,
  onOpen,
}: {
  pillar: Pillar;
  onOpen: (v: Video) => void;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  const videos = pillar.videos;

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
    const card = el.querySelector("button");
    const step = card
      ? card.getBoundingClientRect().width + 16
      : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-4">
        <Label>{`Watch: ${pillar.label}`}</Label>
        <div className="flex gap-2">
          {[
            {
              d: -1 as const,
              label: "Previous videos",
              icon: "arrow-prev",
              off: ends.start,
            },
            {
              d: 1 as const,
              label: "Next videos",
              icon: "arrow-next",
              off: ends.end,
            },
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
              <img
                src={`/images/curriculum/icons/${icon}.svg`}
                alt=""
                width={17}
                height={17}
              />
            </button>
          ))}
        </div>
      </div>
      <Reveal stagger={0.07} className="mt-4 overflow-hidden">
        <div
          ref={track}
          onScroll={sync}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {videos.map((v) => (
            <div key={v.id} data-reveal-item className="shrink-0">
              <VideoCard
                v={v}
                onOpen={() =>
                  onOpen({
                    id: v.id,
                    name: v.title,
                    thumb: `/images/journey/${v.id}.webp`,
                    vertical: true,
                  })
                }
              />
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/** one project: its coloured thumbnail (the client's Figma illustrations,
 *  each on its own gradient, /images/curriculum/figma), then its title and
 *  line */
function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      data-reveal-item
      className="group relative flex w-[260px] shrink-0 snap-start flex-col border border-[#cfd1d7] bg-white p-2.5 sm:w-[280px]"
    >
      <div className="relative aspect-video shrink-0 overflow-hidden rounded-[2px]">
        <Image
          src={`/images/curriculum/figma/${project.img}.webp`}
          alt=""
          fill
          sizes="280px"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3">
        <h4 className="text-balance text-[15px] font-semibold leading-[20.625px] tracking-[-0.025em] text-black">
          {project.title}
        </h4>
        <p className="mt-1 text-[13px] leading-[17.875px] text-body">
          {project.body}
        </p>
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
    const step = card
      ? card.getBoundingClientRect().width + 16
      : el.clientWidth * 0.8;
    el.scrollBy({
      left: dir * step * (el.clientWidth > 700 ? 2 : 1),
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Label>Projects you&rsquo;ll build</Label>
        <div className="flex gap-2">
          {[
            {
              d: -1 as const,
              label: "Previous projects",
              icon: "arrow-prev",
              off: ends.start,
            },
            {
              d: 1 as const,
              label: "Next projects",
              icon: "arrow-next",
              off: ends.end,
            },
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
              <img
                src={`/images/curriculum/icons/${icon}.svg`}
                alt=""
                width={17}
                height={17}
              />
            </button>
          ))}
        </div>
      </div>
      <Reveal stagger={0.07} className="mt-4 overflow-hidden">
        <div
          ref={track}
          onScroll={sync}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-1.5 px-1.5 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {projects.map((pr) => (
            <ProjectCard key={pr.img} project={pr} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}

/**
 * The curriculum as a tabbed card, Figma HOWFOSvIxaWIA2rZi55F0e node 38:6053:
 * under the site's centred heading, one white card (square corners, a thin
 * ink frame and a "selection" handle on each corner, as on the faculty
 * posters) holding a row of
 * four year tabs (the chosen one filled red, "YEAR - 1" over its title) and,
 * below them, that year's content: "Year 1 : Foundations" and its line, the
 * projects slider, the skills (label in red) and the "View Subject List"
 * toggle. Choosing a tab swaps the content in with a short rise. The tabs are
 * a real tablist (arrow keys move between them). Below lg the card becomes an
 * accordion as on Scaler's phone layout: a bar per year, the open one filled
 * red, its content under it.
 */
export function Curriculum() {
  const [active, setActive] = useState(0);
  // phones: which year's accordion is open (one at a time, or none)
  const [open, setOpen] = useState<number | null>(0);
  // the tapped bar and where it was on screen: when another year opens, the
  // one closing above it would pull it up the page, so the scroll is moved
  // by the same amount and the bar stays under the finger
  const pinned = useRef<{ el: HTMLElement; top: number } | null>(null);
  useLayoutEffect(() => {
    const p = pinned.current;
    pinned.current = null;
    if (!p) return;
    const shift = p.el.getBoundingClientRect().top - p.top;
    if (Math.abs(shift) < 1) return;
    const y = window.scrollY + shift;
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
    else window.scrollTo(0, y);
  }, [open]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const year = YEARS[active];

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (active + d + YEARS.length) % YEARS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="curriculum" className="bg-canvas py-8 lg:py-16">
      <div className="container-page">
        <SectionHeading
          title="Build Industry Preferred Skills Through"
          accent="Practical Learning"
          breakBeforeAccent
          // phones: two lines, "Build Industry Preferred Skills" /
          // "Through Practical Learning", sized to fit the screen
          phoneBreakBefore="Through"
          titleClassName="max-lg:text-[5.4vw]"
          intro="A structured learning journey designed with input from industry experts."
        />

        {/* phones and tablets: an accordion, one year per row, as on
            scaler.com's curriculum: the open year's bar filled red with a
            minus, the others white with a plus */}
        <div className="mt-10 flex flex-col gap-3 lg:hidden">
          {YEARS.map((y, i) => {
            const on = open === i;
            return (
              <div key={y.key} className="border border-[#cfd1d7] bg-white">
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`curriculum-acc-${y.key}`}
                  onClick={(e) => {
                    pinned.current = {
                      el: e.currentTarget,
                      top: e.currentTarget.getBoundingClientRect().top,
                    };
                    setOpen(on ? null : i);
                  }}
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 ${
                    on ? "bg-accent text-white" : "bg-white text-ink"
                  }`}
                >
                  <span
                    className={`grid size-10 shrink-0 place-items-center rounded-[4px] text-[14px] font-bold tabular-nums transition-colors duration-300 ${
                      on
                        ? "bg-white/15 text-white"
                        : "bg-accent-soft text-accent"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-[12px] font-semibold uppercase tracking-[0.12em] ${
                        on ? "text-white/80" : "text-muted"
                      }`}
                    >
                      Year {i + 1}
                    </span>
                    <span className="block text-[16px] font-semibold leading-tight">
                      {y.title}
                    </span>
                  </span>
                  {on ? (
                    <Minus size={20} strokeWidth={2} aria-hidden />
                  ) : (
                    <Plus size={20} strokeWidth={2} aria-hidden />
                  )}
                </button>
                {on && (
                  <div
                    id={`curriculum-acc-${y.key}`}
                    className="animate-rise px-4 pb-5 pt-4"
                  >
                    <YearBody
                      year={y}
                      index={i}
                      skillsTone="accent"
                      compact
                      hideTitle
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* desktop: the tabbed card */}
        <Reveal className="mt-12 hidden lg:mt-16 lg:block">
          <div className="relative mx-auto max-w-[1116px] border border-[#cfd1d7] bg-white p-5 sm:px-8 sm:py-6">
            <CornerHandles />
            {/* the year tabs */}
            <div
              role="tablist"
              aria-label="Curriculum years"
              onKeyDown={onKey}
              className="flex overflow-x-auto rounded-[4px] border border-[#e5e5e5] p-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {YEARS.map((y, i) => {
                const on = i === active;
                return (
                  <button
                    key={y.key}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`curriculum-tab-${y.key}`}
                    aria-selected={on}
                    aria-controls="curriculum-panel"
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(i)}
                    className={`min-w-[150px] flex-1 px-5 py-2.5 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60 ${
                      on
                        ? "bg-accent text-white"
                        : "bg-white text-[#525252] hover:bg-sunken"
                    } ${i === 0 ? "rounded-l-[3px]" : ""} ${i === YEARS.length - 1 ? "rounded-r-[3px]" : ""}`}
                  >
                    <span className="block text-[14px] uppercase leading-5 tracking-[0.35px]">
                      Year - {i + 1}
                    </span>
                    <span className="block text-[12px] leading-4 opacity-80">
                      {y.title}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* the chosen year; keyed so a new tab remounts it and rises in */}
            <div
              key={year.key}
              id="curriculum-panel"
              role="tabpanel"
              aria-labelledby={`curriculum-tab-${year.key}`}
              className="animate-rise mt-5"
            >
              <YearBody
                year={year}
                index={active}
                skillsTone="accent"
                compact
              />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * "What Makes uGSOT Built for the AI Age": four numbered pillars down a rail
 * (a red line fills it with the scroll), each pillar's column held beside a
 * sideways row of
 * Shorts from the school's YouTube channel, after "What makes SST India's
 * Ivy League for the AI Age" on scaler.com/school-of-technology (a numbered
 * pillar on the left, upright video cards with a play button and caption on
 * the right). Each video opens in the site's player in its 9:16 frame.
 */
export function CurriculumJourney() {
  const list = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<Video | null>(null);

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
        const p = r.height
          ? Math.min(1, Math.max(0, (mid - r.top) / r.height))
          : 0;
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
    <section id="curriculum-journey" className="bg-canvas py-8 lg:py-16">
      <div className="container-page">
        <SectionHeading
          title="What Makes uGSOT"
          accent="Built for the AI Age"
          // phones: the whole heading on one line, sized to fit
          titleClassName="max-lg:whitespace-nowrap max-lg:text-[4.6vw]"
          intro="See it for yourself: stories from our campus, students and leaders."
        />

        <div
          ref={list}
          className="relative mt-12 space-y-16 lg:mt-16 lg:space-y-24"
        >
          {/* one rail down the whole list (phones too) and the red line that
              fills it with the scroll, as on quadcse.com */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 !mt-0 w-[2px] bg-ink/10"
          />
          <span
            aria-hidden
            data-rail-fill
            // starts empty via transform, not Tailwind's scale-y-0: that sets
            // the separate CSS scale property, which would stack with GSAP's
            style={{ transform: "scaleY(0)" }}
            className="absolute inset-y-0 left-0 !mt-0 w-[2px] origin-top bg-accent will-change-transform"
          />
          {PILLARS.map((pillar, i) => (
            <div
              key={pillar.key}
              className="grid gap-6 pl-5 sm:pl-7 lg:grid-cols-[minmax(260px,320px)_1fr] lg:items-start lg:gap-12 lg:pl-0"
            >
              <PillarColumn pillar={pillar} index={i} />
              <VideoRow pillar={pillar} onOpen={setPlaying} />
            </div>
          ))}
        </div>
      </div>

      {playing && (
        <VideoPlayer video={playing} onClose={() => setPlaying(null)} />
      )}
    </section>
  );
}
