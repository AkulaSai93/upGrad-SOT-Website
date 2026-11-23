"use client";

import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { ApplicationFee } from "./ApplicationFee";
import { useApp } from "./DashboardShell";
import { ProfilingView } from "./ProfilingView";
import { SlotView, TestPanel } from "./SlotView";
import { UgnetFormView } from "./UgnetFormView";
import { applicationId } from "./application";
import { InfoCard, PRIMARY_BUTTON, longDate } from "./fields";
import { money } from "./fees";
import { openInvoice } from "./invoice";
import { STEPS, stepStates } from "./steps";

/**
 * The dashboard's home, in the website's own visual language (photos:
 * Figma AI, SOT Website file):
 *
 * - (the welcome banner above it comes from the shell, on every tab);
 * - once no step is left to fill in here, what is done at a glance: the
 *   application fee (with the invoice to download) and the uGNET form's
 *   main details;
 * - once a slot is booked, the countdown to the test and its link;
 * - the step the applicant is on, its form right here to fill in (the
 *   rail beside it lists every step, so there is no second list here).
 */

/** each step that has a page, by its id */
const STEP_VIEWS: Record<string, () => React.JSX.Element> = {
  "application-fee": ApplicationFee,
  "ugnet-form": UgnetFormView,
  profiling: ProfilingView,
  "ugnet-slot": SlotView,
};

export function Overview() {
  const app = useApp();
  const states = stepStates(app);
  const nextIndex = states.indexOf("current");
  const next = STEPS[nextIndex];

  // the step to fill in here, when the next one has a page
  const shown = next && STEP_VIEWS[next.id] ? next : undefined;
  const StepView = shown && STEP_VIEWS[shown.id];
  const st = app.ugnet.student;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
      {/* what is done so far, at a glance: only once there is no form to
          fill in here, so a step's form never sits under these */}
      {!StepView && (app.payment || app.ugnet.submittedAt) && (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6">
          {app.payment && (
            <InfoCard
              title="Application fee"
              rows={[
                ["Full name", app.profile.name],
                ["Contact number", `+91 ${app.profile.phone}`],
                ["Application ID", applicationId(app.profile.phone)],
                [
                  "Amount",
                  <span key="paid" className="text-[#16794a]">
                    Paid · {money(app.payment.amount)}
                  </span>,
                ],
              ]}
              footer={
                <button
                  type="button"
                  onClick={() => openInvoice(app)}
                  className={`${PRIMARY_BUTTON} h-10 px-4 text-[13.5px]`}
                >
                  <Download size={16} aria-hidden />
                  Download invoice
                </button>
              }
            />
          )}
          {app.ugnet.submittedAt && st && (
            <InfoCard
              title="uGNET form"
              rows={[
                ["Full name", `${st.firstName} ${st.lastName}`.trim()],
                ["Email address", st.email],
                ["Contact number", `+91 ${st.phone}`],
                ["City", st.city],
                ["Date of birth", longDate(st.dob)],
                ["Gender", st.gender],
                ["Nationality", st.nationality],
                ["Application ID", applicationId(app.profile.phone)],
              ]}
              footer={
                <Link
                  href="/dashboard/ugnet-form"
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-accent hover:underline"
                >
                  View the full form
                  <ArrowRight size={15} aria-hidden />
                </Link>
              }
            />
          )}
        </div>
      )}

      {/* the test: the countdown and the assessment link */}
      {app.slot && (
        <section>
          <h2 className="mb-3 text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink">
            Quick links
          </h2>
          <TestPanel booking={app.slot} />
        </section>
      )}

      {/* the step they are on, its form right here */}
      {StepView && (
        <div id="current-step" className="scroll-mt-24">
          <StepView />
        </div>
      )}
    </div>
  );
}
