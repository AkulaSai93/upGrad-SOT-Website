import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { EntranceHero } from "@/components/entrance/EntranceHero";

export const metadata: Metadata = {
  title:
    "Free AI Prep for Engineering Entrance Exams | upGrad School of Technology",
  description:
    "Free AI-powered prep for JEE Main, JEE Advanced, BITSAT and VITEEE: past-year papers, mock tests and AI analytics.",
};

/** the Engineering Entrance Exam prep page; more sections follow the hero */
export default function EntranceExamPage() {
  return (
    <>
      <Navbar links={false} />
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <EntranceHero />
      </main>
      <Footer />
    </>
  );
}
