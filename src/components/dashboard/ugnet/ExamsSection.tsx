"use client";

import { ClipboardList, Plus, Trash2 } from "lucide-react";
import type { ExamEntry } from "../application";
import {
  Checkbox,
  Field,
  Grid,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
  TextInput,
} from "../fields";
import { EXAMS, years } from "../options";
import type { Errors, SectionProps } from "./types";

/**
 * The uGNET form's third section, Entrance Exams: any other entrance exams
 * taken or registered for, added one at a time (exam, year, score, or
 * "results awaited"). Optional: with none added, the student moves on.
 */

const blankExam = (): ExamEntry => ({
  name: "",
  year: "",
  score: "",
  awaited: false,
});

export function checkExams(list: ExamEntry[]): Errors {
  const e: Errors = {};
  list.forEach((x, i) => {
    if (!x.name) e[`${i}.name`] = "Select the exam.";
    if (!x.year) e[`${i}.year`] = "Select the year.";
    if (!x.awaited && !x.score.trim())
      e[`${i}.score`] = "Enter your score, or tick results awaited.";
  });
  return e;
}

export function ExamsSection({
  value: list,
  onChange,
  errors,
}: SectionProps<ExamEntry[]>) {
  const set = (i: number, patch: Partial<ExamEntry>) =>
    onChange(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const add = (
    <button
      type="button"
      onClick={() => onChange([...list, blankExam()])}
      className={`${SECONDARY_BUTTON} h-10 px-4 text-[13.5px]`}
    >
      <Plus size={16} aria-hidden />
      Add entrance exam
    </button>
  );

  return (
    <SectionCard
      title="Entrance exams"
      line="Other engineering entrance exams you have taken or registered for (optional)"
      action={list.length > 0 ? add : undefined}
    >
      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-[6px] border border-dashed border-black/15 px-6 py-10 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-black/[0.04] text-muted">
            <ClipboardList size={20} aria-hidden />
          </span>
          <p className="mt-3 text-[15px] font-medium text-ink">
            No entrance exams added yet
          </p>
          <p className="mt-1 max-w-[340px] text-[13.5px] text-muted">
            Add JEE Main, BITSAT or any other exam you have taken. Haven&apos;t
            taken any? Just press Save &amp; Next.
          </p>
          <div className="mt-5">{add}</div>
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4">
          {list.map((x, i) => (
            <div
              key={i}
              className="rounded-[6px] border border-black/[0.08] p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-[14px] font-semibold text-ink">
                  Exam {i + 1}
                </p>
                <button
                  type="button"
                  onClick={() => onChange(list.filter((_, j) => j !== i))}
                  className="inline-flex items-center gap-1.5 rounded-[4px] px-2 py-1 text-[13px] font-medium text-body transition-colors hover:bg-accent-soft hover:text-accent"
                >
                  <Trash2 size={14} aria-hidden />
                  Remove
                </button>
              </div>
              <Grid>
                <Field
                  label="Exam"
                  required
                  htmlFor={`ex-${i}-name`}
                  error={errors[`${i}.name`]}
                >
                  <Select
                    id={`ex-${i}-name`}
                    options={EXAMS}
                    placeholder="Select exam"
                    value={x.name}
                    invalid={Boolean(errors[`${i}.name`])}
                    onChange={(e) => set(i, { name: e.target.value })}
                  />
                </Field>
                <Field
                  label="Year attempted"
                  required
                  htmlFor={`ex-${i}-year`}
                  error={errors[`${i}.year`]}
                >
                  <Select
                    id={`ex-${i}-year`}
                    options={years(new Date().getFullYear() + 1, 3)}
                    placeholder="Select year"
                    value={x.year}
                    invalid={Boolean(errors[`${i}.year`])}
                    onChange={(e) => set(i, { year: e.target.value })}
                  />
                </Field>
                <Field
                  label="Score / percentile / rank"
                  required={!x.awaited}
                  htmlFor={`ex-${i}-score`}
                  error={errors[`${i}.score`]}
                >
                  <TextInput
                    id={`ex-${i}-score`}
                    placeholder={
                      x.awaited ? "Results awaited" : "e.g. 92.4 percentile"
                    }
                    disabled={x.awaited}
                    value={x.awaited ? "" : x.score}
                    invalid={Boolean(errors[`${i}.score`])}
                    onChange={(e) => set(i, { score: e.target.value })}
                  />
                </Field>
                <div className="flex items-end pb-2.5">
                  <Checkbox
                    checked={x.awaited}
                    onChange={(awaited) =>
                      set(i, { awaited, score: awaited ? "" : x.score })
                    }
                  >
                    Results awaited
                  </Checkbox>
                </div>
              </Grid>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
