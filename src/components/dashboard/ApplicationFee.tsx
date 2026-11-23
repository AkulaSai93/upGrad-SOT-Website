"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";
import { CITIES, STATES } from "@/components/site/india";
import { OtpInput, OTP_LENGTH } from "@/components/apply/OtpInput";
import { StepGate, useApp } from "./DashboardShell";
import {
  APPLICATION_FEE,
  EMAIL_RE,
  ageOn,
  saveApplication,
  type Application,
  type Profile,
} from "./application";
import {
  Field,
  Grid,
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
  TextInput,
} from "./fields";

/**
 * Step 1, Application Fee: confirm your details, then pay the uGNET fee.
 *
 * The name and mobile number come from signing in (the number is already
 * verified, so it is shown locked); the email is verified with a 6-digit
 * code; then date of birth (17 or over), state and city. Every answer is
 * saved as it is typed. The fee card beside the form (under it on phones)
 * opens the checkout once the details are complete.
 *
 * Checkout: pick UPI, card or net banking and pay. It runs in test mode
 * until the payment gateway is connected: no money is taken, and the
 * email code and payment both succeed. Once paid, the page shows the
 * receipt and the way on to the uGNET form.
 */

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** the latest date of birth that makes someone 17 today */
function latestDob() {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 17);
  return d.toISOString().slice(0, 10);
}

type Errors = Partial<Record<keyof Profile, string>>;

function check(p: Profile): Errors {
  const e: Errors = {};
  if (p.name.trim().length < 2) e.name = "Enter your full name.";
  if (!EMAIL_RE.test(p.email)) e.email = "Enter a valid email address.";
  else if (!p.emailVerified) e.email = "Verify your email to continue.";
  if (!p.dob) e.dob = "Enter your date of birth.";
  else if (ageOn(p.dob) < 17) e.dob = "You must be 17 years or above.";
  if (!p.state) e.state = "Select your state.";
  if (!p.city.trim()) e.city = "Enter your city.";
  return e;
}

