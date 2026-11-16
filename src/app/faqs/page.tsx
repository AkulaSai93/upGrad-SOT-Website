import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { FaqCentre } from "@/components/faqs/FaqCentre";

export const metadata: Metadata = {
  title:
    "FAQs: uGNET, Admissions, Fees & Scholarships | upGrad School of Technology",
  description:
    "Every answer about upGrad School of Technology on one page: the program, admissions, the interview, uGNET, fees and scholarships, outcomes and our AI agents.",
};

/** the FAQs page: every answer, searchable, by topic; then the footer */
export default function FaqsPage() {
  return (
    <>
      <Navbar links={false} />
      {/* the page sits above the footer and slides up off it, as on the home page */}
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <FaqCentre />
      </main>
      <Footer />
    </>
  );
}
