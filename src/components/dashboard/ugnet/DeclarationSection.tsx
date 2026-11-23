"use client";

import { Pencil } from "lucide-react";
import type { UgnetForm } from "../application";
import { Checkbox, SectionCard } from "../fields";

/**
 * The uGNET form's last section, Declaration: a short review of every
 * section (each with an Edit link back to it), then the declaration to
 * tick before submitting (wording from the form's Figma).
 */

export const DECLARATION =
  "I confirm that all the information provided is true and accurate, and I understand that any discrepancies may impact my admission eligibility or scholarship. I validate the accuracy of the provided information and acknowledge that any inaccuracies could result in complete disqualification from the admission process.";

export function DeclarationSection({
  form,
  agreed,
  onAgree,
  onEdit,
  error,
}: {
  form: UgnetForm;
  agreed: boolean;
  onAgree: (agreed: boolean) => void;
  onEdit: (section: number) => void;
  error?: string;
}) {
  const s = form.student;
  const a = form.academics;
  const exams = form.exams ?? [];
  const acts = form.activities;
  const rows: { title: string; lines: string[]; section: number }[] = [
    {
      title: "Student details",
      section: 0,
      lines: s
        ? [
            `${s.firstName} ${s.lastName}`.trim(),
            `${s.city}, ${s.state}`,
            `Guardian: ${s.guardian.firstName} ${s.guardian.lastName} (${s.guardian.relation})`,
          ]
        : [],
    },
    {
      title: "Academics",
      section: 1,
      lines: a
        ? [
            `Class X: ${a.x.board}, ${a.x.score.value}${a.x.score.unit === "CGPA" ? " CGPA" : "%"}`,
            `Class 12: ${a.xii.board}, ${a.xii.status === "I have results" ? `${a.xii.score.value}${a.xii.score.unit === "CGPA" ? " CGPA" : "%"}` : "results awaited"}`,
          ]
        : [],
    },
    {
      title: "Entrance exams",
      section: 2,
      lines: exams.length
        ? exams.map(
            (x) =>
              `${x.name} ${x.year}: ${x.awaited ? "results awaited" : x.score}`,
          )
        : ["None added"],
    },
    {
      title: "Activities",
      section: 3,
      lines: [
        `${acts?.extra.length ?? 0} extracurricular · ${acts?.co.length ?? 0} co-curricular`,
      ],
    },
  ];

  return (
    <div className="grid gap-6">
      <SectionCard
        title="Review your answers"
        line="Check everything once before you submit"
      >
        <ul className="divide-y divide-black/[0.06] rounded-[8px] border border-black/[0.08]">
          {rows.map((r) => (
            <li
              key={r.title}
              className="flex items-start justify-between gap-4 px-4 py-3.5"
            >
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-ink">{r.title}</p>
                {r.lines.map((l) => (
                  <p key={l} className="truncate text-[13.5px] text-body">
                    {l}
                  </p>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onEdit(r.section)}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-[6px] px-2 py-1 text-[13px] font-medium text-accent hover:bg-accent-soft"
              >
                <Pencil size={13} aria-hidden />
                Edit
              </button>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Declaration">
        <div
          className={`rounded-[8px] border p-4 ${error ? "border-accent" : "border-black/[0.08]"}`}
        >
          <Checkbox
            checked={agreed}
            onChange={onAgree}
            invalid={Boolean(error)}
          >
            {DECLARATION}
          </Checkbox>
        </div>
        {error && (
          <p role="alert" className="mt-2 text-[12.5px] text-accent">
            {error}
          </p>
        )}
      </SectionCard>
    </div>
  );
}
