"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Info } from "lucide-react";
import { SITE_PRIVACY } from "./copy";
import { StepGate, useApp } from "./DashboardShell";
import { saveApplication, type Profiling } from "./application";
import {
  Chips,
  Field,
  Grid,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
} from "./fields";
import { INCOME_RANGES, LANGUAGES, OCCUPATIONS } from "./options";

/**
 * Step 3, Comprehensive Profiling (from the form's Figma): the languages
 * the student speaks, what their parents do, the family's income and
 * whether EWS applies. Saved as it is filled in; Submit checks the
 * required answers and opens slot selection.
 */

const blank = (): Profiling => ({
  motherTongue: "",
  second: "",
  third: "",
  fatherOccupation: "",
  motherOccupation: "",
  income: "",
  ews: "",
});

type Key = keyof Omit<Profiling, "submittedAt">;

function check(p: Profiling) {
  const e: Partial<Record<Key, string>> = {};
  if (!p.motherTongue) e.motherTongue = "Select your mother tongue.";
  if (!p.fatherOccupation) e.fatherOccupation = "Select an option.";
  if (!p.motherOccupation) e.motherOccupation = "Select an option.";
  if (!p.income) e.income = "Select a range.";
  if (!p.ews) e.ews = "Choose yes or no.";
  return e;
}

export function ProfilingView() {
  const app = useApp();
  const p = app.profiling ?? blank();
  const [tried, setTried] = useState(false);
  const errors = check(p);
  const shown = tried ? errors : {};

  const set = (patch: Partial<Profiling>) =>
    saveApplication({ ...app, profiling: { ...p, ...patch } });

  const submit = () => {
    setTried(true);
    if (Object.keys(errors).length) {
      window.setTimeout(() =>
        document
          .querySelector<HTMLElement>("main [aria-invalid=true]")
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    set({ submittedAt: new Date().toISOString() });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const select = (
    k: Key,
    label: string,
    options: string[],
    required = true,
    hint?: string,
  ) => (
    <Field
      label={label}
      required={required}
      hint={hint}
      htmlFor={`pf-${k}`}
      error={shown[k]}
    >
      <Select
        id={`pf-${k}`}
        options={options}
        placeholder="Select"
        value={p[k]}
        invalid={Boolean(shown[k])}
        onChange={(e) => set({ [k]: e.target.value })}
      />
    </Field>
  );

  return (
    <StepGate id="profiling">
      {p.submittedAt ? (
        <section className="rounded-[8px] border border-black/[0.08] bg-white p-6 text-center sm:p-10">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e9f7ef] text-[#16794a]">
            <CheckCircle2 size={28} aria-hidden />
          </span>
          <h2 className="mt-4 font-display text-[24px] font-medium tracking-[-0.02em] text-ink">
            Profile complete
          </h2>
          <p className="mx-auto mt-1.5 max-w-[420px] text-[14.5px] text-body">
            Thank you. Now pick the date and time you want to take uGNET.
          </p>
          <Link
            href="/dashboard/ugnet-slot"
            className={`${PRIMARY_BUTTON} mt-7`}
          >
            Choose your uGNET slot
            <ArrowRight size={16} aria-hidden />
          </Link>
        </section>
      ) : (
        <div className="grid gap-6">
          <SectionCard title="Languages" line="The languages you speak">
            <Grid>
              {select("motherTongue", "Mother tongue", LANGUAGES)}
              <div className="hidden sm:block" />
              {select("second", "Second language", LANGUAGES, false)}
              {select("third", "Third language", LANGUAGES, false)}
            </Grid>
          </SectionCard>

          <SectionCard
            title="Your family"
            line="What your parents do, and your family's income"
          >
            <Grid>
              {select("fatherOccupation", "Father's occupation", OCCUPATIONS)}
              {select("motherOccupation", "Mother's occupation", OCCUPATIONS)}
              {select(
                "income",
                "Annual family income",
                INCOME_RANGES,
                true,
                "In Indian rupees, before tax",
              )}
              <Field
                label="Does EWS apply to you?"
                required
                hint="Economically Weaker Section"
                error={shown.ews}
              >
                <Chips
                  name="ews"
                  options={["Yes", "No"]}
                  value={p.ews}
                  invalid={Boolean(shown.ews)}
                  onChange={(ews) => set({ ews })}
                />
              </Field>
            </Grid>
          </SectionCard>

          <p className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-muted">
            <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
            {SITE_PRIVACY}
          </p>

          <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-[8px] lg:border lg:bg-white/95 lg:px-5">
            <Link href="/dashboard/ugnet-form" className={SECONDARY_BUTTON}>
              <ArrowLeft size={16} aria-hidden />
              Back
            </Link>
            <button type="button" onClick={submit} className={PRIMARY_BUTTON}>
              Submit
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </StepGate>
  );
}
