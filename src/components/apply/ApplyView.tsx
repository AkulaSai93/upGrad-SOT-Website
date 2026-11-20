"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { CompanyLogos } from "@/components/site/CompanyLogos";
import { SOT_URL } from "@/components/site/contact";
import { signIn } from "./applicant";
import { ShowcaseBackdrop, ShowcaseSlides, useShowcase } from "./ApplyShowcase";
import { OtpInput, OTP_LENGTH } from "./OtpInput";

/**
 * The application sign-up, reached from every Apply Now (/apply).
 *
 * Layout after the client's reference (a split sign-in screen): the photo
 * side fills the page under a dark wash, carrying the white logo and Back
 * to website at the top and, at the foot, a run of slides (each on its
 * own photo: see ApplyShowcase.tsx) and the company logos running past.
 * On the right a white card holds the form. On phones the same slides and
 * logos sit in a band at the top, over their photos, and the card follows
 * under it, running to the foot of the screen.
 *
 * The form has two steps: mobile number and name, then the 6-digit OTP
 * sent to that number. Verifying signs the applicant in (see applicant.ts)
 * and opens the dashboard; from then on the navbar shows a user icon in
 * place of Apply Now. Sending and checking the OTP are not wired to the
 * admissions back end yet: any 6 digits are accepted.
 */
const RESEND_S = 30;
const NAME_RE = /^[A-Za-z][A-Za-z .'-]{1,59}$/;
const PHONE_RE = /^[6-9]\d{9}$/;

const FIELD =
  "h-12 w-full rounded-[6px] border border-black/[0.1] bg-white px-4 text-[15px] text-ink outline-none transition-colors placeholder:text-muted focus:border-ink";

const PRIMARY =
  "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-accent text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50";

/** the two-step form: details, then the OTP */
function ApplyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState<"details" | "otp">("details");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState("");

  // the resend countdown
  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = window.setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [resendIn]);

  const sendOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!PHONE_RE.test(phone))
      return setError("Enter a valid 10-digit mobile number.");
    if (!NAME_RE.test(name.trim())) return setError("Enter your full name.");
    setError("");
    setOtp("");
    setStep("otp");
    setResendIn(RESEND_S);
  };

  const verify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH)
      return setError(`Enter the ${OTP_LENGTH}-digit code.`);
    signIn({ name: name.trim(), phone });
    router.push("/dashboard");
  };

  if (step === "details") {
    return (
      <form onSubmit={sendOtp} noValidate className="grid gap-5">
        <div className="grid gap-2">
          <label
            htmlFor="apply-phone"
            className="text-[13.5px] font-medium text-ink"
          >
            Mobile number
          </label>
          <div className="flex h-12 items-center rounded-[6px] border border-black/[0.1] transition-colors focus-within:border-ink">
            <span className="border-r border-black/[0.08] px-4 text-[15px] font-medium text-ink">
              +91
            </span>
            <input
              id="apply-phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="h-full min-w-0 flex-1 bg-transparent px-4 text-[15px] text-ink outline-none placeholder:text-muted"
            />
          </div>
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="apply-name"
            className="text-[13.5px] font-medium text-ink"
          >
            Full name
          </label>
          <input
            id="apply-name"
            autoComplete="name"
            placeholder="As on your Class 12 marksheet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={FIELD}
          />
        </div>
        {error && (
          <p role="alert" className="-mt-1 text-[13px] text-accent">
            {error}
          </p>
        )}

        <button type="submit" className={PRIMARY}>
          Send OTP
          <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
        </button>

        <p className="text-center text-[12px] leading-[1.5] text-muted">
          By submitting this form, you agree to our{" "}
          <a
            href={`${SOT_URL}/terms-and-conditions`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline"
          >
            Terms and Condition
          </a>{" "}
          and{" "}
          <a
            href={`${SOT_URL}/privacy-policy`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink underline"
          >
            Privacy Policy
          </a>
        </p>
      </form>
    );
  }

  return (
    <form onSubmit={verify} noValidate className="grid gap-5">
      <div className="grid gap-3">
        <p className="text-[14px] text-body">
          Enter the {OTP_LENGTH}-digit code sent to{" "}
          <span className="font-semibold text-ink">+91 {phone}</span>{" "}
          <button
            type="button"
            onClick={() => {
              setStep("details");
              setError("");
            }}
            className="font-medium text-accent hover:underline"
          >
            Change
          </button>
        </p>
        <OtpInput value={otp} onChange={setOtp} />
      </div>

      {error && (
        <p role="alert" className="-mt-1 text-[13px] text-accent">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={otp.length !== OTP_LENGTH}
        className={PRIMARY}
      >
        Verify & continue
        <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
      </button>

      <p className="text-center text-[13px] text-body">
        Didn&apos;t get it?{" "}
        {resendIn > 0 ? (
          <span className="text-muted">Resend in {resendIn}s</span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setOtp("");
              setError("");
              setResendIn(RESEND_S);
            }}
            className="font-semibold text-ink hover:underline"
          >
            Resend OTP
          </button>
        )}
      </p>
    </form>
  );
}

export function ApplyView() {
  const { index, go } = useShowcase();

  return (
    <main className="flex min-h-svh flex-col bg-ink lg:relative lg:flex-row lg:p-3">
      {/* the photo side: logo and way back, the slides and the logos. On
          phones it is a band at the top, its photos behind it (running on
          under the card's rounded corners); on desktop the photos fill the
          whole page, the card floating over them */}
      <section className="relative flex flex-col px-5 pb-10 pt-5 sm:px-8 lg:static lg:flex-1 lg:px-12 lg:py-10">
        {/* the slides' photos, under a dark wash so the white copy reads */}
        <div
          aria-hidden
          className="absolute inset-x-0 -bottom-6 top-0 overflow-hidden lg:inset-0"
        >
          <ShowcaseBackdrop index={index} />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,13,18,0.6)_0%,rgba(11,13,18,0.55)_35%,rgba(11,13,18,0.9)_100%)] lg:bg-[linear-gradient(180deg,rgba(11,13,18,0.7)_0%,rgba(11,13,18,0.5)_40%,rgba(11,13,18,0.94)_100%)]" />
        </div>

        <div className="relative flex items-center justify-between gap-4">
          <Logo onDark />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-white/85 transition-colors hover:text-white"
          >
            <ArrowLeft size={15} aria-hidden />
            Back to website
          </Link>
        </div>

        <div className="relative mt-10 lg:mt-auto">
          <ShowcaseSlides index={index} go={go} />
          <CompanyLogos
            compact
            markHeight={28}
            className="mt-6 lg:mt-10 lg:[&_img]:!h-[30px]"
          />
        </div>
      </section>

      {/* the card */}
      <section className="relative z-10 flex-1 rounded-t-[14px] bg-white px-5 pb-10 pt-8 sm:px-8 lg:flex lg:flex-none lg:w-[min(560px,44vw)] lg:shrink-0 lg:flex-col lg:justify-center lg:rounded-[10px] lg:px-14 lg:py-12">
        <div className="mx-auto w-full max-w-[420px]">
          <h1 className="font-display text-[clamp(1.75rem,2.6vw,2.25rem)] font-medium leading-tight tracking-[-0.03em] text-ink">
            Step Into Your Future
          </h1>
          <p className="mt-2 text-[14.5px] leading-[1.5] text-body">
            Verify your mobile number to begin. Applied before? Use the same
            number to log back in.
          </p>

          <div className="mt-8">
            <ApplyForm />
          </div>
        </div>
      </section>
    </main>
  );
}
