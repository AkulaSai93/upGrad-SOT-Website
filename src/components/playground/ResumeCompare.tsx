"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  Globe,
  Mail,
  Phone,
  X,
} from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Before and after": one sample resume (a fictional student), as written
 * at first and as ResumeCraft rewrites it, laid one over the other with a
 * handle you drag across to wipe from one to the other.
 *
 * Layout: the heading and line; on desktop a bento of small cards on the
 * left (after a client reference: the ATS report, the points gained on the
 * hero's sky, the four fixes as key caps and a line on each) and the
 * comparison on the right; on phones the
 * comparison first, then the list. Each side carries a chip with its ATS
 * score (sample figures). The resumes are drawn in HTML at a fixed page
 * width and scaled to fit, so they look the same at every size.
 *
 * Interaction: drag (mouse, touch or pen), click anywhere on the page, or
 * use the arrow keys on the handle (it is a slider to screen readers). The
 * first time the section comes into view the handle sweeps once to show
 * it moves (skipped with reduced motion).
 */
/** the fixes, as short key caps */
const FIXES = ["Summary", "Impact", "Keywords", "Layout"];

/** each fix in a few words */
const CHANGES = [
  { title: "Summary", body: "a one-line pitch, not an objective" },
  { title: "Impact", body: "results with numbers, not tasks" },
  { title: "Keywords", body: "skills grouped the way ATS reads" },
  { title: "Layout", body: "one column, standard headings" },
];

/** the page's design width; the page is scaled to its frame */
const PAGE_W = 560;
const PAGE_H = 860;

type Entry = {
  title: string;
  date: string;
  sub: string;
  place?: string;
  bullets: string[];
};

type Resume = {
  coursework: string[];
  experience: Entry[];
  projects: Entry[];
  skills: { label: string; text: string }[];
  leadership: string[];
};

/** the same student, the same template; only the writing differs */
const BEFORE: Resume = {
  coursework: [
    "Data Structures",
    "DBMS",
    "OOP in Java",
    "Web Basics",
    "Maths",
    "C Programming",
  ],
  experience: [
    {
      title: "EdTech Startup",
      date: "May 2025 – Jul 2025",
      sub: "Web Development Intern",
      place: "Bengaluru, India",
      bullets: [
        "Worked on the company website.",
        "Did web development tasks and helped the team.",
        "Attended daily team meetings.",
        "Fixed some bugs on the website.",
        "Learnt React during the internship.",
      ],
    },
    {
      title: "Coding Club, upGrad School of Technology",
      date: "Aug 2024 – Present",
      sub: "Member",
      place: "Bengaluru, India",
      bullets: [
        "Part of the college coding club.",
        "Helped in organising events and workshops.",
        "Attended workshops conducted by seniors.",
      ],
    },
  ],
  projects: [
    {
      title: "Campus Events Website",
      sub: "HTML, CSS",
      date: "2024",
      bullets: ["Made a website for college events."],
    },
    {
      title: "Chatbot",
      sub: "Python",
      date: "2024",
      bullets: [
        "Worked on a chatbot project using Python.",
        "It answers basic questions from users.",
      ],
    },
    {
      title: "Library Management System",
      sub: "C",
      date: "2023",
      bullets: [
        "Made a library management system as a mini project.",
        "Used file handling in C to store the books.",
      ],
    },
  ],
  skills: [
    { label: "Languages", text: "C, Python, HTML, CSS" },
    {
      label: "Others",
      text: "MS Office, Teamwork, Hardworking, Quick learner",
    },
  ],
  leadership: [
    "Member of the college cricket team.",
    "Volunteered at the college fest.",
    "Participated in a hackathon.",
    "Member of the photography club.",
  ],
};

const AFTER: Resume = {
  coursework: [
    "Data Structures",
    "Algorithms",
    "DBMS",
    "Machine Learning",
    "Operating Systems",
    "Computer Networks",
    "System Design",
    "Cloud Computing",
  ],
  experience: [
    {
      title: "EdTech Startup",
      date: "May 2025 – Jul 2025",
      sub: "Web Development Intern",
      place: "Bengaluru, India",
      bullets: [
        "Built a React dashboard that cut weekly reporting time by 40% for a 12-person ops team.",
        "Integrated 6 REST APIs with retries and error handling; raised test coverage to 85%.",
        "Shipped 14 features over 6 sprints with Git, code review and GitHub Actions CI.",
        "Cut dashboard API latency from 900 ms to 250 ms with Redis query caching.",
      ],
    },
    {
      title: "Coding Club, upGrad School of Technology",
      date: "Aug 2024 – Present",
      sub: "Technical Lead",
      place: "Bengaluru, India",
      bullets: [
        "Lead a 25-member club; ran 10 workshops on Git, React and DSA for 300+ students.",
        "Organised a 24-hour hackathon with 40 teams and 3 industry judges.",
      ],
    },
  ],
  projects: [
    {
      title: "Campus Events Platform",
      sub: "Next.js, PostgreSQL, Tailwind",
      date: "2024",
      bullets: [
        "Built event sign-ups and email reminders used by 1,200+ students a month.",
        "Cut page load time by 60% with server rendering and image optimisation.",
      ],
    },
    {
      title: "AI Study Assistant",
      sub: "Python, LangChain, FastAPI",
      date: "2025",
      bullets: [
        "Built a RAG assistant over course notes; 92% of 5,000+ answers rated helpful.",
        "Deployed on AWS Lambda behind a FastAPI backend serving 300 daily users.",
      ],
    },
    {
      title: "Expense Splitter App",
      sub: "React Native, Firebase",
      date: "2023",
      bullets: [
        "Bill-splitting app with real-time sync on Firestore; 500+ downloads on Play Store.",
      ],
    },
  ],
  skills: [
    { label: "Languages", text: "Python, JavaScript, TypeScript, C++, SQL" },
    {
      label: "Frameworks",
      text: "React, Next.js, Node.js, FastAPI, Tailwind CSS",
    },
    { label: "Developer Tools", text: "Git, Docker, PostgreSQL, AWS, VS Code" },
  ],
  leadership: [
    "Finalist, Smart India Hackathon 2024: top 5 of 120 teams in the EdTech track.",
    "Volunteer tutor: taught Python basics to 40 school students over 8 weekends.",
    "Captain, college cricket team; led the side to the inter-college semi-finals.",
  ],
};

function Heading({ children }: { children: string }) {
  return (
    <p className="mt-3.5 border-b border-[#222] pb-px text-[16px] leading-tight">
      {children}
    </p>
  );
}

function Item({ e }: { e: Entry }) {
  return (
    <div className="mt-1.5">
      <p className="flex justify-between gap-3">
        <span>
          <b>{e.title}</b>
          {!e.place && <i> | {e.sub}</i>}
        </span>
        <b className="shrink-0">{e.date}</b>
      </p>
      {e.place && (
        <p className="flex justify-between italic">
          <span>{e.sub}</span>
          <span>{e.place}</span>
        </p>
      )}
      <ul className="list-disc pl-6">
        {e.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/** a classic one-column LaTeX-style resume (the client's reference) */
function Page({ r, stamp = false }: { r: Resume; stamp?: boolean }) {
  return (
    <div className="relative h-full bg-white px-8 py-8 font-serif text-[13px] leading-[1.45] text-[#1a1a1a]">
      <p className="text-center text-[26px] leading-none tracking-[0.02em] [font-variant:small-caps]">
        Aarav Mehta
      </p>
      <p className="mt-1 text-center text-[11px]">
        Bengaluru, Karnataka, India
      </p>
      <p className="mt-0.5 flex flex-wrap justify-center gap-x-3 text-[10.5px]">
        <span className="inline-flex items-center gap-1">
          <Phone size={9} aria-hidden /> 98765-43210
        </span>
        <span className="inline-flex items-center gap-1 underline">
          <Mail size={9} aria-hidden /> aarav.mehta@email.com
        </span>
        <span className="inline-flex items-center gap-1 underline">
          <Globe size={9} aria-hidden /> aaravmehta.dev
        </span>
      </p>

      <Heading>Education</Heading>
      <div className="mt-1.5">
        <p className="flex justify-between">
          <b>upGrad School of Technology</b>
          <b>Aug. 2023 – May 2027</b>
        </p>
        <p className="flex justify-between italic">
          <span>B.Tech in Computer Science and Engineering</span>
          <span>Bengaluru, India</span>
        </p>
      </div>

      <Heading>Relevant Coursework</Heading>
      <ul className="mt-1 grid list-disc grid-cols-4 gap-x-4 pl-6">
        {r.coursework.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <Heading>Experience</Heading>
      {r.experience.map((e) => (
        <Item key={e.title} e={e} />
      ))}

      <Heading>Projects</Heading>
      {r.projects.map((e) => (
        <Item key={e.title} e={e} />
      ))}

      <Heading>Technical Skills</Heading>
      <div className="mt-1 pl-2">
        {r.skills.map((k) => (
          <p key={k.label}>
            <b>{k.label}:</b> {k.text}
          </p>
        ))}
      </div>

      <Heading>Leadership / Extracurricular</Heading>
      <ul className="mt-1 list-disc pl-6">
        {r.leadership.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      {/* the rewritten one gets the stamp */}
      {stamp && (
        <span
          aria-hidden
          className="absolute left-[22%] top-[44%] -rotate-[14deg] rounded-[6px] border-[5px] border-[#1d8a3e] px-5 py-1 font-sans text-[46px] font-black uppercase leading-none tracking-[0.06em] text-[#1d8a3e] opacity-80 mix-blend-multiply"
        >
          Selected
        </span>
      )}
    </div>
  );
}

export function ResumeCompare({ id = "before-after" }: { id?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const [scale, setScale] = useState(1);
  const [pageH, setPageH] = useState(PAGE_H);
  const dragging = useRef(false);

  // the page is drawn at PAGE_W and scaled to the frame
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const k = el.clientWidth / PAGE_W;
      setScale(k);
      // the page runs the frame's full height, however tall the cards beside it
      setPageH(Math.max(PAGE_H, el.clientHeight / k));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // once in view, the handle sweeps to show it moves
  useEffect(() => {
    const el = frame.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const o = { v: 50 };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        gsap
          .timeline({
            onUpdate: () => {
              if (!dragging.current) setPos(o.v);
            },
          })
          .to(o, { v: 78, duration: 0.9, ease: "power2.inOut" })
          .to(o, { v: 24, duration: 1.1, ease: "power2.inOut" })
          .to(o, { v: 50, duration: 0.8, ease: "power2.inOut" });
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const moveTo = (clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <section id={id} className="bg-canvas py-10 lg:py-14">
      <div className="container-page">
        <SectionHeading
          title="See the"
          accent="Difference"
          intro="Drag the slider to watch a basic resume become one that recruiters, and their ATS, will read."
        />

        <div className="mx-auto mt-8 grid max-w-[1100px] items-stretch gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-10">
          {/* what changes, as a bento of small cards (after a client
              reference): the ATS report, the points gained, the fixes */}
          <div className="order-2 grid grid-cols-2 gap-3 lg:order-1 lg:h-full lg:grid-rows-[1fr_auto_auto]">
            {/* the report */}
            <div className="flex flex-col overflow-hidden rounded-[10px] border border-black/[0.08] bg-white">
              <div className="flex items-center justify-between border-b border-black/[0.06] bg-[#f6f7f9] px-4 py-2.5 text-[12.5px] text-body">
                ATS Report
                <X size={14} aria-hidden className="text-muted" />
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="flex items-center gap-1.5 text-[12px] text-body">
                  <FileCheck2 size={14} aria-hidden className="text-accent" />
                  aarav-mehta-resume.pdf
                </p>
                <p className="mt-2 font-display text-[clamp(1.375rem,2vw,1.75rem)] font-medium leading-none tracking-[-0.03em] text-ink">
                  42 <span className="text-muted">→</span>{" "}
                  <span className="text-accent">91</span>
                </p>
                <p className="mt-1.5 text-[12.5px] text-body">
                  ATS score, before and after
                </p>
                <div className="mt-3 border-t border-black/[0.06] pt-3 text-[12px] text-muted">
                  Keywords matched: <b className="text-ink">18 of 20</b>
                </div>
                <span className="mt-4 inline-flex w-fit items-center rounded-[6px] bg-ink px-3.5 py-2 text-[12.5px] font-semibold text-white">
                  View report
                </span>
              </div>
            </div>

            {/* the points gained, on the hero's sky */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-[10px] bg-[linear-gradient(160deg,#cfe6fa_0%,#a9d2f5_55%,#8fc3f2_100%)] p-4">
              <p className="flex items-center gap-1 font-display text-[clamp(2.25rem,3.6vw,3rem)] font-medium leading-none tracking-[-0.04em] text-ink">
                +49
                <span className="flex text-ink/40" aria-hidden>
                  <ChevronRight size={26} strokeWidth={1.6} />
                  <ChevronRight size={26} strokeWidth={1.6} className="-ml-4" />
                  <ChevronRight size={26} strokeWidth={1.6} className="-ml-4" />
                </span>
              </p>
              <p className="mt-10 text-[13px] leading-snug text-[#1f3d55]">
                ATS points gained on this resume, in one pass of the agent.
              </p>
            </div>

            {/* the fixes, as key caps */}
            <div className="col-span-2 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-black/[0.08] bg-white p-4 sm:p-5">
              <div>
                <p className="font-display text-[17px] font-medium text-ink">
                  Four fixes
                </p>
                <p className="mt-0.5 text-[13px] text-body">
                  What the agent changed on the page
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {FIXES.map((f) => (
                  <li
                    key={f}
                    className="rounded-[6px] border border-black/[0.06] bg-[#f3f5f7] px-3 py-2 text-[12.5px] font-medium text-ink shadow-[inset_0_-2px_0_rgba(11,13,18,0.06)]"
                  >
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* each fix in a line */}
            <ul className="col-span-2 grid gap-2.5 rounded-[10px] border border-black/[0.08] bg-white p-4 sm:p-5">
              {CHANGES.map((c) => (
                <li key={c.title} className="flex items-center gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent/10 text-accent">
                    <Check size={12} strokeWidth={2.8} aria-hidden />
                  </span>
                  <span className="text-[13.5px] leading-snug text-body">
                    <b className="font-medium text-ink">{c.title}:</b> {c.body}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* the comparison */}
          <div className="order-1 flex flex-col lg:order-2">
            <div className="flex flex-1 flex-col rounded-[8px] bg-[#f3f5f7] p-3 sm:p-4">
              <div
                ref={frame}
                onPointerDown={(e) => {
                  dragging.current = true;
                  e.currentTarget.setPointerCapture(e.pointerId);
                  moveTo(e.clientX);
                }}
                onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
                onPointerUp={() => (dragging.current = false)}
                onPointerCancel={() => (dragging.current = false)}
                className="relative aspect-[560/860] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[4px] shadow-[0_12px_32px_-14px_rgba(11,13,18,0.3)]"
              >
                {/* before, underneath */}
                <div
                  className="absolute left-0 top-0 origin-top-left"
                  style={{
                    width: PAGE_W,
                    height: pageH,
                    transform: `scale(${scale})`,
                  }}
                >
                  <Page r={BEFORE} />
                </div>
                {/* after, on top, wiped in from the left */}
                <div
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
                >
                  <div
                    className="absolute left-0 top-0 origin-top-left"
                    style={{
                      width: PAGE_W,
                      height: pageH,
                      transform: `scale(${scale})`,
                    }}
                  >
                    <Page r={AFTER} stamp />
                  </div>
                </div>

                {/* the chips */}
                <span className="pointer-events-none absolute bottom-3 left-3 rounded-[4px] bg-ink px-2.5 py-1 text-[11.5px] font-semibold text-white">
                  After · ATS 91
                </span>
                <span className="pointer-events-none absolute bottom-3 right-3 rounded-[4px] border border-black/[0.08] bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink shadow-[0_2px_8px_rgba(0,0,0,0.12)]">
                  Before · ATS 42
                </span>

                {/* the handle */}
                <div
                  className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-accent"
                  style={{ left: `${pos}%` }}
                >
                  <button
                    type="button"
                    role="slider"
                    aria-label="Compare before and after"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(pos)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft")
                        setPos((p) => Math.max(0, p - 5));
                      if (e.key === "ArrowRight")
                        setPos((p) => Math.min(100, p + 5));
                    }}
                    className="pointer-events-auto absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-[0_6px_18px_rgba(228,0,43,0.4)] outline-none ring-white focus-visible:ring-2"
                  >
                    <span className="flex">
                      <ChevronLeft size={15} strokeWidth={2.6} aria-hidden />
                      <ChevronRight size={15} strokeWidth={2.6} aria-hidden />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
