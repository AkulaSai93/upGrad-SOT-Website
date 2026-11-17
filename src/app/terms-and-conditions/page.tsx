import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions | upGrad School of Technology",
  description:
    "The terms that govern your use of upGrad School of Technology's website and services, including refunds and deferrals.",
};

/** the Terms & Conditions: the text, with its contents; then the footer */
export default function TermsPage() {
  return (
    <>
      <Navbar links={false} />
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <LegalPage doc="terms-and-conditions" />
      </main>
      <Footer />
    </>
  );
}
