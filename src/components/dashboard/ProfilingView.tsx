"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { SITE_PRIVACY } from "./copy";
import { StepGate, useApp, useGoToNext } from "./DashboardShell";
import { saveApplication, type Profiling } from "./application";
import {
  Field,
  Grid,
  PRIMARY_BUTTON,
  Radios,
  ReviewCard,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
} from "./fields";
import { INCOME_RANGES, LANGUAGES, OCCUPATIONS } from "./options";

/**
 * Step 3, Comprehensive Profiling (from the form's Figma): the languages
 * the student speaks, what their parents do, the family's income and
 * whether EWS applies. Saved as it is filled in; Submit checks the
 * required answers and opens slot selection. Once submitted it opens as a
 * preview of the answers, with Edit to change them.
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
  const goToNext = useGoToNext();
  // submitted answers open as a preview; Edit works on a copy, saved back
  // only once it checks out
  const [draft, setDraft] = useState<Profiling | null>(null);
  const editing = Boolean(app.profiling?.submittedAt && draft);
  const p = draft ?? app.profiling ?? blank();
  const [tried, setTried] = useState(false);
  const errors = check(p);
  const shown = tried ? errors : {};

  const set = (patch: Partial<Profiling>) =>
    editing
      ? setDraft({ ...p, ...patch })
      : saveApplication({ ...app, profiling: { ...p, ...patch } });

  const stopEditing = () => {
    setDraft(null);
    setTried(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    setTried(true);
    if (Object.keys(errors).length) {
      window.setTimeout(() =>
        document
          .querySelector<HTMLElement>(
            "main [aria-invalid=true], main [data-invalid=true]",
          )
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    if (editing) {
      saveApplication({ ...app, profiling: p });
      return stopEditing();
    }
    set({ submittedAt: new Date().toISOString() });
    goToNext("/dashboard/ugnet-slot");
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
      {app.profiling?.submittedAt && !editing ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
          <ReviewCard
            title="Languages"
            onEdit={() => setDraft(app.profiling!)}
            rows={[
              ["Mother tongue", p.motherTongue],
              ["Second language", p.second],
              ["Third language", p.third],
            ]}
          />
          <ReviewCard
            title="Your family"
            onEdit={() => setDraft(app.profiling!)}
            rows={[
              ["Father's occupation", p.fatherOccupation],
              ["Mother's occupation", p.motherOccupation],
              ["Annual family income", p.income],
              ["EWS applies", p.ews],
            ]}
          />
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
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
                <Radios
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

          <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-black/[0.06] bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(11,13,18,0.06)] backdrop-blur sm:px-6 lg:sticky lg:z-10 lg:rounded-[6px] lg:border lg:px-5 lg:shadow-none">
            {editing ? (
              <button
                type="button"
                onClick={stopEditing}
                className={SECONDARY_BUTTON}
              >
                Cancel
              </button>
            ) : (
              <Link href="/dashboard/ugnet-form" className={SECONDARY_BUTTON}>
                <ArrowLeft size={16} aria-hidden />
                Back
              </Link>
            )}
            <button type="button" onClick={submit} className={PRIMARY_BUTTON}>
              {editing ? "Save changes" : "Submit"}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </StepGate>
  );
}
