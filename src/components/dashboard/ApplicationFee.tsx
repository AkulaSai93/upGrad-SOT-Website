"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Calendar,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  ShieldCheck,
  Tag,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";
import { CITIES, STATES } from "@/components/site/india";
import { OtpInput, OTP_LENGTH } from "@/components/apply/OtpInput";
import { StepGate, useApp, useGoToNext } from "./DashboardShell";
import {
  EMAIL_RE,
  ageOn,
  saveApplication,
  type Application,
  type Profile,
} from "./application";
import {
  COUPONS,
  feeSummary,
  money,
  normaliseCode,
  type FeeSummary,
} from "./fees";
import {
  Combobox,
  Field,
  Grid,
  INPUT,
  PRIMARY_BUTTON,
  ReviewCard,
  SECONDARY_BUTTON,
  SectionCard,
  Select,
  TextInput,
  longDate,
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
 * Once paid, the step opens as the details given (with Edit to change
 * them) and the payment record.
 *
 * Checkout: pick UPI, card or net banking and pay. It runs in test mode
 * until the payment gateway is connected: no money is taken, and the
 * email code and payment both succeed. Once paid, the page shows the
 * receipt and the way on to the uGNET form.
 */

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
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-[4px] px-3 text-[13.5px] font-medium text-[#16794a]"
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
        <div className="mt-1 rounded-[6px] border border-black/[0.08] bg-black/[0.03] p-4">
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

/** the payment summary, with its coupon box (content from the admissions
    team's summary) */
function PaymentSummary({
  fee,
  ready,
  onApply,
  onRemove,
}: {
  fee: FeeSummary;
  ready: boolean;
  onApply: (code: string) => string | null;
  onRemove: () => void;
}) {
  const [code, setCode] = useState("");
  const [problem, setProblem] = useState("");

  const apply = () => {
    const tidy = normaliseCode(code);
    if (!tidy) return setProblem("Enter a coupon code.");
    const error = onApply(tidy);
    setProblem(error ?? "");
    if (!error) setCode("");
  };

  const row = "flex items-center justify-between gap-4 text-[14px]";

  return (
    <aside className="rounded-[6px] border border-black/[0.08] bg-white p-5 sm:p-6">
      <h2 className="font-display text-[18px] font-semibold tracking-[-0.01em] text-ink">
        Payment summary
      </h2>
      <dl className="mt-5 grid gap-3">
        <div className={row}>
          <dt className="text-body">Application fee</dt>
          <dd className="font-semibold text-ink">{money(fee.base)}</dd>
        </div>
        {fee.coupon && (
          <div className={row}>
            <dt className="flex flex-wrap items-center gap-2 text-[#16794a]">
              Discount
              <span className="inline-flex items-center gap-1 rounded-[4px] bg-[#e9f7ef] px-1.5 py-0.5 text-[11.5px] font-semibold">
                <Tag size={11} aria-hidden />
                {fee.coupon}
                <button
                  type="button"
                  onClick={onRemove}
                  aria-label={`Remove coupon ${fee.coupon}`}
                  className="ml-0.5 rounded-[2px] hover:text-ink"
                >
                  <X size={11} aria-hidden />
                </button>
              </span>
            </dt>
            <dd className="font-semibold text-[#16794a]">
              −{money(fee.discount)}
            </dd>
          </div>
        )}
        <div className={row}>
          <dt className="text-body">Subtotal</dt>
          <dd className="font-semibold text-ink">{money(fee.subtotal)}</dd>
        </div>
        <div className={row}>
          <dt className="text-body">IGST (18%)</dt>
          <dd className="font-semibold text-ink">{money(fee.igst)}</dd>
        </div>
        <div className="mt-1 flex items-center justify-between gap-4 border-t border-dashed border-black/15 pt-4">
          <dt className="text-[16px] font-semibold text-ink">Total payable</dt>
          <dd className="font-display text-[22px] font-semibold tracking-[-0.02em] text-accent">
            {money(fee.total)}
          </dd>
        </div>
      </dl>

      {!fee.coupon && (
        <div className="mt-5">
          <div className="flex gap-2">
            <label htmlFor="fee-coupon" className="sr-only">
              Coupon code
            </label>
            <input
              id="fee-coupon"
              placeholder="Coupon code"
              autoComplete="off"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setProblem("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  apply();
                }
              }}
              aria-invalid={Boolean(problem) || undefined}
              className={`${INPUT} min-w-0 flex-1 uppercase tracking-[0.04em] placeholder:normal-case placeholder:tracking-normal`}
            />
            <button
              type="button"
              onClick={apply}
              className={`${SECONDARY_BUTTON} shrink-0 px-4`}
            >
              Apply
            </button>
          </div>
          {problem && (
            <p role="alert" className="mt-2 text-[12.5px] text-accent">
              {problem}
            </p>
          )}
        </div>
      )}

      <p className="mt-4 text-[12.5px] leading-[1.5] text-accent">
        Note: No refund will be given if the candidate is later found
        ineligible.
      </p>

      <button type="submit" className={`${PRIMARY_BUTTON} mt-5 w-full`}>
        Continue to pay
        <ArrowRight size={16} aria-hidden />
      </button>
      {!ready && (
        <p className="mt-3 text-center text-[12.5px] text-muted">
          Complete your details to pay
        </p>
      )}
    </aside>
  );
}

