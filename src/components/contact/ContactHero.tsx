"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Check, ChevronDown } from "lucide-react";
import { STATES } from "@/components/site/india";

gsap.registerPlugin(useGSAP);

/**
 * The Get in Touch page's hero.
 *
 * Layout from the Figma design (SOT Website, node 226:15564): one screen tall
 * on desktop over a sunny scene (a red phone, envelope and chat bubble on a
 * green hill under a blue sky), the headline and its line on the left and
 * the enquiry form in a white card on the right: full name, email and
 * phone, state and pin code, the query, the consent and Submit. The copy
 * is dark on the sky, and the foot fades into the page's white. On phones
 * the copy comes first, then the form, with the scene pinned under it.
 *
 * The form checks itself in the browser (required fields, a 10-digit phone,
 * a 6-digit pin code) and thanks the visitor on submit; sending it on to the
 * admissions team is not wired up yet.
 *
 * Motion (GSAP): the copy rises in and the card lifts in. Reduced motion:
 * shown as they are.
 */

const FIELD =
  "h-12 w-full rounded-[4px] border border-[#d9e0db] bg-[#fbfcfa] px-[15px] text-[14px] text-ink outline-none transition-colors placeholder:text-[#62706e] focus:border-ink";

function Label({
  htmlFor,
  children,
  required = true,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[14px] font-medium leading-[1.45] text-[#152b2a]"
    >
      {children}
      {required && <span className="text-[#6a7800]"> *</span>}
    </label>
  );
}

export function ContactHero() {
  const root = useRef<HTMLElement>(null);
  const [agree, setAgree] = useState(true);
  const [sent, setSent] = useState(false);

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
          )
          .fromTo(
            "[data-hero-card]",
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 1.1 },
            0.15,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!agree) return;
    setSent(true);
  };

  return (
    <section
      ref={root}
      aria-labelledby="contact-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#337dc3_0%,#428ece_45%,#519fd7_100%)] pb-[clamp(230px,60vw,340px)] pt-28 lg:min-h-[max(100svh,820px)] lg:pb-16 lg:pt-[135px]"
    >
      {/* the scene: full bleed on desktop; on phones pinned to the foot
          (so it isn't blown up to the tall section), its sky fading into
          the section's matching blue */}
      <div className="absolute inset-x-0 bottom-0 h-[clamp(340px,100vw,520px)] [mask-image:linear-gradient(180deg,transparent_0%,#000_28%)] lg:inset-0 lg:h-auto lg:[mask-image:none]">
        <Image
          src="/images/contact/hero-bg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[30%_100%] lg:object-center"
        />
      </div>

      <div className="container-page relative grid gap-10 lg:grid-cols-[minmax(0,570px)_minmax(0,608px)] lg:items-start lg:justify-between lg:gap-16">
        {/* the headline and its line */}
        <div className="text-center lg:pt-[54px] lg:text-left">
          <h1
            id="contact-title"
            data-hero-line
            className="font-display whitespace-nowrap text-[clamp(1.5rem,8.2vw,2.75rem)] lg:whitespace-normal lg:text-[clamp(2.75rem,5.4vw,4.875rem)] font-medium leading-[1.04] tracking-[-0.045em] text-ink"
          >
            Get in Touch <br className="max-lg:hidden" />
            With Us
          </h1>
          <p
            data-hero-line
            className="mx-auto mt-3 max-w-[570px] lg:mt-6 text-[16px] lg:mx-0 leading-[1.45] text-ink lg:text-[18px]"
          >
            We are here to answer every question you have about programs,
            admissions, and life at uGSOT.
          </p>
        </div>

        {/* the enquiry form */}
        <div
          data-hero-card
          className="rounded-[8px] bg-white p-5 shadow-[0_16px_40px_0_rgba(0,31,36,0.12)] sm:p-6"
        >
          {sent ? (
            <div className="grid min-h-[420px] place-items-center text-center">
              <div>
                <span className="mx-auto grid size-12 place-items-center rounded-full bg-accent text-white">
                  <Check size={22} strokeWidth={2.6} aria-hidden />
                </span>
                <p className="mt-4 font-display text-[22px] font-medium text-ink">
                  Thank you!
                </p>
                <p className="mt-2 text-[14.5px] text-[#62706e]">
                  Our admissions team will reach out to you shortly.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} className="grid gap-[14px]">
              <div className="grid gap-[10px]">
                <Label htmlFor="c-name">Full Name</Label>
                <input
                  id="c-name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={FIELD}
                />
              </div>

              <div className="grid gap-[14px] sm:grid-cols-2 sm:gap-5">
                <div className="grid gap-[10px]">
                  <Label htmlFor="c-email">Email ID</Label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Enter email address"
                    className={FIELD}
                  />
                </div>
                <div className="grid gap-[10px]">
                  <Label htmlFor="c-phone">Phone Number</Label>
                  <input
                    id="c-phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    pattern="[6-9][0-9]{9}"
                    maxLength={10}
                    title="A 10-digit mobile number"
                    autoComplete="tel-national"
                    placeholder="Enter phone number"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="grid gap-[14px] sm:grid-cols-2 sm:gap-5">
                <div className="grid gap-[10px]">
                  <Label htmlFor="c-state">State</Label>
                  <div className="relative">
                    <select
                      id="c-state"
                      name="state"
                      required
                      defaultValue=""
                      className={`${FIELD} appearance-none pr-10 invalid:text-[#62706e]`}
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      {STATES.map((s) => (
                        <option key={s} value={s} className="text-ink">
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={17}
                      aria-hidden
                      className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2 text-[#152b2a]"
                    />
                  </div>
                </div>
                <div className="grid gap-[10px]">
                  <Label htmlFor="c-pin">Pin code</Label>
                  <input
                    id="c-pin"
                    name="pincode"
                    required
                    inputMode="numeric"
                    pattern="[1-9][0-9]{5}"
                    maxLength={6}
                    title="A 6-digit pin code"
                    autoComplete="postal-code"
                    placeholder="Enter pincode"
                    className={FIELD}
                  />
                </div>
              </div>

              <div className="grid gap-[10px]">
                <Label htmlFor="c-query" required={false}>
                  Query
                </Label>
                <textarea
                  id="c-query"
                  name="query"
                  rows={3}
                  placeholder="Tell us how can we help you...."
                  className={`${FIELD} h-[75px] resize-none py-[14px]`}
                />
              </div>

              {/* consent */}
              <label className="flex cursor-pointer items-start gap-[10px] text-[12px] leading-[1.45] text-[#62706e]">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="peer sr-only"
                  required
                />
                <span className="mt-px grid size-[19px] shrink-0 place-items-center rounded-[2px] border border-[#d9e0db] bg-white text-white transition-colors peer-checked:border-accent peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
                <span>
                  By submitting this form, you agree to our{" "}
                  <a
                    href="/terms-and-conditions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#152b2a] underline"
                  >
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#152b2a] underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>

              <button
                type="submit"
                className="h-[54px] w-full rounded-[4px] bg-accent text-[16px] font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
                disabled={!agree}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
      {/* the foot fades into the page's white */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,#fff_100%)] lg:h-36"
      />
    </section>
  );
}
