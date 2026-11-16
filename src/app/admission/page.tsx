import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { AdmissionHero } from "@/components/admission/AdmissionHero";
import { AdmissionProcess } from "@/components/admission/AdmissionProcess";
// already built for the university page and the home page, reused as
// sot.upgrad.com/admission repeats them
import { CampusFees } from "@/components/campus/CampusFees";
import { CampusLoans } from "@/components/campus/CampusLoans";
import { Scholarships } from "@/components/sections/Scholarships";
import { Faqs } from "@/components/sections/Faqs";
import { campusBySlug } from "@/components/campus/campuses";

export const metadata: Metadata = {
  title:
    "Admissions 2026: AI-First B.Tech in CSE | upGrad School of Technology",
  description:
    "Admissions are open for 2026 at upGrad School of Technology: eligibility, the six-step admission process, fees, education loans and scholarships.",
};

/** the admissions page: the hero and the process are its own; the fees
 * (SSAHE's, as on sot.upgrad.com/admission), loans, scholarships and FAQs
 * are the sections the site already has */
export default function AdmissionPage() {
  const ssahe = campusBySlug("ssahe")!;
  return (
    <>
      <Navbar links={false} />
      {/* the page sits above the footer and slides up off it, as on the home page */}
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        {/* a run of short sections, spaced and headed as on the university page */}
        <div className="[--section-heading-size:clamp(1.25rem,2vw,1.75rem)] [&>section:not(:first-child)]:py-6 lg:[&>section:not(:first-child)]:py-12">
          <AdmissionHero />
          <AdmissionProcess />
          <CampusFees campus={ssahe} />
          <CampusLoans />
          <Scholarships />
          <Faqs />
        </div>
      </main>
      <Footer />
    </>
  );
}
