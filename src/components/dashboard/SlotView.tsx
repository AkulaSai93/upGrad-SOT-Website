"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  X,
} from "lucide-react";
import { PHONE } from "@/components/site/contact";
import { StepGate, useApp } from "./DashboardShell";
import { saveApplication, type SlotBooking } from "./application";
import { INPUT, PRIMARY_BUTTON, SECONDARY_BUTTON } from "./fields";

/**
 * Step 4, uGNET Slot Selection (from the form's Figma): the test date and
 * its three 2-hour slots as cards; picking one shows it in a bar with
 * Confirm booking, which asks the student to type "confirm" before it
 * books (a slot cannot be changed online afterwards). Once booked: the
 * date and time, a countdown to the start, the assessment link (live from
 * the slot's start) and the common questions.
 *
 * The date is the uGNET date the site shows (12 Jan 2027); the slot times
 * are the Figma's.
 */

const TEST_DATE = "2027-01-12";

const SLOTS = [
  { id: "slot-1", label: "Slot 1", start: "12:00", end: "14:00" },
  { id: "slot-2", label: "Slot 2", start: "14:00", end: "16:00" },
  { id: "slot-3", label: "Slot 3", start: "16:00", end: "18:00" },
];

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const time = (hhmm: string) =>
  new Date(`2000-01-01T${hhmm}:00`)
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

const span = (s: (typeof SLOTS)[number]) =>
  `${time(s.start)} to ${time(s.end)}`;

const FAQS = [
  {
    q: "Can I change my slot or reschedule my test?",
    a: `Slots cannot be changed online once booked. If you need a different time, call admissions on ${PHONE.label} before your slot.`,
  },
  {
    q: "Where will I take the test?",
    a: "uGNET is an online test. Take it from home on a laptop or desktop with a webcam and a steady internet connection.",
  },
  {
    q: "How can I prepare for the test?",
    a: "The uGNET page sets out what the test covers and how it is marked. Practise with a timer so the two hours feel familiar.",
  },
  {
    q: "How do I sign in to the test?",
    a: "The assessment link on this page goes live when your slot starts. Your sign-in details are emailed to you before the test.",
  },
];

/** the current time, ticking every second */
function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

function Countdown({ to, now }: { to: Date; now: number }) {
  const left = Math.max(0, to.getTime() - now);
  const parts = [
    ["Days", Math.floor(left / 86400000)],
    ["Hours", Math.floor(left / 3600000) % 24],
    ["Minutes", Math.floor(left / 60000) % 60],
    ["Seconds", Math.floor(left / 1000) % 60],
  ] as const;
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {parts.map(([label, n]) => (
        <div
          key={label}
          className="rounded-[8px] bg-white/10 px-2 py-3 text-center"
        >
          <p className="font-display text-[clamp(1.5rem,3vw,2rem)] font-medium leading-none tabular-nums">
            {String(n).padStart(2, "0")}
          </p>
          <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-white/60">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({
  slot,
  onCancel,
  onBook,
}: {
  slot: (typeof SLOTS)[number];
  onCancel: () => void;
  onBook: () => void;
}) {
  const [typed, setTyped] = useState("");
  const ok = typed.trim().toLowerCase() === "confirm";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onCancel]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (ok) onBook();
        }}
        className="w-full max-w-[440px] rounded-t-[8px] bg-white p-6 shadow-[var(--shadow-lg)] sm:rounded-[8px]"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="confirm-title"
            className="font-display text-[20px] font-semibold tracking-[-0.02em] text-ink"
          >
            Confirm your booking
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted hover:bg-sunken hover:text-ink"
          >
            <X size={18} aria-hidden />
          </button>
        </div>
        <p className="mt-1 text-[14px] text-body">
          Slots can&apos;t be changed online after booking. Type{" "}
          <span className="font-semibold text-accent">confirm</span> to book.
        </p>
        <div className="mt-5 grid gap-2 rounded-[8px] bg-sunken p-4 text-[14px] text-ink">
          <p className="flex items-center gap-2.5">
            <Calendar size={16} className="text-accent" aria-hidden />
            {dateLabel(TEST_DATE)}
          </p>
          <p className="flex items-center gap-2.5">
            <Clock size={16} className="text-accent" aria-hidden />
            {span(slot)}
          </p>
        </div>
        <label
          htmlFor="confirm-word"
          className="mt-5 block text-[13.5px] font-medium text-ink"
        >
          Type confirm to book this slot
        </label>
        <input
          id="confirm-word"
          autoFocus
          autoComplete="off"
          placeholder="confirm"
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          className={`${INPUT} mt-2`}
        />
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button type="button" onClick={onCancel} className={SECONDARY_BUTTON}>
            Cancel
          </button>
          <button type="submit" disabled={!ok} className={PRIMARY_BUTTON}>
            Book slot
          </button>
        </div>
      </form>
    </div>
  );
}

