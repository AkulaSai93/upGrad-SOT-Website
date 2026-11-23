"use client";

import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type ComponentProps,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  Check,
  ChevronDown,
  FileCheck2,
  Trash2,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";

/**
 * The dashboard's form kit: one look for every field across the
 * application steps (labels above, a red star for required, a hint under
 * the label, the error under the field), so each step only lays out its
 * fields and its rules.
 */

export const INPUT =
  "h-11 w-full rounded-[6px] border border-black/[0.1] bg-white px-3.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-ink disabled:cursor-not-allowed disabled:bg-sunken disabled:text-body aria-[invalid=true]:border-accent";

/** a labelled field: label, optional hint, the control, then any error */
export function Field({
  label,
  required = false,
  hint,
  error,
  htmlFor,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`grid content-start gap-2 ${className}`}>
      <div>
        <label
          htmlFor={htmlFor}
          className="text-[13.5px] font-medium leading-tight text-ink"
        >
          {label}
          {required && <span className="text-accent"> *</span>}
        </label>
        {hint && (
          <p className="mt-1 text-[12.5px] leading-snug text-muted">{hint}</p>
        )}
      </div>
      {children}
      {error && (
        <p role="alert" className="text-[12.5px] text-accent">
          {error}
        </p>
      )}
    </div>
  );
}

/** a text input with an optional icon at its start */
export function TextInput({
  icon: Icon,
  invalid,
  className = "",
  ...props
}: ComponentProps<"input"> & { icon?: LucideIcon; invalid?: boolean }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={17}
          aria-hidden
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
      )}
      <input
        aria-invalid={invalid || undefined}
        className={`${INPUT} ${Icon ? "pl-10" : ""} ${className}`}
        {...props}
      />
    </div>
  );
}

export function TextArea({
  invalid,
  className = "",
  ...props
}: ComponentProps<"textarea"> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={`${INPUT} h-auto min-h-[104px] resize-y py-3 leading-[1.5] ${className}`}
      {...props}
    />
  );
}

/** a native select, styled like the inputs, with a placeholder choice */
export function Select({
  options,
  placeholder = "Select",
  invalid,
  className = "",
  ...props
}: Omit<ComponentProps<"select">, "children"> & {
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid || undefined}
        className={`${INPUT} appearance-none pr-10 ${props.value ? "" : "text-muted/80"} ${className}`}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={17}
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
    </div>
  );
}

