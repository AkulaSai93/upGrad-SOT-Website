"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ComponentProps,
  type DragEvent,
  type ReactNode,
} from "react";
import {
  Check,
  ChevronDown,
  Pencil,
  FileCheck2,
  Trash2,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";

/**
 * The dashboard's form kit: one look for every field across the
 * application steps (labels above, a red star for required, the control,
 * then its hint, or its error in its place), so fields side by side line
 * up and each step only lays out its fields and its rules.
 */

export const INPUT =
  "h-11 w-full rounded-[4px] border border-black/[0.1] bg-white px-3.5 text-[14.5px] text-ink outline-none transition-colors placeholder:text-muted/80 focus:border-ink disabled:cursor-not-allowed disabled:bg-black/[0.035] disabled:text-body aria-[invalid=true]:border-accent";

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
    <div
      className={`grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-2 ${className}`}
    >
      <label
        htmlFor={htmlFor}
        className="text-[13.5px] font-medium leading-tight text-ink"
      >
        {label}
        {required && <span className="text-accent"> *</span>}
      </label>
      {children}
      {error ? (
        <p role="alert" className="text-[12.5px] text-accent">
          {error}
        </p>
      ) : (
        hint && (
          <p className="-mt-0.5 text-[12.5px] leading-snug text-muted">
            {hint}
          </p>
        )
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

/** closes a popover on a click outside it or on Escape */
function useDismiss(
  open: boolean,
  box: React.RefObject<HTMLElement | null>,
  close: () => void,
) {
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!box.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, box, close]);
}

const POPOVER =
  "absolute inset-x-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[4px] border border-black/[0.1] bg-white shadow-[var(--shadow-lg)]";

/** the list in a popover: options, the active one tinted, the chosen one ticked */
function OptionList({
  id,
  options,
  value,
  active,
  setActive,
  choose,
  empty = "No matches",
}: {
  id: string;
  options: readonly string[];
  value: string;
  active: number;
  setActive: (i: number) => void;
  choose: (o: string) => void;
  empty?: string;
}) {
  const list = useRef<HTMLUListElement>(null);
  // keep the active option in view as the arrows move it
  useEffect(() => {
    list.current
      ?.querySelector<HTMLElement>(`[data-i="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!options.length)
    return <p className="px-3.5 py-3 text-[13.5px] text-muted">{empty}</p>;
  return (
    <ul
      ref={list}
      id={id}
      role="listbox"
      className="max-h-60 overflow-y-auto overscroll-contain p-1"
    >
      {options.map((o, i) => (
        <li
          key={o}
          data-i={i}
          role="option"
          aria-selected={o === value}
          onMouseDown={(e) => e.preventDefault()}
          onMouseEnter={() => setActive(i)}
          onClick={() => choose(o)}
          className={`flex cursor-pointer items-center justify-between gap-3 rounded-[4px] px-3 py-2.5 text-[14px] ${
            i === active ? "bg-black/[0.045]" : ""
          } ${o === value ? "font-medium text-accent" : "text-ink"}`}
        >
          {o}
          {o === value && <Check size={15} strokeWidth={2.4} aria-hidden />}
        </li>
      ))}
    </ul>
  );
}

/**
 * A dropdown in the site's style (in place of the browser's own): a field
 * that opens a list under it. Long lists get a search box. The arrow keys
 * move through the list, Enter picks, Escape or a click outside closes.
 * `onChange` gets `{ target: { value } }`, as a native select's would.
 */
export function Select({
  id,
  options,
  value = "",
  onChange,
  placeholder = "Select",
  invalid,
  disabled,
  icon: Icon,
  searchable,
}: {
  id?: string;
  options: readonly string[];
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  icon?: LucideIcon;
  /** a search box at the top of the list (on its own for lists over 8) */
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const search = searchable ?? options.length > 8;
  const shown = query
    ? options.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : options;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);
  useDismiss(open, box, close);

  const show = () => {
    setActive(Math.max(0, options.indexOf(value)));
    setOpen(true);
  };
  const choose = (o: string) => {
    onChange?.({ target: { value: o } });
    close();
    button.current?.focus();
  };
  const onKeys = (e: ReactKeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) return show();
      const by = e.key === "ArrowDown" ? 1 : -1;
      setActive((a) => (a + by + shown.length) % Math.max(shown.length, 1));
    } else if (e.key === "Enter" && open) {
      e.preventDefault();
      if (shown[active]) choose(shown[active]);
    } else if (e.key === "Tab") close();
  };

  return (
    <div ref={box} className="relative">
      <button
        ref={button}
        id={id}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        data-invalid={invalid || undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={onKeys}
        className={`${INPUT} flex items-center gap-2.5 text-left ${open ? "border-ink" : invalid ? "border-accent" : ""}`}
      >
        {Icon && <Icon size={17} className="shrink-0 text-muted" aria-hidden />}
        <span
          className={`min-w-0 flex-1 truncate ${value ? "" : "text-muted/80"}`}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          size={17}
          aria-hidden
          className={`shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className={POPOVER}>
          {search && (
            <div className="border-b border-black/[0.06] p-1.5">
              <input
                autoFocus
                aria-label="Search"
                placeholder="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onKeys}
                className="h-9 w-full rounded-[4px] bg-black/[0.035] px-3 text-[14px] text-ink outline-none placeholder:text-muted/80"
              />
            </div>
          )}
          <OptionList
            id={listId}
            options={shown}
            value={value}
            active={active}
            setActive={setActive}
            choose={choose}
          />
        </div>
      )}
    </div>
  );
}

/**
 * A text field with suggestions (for cities): type any value, or pick one
 * of the suggestions that match what has been typed so far.
 */
export function Combobox({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
  disabled,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();
  const q = value.trim().toLowerCase();
  const shown = (
    q ? options.filter((o) => o.toLowerCase().includes(q)) : options
  ).slice(0, 50);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, box, close);

  const choose = (o: string) => {
    onChange(o);
    close();
  };

  return (
    <div ref={box} className="relative">
      <input
        id={id}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-invalid={invalid || undefined}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            const by = e.key === "ArrowDown" ? 1 : -1;
            setActive(
              (a) => (a + by + shown.length) % Math.max(shown.length, 1),
            );
          } else if (e.key === "Enter" && open && shown[active]) {
            e.preventDefault();
            choose(shown[active]);
          } else if (e.key === "Tab") close();
        }}
        className={`${INPUT} pr-10`}
      />
      <ChevronDown
        size={17}
        aria-hidden
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
      />
      {open && !disabled && shown.length > 0 && (
        <div className={POPOVER}>
          <OptionList
            id={listId}
            options={shown}
            value={value}
            active={active}
            setActive={setActive}
            choose={choose}
          />
        </div>
      )}
    </div>
  );
}

