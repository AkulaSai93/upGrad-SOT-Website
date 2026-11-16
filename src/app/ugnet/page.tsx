import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { UgnetHero } from "@/components/ugnet/UgnetHero";
import { UgnetWho } from "@/components/ugnet/UgnetWho";
import { UgnetAssess } from "@/components/ugnet/UgnetAssess";
import { UgnetPattern } from "@/components/ugnet/UgnetPattern";
import { Admission } from "@/components/sections/Admission";
import { Scholarships } from "@/components/sections/Scholarships";

export const metadata: Metadata = {
  title:
    "uGNET 2026: Eligibility, Pattern & Dates | upGrad School of Technology",
  description:
    "uGNET is the National Entrance Test for admission into the Computer Science Engineering program at upGrad School of Technology's partner universities.",
};

/** the uGNET entrance test's page; more sections follow the hero */
export default function UgnetPage() {
  return (
    <>
      <Navbar links={false} />
      {/* the page sits above the footer and slides up off it, as on the home page */}
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <UgnetHero />
        <UgnetWho />
        <UgnetAssess />
        <UgnetPattern />
        {/* the home page's admission process design, with uGNET's own four
            steps (sot.upgrad.com/uGNET); its id is the target of the page's
            "Apply for uGNET" buttons */}
        <Admission
          id="apply"
          title="How do I apply"
          accent="for uGNET?"
          intro="Four steps from sign-up to your score."
          steps={[
            {
              title: "Create your Account",
              body: "Sign up with your WhatsApp number and fill in your basic details.",
            },
            {
              title: "Register for uGNET",
              body: "Pay your application fee of Rs. 1000",
            },
            {
              title: "Attempt the Exam",
              body: "Choose your preferred slot and complete the 2-hour online uGNET test.",
            },
            {
              title: "Result Declaration",
              body: "You will receive your score within 2 days of attempting the exam.",
            },
          ]}
        />
        <Scholarships />
      </main>
      <Footer />
    </>
  );
}