/** the email field, with its Verify button and the code under it */
function EmailField({
  profile,
  update,
  error,
}: {
  profile: Profile;
  update: (patch: Partial<Profile>) => void;
  error?: string;
}) {
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState("");
  const valid = EMAIL_RE.test(profile.email);

  return (
    <Field
      label="Email ID"
      required
      htmlFor="fee-email"
      error={sent ? undefined : error}
      className="sm:col-span-2"
    >
      <div className="flex gap-2">
        <div className="min-w-0 flex-1">
          <TextInput
            id="fee-email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@example.com"
            value={profile.email}
            disabled={profile.emailVerified}
            invalid={Boolean(error) && !sent}
            onChange={(e) => {
              update({ email: e.target.value.trim(), emailVerified: false });
              setSent(false);
            }}
          />
        </div>
        {profile.emailVerified ? (
          <button
            type="button"
            onClick={() => update({ emailVerified: false })}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[6px] px-3 text-[13.5px] font-medium text-[#16794a]"
            title="Change email"
          >
            <BadgeCheck size={17} aria-hidden />
            Verified
          </button>
        ) : (
          <button
            type="button"
            disabled={!valid || sent}
            onClick={() => {
              setSent(true);
              setCode("");
            }}
            className={`${SECONDARY_BUTTON} shrink-0 px-4`}
          >
            Verify
          </button>
        )}
      </div>

      {sent && !profile.emailVerified && (
        <div className="mt-1 rounded-[8px] border border-black/[0.08] bg-sunken/60 p-4">
          <p className="text-[13.5px] text-body">
            Enter the {OTP_LENGTH}-digit code sent to{" "}
            <span className="font-semibold text-ink">{profile.email}</span>
          </p>
          <div className="mt-3 max-w-[340px]">
            <OtpInput value={code} onChange={setCode} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={code.length !== OTP_LENGTH}
              onClick={() => {
                update({ emailVerified: true });
                setSent(false);
              }}
              className={`${PRIMARY_BUTTON} h-10 px-4 text-[14px]`}
            >
              Confirm email
            </button>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-[13.5px] font-medium text-body hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </Field>
  );
}

/** the checkout, as a sheet over the page */
function Checkout({ app, onClose }: { app: Application; onClose: () => void }) {
  const [method, setMethod] = useState("UPI");
  const [paying, setPaying] = useState(false);

  // Escape closes it, unless a payment is going through
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !paying) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [paying, onClose]);

  const pay = () => {
    setPaying(true);
    window.setTimeout(() => {
      saveApplication({
        ...app,
        payment: {
          amount: APPLICATION_FEE,
          method,
          reference: `PAY${Date.now().toString(36).toUpperCase()}`,
          paidAt: new Date().toISOString(),
        },
      });
      onClose();
    }, 1400);
  };

  const METHODS = [
    {
      id: "UPI",
      line: "Google Pay, PhonePe, Paytm and more",
      Icon: Smartphone,
    },
    { id: "Card", line: "Debit or credit card", Icon: CreditCard },
    { id: "Net banking", line: "All major banks", Icon: Building2 },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/50 backdrop-blur-[2px] sm:items-center sm:p-6"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !paying) onClose();
      }}
    >
      <div className="w-full max-w-[440px] rounded-t-[8px] bg-white p-6 shadow-[var(--shadow-lg)] sm:rounded-[8px]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="checkout-title"
              className="font-display text-[20px] font-semibold tracking-[-0.02em] text-ink"
            >
              Pay application fee
            </h2>
            <p className="mt-0.5 text-[13.5px] text-muted">
              uGNET 2027 · {app.profile.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={paying}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-sunken hover:text-ink disabled:opacity-40"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <fieldset className="mt-5 grid gap-2" disabled={paying}>
          <legend className="sr-only">Payment method</legend>
          {METHODS.map(({ id, line, Icon }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-[8px] border px-4 py-3 transition-colors ${
                method === id
                  ? "border-accent bg-accent-soft"
                  : "border-black/[0.1] hover:border-ink"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={id}
                checked={method === id}
                onChange={() => setMethod(id)}
                className="sr-only"
              />
              <span
                className={`grid size-9 place-items-center rounded-[6px] ${
                  method === id ? "bg-white text-accent" : "bg-sunken text-ink"
                }`}
              >
                <Icon size={17} aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block text-[14.5px] font-medium text-ink">
                  {id}
                </span>
                <span className="block text-[12.5px] text-muted">{line}</span>
              </span>
              <span
                aria-hidden
                className={`size-4 rounded-full border-[5px] ${method === id ? "border-accent" : "border-black/15"}`}
              />
            </label>
          ))}
        </fieldset>

        <button
          type="button"
          onClick={pay}
          disabled={paying}
          className={`${PRIMARY_BUTTON} mt-5 w-full`}
        >
          {paying ? (
            <>
              <Loader2 size={17} className="animate-spin" aria-hidden />
              Processing payment…
            </>
          ) : (
            <>Pay {fmt(APPLICATION_FEE)}</>
          )}
        </button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-muted">
          <ShieldCheck size={13} aria-hidden />
          Test mode: no money is taken until payments go live
        </p>
      </div>
    </div>
  );
}

/** after paying: the receipt and the way on */
function Receipt({ app }: { app: Application }) {
  const p = app.payment!;
  const rows = [
    ["Amount paid", fmt(p.amount)],
    ["Paid by", p.method],
    ["Reference", p.reference],
    [
      "Date",
      new Date(p.paidAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    ],
  ];
  return (
    <div className="grid gap-6">
      <section className="rounded-[8px] border border-black/[0.08] bg-white p-6 text-center sm:p-10">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e9f7ef] text-[#16794a]">
          <CheckCircle2 size={28} aria-hidden />
        </span>
        <h2 className="mt-4 font-display text-[24px] font-medium tracking-[-0.02em] text-ink">
          Payment received
        </h2>
        <p className="mx-auto mt-1.5 max-w-[420px] text-[14.5px] text-body">
          Thank you, {app.profile.name.split(" ")[0]}. Your uGNET application is
          open: fill in the uGNET form next.
        </p>
        <dl className="mx-auto mt-6 grid max-w-[420px] divide-y divide-black/[0.06] rounded-[8px] border border-black/[0.08] text-left">
          {rows.map(([k, v]) => (
            <div
              key={k}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <dt className="text-[13.5px] text-muted">{k}</dt>
              <dd className="text-[14px] font-medium text-ink">{v}</dd>
            </div>
          ))}
        </dl>
        <Link href="/dashboard/ugnet-form" className={`${PRIMARY_BUTTON} mt-7`}>
          Continue to uGNET Form
          <ArrowRight size={16} aria-hidden />
        </Link>
      </section>
    </div>
  );
}

export function ApplicationFee() {
  const app = useApp();
  const [tried, setTried] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const profile = app.profile;

  const update = (patch: Partial<Profile>) =>
    saveApplication({ ...app, profile: { ...profile, ...patch } });

  const errors = check(profile);
  const ready = Object.keys(errors).length === 0;
  const shown = tried ? errors : {};

  const proceed = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (ready) setCheckout(true);
    else
      document
        .querySelector<HTMLElement>("[aria-invalid=true]")
        ?.focus({ preventScroll: false });
  };

  return (
    <StepGate id="application-fee">
      {app.payment ? (
        <Receipt app={app} />
      ) : (
        <form
          onSubmit={proceed}
          noValidate
          className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]"
        >
          <SectionCard
            title="Your details"
            line="We have filled in what you gave us when you signed in."
          >
            <Grid>
              <Field
                label="Full name"
                required
                htmlFor="fee-name"
                error={shown.name}
                className="sm:col-span-2"
              >
                <TextInput
                  id="fee-name"
                  icon={UserRound}
                  autoComplete="name"
                  value={profile.name}
                  invalid={Boolean(shown.name)}
                  onChange={(e) => update({ name: e.target.value })}
                />
              </Field>

              <Field
                label="Mobile number"
                htmlFor="fee-phone"
                className="sm:col-span-2"
              >
                <div className="flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <TextInput
                      id="fee-phone"
                      icon={Phone}
                      value={`+91 ${profile.phone}`}
                      disabled
                    />
                  </div>
                  <span className="inline-flex h-11 shrink-0 items-center gap-1.5 px-3 text-[13.5px] font-medium text-[#16794a]">
                    <BadgeCheck size={17} aria-hidden />
                    Verified
                  </span>
                </div>
              </Field>

              <EmailField
                profile={profile}
                update={update}
                error={shown.email}
              />

              <Field
                label="Date of birth"
                required
                hint="You must be 17 years or above"
                htmlFor="fee-dob"
                error={shown.dob}
              >
                <TextInput
                  id="fee-dob"
                  type="date"
                  icon={Calendar}
                  max={latestDob()}
                  value={profile.dob}
                  invalid={Boolean(shown.dob)}
                  onChange={(e) => update({ dob: e.target.value })}
                />
              </Field>

              <div className="hidden sm:block" />

              <Field
                label="State"
                required
                htmlFor="fee-state"
                error={shown.state}
              >
                <Select
                  id="fee-state"
                  options={STATES}
                  placeholder="Select state"
                  value={profile.state}
                  invalid={Boolean(shown.state)}
                  onChange={(e) => update({ state: e.target.value, city: "" })}
                />
              </Field>

              <Field
                label="City"
                required
                htmlFor="fee-city"
                error={shown.city}
              >
                <TextInput
                  id="fee-city"
                  list="fee-cities"
                  autoComplete="address-level2"
                  placeholder={
                    profile.state
                      ? "Type or pick your city"
                      : "Pick a state first"
                  }
                  disabled={!profile.state}
                  value={profile.city}
                  invalid={Boolean(shown.city)}
                  onChange={(e) => update({ city: e.target.value })}
                />
                <datalist id="fee-cities">
                  {(CITIES[profile.state] ?? []).map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
            </Grid>
          </SectionCard>

          {/* the fee */}
          <aside className="rounded-[8px] border border-black/[0.08] bg-white p-5 sm:p-6 xl:sticky xl:top-24">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">
              Application fee
            </p>
            <p className="mt-2 font-display text-[34px] font-medium leading-none tracking-[-0.03em] text-ink">
              {fmt(APPLICATION_FEE)}
            </p>
            <p className="mt-2 text-[13.5px] leading-[1.5] text-body">
              One fee covers your uGNET 2027 application and test.
            </p>
            <ul className="mt-5 grid gap-2.5 border-t border-black/[0.06] pt-5 text-[13.5px] text-body">
              {[
                "The 2-hour online uGNET test",
                "Your choice of test slot",
                "Your score within 2 days",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-accent"
                    aria-hidden
                  />
                  {t}
                </li>
              ))}
            </ul>
            <button type="submit" className={`${PRIMARY_BUTTON} mt-6 w-full`}>
              Pay {fmt(APPLICATION_FEE)}
              <ArrowRight size={16} aria-hidden />
            </button>
            {!ready && (
              <p className="mt-3 text-center text-[12.5px] text-muted">
                Complete your details to pay
              </p>
            )}
          </aside>
        </form>
      )}

      {checkout && <Checkout app={app} onClose={() => setCheckout(false)} />}
    </StepGate>
  );
}