function Booked({ booking }: { booking: SlotBooking }) {
  const slot = SLOTS.find((s) => s.id === booking.slot) ?? SLOTS[0];
  const start = new Date(`${booking.date}T${slot.start}:00`);
  const now = useNow();
  const live = now >= start.getTime();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="grid gap-6">
      <section className="rounded-[8px] border border-black/[0.08] bg-white p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <span className="grid size-14 place-items-center rounded-full bg-[#e9f7ef] text-[#16794a]">
            <CheckCircle2 size={28} aria-hidden />
          </span>
          <h2 className="mt-4 font-display text-[24px] font-medium tracking-[-0.02em] text-ink">
            Slot booked
          </h2>
          <p className="mt-1.5 text-[14.5px] text-body">
            Your uGNET slot is confirmed. See you on the day.
          </p>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {[
            { Icon: Calendar, k: "Test date", v: dateLabel(booking.date) },
            { Icon: Clock, k: "Time slot", v: span(slot) },
          ].map(({ Icon, k, v }) => (
            <div
              key={k}
              className="flex items-center gap-3 rounded-[8px] border border-black/[0.08] px-4 py-3.5"
            >
              <span className="grid size-10 place-items-center rounded-[8px] bg-accent-soft text-accent">
                <Icon size={18} aria-hidden />
              </span>
              <span>
                <span className="block text-[12.5px] text-muted">{k}</span>
                <span className="block text-[14.5px] font-semibold text-ink">
                  {v}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[8px] bg-ink p-6 text-white sm:p-8">
        <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/60">
          Time until your test
        </p>
        <div className="mt-4">
          <Countdown to={start} now={now} />
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[15px] font-semibold">uGNET assessment</p>
            <p className="text-[13px] text-white/65">
              {live
                ? "Your test is open now."
                : "The link goes live when your slot starts."}
            </p>
          </div>
          <button
            type="button"
            disabled={!live}
            className={`${PRIMARY_BUTTON} disabled:bg-white/15 disabled:opacity-100`}
          >
            Open assessment
            <ExternalLink size={15} aria-hidden />
          </button>
        </div>
      </section>

      <section className="rounded-[8px] border border-black/[0.08] bg-white">
        <h2 className="border-b border-black/[0.06] px-5 py-4 font-display text-[17px] font-semibold text-ink sm:px-6">
          Common questions
        </h2>
        <ul className="divide-y divide-black/[0.06]">
          {FAQS.map((f, i) => (
            <li key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[14.5px] font-medium text-ink sm:px-6"
              >
                {f.q}
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-muted transition-transform ${open === i ? "rotate-180" : ""}`}
                />
              </button>
              {open === i && (
                <p className="px-5 pb-4 text-[14px] leading-[1.6] text-body sm:px-6">
                  {f.a}
                  {i === 2 && (
                    <>
                      {" "}
                      <Link
                        href="/ugnet"
                        className="font-medium text-accent hover:underline"
                      >
                        See the uGNET page
                      </Link>
                    </>
                  )}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export function SlotView() {
  const app = useApp();
  const [picked, setPicked] = useState<string>("");
  const [confirming, setConfirming] = useState(false);
  const slot = SLOTS.find((s) => s.id === picked);

  const book = () => {
    saveApplication({
      ...app,
      slot: {
        date: TEST_DATE,
        slot: picked,
        bookedAt: new Date().toISOString(),
      },
    });
    setConfirming(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <StepGate id="ugnet-slot">
      {app.slot ? (
        <Booked booking={app.slot} />
      ) : (
        <div className="grid gap-6">
          <section className="rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-[8px] bg-accent-soft text-accent">
                <Calendar size={20} aria-hidden />
              </span>
              <div>
                <h2 className="text-[16px] font-semibold text-ink">
                  {dateLabel(TEST_DATE)}
                </h2>
                <p className="text-[13px] text-muted">
                  uGNET 2027 · January test
                </p>
              </div>
            </div>
            <div
              role="radiogroup"
              aria-label="Time slot"
              className="mt-5 grid gap-3 sm:grid-cols-3"
            >
              {SLOTS.map((s) => {
                const on = picked === s.id;
                return (
                  <label
                    key={s.id}
                    className={`relative flex cursor-pointer flex-col gap-1 rounded-[6px] border-2 p-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent/30 ${
                      on
                        ? "border-accent bg-accent-soft"
                        : "border-black/[0.08] hover:border-black/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={s.id}
                      checked={on}
                      onChange={() => setPicked(s.id)}
                      className="sr-only"
                    />
                    {on && (
                      <span className="absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-accent text-white">
                        <Check size={14} strokeWidth={3} aria-hidden />
                      </span>
                    )}
                    <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {s.label}
                    </span>
                    <span className="flex items-center gap-2 text-[16px] font-semibold text-ink">
                      <Clock size={16} className="text-accent" aria-hidden />
                      {span(s)}
                    </span>
                    <span className="text-[12.5px] text-muted">
                      2 hours · Limited seats
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {slot ? (
            <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:mx-0 lg:rounded-[8px] lg:border lg:px-5">
              <div>
                <p className="text-[12.5px] text-muted">Selected slot</p>
                <p className="text-[14.5px] font-semibold text-ink">
                  {dateLabel(TEST_DATE)} · {span(slot)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirming(true)}
                className={PRIMARY_BUTTON}
              >
                Confirm booking
                <ArrowRight size={16} aria-hidden />
              </button>
            </div>
          ) : (
            <p className="text-center text-[13.5px] text-muted">
              Pick a slot to continue
            </p>
          )}
        </div>
      )}
      {confirming && slot && (
        <ConfirmDialog
          slot={slot}
          onCancel={() => setConfirming(false)}
          onBook={book}
        />
      )}
    </StepGate>
  );
}
