"use client";

import { useState } from "react";
import { BookOpenText, Calculator, Check, Workflow } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "What Does uGNET Assess?"
 *
 * Copy is sot.upgrad.com/uGNET's own (read 16 Nov 2026): the lead-in, the
 * three areas with their lines and topics, and each area's questions, marks
 * and minutes from its exam pattern (160 marks in all).
 *
 * Layout: the heading and lead-in centred, then the three areas as a tab
 * bar like the campus facilities' (an icon and the name each), the chosen
 * one filled ink; under them
 * the chosen area in one panel: its line and its topics as a checklist on
 * the left; on the right a ring showing its share of the 160 marks, with its
 * questions, marks and minutes in a row under it. On phones the chips scroll sideways on one line
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
                  className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-[3px] px-2.5 py-2 text-[13px] font-semibold sm:gap-2 sm:px-3.5 sm:text-[14px] transition-colors duration-300 ${
                    on ? "bg-ink text-white" : "text-body hover:text-ink"
                  }`}
                >
                  <ar.Icon
                    size={15}
                    aria-hidden
                    className={on ? "text-white" : "text-accent"}
                  />
                  {/* on phones the first word, so all three fit */}
                  <span className="sm:hidden">{ar.name.split(" ")[0]}</span>
                  <span className="max-sm:hidden">{ar.name}</span>
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
              className="animate-rise grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-center lg:gap-10"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-accent-soft text-accent">
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

              {/* its weight: a ring for its share of the marks, its figures
                  under it */}
              <div className="flex flex-col items-center justify-center gap-5 rounded-[8px] bg-[linear-gradient(160deg,#fff7f8_0%,#ffe9ec_100%)] p-5">
                <div
                  className="relative grid size-36 place-items-center rounded-full"
                  style={{
                    background: `conic-gradient(var(--accent) ${(a.marks / TOTAL_MARKS) * 360}deg, rgba(228,0,43,0.12) 0deg)`,
                  }}
                >
                  <div className="grid size-[112px] place-items-center rounded-full bg-white text-center">
                    <span>
                      <span className="block font-display text-[28px] font-medium leading-none text-ink">
                        {Math.round((a.marks / TOTAL_MARKS) * 100)}%
                      </span>
                      <span className="mt-1 block text-[11.5px] text-muted">
                        of {TOTAL_MARKS} marks
                      </span>
                    </span>
                  </div>
                </div>
                <dl className="grid w-full grid-cols-3 divide-x divide-black/[0.08] rounded-[6px] bg-white py-3 text-center">
                  {[
                    { k: "Questions", v: a.questions },
                    { k: "Marks", v: a.marks },
                    { k: "Minutes", v: a.minutes },
                  ].map((st) => (
                    <div key={st.k} className="flex flex-col-reverse">
                      <dt className="text-[11.5px] text-muted">{st.k}</dt>
                      <dd className="font-display text-[20px] font-medium leading-tight text-ink">
                        {st.v}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