/** a single choice shown as a row of chips (radio buttons underneath) */
export function Chips({
  name,
  options,
  value,
  onChange,
  invalid,
}: {
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <div
      role="radiogroup"
      aria-invalid={invalid || undefined}
      className="flex flex-wrap gap-2"
    >
      {options.map((o) => {
        const on = value === o;
        return (
          <label
            key={o}
            className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-[4px] border px-4 text-[13.5px] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30 ${
              on
                ? "border-accent bg-accent-soft text-accent"
                : invalid
                  ? "border-accent/50 text-ink hover:border-ink"
                  : "border-black/[0.1] text-ink hover:border-ink"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={o}
              checked={on}
              onChange={() => onChange(o)}
              className="sr-only"
            />
            {on && <Check size={14} strokeWidth={2.6} aria-hidden />}
            {o}
          </label>
        );
      })}
    </div>
  );
}

/** a tick box with its label beside it */
export function Checkbox({
  checked,
  onChange,
  children,
  invalid,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  invalid?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.55] text-body">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={`mt-[2px] grid size-5 shrink-0 place-items-center rounded-[4px] border text-white transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 ${
          checked
            ? "border-accent bg-accent"
            : invalid
              ? "border-accent bg-white"
              : "border-black/20 bg-white"
        }`}
      >
        {checked && <Check size={13} strokeWidth={3} />}
      </span>
      <span>{children}</span>
    </label>
  );
}

/** a score: the number, then its unit (percentage or CGPA) */
export function ScoreInput({
  id,
  value,
  unit,
  onValue,
  onUnit,
  invalid,
}: {
  id?: string;
  value: string;
  unit: string;
  onValue: (value: string) => void;
  onUnit: (unit: string) => void;
  invalid?: boolean;
}) {
  return (
    <div
      className={`flex h-11 overflow-hidden rounded-[6px] border bg-white transition-colors focus-within:border-ink ${
        invalid ? "border-accent" : "border-black/[0.1]"
      }`}
    >
      <input
        id={id}
        inputMode="decimal"
        placeholder={unit === "CGPA" ? "e.g. 9.2" : "e.g. 86.40"}
        value={value}
        onChange={(e) => onValue(e.target.value.replace(/[^\d.]/g, ""))}
        className="min-w-0 flex-1 bg-transparent px-3.5 text-[14.5px] text-ink outline-none placeholder:text-muted/80"
      />
      <div className="relative border-l border-black/[0.08] bg-sunken">
        <select
          aria-label="Score type"
          value={unit}
          onChange={(e) => onUnit(e.target.value)}
          className="h-full appearance-none bg-transparent pl-3 pr-8 text-[13.5px] font-medium text-ink outline-none"
        >
          <option>Percentage</option>
          <option>CGPA</option>
        </select>
        <ChevronDown
          size={15}
          aria-hidden
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}

export type FileRef = { name: string; size: number };

const FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_BYTES = 1024 * 1024;

/**
 * A mark sheet upload: drop a file or browse for one (JPG, PNG or PDF, up
 * to 1 MB). Only its name and size are kept until uploads go to the back
 * end; once chosen it shows as a file row that can be removed.
 */
export function FileDrop({
  value,
  onChange,
  invalid,
}: {
  value?: FileRef;
  onChange: (file: FileRef | undefined) => void;
  invalid?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const id = useId();
  const [over, setOver] = useState(false);
  const [problem, setProblem] = useState("");

  const take = (file?: File) => {
    if (!file) return;
    if (!FILE_TYPES.includes(file.type))
      return setProblem("Use a JPG, PNG or PDF file.");
    if (file.size > MAX_BYTES)
      return setProblem("That file is over 1 MB. Try a smaller scan.");
    setProblem("");
    onChange({ name: file.name, size: file.size });
  };

  if (value) {
    return (
      <div className="flex items-center gap-3 rounded-[6px] border border-black/[0.1] bg-white px-3.5 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[6px] bg-accent-soft text-accent">
          <FileCheck2 size={18} aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14px] font-medium text-ink">
            {value.name}
          </span>
          <span className="block text-[12.5px] text-muted">
            {(value.size / 1024).toFixed(0)} KB · Uploaded
          </span>
        </span>
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className="inline-flex items-center gap-1 rounded-[6px] px-2 py-1.5 text-[13px] font-medium text-body transition-colors hover:bg-sunken hover:text-ink"
        >
          <Trash2 size={15} aria-hidden />
          Remove
        </button>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setOver(false);
          take(e.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[6px] border border-dashed px-4 py-6 text-center transition-colors ${
          over
            ? "border-accent bg-accent-soft"
            : invalid
              ? "border-accent bg-white"
              : "border-black/20 bg-white hover:border-ink"
        }`}
      >
        <UploadCloud size={22} className="text-accent" aria-hidden />
        <span className="text-[14px] text-ink">
          <span className="font-semibold text-accent">Click to upload</span> or
          drag and drop
        </span>
        <span className="text-[12.5px] text-muted">
          JPG, PNG or PDF, up to 1 MB
        </span>
      </label>
      <input
        ref={input}
        id={id}
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          take(e.target.files?.[0]);
          e.target.value = "";
        }}
        className="sr-only"
      />
      {problem && (
        <p role="alert" className="mt-2 text-[12.5px] text-accent">
          {problem}
        </p>
      )}
    </div>
  );
}

/** a white card holding one section of a form */
export function SectionCard({
  title,
  line,
  action,
  children,
}: {
  title: string;
  line?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[6px] border border-black/[0.08] bg-white">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-black/[0.06] px-5 py-4 sm:px-6">
        <div>
          <h2 className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink">
            {title}
          </h2>
          {line && <p className="mt-0.5 text-[13px] text-muted">{line}</p>}
        </div>
        {action}
      </header>
      <div className="px-5 py-5 sm:px-6 sm:py-6">{children}</div>
    </section>
  );
}

/** two columns on wider screens, one on phones */
export function Grid({ children }: { children: ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export const PRIMARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-accent px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50";

export const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-black/[0.1] bg-white px-5 text-[14.5px] font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50";
