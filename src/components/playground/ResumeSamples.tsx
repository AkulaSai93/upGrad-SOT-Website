"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Choose a Sample Resume": a gallery of resume templates to start from.
 *
 * Eight samples across four roles (Software Engineer, Data Science, Full
 * Stack, AI / ML). Each card is a page preview, drawn in HTML at a fixed
 * page width and scaled to its card, in one of four styles (Classic,
 * Modern, Minimal, Sidebar), with its name and tags underneath. On hover
 * the page lifts and a "Use this template" button rises over it. Four
 * across on desktop, two on tablets, a row to swipe on phones.
 *
 * The people and details on the samples are made up.
 */
type Role = "Software Engineer" | "Data Science" | "Full Stack" | "AI / ML";
type Style = "Classic" | "Modern" | "Minimal" | "Sidebar";

type Person = {
  name: string;
  title: string;
  summary: string;
  exp: { org: string; role: string; date: string; bullets: string[] }[];
  projects: { name: string; stack: string; bullet: string }[];
  skills: string[];
};

const PEOPLE: Record<Role, Person> = {
  "Software Engineer": {
    name: "Priya Sharma",
    title: "Software Engineer",
    summary:
      "B.Tech CSE graduate who ships reliable backend services; strong in Java, Go and distributed systems.",
    exp: [
      {
        org: "Fintech Startup",
        role: "Software Engineering Intern",
        date: "Jan – Jun 2026",
        bullets: [
          "Built a payments reconciliation service in Go handling 2M records a day.",
          "Cut p95 API latency by 45% with caching and query tuning.",
        ],
      },
      {
        org: "Open Source",
        role: "Contributor",
        date: "2024 – Present",
        bullets: [
          "Merged 18 pull requests into a popular CLI tool written in Rust.",
        ],
      },
    ],
    projects: [
      {
        name: "Distributed Key-Value Store",
        stack: "Go, Raft",
        bullet:
          "Replicated store with leader election and 99.9% uptime in tests.",
      },
      {
        name: "Code Review Bot",
        stack: "TypeScript, GitHub API",
        bullet: "Flags risky diffs on 40+ repositories.",
      },
    ],
    skills: ["Java", "Go", "Python", "SQL", "Docker", "Kubernetes", "AWS"],
  },
  "Data Science": {
    name: "Rohan Iyer",
    title: "Data Scientist",
    summary:
      "Data science student turning messy data into decisions; Python, SQL and experiment design.",
    exp: [
      {
        org: "E-commerce Company",
        role: "Data Science Intern",
        date: "May – Aug 2025",
        bullets: [
          "Built a churn model (AUC 0.87) that guided a retention campaign.",
          "Automated weekly dashboards in SQL and Power BI for 6 teams.",
        ],
      },
      {
        org: "Analytics Club",
        role: "Lead",
        date: "2024 – Present",
        bullets: ["Ran 8 Kaggle-style challenges with 150+ participants."],
      },
    ],
    projects: [
      {
        name: "Price Forecasting",
        stack: "Python, Prophet",
        bullet: "Forecast vegetable prices with 8% MAPE across 12 markets.",
      },
      {
        name: "A/B Test Toolkit",
        stack: "Python, SciPy",
        bullet: "Power analysis and results reports in one notebook.",
      },
    ],
    skills: [
      "Python",
      "SQL",
      "Pandas",
      "scikit-learn",
      "Power BI",
      "Statistics",
    ],
  },
  "Full Stack": {
    name: "Neha Kapoor",
    title: "Full Stack Developer",
    summary:
      "Full stack developer building fast, accessible web apps with React, Next.js and Node.",
    exp: [
      {
        org: "SaaS Startup",
        role: "Full Stack Intern",
        date: "Jun – Dec 2025",
        bullets: [
          "Shipped a billing dashboard in Next.js used by 3,000 customers.",
          "Raised Lighthouse performance from 62 to 95 on key pages.",
        ],
      },
      {
        org: "Freelance",
        role: "Web Developer",
        date: "2024 – 2025",
        bullets: [
          "Built 6 sites for local businesses with Next.js and Stripe.",
        ],
      },
    ],
    projects: [
      {
        name: "Campus Marketplace",
        stack: "Next.js, PostgreSQL",
        bullet: "Buy-and-sell app with chat; 900 students in the first month.",
      },
      {
        name: "Realtime Whiteboard",
        stack: "React, WebSockets",
        bullet: "Collaborative canvas with presence and undo.",
      },
    ],
    skills: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Tailwind",
    ],
  },
  "AI / ML": {
    name: "Arjun Rao",
    title: "Machine Learning Engineer",
    summary:
      "ML engineer focused on LLM applications and model deployment; PyTorch, LangChain and MLOps.",
    exp: [
      {
        org: "AI Research Lab",
        role: "ML Intern",
        date: "Jan – Jul 2026",
        bullets: [
          "Fine-tuned a 7B model for support replies; resolution rate up 22%.",
          "Built an evaluation harness covering 1,200 test prompts.",
        ],
      },
      {
        org: "IAIB Buildathon",
        role: "Finalist",
        date: "2025",
        bullets: ["Top 10 of 400 teams with a voice tutor for rural schools."],
      },
    ],
    projects: [
      {
        name: "RAG Study Assistant",
        stack: "Python, LangChain",
        bullet: "Answers from course notes; 92% of answers rated helpful.",
      },
      {
        name: "Crop Disease Detector",
        stack: "PyTorch, FastAPI",
        bullet: "94% accuracy on 38 classes; runs on a phone.",
      },
    ],
    skills: [
      "Python",
      "PyTorch",
      "LangChain",
      "Hugging Face",
      "FastAPI",
      "MLflow",
    ],
  },
};

