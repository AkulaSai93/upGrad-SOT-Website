"use client";

import { Info } from "lucide-react";
import { CITIES, STATES } from "@/components/site/india";
import type { Academics, ClassRecord, Score } from "../application";
import {
  Chips,
  Field,
  FileDrop,
  Grid,
  ScoreInput,
  SectionCard,
  Select,
  TextInput,
  Combobox,
} from "../fields";
import { BOARDS_X, BOARDS_XII, RESULT_STATUS, years } from "../options";
import type { Errors, SectionProps } from "./types";

/**
 * The uGNET form's second section, Academics: Class X, Class XI and Class
 * 12 / Diploma, each with its board (as chips), school, city, year and
 * scores (a percentage or a CGPA). Class X and 12 also take the mark
 * sheet. For Class 12 the scores and mark sheet are asked for only once
 * the student has their results.
 */

const score = (): Score => ({ value: "", unit: "Percentage" });

const blankClass = (): ClassRecord => ({
  board: "",
  school: "",
  city: "",
  year: "",
  status: "",
  score: score(),
  math: score(),
});

export const blankAcademics = (): Academics => ({
  x: blankClass(),
  xi: blankClass(),
  xii: blankClass(),
});

const ALL_CITIES = [...new Set(STATES.flatMap((s) => CITIES[s]))].sort();

function scoreProblem(s: Score) {
  const n = Number(s.value);
  if (!s.value || Number.isNaN(n)) return "Enter the score.";
  if (s.unit === "CGPA" ? n > 10 : n > 100)
    return s.unit === "CGPA"
      ? "A CGPA is out of 10."
      : "A percentage is out of 100.";
  return "";
}

export function checkAcademics(a: Academics): Errors {
  const e: Errors = {};
  const need = (k: string, ok: boolean, msg: string) => {
    if (!ok) e[k] = msg;
  };
  const score = (k: string, s: Score) => {
    const p = scoreProblem(s);
    if (p) e[k] = p;
  };

  need("x.board", Boolean(a.x.board), "Pick your board.");
  need("x.school", Boolean(a.x.school.trim()), "Enter your school's name.");
  need("x.city", Boolean(a.x.city.trim()), "Enter the city.");
  need("x.year", Boolean(a.x.year), "Select the year.");
  score("x.score", a.x.score);
  score("x.math", a.x.math);
  need(
    "x.marksheet",
    Boolean(a.x.marksheet),
    "Upload your Class X mark sheet.",
  );

  need("xi.board", Boolean(a.xi.board), "Pick your board.");
  need("xi.school", Boolean(a.xi.school.trim()), "Enter your school's name.");
  need("xi.year", Boolean(a.xi.year), "Select the year.");
  score("xi.score", a.xi.score);

  need("xii.board", Boolean(a.xii.board), "Pick your board.");
  need("xii.school", Boolean(a.xii.school.trim()), "Enter your school's name.");
  need("xii.city", Boolean(a.xii.city.trim()), "Enter the city.");
  need("xii.year", Boolean(a.xii.year), "Select the year.");
  need(
    "xii.status",
    Boolean(a.xii.status),
    "Tell us if you have your results.",
  );
  if (a.xii.status === "I have results") {
    score("xii.score", a.xii.score);
    score("xii.math", a.xii.math);
    need("xii.marksheet", Boolean(a.xii.marksheet), "Upload your mark sheet.");
  }
  return e;
}

