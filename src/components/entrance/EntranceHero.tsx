"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

gsap.registerPlugin(useGSAP);

/**
 * The Engineering Entrance Exam prep page's hero.
 *
 * One screen tall on a blue sky (the site's light look), centred: a small
 * label, the headline, one short line and the sign-in form: a single row (+91, the mobile number,
 * Send OTP) on a white card, with the secure-login line and the terms
 * under it. Sending the OTP swaps the row for the 6-digit code; it checks
 * itself in the browser and is not wired to a back end yet. At the foot,
 * in the flow under the form so the copy never covers them, three students
 * revising together: a Figma AI photo (SOT Website file) with its green
 * background keyed out, on a soft white ground.
 *
 * Under the hero a red strip runs the exams it covers (JEE Main, JEE
 * Advanced, BITSAT, VITEEE) right to left, on the site's marquee.
 *
 * Motion (GSAP): the copy and the form rise in, then the students lift in. Reduced motion: shown as
 * they are, and the strip stands still.
 */
const EXAMS = ["JEE Main", "JEE Advanced", "BITSAT", "VITEEE"];

export function EntranceHero() {
  const root = useRef<HTMLElement>(null);
  const [phone, setPhone] = useState("");
  const [sent, setSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .fromTo(
            "[data-hero-line]",
            { y: 24, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1, stagger: 0.08 },
            0.1,
          )
          .fromTo(
            "[data-hero-students]",
            { y: 80, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.3 },
            0.35,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const sendOtp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (/^[6-9]\d{9}$/.test(phone)) setSent(true);
  };
  const verify = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (/^\d{6}$/.test(otp)) setDone(true);
  };

  return (
    <>
      <section
        id="entrance-hero"
        ref={root}
        aria-labelledby="entrance-title"
        className="relative flex flex-col overflow-hidden bg-[linear-gradient(180deg,#6bb0ee_0%,#8bc4f5_60%,#cfe6fb_100%)] pt-28 lg:min-h-[calc(100svh-36px)]"
      >
        <div className="container-page relative z-10 flex flex-col items-center text-center">
          <p
            data-hero-line
            className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3.5 py-1.5 text-[12.5px] font-medium text-ink shadow-[var(--shadow-sm)] backdrop-blur-md"
          >
            <Sparkles size={13} className="text-accent" aria-hidden />
            Free · AI-powered practice
          </p>

          <h1
            id="entrance-title"
            data-hero-line
            className="mt-5 max-w-[900px] text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.035em] text-ink"
          >
            Free AI-powered prep for any{" "}
            <span className="text-accent">Engineering Entrance Exam</span>
          </h1>

          <p
            data-hero-line
            className="mt-4 max-w-[560px] text-balance text-[15.5px] leading-[1.6] text-ink/80 lg:text-[17px]"
          >
            Past-year papers, full mock tests and AI analytics that show you
            exactly where to improve.
          </p>

          {/* the sign-in: one row on a white card, the secure-login line and the terms under it */}
          <div data-hero-line className="mt-8 w-full max-w-[520px]">
            <div className="rounded-[10px] bg-white p-2 shadow-[0_24px_50px_-20px_rgba(16,52,92,0.35)]">
              {done ? (
                <p className="flex h-[52px] items-center justify-center gap-2 text-[15px] font-medium text-ink">
                  <ShieldCheck size={18} className="text-accent" aria-hidden />
                  You&apos;re in. Your practice agent is ready.
                </p>
              ) : !sent ? (
                <form
                  onSubmit={sendOtp}
                  className="flex flex-col gap-1.5 sm:flex-row"
                >
                  <label htmlFor="ee-phone" className="sr-only">
                    Mobile number
                  </label>
                  <div className="flex h-[52px] items-center rounded-[6px] border border-black/[0.08] bg-[#f6f7f9] transition-colors focus-within:border-ink sm:flex-1">
                    <span className="border-r border-black/[0.08] px-3.5 text-[15px] font-medium text-ink">
                      +91
                    </span>
                    <input
                      id="ee-phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      required
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      title="A 10-digit mobile number"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-[15px] text-ink outline-none placeholder:text-muted"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[6px] bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Send OTP
                    <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={verify}
                  className="flex flex-col gap-1.5 sm:flex-row"
                >
                  <label htmlFor="ee-otp" className="sr-only">
                    6-digit OTP sent to +91 {phone}
                  </label>
                  <input
                    id="ee-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    autoFocus
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="h-[52px] min-w-0 rounded-[6px] border border-black/[0.08] bg-[#f6f7f9] px-4 focus:border-ink sm:flex-1 text-[15px] tracking-[0.2em] text-ink outline-none placeholder:tracking-normal placeholder:text-muted"
                  />
                  <button
                    type="submit"
                    className="inline-flex h-[52px] items-center justify-center gap-2 rounded-[6px] bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
                  >
                    Verify & start
                    <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
                  </button>
                </form>
              )}
              <p className="mt-3 flex flex-wrap items-center justify-center gap-x-1.5 border-t border-black/[0.06] pt-3 text-[12.5px] text-body">
                <ShieldCheck size={14} className="text-accent" aria-hidden />
                {sent && !done ? (
                  <>
                    OTP sent to +91 {phone} ·{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setOtp("");
                      }}
                      className="font-medium text-ink underline underline-offset-2"
                    >
                      Change number
                    </button>
                  </>
                ) : (
                  "Secure OTP login · takes under a minute"
                )}
              </p>
              <p className="mt-1 pb-1.5 text-[12px] text-muted">
                By continuing, you agree to our{" "}
                <a
                  href="/terms-and-conditions"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  Terms
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* the students, cut out, at the foot: in the flow under the form so
            the copy never covers them, sitting on a soft white ground */}
        <div
          data-hero-students
          className="relative z-10 mx-auto mt-10 w-[min(600px,94vw)] lg:mt-auto lg:pt-6"
        >
          <span
            aria-hidden
            className="absolute inset-x-[6%] bottom-[2%] h-[14%] rounded-[50%] bg-[#0b2a4a]/25 blur-2xl"
          />
          <Image
            src="/images/entrance/students-cutout.webp"
            alt="Three students revising together with books and a laptop"
            width={1362}
            height={698}
            priority
            sizes="(min-width: 768px) 600px, 94vw"
            className="relative h-auto w-full"
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_100%)] lg:h-32"
        />
      </section>

      {/* the exams it covers, running right to left */}
      <div className="marquee-mask relative z-10 bg-accent py-3.5 text-white">
        <div className="marquee-track [animation-duration:28s]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center"
            >
              {Array.from({ length: 4 }, () => EXAMS)
                .flat()
                .map((exam, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-8 pr-8 font-display text-[18px] font-medium tracking-[-0.01em] sm:text-[22px]"
                  >
                    {exam}
                    <Sparkles size={16} className="text-white/60" aria-hidden />
                  </li>
                ))}
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}
