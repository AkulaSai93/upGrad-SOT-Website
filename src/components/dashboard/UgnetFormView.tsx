"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardList,
  FileCheck,
  GraduationCap,
  Info,
  Trophy,
  UserRound,
} from "lucide-react";
import { SITE_PRIVACY } from "./copy";
import { StepGate, useApp, useGoToNext } from "./DashboardShell";
import { saveApplication, type UgnetForm } from "./application";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "./fields";
import {
  AcademicsSection,
  blankAcademics,
  checkAcademics,
} from "./ugnet/AcademicsSection";
import {
  ActivitiesSection,
  blankActivities,
  checkActivities,
} from "./ugnet/ActivitiesSection";
import { DeclarationSection } from "./ugnet/DeclarationSection";
import { ExamsSection, checkExams } from "./ugnet/ExamsSection";
import {
  StudentSection,
  checkStudent,
  studentFrom,
} from "./ugnet/StudentSection";
import type { Errors } from "./ugnet/types";
import { UgnetPreview } from "./ugnet/UgnetPreview";

/**
 * Step 2, the uGNET form, in five sections: Student Details, Academics,
 * Exams, Activities and Declaration (from the form's Figma). A bar across
 * the top shows where the student is; sections already reached can be
 * opened again from it. Answers are saved as they are typed, so the form
 * can be left and picked up later.
 *
 * Save & Next checks the section: any problems show under their fields
 * and the first one is brought into view. The last section reviews the
 * answers and, once the declaration is ticked, submits the form.
 *
 * Once submitted, the step opens as a preview of every answer; Edit on a
 * section reopens it on a copy, and Save changes (once the section checks
 * out) writes it back, while Cancel drops the changes.
 */

const SECTIONS = [
  { title: "Student Details", Icon: UserRound },
  { title: "Academics", Icon: GraduationCap },
  { title: "Exams", Icon: ClipboardList },
  { title: "Activities", Icon: Trophy },
  { title: "Declaration", Icon: FileCheck },
];