const SAMPLES: { role: Role; style: Style }[] = [
  { role: "Software Engineer", style: "Classic" },
  { role: "Data Science", style: "Modern" },
  { role: "Full Stack", style: "Sidebar" },
  { role: "AI / ML", style: "Minimal" },
  { role: "Software Engineer", style: "Modern" },
  { role: "Data Science", style: "Classic" },
  { role: "Full Stack", style: "Minimal" },
  { role: "AI / ML", style: "Sidebar" },
];

const PAGE_W = 560;
const PAGE_H = 724; // US letter shape

/* ---------- the four styles ---------- */

function ClassicH({ t }: { t: string }) {
  return <p className="mt-3 border-b border-[#222] text-[15px]">{t}</p>;
}

function Classic({ p }: { p: Person }) {
  return (
    <div className="h-full bg-white px-8 py-7 font-serif text-[12px] leading-[1.42] text-[#1a1a1a]">
      <p className="text-center text-[26px] leading-none [font-variant:small-caps]">
        {p.name}
      </p>
      <p className="mt-1.5 flex justify-center gap-3 text-[11px]">
        <span className="inline-flex items-center gap-1">
          <Phone size={9} aria-hidden /> 98765-43210
        </span>
        <span className="inline-flex items-center gap-1 underline">
          <Mail size={9} aria-hidden /> {p.name.split(" ")[0].toLowerCase()}
          @email.com
        </span>
      </p>
      <ClassicH t="Education" />
      <p className="mt-1 flex justify-between">
        <b>upGrad School of Technology</b>
        <b>2022 – 2026</b>
      </p>
      <p className="italic">B.Tech in Computer Science and Engineering</p>
      <ClassicH t="Experience" />
      {p.exp.map((e) => (
        <div key={e.org} className="mt-1.5">
          <p className="flex justify-between">
            <b>{e.org}</b>
            <b>{e.date}</b>
          </p>
          <p className="italic">{e.role}</p>
          <ul className="list-disc pl-5">
            {e.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      ))}
      <ClassicH t="Projects" />
      {p.projects.map((x) => (
        <div key={x.name} className="mt-1.5">
          <p>
            <b>{x.name}</b> | <i>{x.stack}</i>
          </p>
          <ul className="list-disc pl-5">
            <li>{x.bullet}</li>
          </ul>
        </div>
      ))}
      <ClassicH t="Technical Skills" />
      <p className="mt-1">
        <b>Skills:</b> {p.skills.join(", ")}
      </p>
    </div>
  );
}

function ModernH({ t }: { t: string }) {
  return (
    <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e4002b]">
      {t}
    </p>
  );
}