/** the checkout, as a sheet over the page */
function Checkout({
  app,
  fee,
  onClose,
  onPaid,
}: {
  app: Application;
  fee: FeeSummary;
  onClose: () => void;
  onPaid: () => void;
}) {
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
          amount: fee.total,
          coupon: fee.coupon,
          discount: fee.discount || undefined,
          method,
          reference: `PAY${Date.now().toString(36).toUpperCase()}`,
          paidAt: new Date().toISOString(),
        },
      });
      onClose();
      onPaid();
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
      <div className="w-full max-w-[440px] rounded-t-[6px] bg-white p-6 shadow-[var(--shadow-lg)] sm:rounded-[6px]">
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
            className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-black/[0.04] hover:text-ink disabled:opacity-40"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <fieldset className="mt-5 grid gap-2" disabled={paying}>
          <legend className="sr-only">Payment method</legend>
          {METHODS.map(({ id, line, Icon }) => (
            <label
              key={id}
              className={`flex cursor-pointer items-center gap-3 rounded-[6px] border px-4 py-3 transition-colors ${
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
                className={`grid size-9 place-items-center rounded-[4px] ${
                  method === id
                    ? "bg-white text-accent"
                    : "bg-black/[0.04] text-ink"
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
            <>Pay {money(fee.total)}</>
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

/** after paying: the details given (with Edit), and the payment */
function Paid({ app, onEdit }: { app: Application; onEdit: () => void }) {
  const p = app.payment!;
  const d = app.profile;
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
      <ReviewCard
        title="Your details"
        onEdit={onEdit}
        rows={[
          ["Full name", d.name],
          ["Mobile number", `+91 ${d.phone}`],
          ["Email ID", d.email],
          ["Date of birth", longDate(d.dob)],
          ["State", d.state],
          ["City", d.city],
        ]}
      />
      <ReviewCard
        title="Payment"
        rows={[
          ["Amount paid", money(p.amount)],
          ...(p.coupon
            ? ([["Coupon", `${p.coupon} (−${money(p.discount ?? 0)})`]] as [
                string,
                string,
              ][])
            : []),
          ["Paid by", p.method],
          ["Reference", p.reference],
          [
            "Date",
            new Date(p.paidAt).toLocaleString("en-IN", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
          ],
        ]}
      />
    </div>
  );
}

export function ApplicationFee() {
  const app = useApp();
  const [tried, setTried] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [coupon, setCoupon] = useState<string>();
  const goToNext = useGoToNext();
  // once paid, the details open as a preview; Edit works on a copy, saved
  // back only once it checks out
  const [draft, setDraft] = useState<Profile | null>(null);
  const editing = Boolean(app.payment && draft);
  const profile = draft ?? app.profile;
  const fee = feeSummary(coupon);

  const update = (patch: Partial<Profile>) =>
    editing
      ? setDraft({ ...profile, ...patch })
      : saveApplication({ ...app, profile: { ...profile, ...patch } });

  const stopEditing = () => {
    setDraft(null);
    setTried(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveEdit = () => {
    setTried(true);
    if (!ready) return;
    saveApplication({ ...app, profile });
    stopEditing();
  };

  const errors = check(profile);
  const ready = Object.keys(errors).length === 0;
  const shown = tried ? errors : {};

  const proceed = (e: FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (ready) setCheckout(true);
    else
      document
        .querySelector<HTMLElement>("[aria-invalid=true], [data-invalid=true]")
        ?.focus({ preventScroll: false });
  };

  const details = (
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

        <EmailField profile={profile} update={update} error={shown.email} />

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

        <Field label="State" required htmlFor="fee-state" error={shown.state}>
          <Select
            id="fee-state"
            options={STATES}
            placeholder="Select state"
            value={profile.state}
            invalid={Boolean(shown.state)}
            onChange={(e) => update({ state: e.target.value, city: "" })}
          />
        </Field>

        <Field label="City" required htmlFor="fee-city" error={shown.city}>
          <Combobox
            id="fee-city"
            options={CITIES[profile.state] ?? []}
            placeholder={
              profile.state ? "Type or pick your city" : "Pick a state first"
            }
            disabled={!profile.state}
            value={profile.city}
            invalid={Boolean(shown.city)}
            onChange={(city) => update({ city })}
          />
        </Field>
      </Grid>
    </SectionCard>
  );

  return (
    <StepGate id="application-fee">
      {app.payment && !editing ? (
        <Paid app={app} onEdit={() => setDraft(app.profile)} />
      ) : editing ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5">
          {details}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={stopEditing}
              className={SECONDARY_BUTTON}
            >
              Cancel
            </button>
            <button type="button" onClick={saveEdit} className={PRIMARY_BUTTON}>
              Save changes
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={proceed}
          noValidate
          className="grid grid-cols-[minmax(0,1fr)] gap-6"
        >
          {details}

          <PaymentSummary
            fee={fee}
            ready={ready}
            onApply={(code) => {
              if (!COUPONS[code]) return "That coupon code isn't valid.";
              setCoupon(code);
              return null;
            }}
            onRemove={() => setCoupon(undefined)}
          />
        </form>
      )}

      {checkout && (
        <Checkout
          app={app}
          fee={fee}
          onClose={() => setCheckout(false)}
          onPaid={() => goToNext("/dashboard/ugnet-form")}
        />
      )}
    </StepGate>
  );
}
