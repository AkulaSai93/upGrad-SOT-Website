"use client";

import {
  BookOpenText,
  Calculator,
  Clock,
  FileQuestion,
  Trophy,
  Workflow,
} from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "uGNET Exam Pattern"
 *
 * Figures are sot.upgrad.com/uGNET's exam pattern table (read 16 Nov 2026):
 * per section the easy (1 mark), medium (2 marks) and difficult (4 marks)
 * questions, the total questions, the maximum marks and the duration, and
 * the totals (90 questions, 160 marks, 120 minutes).
 *
 * Layout, as the source page sets it: the heading centred, the three totals
 * as red stat cards, then the table in the fee table's plain style (a cool
 * grey header, hairlines, the totals row in bold). On phones each section becomes
 * a card with its figures in a small grid.
 */
const ROWS = [
  {
    name: "Mathematical Ability",
    easy: 15,
    medium: 10,
    hard: 5,
    questions: 30,
    marks: 55,
    minutes: 40,
    Icon: Calculator,
  },
  {
    name: "Logical Reasoning",
    sub: "Pseudocoding + Critical Thinking",
    easy: 25,
    medium: 15,
    hard: 5,
    questions: 45,
    marks: 75,
    minutes: 60,
    Icon: Workflow,
  },
  {
    name: "Verbal Aptitude",
    easy: 6,
    medium: 6,
    hard: 3,
    questions: 15,
    marks: 30,
    minutes: 20,
    Icon: BookOpenText,
  },
];
const TOTAL = {
  easy: 46,
  medium: 31,
  hard: 13,
  questions: 90,
  marks: 160,
  minutes: 120,
};

const COLS = [
  { key: "easy", label: "Easy", note: "1 mark" },
  { key: "medium", label: "Medium", note: "2 marks" },
  { key: "hard", label: "Difficult", note: "4 marks" },
  { key: "questions", label: "Total Questions" },
  { key: "marks", label: "Max Marks" },
  { key: "minutes", label: "Duration" },
] as const;

type Figures = Record<(typeof COLS)[number]["key"], number>;
const cell = (r: Figures, key: keyof Figures) =>
  key === "minutes" ? `${r[key]} min` : r[key];

export function UgnetPattern() {
  return (
    <section id="pattern" className="bg-canvas py-10 lg:py-14">
      <div className="container-page">
        <SectionHeading title="uGNET" accent="Exam Pattern" />

        {/* the totals */}
        <ul className="mx-auto mt-8 grid max-w-[1040px] grid-cols-3 gap-3 lg:mt-10 lg:gap-4">
          {[
            { k: "Total Questions", v: TOTAL.questions, Icon: FileQuestion },
            { k: "Total Duration", v: `${TOTAL.minutes} min`, Icon: Clock },
            { k: "Total Marks", v: TOTAL.marks, Icon: Trophy },
          ].map(({ k, v, Icon }) => (
            <li
              key={k}
              className="flex flex-col items-start gap-3 rounded-[4px] bg-accent p-3 text-white sm:flex-row sm:items-center sm:p-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-[6px] bg-white text-accent">
                <Icon size={19} aria-hidden />
              </span>
              <span>
                <span className="block text-[12px] text-white/85 sm:text-[13px]">
                  {k}
                </span>
                <span className="block font-display text-[20px] font-medium leading-tight sm:text-[24px]">
                  {v}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {/* tablet and up: the table */}
        <div className="mx-auto mt-4 hidden max-w-[1040px] overflow-hidden rounded-[8px] border border-black/[0.08] md:block">
          <table className="w-full text-[14px]">
            <thead>
              <tr className="bg-[#f6f7f9] text-left">
                <th scope="col" className="px-5 py-3.5 font-semibold text-ink">
                  Section
                </th>
                {COLS.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className="border-l border-black/[0.08] px-4 py-3.5 text-center font-semibold text-ink"
                  >
                    {c.label}
                    {"note" in c && (
                      <span className="block text-[11.5px] font-medium text-muted">
                        {c.note}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.name} className="border-t border-black/[0.08]">
                  <th
                    scope="row"
                    className="px-5 py-4 text-left font-medium text-ink"
                  >
                    {r.name}
                    {r.sub && (
                      <span className="block text-[12px] font-normal text-muted">
                        {r.sub}
                      </span>
                    )}
                  </th>
                  {COLS.map((c) => (
                    <td
                      key={c.key}
                      className="border-l border-black/[0.08] px-4 py-4 text-center tabular-nums text-body"
                    >
                      {cell(r, c.key)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-black/[0.08]">
                <th
                  scope="row"
                  className="px-5 py-4 text-left font-semibold text-ink"
                >
                  Total
                </th>
                {COLS.map((c) => (
                  <td
                    key={c.key}
                    className="border-l border-black/[0.08] px-4 py-4 text-center font-semibold tabular-nums text-ink"
                  >
                    {cell(TOTAL, c.key)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* phones: a card per section */}
        <ul className="mt-4 grid gap-3 md:hidden">
          {ROWS.map((r) => (
            <li
              key={r.name}
              className="rounded-[8px] border border-black/[0.08] bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-[6px] bg-accent-soft text-accent">
                  <r.Icon size={16} aria-hidden />
                </span>
                <div>
                  <p className="font-display text-[16px] font-medium leading-tight text-ink">
                    {r.name}
                  </p>
                  {r.sub && <p className="text-[12px] text-muted">{r.sub}</p>}
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-3 gap-2">
                {COLS.map((c) => (
                  <div
                    key={c.key}
                    className="rounded-[6px] bg-[#f6f7f9] px-2.5 py-2"
                  >
                    <dt className="text-[11px] leading-tight text-muted">
                      {c.label}
                      {"note" in c && ` (${c.note})`}
                    </dt>
                    <dd className="mt-0.5 font-display text-[15px] font-medium text-ink">
                      {cell(r, c.key)}
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
