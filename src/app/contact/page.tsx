import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ContactHero } from "@/components/contact/ContactHero";
import { Faqs } from "@/components/sections/Faqs";

export const metadata: Metadata = {
  title: "Get in Touch | upGrad School of Technology",
  description:
    "Questions about programs, admissions or life at upGrad School of Technology? Send us your query and our admissions team will reach out.",
};

/** the Get in Touch page: the enquiry hero, then the FAQs and the footer */
export default function ContactPage() {
  return (
    <>
      <Navbar links={false} />
      {/* the page sits above the footer and slides up off it, as on the home page */}
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <ContactHero />
        <Faqs />
      </main>
      <Footer />
    </>
  );
}