function ClassFields({
  at,
  value: c,
  onChange,
  errors,
  boards,
  city = true,
  math = true,
  marksheet,
  status = false,
}: {
  at: "x" | "xi" | "xii";
  value: ClassRecord;
  onChange: (c: ClassRecord) => void;
  errors: Errors;
  boards: string[];
  city?: boolean;
  math?: boolean;
  marksheet?: string;
  status?: boolean;
}) {
  const set = (patch: Partial<ClassRecord>) => onChange({ ...c, ...patch });
  const err = (k: string) => errors[`${at}.${k}`];
  const scores = !status || c.status === "I have results";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <Field label="Board" required error={err("board")}>
        <Chips
          name={`${at}-board`}
          options={boards}
          value={c.board}
          invalid={Boolean(err("board"))}
          onChange={(board) => set({ board })}
        />
      </Field>
      <Grid>
        <Field
          label="School / institute name"
          required
          hint="As written on its website"
          htmlFor={`${at}-school`}
          error={err("school")}
          className={city ? "" : "sm:col-span-2"}
        >
          <TextInput
            id={`${at}-school`}
            placeholder="Enter the school's name"
            value={c.school}
            invalid={Boolean(err("school"))}
            onChange={(e) => set({ school: e.target.value })}
          />
        </Field>
        {city && (
          <Field
            label="City"
            required
            hint="Where the school is"
            htmlFor={`${at}-city`}
            error={err("city")}
          >
            <Combobox
              id={`${at}-city`}
              options={ALL_CITIES}
              placeholder="Type or pick the city"
              value={c.city}
              invalid={Boolean(err("city"))}
              onChange={(city) => set({ city })}
            />
          </Field>
        )}
        <Field
          label="Year of passing"
          required
          htmlFor={`${at}-year`}
          error={err("year")}
        >
          <Select
            id={`${at}-year`}
            options={years()}
            placeholder="Select year"
            value={c.year}
            invalid={Boolean(err("year"))}
            onChange={(e) => set({ year: e.target.value })}
          />
        </Field>
        {status && (
          <Field
            label="Result status"
            required
            error={err("status")}
            className="sm:col-span-2"
          >
            <Chips
              name={`${at}-status`}
              options={RESULT_STATUS}
              value={c.status}
              invalid={Boolean(err("status"))}
              onChange={(s) => set({ status: s })}
            />
          </Field>
        )}
        {scores && (
          <>
            <Field
              label="Overall score"
              required
              htmlFor={`${at}-score`}
              error={err("score")}
            >
              <ScoreInput
                id={`${at}-score`}
                value={c.score.value}
                unit={c.score.unit}
                invalid={Boolean(err("score"))}
                onValue={(value) => set({ score: { ...c.score, value } })}
                onUnit={(unit) => set({ score: { ...c.score, unit } })}
              />
            </Field>
            {math && (
              <Field
                label="Maths score"
                required
                htmlFor={`${at}-math`}
                error={err("math")}
              >
                <ScoreInput
                  id={`${at}-math`}
                  value={c.math.value}
                  unit={c.math.unit}
                  invalid={Boolean(err("math"))}
                  onValue={(value) => set({ math: { ...c.math, value } })}
                  onUnit={(unit) => set({ math: { ...c.math, unit } })}
                />
              </Field>
            )}
            {marksheet && (
              <Field
                label={marksheet}
                required
                hint="JPG, PNG or PDF, up to 1 MB"
                error={err("marksheet")}
                className="sm:col-span-2"
              >
                <FileDrop
                  value={c.marksheet}
                  invalid={Boolean(err("marksheet"))}
                  onChange={(file) => set({ marksheet: file })}
                />
              </Field>
            )}
          </>
        )}
        {status && c.status === "Waiting for results" && (
          <p className="flex items-start gap-2 rounded-[6px] bg-black/[0.04] px-4 py-3 text-[13.5px] text-body sm:col-span-2">
            <Info
              size={16}
              className="mt-0.5 shrink-0 text-muted"
              aria-hidden
            />
            No problem. You can add your scores and mark sheet here once your
            results are out.
          </p>
        )}
      </Grid>
    </div>
  );
}

export function AcademicsSection({
  value: a,
  onChange,
  errors,
}: SectionProps<Academics>) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <SectionCard title="Class X" line="Your secondary school results">
        <ClassFields
          at="x"
          value={a.x}
          onChange={(x) => onChange({ ...a, x })}
          errors={errors}
          boards={BOARDS_X}
          marksheet="Class X mark sheet"
        />
      </SectionCard>
      <SectionCard title="Class XI" line="Your first year of senior secondary">
        <ClassFields
          at="xi"
          value={a.xi}
          onChange={(xi) => onChange({ ...a, xi })}
          errors={errors}
          boards={BOARDS_XII}
          city={false}
          math={false}
        />
      </SectionCard>
      <SectionCard
        title="Class 12 / Diploma"
        line="Your final school year, or your diploma"
      >
        <ClassFields
          at="xii"
          value={a.xii}
          onChange={(xii) => onChange({ ...a, xii })}
          errors={errors}
          boards={BOARDS_XII}
          marksheet="Class 12 / Diploma mark sheet"
          status
        />
      </SectionCard>
    </div>
  );
}