function Stepper({
  at,
  reached,
  go,
}: {
  at: number;
  reached: number;
  go: (i: number) => void;
}) {
  return (
    <ol className="flex items-start">
      {SECTIONS.map(({ title, Icon }, i) => {
        const done = i < reached && i !== at;
        const open = i <= reached;
        return (
          <li
            key={title}
            className="relative flex flex-1 flex-col items-center"
          >
            {i > 0 && (
              <span
                aria-hidden
                className={`absolute right-1/2 top-5 h-0.5 w-full -translate-y-1/2 ${i <= reached ? "bg-accent" : "bg-black/[0.08]"}`}
              />
            )}
            <button
              type="button"
              disabled={!open}
              onClick={() => go(i)}
              aria-current={i === at ? "step" : undefined}
              aria-label={`${title}${done ? " (done)" : ""}`}
              className={`relative z-[1] grid size-10 place-items-center rounded-full border-2 transition-colors ${
                i === at
                  ? "border-accent bg-white text-accent"
                  : done
                    ? "border-accent bg-accent text-white"
                    : "border-black/[0.08] bg-white text-muted"
              } ${open ? "cursor-pointer" : "cursor-not-allowed"}`}
            >
              {done ? (
                <Check size={17} strokeWidth={2.6} aria-hidden />
              ) : (
                <Icon size={17} aria-hidden />
              )}
            </button>
            <span
              className={`mt-2 hidden text-center text-[12.5px] sm:block ${i === at ? "font-semibold text-ink" : "text-muted"}`}
            >
              {title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function UgnetFormView() {
  const app = useApp();
  const goToNext = useGoToNext();
  // a submitted form opens as a preview; Edit works on a copy (the draft),
  // saved back only once the section checks out
  const [draft, setDraft] = useState<UgnetForm | null>(null);
  const editing = Boolean(app.ugnet.submittedAt && draft);
  const form = draft ?? app.ugnet;
  const [at, setAt] = useState(() =>
    Math.min(form.reached, SECTIONS.length - 1),
  );
  const [tried, setTried] = useState(false);

  const student = form.student ?? studentFrom(app.profile);
  const academics = form.academics ?? blankAcademics();
  const exams = form.exams ?? [];
  const activities = form.activities ?? blankActivities();

  const save = (patch: Partial<UgnetForm>) =>
    editing
      ? setDraft({ ...form, ...patch })
      : saveApplication({ ...app, ugnet: { ...form, ...patch } });

  const edit = (i: number) => {
    setDraft(app.ugnet);
    setAt(i);
    setTried(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const stopEditing = () => {
    setDraft(null);
    setTried(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const problems: Errors =
    at === 0
      ? checkStudent(student)
      : at === 1
        ? checkAcademics(academics)
        : at === 2
          ? checkExams(exams)
          : at === 3
            ? checkActivities(activities)
            : form.declared
              ? {}
              : { declared: "Tick the declaration to submit." };
  const shown = tried ? problems : {};

  const go = (i: number) => {
    setAt(i);
    setTried(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => {
    setTried(true);
    if (Object.keys(problems).length) {
      // bring the first problem into view once it has rendered
      window.setTimeout(() =>
        document
          .querySelector<HTMLElement>(
            "main [aria-invalid=true], main [data-invalid=true], main [role=alert]",
          )
          ?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    if (editing) {
      saveApplication({
        ...app,
        ugnet: { ...form, student, academics, exams, activities },
      });
      stopEditing();
      return;
    }
    if (at === SECTIONS.length - 1) {
      save({ submittedAt: new Date().toISOString(), reached: SECTIONS.length });
      goToNext("/dashboard/profiling");
      return;
    }
    // keep the answers of this section (the defaults included) and move on
    save({
      student,
      academics,
      exams,
      activities,
      reached: Math.max(form.reached, at + 1),
    });
    go(at + 1);
  };

  return (
    <StepGate id="ugnet-form">
      {app.ugnet.submittedAt && !editing ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
          <UgnetPreview form={app.ugnet} onEdit={edit} />
        </div>
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
          <div className="py-1">
            <Stepper
              at={at}
              reached={editing ? SECTIONS.length - 2 : form.reached}
              go={go}
            />
            <p className="mt-3 text-center text-[13px] text-muted sm:hidden">
              Section {at + 1} of {SECTIONS.length}:{" "}
              <span className="font-semibold text-ink">
                {SECTIONS[at].title}
              </span>
            </p>
          </div>

          {at === 0 && (
            <StudentSection
              value={student}
              onChange={(v) => save({ student: v })}
              errors={shown}
            />
          )}
          {at === 1 && (
            <AcademicsSection
              value={academics}
              onChange={(v) => save({ academics: v })}
              errors={shown}
            />
          )}
          {at === 2 && (
            <ExamsSection
              value={exams}
              onChange={(v) => save({ exams: v })}
              errors={shown}
            />
          )}
          {at === 3 && (
            <ActivitiesSection
              value={activities}
              onChange={(v) => save({ activities: v })}
              errors={shown}
            />
          )}
          {at === 4 && (
            <DeclarationSection
              form={{ ...form, student, academics, exams, activities }}
              agreed={Boolean(form.declared)}
              onAgree={(declared) => save({ declared })}
              onEdit={go}
              error={shown.declared}
            />
          )}

          <p className="flex items-start gap-2 text-[12.5px] leading-[1.5] text-muted">
            <Info size={14} className="mt-0.5 shrink-0" aria-hidden />
            {SITE_PRIVACY}
          </p>

          {/* the way back and on, kept in reach at the foot of the screen */}
          <div className="sticky bottom-0 z-10 -mx-4 flex items-center justify-between gap-3 border-t border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:mx-0 lg:rounded-[6px] lg:border lg:bg-white/95 lg:px-5">
            {editing ? (
              <button
                type="button"
                onClick={stopEditing}
                className={SECONDARY_BUTTON}
              >
                Cancel
              </button>
            ) : at > 0 ? (
              <button
                type="button"
                onClick={() => go(at - 1)}
                className={SECONDARY_BUTTON}
              >
                <ArrowLeft size={16} aria-hidden />
                Back
              </button>
            ) : (
              <span className="text-[12.5px] text-muted">
                Saved as you type
              </span>
            )}
            <button type="button" onClick={next} className={PRIMARY_BUTTON}>
              {editing
                ? "Save changes"
                : at === SECTIONS.length - 1
                  ? "Submit form"
                  : "Save & Next"}
              <ArrowRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </StepGate>
  );
}
