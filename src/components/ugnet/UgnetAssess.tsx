"use client";

import { useState } from "react";
import { BookOpenText, Calculator, Check, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "What Does uGNET Assess?"
 *
 * Copy is sot.upgrad.com/uGNET's own (read 16 Nov 2026): the lead-in, the
 * three areas with their lines and topics, and each area's questions, marks
 * and minutes from its exam pattern (90 questions, 160 marks, 120 minutes in
 * all).
 *
 * Layout: the heading and lead-in centred, then the three areas as a tab
 * bar like the campus facilities' (an icon and the name each), the chosen
 * one filled ink; under them
 * the chosen area in one panel: its line and topics as a checklist on the
 * left, its questions, marks and minutes and a bar showing its share of the
 * 160 marks on the right. On phones the chips scroll sideways on one line
 * and the panel stacks.
 */
const TOTAL_MARKS = 160;

const AREAS = [
  {
    name: "Mathematical Ability",
    line: "Assesses numerical and mathematical proficiency essential for engineering coursework, including:",
    topics: [
      "Arithmetic and number systems",
      "Algebraic reasoning and equations",
      "Probability and basic statistics",
      "Data interpretation and analytical calculations",
      "Mathematical thinking required for algorithm design and problem-solving",
    ],
    questions: 30,
    marks: 55,
    minutes: 40,
    Icon: Calculator,
  },
  {
    name: "Logical Reasoning",
    sub: "Pseudocoding + Critical Thinking",
    line: "Evaluates a student's ability to think logically and approach problems systematically, including:",
    topics: [
      "Logical patterns and deductive reasoning",
      "Structured problem-solving approaches",
      "Pseudocode interpretation and flow-based logic",
      "Step-by-step reasoning required for programming and computational thinking",
    ],
    questions: 45,
    marks: 75,
    minutes: 60,
    Icon: Workflow,
  },
  {
    name: "Verbal Aptitude",
    line: "Measures clarity of thought and comprehension skills necessary for technical learning and communication, including:",
    topics: [
      "Reading comprehension",
      "Inference and contextual understanding",
      "Ability to interpret written information accurately",
      "Language skills required to follow technical instructions and coursework",
    ],
    questions: 15,
    marks: 30,
    minutes: 20,
    Icon: BookOpenText,
  },
];

export function UgnetAssess() {
  const [active, setActive] = useState(0);
  const a = AREAS[active];

  return (
    <section id="assess" className="bg-canvas py-10 lg:py-14">
      <div className="container-page">
        <SectionHeading
          title="What Does"
          accent="uGNET Assess?"
          intro="uGNET focuses on mathematical ability, logical reasoning, critical thinking, and verbal aptitude to ensure students are prepared for a rigorous, AI-first, computer science program."
          className="[&>p]:max-w-[820px] [&>p]:text-pretty"
        />

        {/* the three areas as chips */}
        <div className="mt-8 flex justify-center lg:mt-10">
          <div
            role="tablist"
            aria-label="uGNET sections"
            className="flex max-w-full gap-1 overflow-x-auto rounded-[4px] border border-black/[0.08] bg-white p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {AREAS.map((ar, i) => {
              const on = i === active;
              return (
                <button
                  key={ar.name}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="assess-panel"
                  onClick={() => setActive(i)}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-[3px] px-3.5 py-2 text-[14px] font-semibold transition-colors duration-300 ${
                    on ? "bg-ink text-white" : "text-body hover:text-ink"
                  }`}
                >
                  <ar.Icon
                    size={15}
                    aria-hidden
                    className={on ? "text-white" : "text-accent"}
                  />
                  {ar.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-5 max-w-[1040px]">
          {/* the chosen area */}
          <div
            id="assess-panel"
            role="tabpanel"
            aria-label={a.name}
            className="rounded-[8px] border border-black/[0.08] bg-white p-5 lg:px-6 lg:py-5"
          >
            <div
              key={a.name}
              className="animate-rise grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-8"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-[8px] bg-accent-soft text-accent">
                    <a.Icon size={19} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-[clamp(1.125rem,1.8vw,1.375rem)] font-medium leading-tight tracking-[-0.02em] text-ink">
                      {a.name}
                    </h3>
                    {a.sub && (
                      <p className="text-[12.5px] text-muted">{a.sub}</p>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-[14.5px] leading-[1.6] text-body">
                  {a.line}
                </p>
                <ul className="mt-4 grid gap-2">
                  {a.topics.map((t) => (
                    <li
                      key={t}
                      className="flex items-start gap-2.5 text-[14px] leading-snug text-ink"
                    >
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                        <Check size={12} strokeWidth={3} aria-hidden />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col justify-between gap-4 rounded-[8px] bg-[#f6f7f9] p-4 lg:p-5">
                <dl className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-3">
                  {[
                    { k: "Questions", v: a.questions },
                    { k: "Max marks", v: a.marks },
                    { k: "Duration", v: `${a.minutes} min` },
                  ].map((st) => (
                    <div
                      key={st.k}
                      className="rounded-[6px] bg-white px-3 py-2.5 lg:flex lg:items-baseline lg:justify-between"
                    >
                      <dt className="text-[12px] text-muted">{st.k}</dt>
                      <dd className="mt-0.5 font-display text-[18px] font-medium text-ink lg:mt-0">
                        {st.v}
                      </dd>
                    </div>
                  ))}
                </dl>
                {/* its share of the marks */}
                <div>
                  <div className="flex items-center justify-between text-[12.5px] text-body">
                    <span>Share of the {TOTAL_MARKS} marks</span>
                    <span className="font-semibold text-ink">
                      {Math.round((a.marks / TOTAL_MARKS) * 100)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${(a.marks / TOTAL_MARKS) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
