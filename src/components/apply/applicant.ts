"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * The signed-in applicant, kept in this browser's localStorage until the
 * admissions back end is wired up. Verifying the OTP on /apply signs in;
 * the navbar then swaps Apply Now for a link to the dashboard.
 *
 * Every component reads it through useApplicant(), which re-renders on a
 * change made in this tab (a custom event) or in another tab (the browser's
 * storage event). On the server, and before hydration, nobody is signed in.
 */
export type Applicant = { name: string; phone: string };

const KEY = "sot-applicant";
const CHANGE = "sot-applicant-change";

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null; // storage blocked (private mode, cookies off)
  }
}

function parse(raw: string | null): Applicant | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Applicant>;
    return typeof value.name === "string" && typeof value.phone === "string"
      ? { name: value.name, phone: value.phone }
      : null;
  } catch {
    return null;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

function write(raw: string | null) {
  try {
    if (raw === null) window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, raw);
  } catch {
    // storage blocked: the session simply won't persist
  }
  window.dispatchEvent(new Event(CHANGE));
}

/** the signed-in applicant, or null */
export function useApplicant(): Applicant | null {
  const raw = useSyncExternalStore(subscribe, readRaw, () => null);
  return useMemo(() => parse(raw), [raw]);
}

export function signIn(applicant: Applicant) {
  write(JSON.stringify(applicant));
}

export function signOut() {
  write(null);
}
