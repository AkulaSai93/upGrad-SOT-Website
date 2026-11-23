"use client";

import Image from "next/image";
import type { Address, ClassRecord, Score, UgnetForm } from "../application";
import { ReviewCard, longDate } from "../fields";

/**
 * The submitted uGNET form, read back in full: every section as a card
 * with all its answers and an Edit button that reopens that section.
 */

const score = (s: Score) =>
  s.value ? `${s.value}${s.unit === "CGPA" ? " CGPA" : "%"}` : "";

const address = (a: Address) =>
  [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(", ");

function classRows(
  c: ClassRecord,
  opts: { city?: boolean; math?: boolean; status?: boolean; sheet?: boolean },
) {
  const rows: [string, string][] = [
    ["Board", c.board],
    ["School / institute", c.school],
  ];
  if (opts.city) rows.push(["City", c.city]);
  rows.push(["Year of passing", c.year]);
  if (opts.status) rows.push(["Result status", c.status]);
  const scores = !opts.status || c.status === "I have results";
  if (scores) {
    rows.push(["Overall score", score(c.score)]);
    if (opts.math) rows.push(["Maths score", score(c.math)]);
    if (opts.sheet) rows.push(["Mark sheet", c.marksheet?.name ?? ""]);
  }
  return rows;
}

export function UgnetPreview({
  form,
  onEdit,
}: {
  form: UgnetForm;
  onEdit: (section: number) => void;
}) {
  const s = form.student;
  const a = form.academics;
  const exams = form.exams ?? [];
  const acts = form.activities ?? { extra: [], co: [] };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      {s && (
        <ReviewCard
          title="Student details"
          onEdit={() => onEdit(0)}
          rows={[
            ["Name", `${s.firstName} ${s.lastName}`.trim()],
            ["Date of birth", longDate(s.dob)],
            ["Email ID", s.email],
            ["Mobile number", `+91 ${s.phone}`],
            ["Gender", s.gender],
            ["Nationality", s.nationality],
            ["City", s.city],
            ["State", s.state],
          ]}
        >
          {s.photo && (
            <div className="mt-5 flex items-center gap-3 border-t border-black/[0.06] pt-4">
              <span className="relative size-12 overflow-hidden rounded-full border border-black/[0.08]">
                <Image
                  src={s.photo}
                  alt="Your photo"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </span>
              <span className="text-[13px] text-muted">Photo added</span>
            </div>
          )}
        </ReviewCard>
      )}

      {s && (
        <ReviewCard
          title="Parent / guardian"
          onEdit={() => onEdit(0)}
          rows={[
            ["Name", `${s.guardian.firstName} ${s.guardian.lastName}`.trim()],
            ["Relationship", s.guardian.relation],
            [
              "Mobile number",
              s.guardian.phone ? `+91 ${s.guardian.phone}` : "",
            ],
            ["Email ID", s.guardian.email],
          ]}
        />
      )}

      {s && (
        <ReviewCard
          title="Address"
          onEdit={() => onEdit(0)}
          rows={[
            ["Current address", address(s.current)],
            [
              "Permanent address",
              s.permanentSame
                ? "Same as current address"
                : address(s.permanent),
            ],
          ]}
        />
      )}

      {a && (
        <>
          <ReviewCard
            title="Class X"
            onEdit={() => onEdit(1)}
            rows={classRows(a.x, { city: true, math: true, sheet: true })}
          />
          <ReviewCard
            title="Class XI"
            onEdit={() => onEdit(1)}
            rows={classRows(a.xi, {})}
          />
          <ReviewCard
            title="Class 12 / Diploma"
            onEdit={() => onEdit(1)}
            rows={classRows(a.xii, {
              city: true,
              math: true,
              status: true,
              sheet: true,
            })}
          />
        </>
      )}

      <ReviewCard title="Entrance exams" onEdit={() => onEdit(2)}>
        {exams.length ? (
          <ul className="grid gap-3">
            {exams.map((x, i) => (
              <li
                key={i}
                className="flex flex-wrap items-baseline justify-between gap-2 border-b border-black/[0.06] pb-3 last:border-0 last:pb-0"
              >
                <span className="text-[14.5px] font-medium text-ink">
                  {x.name}{" "}
                  <span className="font-normal text-muted">· {x.year}</span>
                </span>
                <span className="text-[14px] text-body">
                  {x.awaited ? "Results awaited" : x.score}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-muted">None added</p>
        )}
      </ReviewCard>

      <ReviewCard title="Activities" onEdit={() => onEdit(3)}>
        {(
          [
            ["Extracurricular", acts.extra],
            ["Co-curricular", acts.co],
          ] as const
        ).map(([label, list]) => (
          <div key={label} className="mb-4 last:mb-0">
            <p className="text-[12.5px] text-muted">{label}</p>
            {list.length ? (
              <ul className="mt-1.5 grid gap-2.5">
                {list.map((x, i) => (
                  <li key={i}>
                    <p className="text-[14.5px] font-medium text-ink">
                      {x.type}{" "}
                      <span className="font-normal text-muted">
                        · {x.level}
                      </span>
                    </p>
                    <p className="mt-0.5 text-[13.5px] leading-[1.5] text-body">
                      {x.description}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-0.5 text-[14px] text-muted">None added</p>
            )}
          </div>
        ))}
      </ReviewCard>
    </div>
  );
}
