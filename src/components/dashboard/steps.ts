import {
  Award,
  CalendarClock,
  CalendarDays,
  ClipboardList,
  FileText,
  Landmark,
  type LucideIcon,
  ShieldCheck,
  UserRoundSearch,
  Wallet,
} from "lucide-react";
import type { Application } from "./application";

/**
 * The nine steps of an application, in order, as the admissions journey
 * runs: each unlocks when the one before it is done. The first four have
 * their own pages so far; the rest show as locked until they are built.
 */
export type Step = {
  id: string;
  title: string;
  /** one line on what happens in the step */
  line: string;
  href?: string;
  /** the step's photo (Figma AI, SOT Website file) */
  image: string;
  Icon: LucideIcon;
  done: (a: Application) => boolean;
};

export const STEPS: Step[] = [
  {
    id: "application-fee",
    image: "/images/dashboard/application-fee.webp",
    title: "Application Fee",
    line: "Confirm your details and pay the uGNET fee",
    href: "/dashboard/application-fee",
    Icon: Wallet,
    done: (a) => Boolean(a.payment),
  },
  {
    id: "ugnet-form",
    image: "/images/dashboard/ugnet-form.webp",
    title: "uGNET Form",
    line: "Tell us about you, your studies and interests",
    href: "/dashboard/ugnet-form",
    Icon: FileText,
    done: (a) => Boolean(a.ugnet.submittedAt),
  },
  {
    id: "profiling",
    image: "/images/dashboard/profiling.webp",
    title: "Comprehensive Profiling",
    line: "A few questions about your languages and family",
    href: "/dashboard/profiling",
    Icon: UserRoundSearch,
    done: (a) => Boolean(a.profiling?.submittedAt),
  },
  {
    id: "ugnet-slot",
    image: "/images/dashboard/ugnet-slot.webp",
    title: "uGNET Slot Selection",
    line: "Pick the date and time for your test",
    href: "/dashboard/ugnet-slot",
    Icon: CalendarDays,
    done: (a) => Boolean(a.slot),
  },
  {
    id: "test-results",
    image: "/images/dashboard/test-results.webp",
    title: "Test Results",
    line: "Your uGNET score",
    Icon: ClipboardList,
    done: () => false,
  },
  {
    id: "interview-slot",
    image: "/images/dashboard/interview-slot.webp",
    title: "Interview Slot Selection",
    line: "Book your interview",
    Icon: CalendarClock,
    done: () => false,
  },
  {
    id: "scholarship",
    image: "/images/dashboard/scholarship.webp",
    title: "Result & Scholarship",
    line: "Your result and any scholarship",
    Icon: Award,
    done: () => false,
  },
  {
    id: "block-amount",
    image: "/images/dashboard/block-amount.webp",
    title: "Block Amount",
    line: "Hold your seat",
    Icon: ShieldCheck,
    done: () => false,
  },
  {
    id: "admission-fee",
    image: "/images/dashboard/admission-fee.webp",
    title: "Admission Fee",
    line: "Complete your admission",
    Icon: Landmark,
    done: () => false,
  },
];

export type StepState = "done" | "current" | "locked";

/** each step's state: done, the one to do next, or still locked */
export function stepStates(a: Application): StepState[] {
  const current = STEPS.findIndex((s) => !s.done(a));
  return STEPS.map((s, i) =>
    s.done(a) ? "done" : i === current ? "current" : "locked",
  );
}
