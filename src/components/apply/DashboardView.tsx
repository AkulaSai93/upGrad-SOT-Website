"use client";

import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";
import { signOut, useApplicant } from "./applicant";

/**
 * The applicant's dashboard: a placeholder until its design is ready. It
 * greets the signed-in applicant and lets them sign out; anyone not signed
 * in is pointed to /apply.
 */
export function DashboardView() {
  const applicant = useApplicant();

  return (
    <section className="container-page flex min-h-[70svh] flex-col items-center justify-center pb-20 pt-36 text-center">
      {applicant ? (
        <>
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-muted">
            Your dashboard
          </p>
          <h1 className="mt-3 font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.035em] text-ink">
            Hi, <span className="text-accent">{applicant.name}</span>
          </h1>
          <p className="mt-3 max-w-[460px] text-[15.5px] leading-[1.6] text-body">
            You&apos;re signed in with +91 {applicant.phone}. Your application
            dashboard is on its way.
          </p>
          <button
            type="button"
            onClick={signOut}
            className="mt-8 inline-flex items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white px-5 py-[11px] text-[14.5px] font-semibold text-ink transition-colors hover:border-ink"
          >
            <LogOut size={15} aria-hidden />
            Sign out
          </button>
        </>
      ) : (
        <>
          <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-medium leading-tight tracking-[-0.035em] text-ink">
            Sign in to see your dashboard
          </h1>
          <p className="mt-3 max-w-[460px] text-[15.5px] leading-[1.6] text-body">
            Verify your mobile number to start or continue your application.
          </p>
          <Link
            href="/apply"
            className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-accent px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Apply Now
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </Link>
        </>
      )}
    </section>
  );
}
