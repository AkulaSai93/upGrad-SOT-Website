"use client";

import { Plus, Sparkles, Trash2, Trophy } from "lucide-react";
import type { Activities, Activity } from "../application";
import {
  Field,
  Grid,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
  TextArea,
} from "../fields";
import { COCURRICULAR_TYPES, EXTRACURRICULAR_TYPES, LEVELS } from "../options";
import type { Errors, SectionProps } from "./types";

/**
 * The uGNET form's fourth section, Activities: extracurricular (sports,
 * arts, service) and co-curricular (olympiads, hackathons, projects),
 * each added one at a time with its type, level and a short description.
 * Optional: with none added, the student moves on.
 */

const blankActivity = (): Activity => ({
  type: "",
  level: "",
  description: "",
});

export const blankActivities = (): Activities => ({ extra: [], co: [] });

export function checkActivities(a: Activities): Errors {
  const e: Errors = {};
  (["extra", "co"] as const).forEach((group) =>
    a[group].forEach((x, i) => {
      if (!x.type) e[`${group}.${i}.type`] = "Select the type.";
      if (!x.level) e[`${group}.${i}.level`] = "Select the level.";
      if (x.description.trim().length < 20)
        e[`${group}.${i}.description`] =
          "Add a line or two (at least 20 characters).";
    }),
  );
  return e;
}

function ActivityList({
  group,
  title,
  line,
  empty,
  types,
  Icon,
  list,
  onChange,
  errors,
}: {
  group: "extra" | "co";
  title: string;
  line: string;
  empty: string;
  types: string[];
  Icon: typeof Trophy;
  list: Activity[];
  onChange: (list: Activity[]) => void;
  errors: Errors;
}) {
  const set = (i: number, patch: Partial<Activity>) =>
    onChange(list.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const err = (i: number, k: string) => errors[`${group}.${i}.${k}`];
  const add = (
    <button
      type="button"
      onClick={() => onChange([...list, blankActivity()])}
      className={`${SECONDARY_BUTTON} h-10 px-4 text-[13.5px]`}
    >
      <Plus size={16} aria-hidden />
      Add activity
    </button>
  );

  return (
    <SectionCard
      title={title}
      line={line}
      action={list.length > 0 ? add : undefined}
    >
      {list.length === 0 ? (
        <div className="flex flex-col items-center rounded-[6px] border border-dashed border-black/15 px-6 py-9 text-center">
          <span className="grid size-11 place-items-center rounded-full bg-black/[0.04] text-muted">
            <Icon size={20} aria-hidden />
          </span>
          <p className="mt-3 text-[15px] font-medium text-ink">
            Nothing added yet
          </p>
          <p className="mt-1 max-w-[360px] text-[13.5px] text-muted">{empty}</p>
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
                  Activity {i + 1}
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
                  label="Type"
                  required
                  htmlFor={`${group}-${i}-type`}
                  error={err(i, "type")}
                >
                  <Select
                    id={`${group}-${i}-type`}
                    options={types}
                    placeholder="Select type"
                    value={x.type}
                    invalid={Boolean(err(i, "type"))}
                    onChange={(e) => set(i, { type: e.target.value })}
                  />
                </Field>
                <Field
                  label="Level"
                  required
                  hint="The highest level you took part at"
                  htmlFor={`${group}-${i}-level`}
                  error={err(i, "level")}
                >
                  <Select
                    id={`${group}-${i}-level`}
                    options={LEVELS}
                    placeholder="Select level"
                    value={x.level}
                    invalid={Boolean(err(i, "level"))}
                    onChange={(e) => set(i, { level: e.target.value })}
                  />
                </Field>
                <Field
                  label="Description"
                  required
                  htmlFor={`${group}-${i}-desc`}
                  error={err(i, "description")}
                  className="sm:col-span-2"
                >
                  <TextArea
                    id={`${group}-${i}-desc`}
                    maxLength={500}
                    placeholder="Your role, what you achieved, or anything else about it"
                    value={x.description}
                    invalid={Boolean(err(i, "description"))}
                    onChange={(e) => set(i, { description: e.target.value })}
                  />
                  <p className="text-right text-[12px] text-muted">
                    {x.description.length}/500
                  </p>
                </Field>
              </Grid>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export function ActivitiesSection({
  value: a,
  onChange,
  errors,
}: SectionProps<Activities>) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      <ActivityList
        group="extra"
        title="Extracurricular activities"
        line="Sports, arts, music, volunteering and more (optional)"
        empty="Played a sport, performed, or volunteered? Add it here. Nothing to add? Just press Save & Next."
        types={EXTRACURRICULAR_TYPES}
        Icon={Trophy}
        list={a.extra}
        onChange={(extra) => onChange({ ...a, extra })}
        errors={errors}
      />
      <ActivityList
        group="co"
        title="Co-curricular activities"
        line="Olympiads, hackathons, coding contests, projects (optional)"
        empty="Took part in an olympiad, built a project, or won a contest? Add it here."
        types={COCURRICULAR_TYPES}
        Icon={Sparkles}
        list={a.co}
        onChange={(co) => onChange({ ...a, co })}
        errors={errors}
      />
    </div>
  );
}
