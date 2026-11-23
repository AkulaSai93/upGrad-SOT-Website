"use client";

import { createLocalStore } from "./localStore";

/**
 * The signed-in applicant, kept in this browser until the admissions back
 * end is wired up. Verifying the OTP on /apply signs in; the navbar then
 * swaps Apply Now for a link to the dashboard. On the server, and before
 * hydration, nobody is signed in.
 */
export type Applicant = { name: string; phone: string };

const store = createLocalStore<Applicant>("sot-applicant", (value) => {
  const v = value as Partial<Applicant> | null;
  return v && typeof v.name === "string" && typeof v.phone === "string"
    ? { name: v.name, phone: v.phone }
    : null;
});

/** the signed-in applicant, or null */
export const useApplicant = store.use;

export const signIn = (applicant: Applicant) => store.set(applicant);

export const signOut = () => store.clear();
