import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | upGrad School of Technology",
  description:
    "How upGrad School of Technology collects, uses, shares and protects your personal data.",
};

/** the Privacy Policy: the text, with its contents; then the footer */
export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar links={false} />
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <LegalPage doc="privacy-policy" />
      </main>
      <Footer />
    </>
  );
}