function Modern({ p }: { p: Person }) {
  return (
    <div className="h-full bg-white font-sans text-[12px] leading-[1.5] text-[#2b3140]">
      <div className="bg-[#0b0d12] px-8 pb-5 pt-7 text-white">
        <p className="text-[26px] font-semibold leading-none tracking-[-0.02em]">
          {p.name}
        </p>
        <p className="mt-1.5 text-[13px] text-white/75">{p.title}</p>
      </div>
      <div className="px-8 pb-6">
        <ModernH t="Summary" />
        <p className="mt-1">{p.summary}</p>
        <ModernH t="Experience" />
        {p.exp.map((e) => (
          <div key={e.org} className="mt-1.5">
            <p className="flex justify-between font-semibold text-[#0b0d12]">
              <span>
                {e.role} · {e.org}
              </span>
              <span className="font-normal text-[#5b6270]">{e.date}</span>
            </p>
            <ul className="list-disc pl-5">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        <ModernH t="Projects" />
        {p.projects.map((x) => (
          <p key={x.name} className="mt-1">
            <b className="text-[#0b0d12]">{x.name}</b> · {x.stack}: {x.bullet}
          </p>
        ))}
        <ModernH t="Skills" />
        <p className="mt-1.5 flex flex-wrap gap-1.5">
          {p.skills.map((k) => (
            <span
              key={k}
              className="rounded-[3px] bg-[#f3f5f7] px-2 py-0.5 text-[11px]"
            >
              {k}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

function MinimalH({ t }: { t: string }) {
  return (
    <p className="mt-4 border-t border-black/10 pt-2 text-[12px] font-semibold text-[#0b0d12]">
      {t}
    </p>
  );
}

function Minimal({ p }: { p: Person }) {
  return (
    <div className="h-full bg-white px-9 py-8 font-sans text-[12px] leading-[1.55] text-[#3d4451]">
      <p className="text-[28px] font-light leading-none tracking-[-0.03em] text-[#0b0d12]">
        {p.name}
      </p>
      <p className="mt-2 text-[12.5px]">
        {p.title} · Bengaluru · {p.name.split(" ")[0].toLowerCase()}@email.com
      </p>
      <MinimalH t="About" />
      <p>{p.summary}</p>
      <MinimalH t="Experience" />
      {p.exp.map((e) => (
        <div key={e.org} className="mt-1 grid grid-cols-[96px_1fr] gap-3">
          <span className="text-[11px] text-[#8a909c]">{e.date}</span>
          <div>
            <p className="font-medium text-[#0b0d12]">
              {e.role}, {e.org}
            </p>
            {e.bullets.map((b) => (
              <p key={b}>{b}</p>
            ))}
          </div>
        </div>
      ))}
      <MinimalH t="Projects" />
      {p.projects.map((x) => (
        <div key={x.name} className="mt-1 grid grid-cols-[96px_1fr] gap-3">
          <span className="text-[11px] text-[#8a909c]">{x.stack}</span>
          <p>
            <span className="font-medium text-[#0b0d12]">{x.name}.</span>{" "}
            {x.bullet}
          </p>
        </div>
      ))}
      <MinimalH t="Education" />
      <p>B.Tech CSE, upGrad School of Technology, 2022 – 2026</p>
      <MinimalH t="Skills" />
      <p>{p.skills.join(" · ")}</p>
    </div>
  );
}

function Sidebar({ p }: { p: Person }) {
  return (
    <div className="grid h-full grid-cols-[34%_1fr] bg-white font-sans text-[12px] leading-[1.5] text-[#2b3140]">
      <div className="bg-[#f3f5f7] px-5 py-7">
        <span className="grid size-14 place-items-center rounded-full bg-[#e4002b] text-[18px] font-semibold text-white">
          {p.name
            .split(" ")
            .map((w) => w[0])
            .join("")}
        </span>
        <p className="mt-3 text-[18px] font-semibold leading-tight text-[#0b0d12]">
          {p.name}
        </p>
        <p className="text-[12px] text-[#5b6270]">{p.title}</p>
        <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0b0d12]">
          Contact
        </p>
        <p className="mt-1 text-[11px]">98765 43210</p>
        <p className="text-[11px]">
          {p.name.split(" ")[0].toLowerCase()}@email.com
        </p>
        <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0b0d12]">
          Skills
        </p>
        <ul className="mt-1 grid gap-0.5 text-[11.5px]">
          {p.skills.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
        <p className="mt-5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#0b0d12]">
          Education
        </p>
        <p className="mt-1 text-[11.5px]">B.Tech CSE, uGSOT, 2022 – 2026</p>
      </div>
      <div className="px-6 py-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e4002b]">
          Profile
        </p>
        <p className="mt-1">{p.summary}</p>
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e4002b]">
          Experience
        </p>
        {p.exp.map((e) => (
          <div key={e.org} className="mt-2">
            <p className="font-semibold text-[#0b0d12]">{e.role}</p>
            <p className="text-[11px] text-[#5b6270]">
              {e.org} · {e.date}
            </p>
            <ul className="mt-0.5 list-disc pl-4">
              {e.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#e4002b]">
          Projects
        </p>
        {p.projects.map((x) => (
          <div key={x.name} className="mt-2">
            <p className="font-semibold text-[#0b0d12]">{x.name}</p>
            <p className="text-[11px] text-[#5b6270]">{x.stack}</p>
            <p>{x.bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const STYLES: Record<Style, (props: { p: Person }) => React.ReactElement> = {
  Classic,
  Modern,
  Minimal,
  Sidebar,
};

/** a page drawn at PAGE_W and scaled to its card */
export function Thumb({ role, style }: { role: Role; style: Style }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0.4);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setK(el.clientWidth / PAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const Tpl = STYLES[style];
  return (
    <div
      ref={box}
      className="relative aspect-[560/724] overflow-hidden rounded-[4px] bg-white"
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ width: PAGE_W, height: PAGE_H, transform: `scale(${k})` }}
      >
        <Tpl p={PEOPLE[role]} />
      </div>
    </div>
  );
}

export function ResumeSamples({
  id = "samples",
  useHref = "#create",
}: {
  id?: string;
  useHref?: string;
}) {
  return (
    <section id={id} className="bg-canvas py-10 lg:py-14">
      <div className="container-page">
        <SectionHeading
          title="Choose a"
          accent="Sample Resume"
          intro="Start from a proven template for your role, then let the agent fill it in."
        />

        <ul className="-mx-4 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 pt-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {SAMPLES.map((s) => (
            <li
              key={`${s.role}-${s.style}`}
              className="w-[72vw] max-w-[300px] shrink-0 snap-center sm:w-auto sm:max-w-none"
            >
              <div className="group">
                <div className="relative rounded-[8px] bg-[#f3f5f7] p-3 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5">
                  <div className="shadow-[0_10px_28px_-14px_rgba(11,13,18,0.35)]">
                    <Thumb role={s.role} style={s.style} />
                  </div>
                  {/* the button rises over the page on hover */}
                  <a
                    href={useHref}
                    className="absolute inset-x-6 bottom-6 flex translate-y-2 items-center justify-center gap-1.5 rounded-[6px] bg-accent px-4 py-2.5 text-[13.5px] font-semibold text-white opacity-0 transition-[opacity,transform] duration-300 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
                  >
                    Use this template
                    <ArrowUpRight size={15} aria-hidden />
                  </a>
                </div>
                <p className="mt-3 font-display text-[16px] font-medium text-ink">
                  {s.style} · {PEOPLE[s.role].title}
                </p>
                <p className="mt-1 flex flex-wrap gap-1.5 text-[11.5px] text-body">
                  <span className="rounded-[4px] bg-accent/10 px-2 py-0.5 font-medium text-accent">
                    ATS-friendly
                  </span>
                  <span className="rounded-[4px] bg-black/[0.05] px-2 py-0.5">
                    1 page
                  </span>
                  <span className="rounded-[4px] bg-black/[0.05] px-2 py-0.5">
                    {s.role}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
