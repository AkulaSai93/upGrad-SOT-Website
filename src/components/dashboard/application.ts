"use client";

import { useApplicant } from "@/components/apply/applicant";
import { createLocalStore } from "@/components/apply/localStore";
import type { FileRef } from "./fields";

/**
 * The applicant's application, saved in this browser (per mobile number)
 * until the admissions back end is wired up. The name and number come
 * from signing in on /apply; everything else is filled in step by step on
 * the dashboard, and each step's answers are kept as they are typed.
 */

export type Profile = {
  name: string;
  phone: string;
  email: string;
  emailVerified: boolean;
  dob: string; // YYYY-MM-DD
  state: string;
  city: string;
};

export type Payment = {
  amount: number;
  method: string;
  reference: string;
  paidAt: string; // ISO date
};

export type Address = {
  line1: string;
  line2: string;
  state: string;
  city: string;
  pincode: string;
};

export type StudentDetails = {
  photo?: string; // a small JPEG data URL
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  state: string;
  city: string;
  nationality: string;
  guardian: {
    firstName: string;
    lastName: string;
    relation: string;
    phone: string;
    email: string;
  };
  current: Address;
  permanentSame: boolean;
  permanent: Address;
};

export type Score = { value: string; unit: string };

export type ClassRecord = {
  board: string;
  school: string;
  city: string;
  year: string;
  status: string; // Class 12 only: waiting for results, or has them
  score: Score;
  math: Score;
  marksheet?: FileRef;
};

export type Academics = { x: ClassRecord; xi: ClassRecord; xii: ClassRecord };

export type ExamEntry = {
  name: string;
  year: string;
  score: string;
  awaited: boolean;
};

export type Activity = { type: string; level: string; description: string };

export type Activities = { extra: Activity[]; co: Activity[] };

export type UgnetForm = {
  student?: StudentDetails;
  academics?: Academics;
  exams?: ExamEntry[];
  activities?: Activities;
  declared?: boolean;
  /** the furthest section reached (0 to 4) */
  reached: number;
  submittedAt?: string;
};

export type Profiling = {
  motherTongue: string;
  second: string;
  third: string;
  fatherOccupation: string;
  motherOccupation: string;
  income: string;
  ews: string;
  submittedAt?: string;
};

export type SlotBooking = {
  date: string; // YYYY-MM-DD
  slot: string; // the slot's id
  bookedAt: string;
};

export type Application = {
  profile: Profile;
  payment?: Payment;
  ugnet: UgnetForm;
  profiling?: Profiling;
  slot?: SlotBooking;
};

/** the uGNET application fee, in rupees (sot.upgrad.com/uGNET) */
export const APPLICATION_FEE = 1000;

type Saved = Record<string, Application>; // by mobile number

const store = createLocalStore<Saved>("sot-applications", (value) =>
  value && typeof value === "object" ? (value as Saved) : null,
);

const fresh = (name: string, phone: string): Application => ({
  profile: {
    name,
    phone,
    email: "",
    emailVerified: false,
    dob: "",
    state: "",
    city: "",
  },
  ugnet: { reached: 0 },
});

/** the signed-in applicant's application (a fresh one if they have none) */
export function useApplication(): Application | null {
  const applicant = useApplicant();
  const saved = store.use();
  if (!applicant) return null;
  return saved?.[applicant.phone] ?? fresh(applicant.name, applicant.phone);
}

/** save the application (the first save creates it) */
export function saveApplication(application: Application) {
  const saved = store.get() ?? {};
  store.set({ ...saved, [application.profile.phone]: application });
}

/** the reference the admissions team quotes back, from the mobile number */
export const applicationId = (phone: string) =>
  `UG27-${phone.slice(-6).split("").reverse().join("")}`;

/** "Asha Verma" → "Asha" */
export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

/** the age in whole years on a given day, from a YYYY-MM-DD birth date */
export function ageOn(dob: string, on = new Date()) {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return 0;
  let age = on.getFullYear() - y;
  if (on.getMonth() + 1 < m || (on.getMonth() + 1 === m && on.getDate() < d))
    age -= 1;
  return age;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const PHONE_RE = /^[6-9]\d{9}$/;
export const PINCODE_RE = /^[1-9]\d{5}$/;