/** a single choice as a row of equal chips (radio buttons underneath) */
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
      className="grid grid-cols-[repeat(auto-fit,minmax(92px,1fr))] gap-2"
    >
      {options.map((o) => {
        const on = value === o;
        return (
          <label
            key={o}
            className={`inline-flex h-11 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border px-3 text-center text-[13.5px] font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30 ${
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

/** a single choice as radio buttons in a row (for short answers like Yes / No) */
export function Radios({
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
      data-invalid={invalid || undefined}
      className="flex min-h-11 flex-wrap items-center gap-x-7 gap-y-2"
    >
      {options.map((o) => {
        const on = value === o;
        return (
          <label
            key={o}
            className="inline-flex cursor-pointer items-center gap-2.5 text-[14.5px] text-ink has-[:focus-visible]:[&>span]:ring-2 has-[:focus-visible]:[&>span]:ring-accent/30"
          >
            <input
              type="radio"
              name={name}
              value={o}
              checked={on}
              onChange={() => onChange(o)}
              className="sr-only"
            />
            <span
              aria-hidden
              className={`grid size-5 place-items-center rounded-full border-2 bg-white transition-colors ${
                on
                  ? "border-accent"
                  : invalid
                    ? "border-accent/60"
                    : "border-black/25"
              }`}
            >
              {on && <span className="size-2.5 rounded-full bg-accent" />}
            </span>
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
      className={`flex h-11 overflow-hidden rounded-[4px] border bg-white transition-colors focus-within:border-ink ${
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
      <div className="relative border-l border-black/[0.08] bg-black/[0.035]">
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
      <div className="flex items-center gap-3 rounded-[4px] border border-black/[0.1] bg-white px-3.5 py-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-[4px] bg-accent-soft text-accent">
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
          className="inline-flex items-center gap-1 rounded-[4px] px-2 py-1.5 text-[13px] font-medium text-body transition-colors hover:bg-black/[0.04] hover:text-ink"
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
        className={`flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-[4px] border border-dashed px-4 py-6 text-center transition-colors ${
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

/** one section of a form: its title above, its fields in a white card */
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
    <section>
      <header className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink">
            {title}
          </h2>
          {line && <p className="mt-0.5 text-[13px] text-muted">{line}</p>}
        </div>
        {action}
      </header>
      <div className="rounded-[6px] border border-black/[0.08] bg-white px-5 py-5 sm:px-6 sm:py-6">
        {children}
      </div>
    </section>
  );
}

/** a finished section, read back: its title and an Edit button above,
    then its answers as label / value pairs in a white card, two columns
    on wider screens */
export function ReviewCard({
  title,
  onEdit,
  rows,
  children,
}: {
  title: string;
  onEdit?: () => void;
  rows?: [label: string, value: ReactNode][];
  children?: ReactNode;
}) {
  return (
    <section>
      <header className="mb-3 flex items-end justify-between gap-3">
        <h2 className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink">
          {title}
        </h2>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-black/[0.1] px-3 py-1.5 text-[13px] font-semibold text-ink transition-colors hover:border-ink"
          >
            <Pencil size={13} aria-hidden />
            Edit
          </button>
        )}
      </header>
      <div className="rounded-[6px] border border-black/[0.08] bg-white px-5 py-5 sm:px-6">
        {rows && (
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {rows.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-[12.5px] text-muted">{label}</dt>
                <dd className="mt-0.5 break-words text-[14.5px] font-medium text-ink">
                  {value === "" || value === undefined || value === null
                    ? "—"
                    : value}
                </dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </div>
    </section>
  );
}

/** key facts at a glance: the title above, then label / value rows (the
    value on the right) in a white card, with an optional footer */
export function InfoCard({
  title,
  rows,
  footer,
}: {
  title: string;
  rows: [label: string, value: ReactNode][];
  footer?: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink">
        {title}
      </h2>
      <div className="rounded-[6px] border border-black/[0.08] bg-white px-5 py-2 sm:px-6">
        <dl className="divide-y divide-black/[0.06]">
          {rows.map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 py-3"
            >
              <dt className="text-[14px] text-body">{label}</dt>
              <dd className="min-w-0 truncate text-right text-[14px] font-semibold text-ink">
                {value === "" || value === undefined || value === null
                  ? "—"
                  : value}
              </dd>
            </div>
          ))}
        </dl>
        {footer && (
          <div className="border-t border-black/[0.06] py-4">{footer}</div>
        )}
      </div>
    </section>
  );
}

/** a date (YYYY-MM-DD or ISO) as "14 March 2008" */
export const longDate = (d: string) =>
  d
    ? new Date(d.length === 10 ? `${d}T00:00:00` : d).toLocaleDateString(
        "en-IN",
        { day: "numeric", month: "long", year: "numeric" },
      )
    : "";

/** two columns on wider screens, one on phones */
export function Grid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5 sm:grid-cols-2">
      {children}
    </div>
  );
}

export const PRIMARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[4px] bg-accent px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50";

export const SECONDARY_BUTTON =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[4px] border border-black/[0.1] bg-white px-5 text-[14.5px] font-semibold text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-50";
