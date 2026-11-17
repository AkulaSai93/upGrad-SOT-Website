import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ResumeHero } from "@/components/playground/ResumeHero";
import { ResumeFeatures } from "@/components/playground/ResumeFeatures";
import { ResumeCompare } from "@/components/playground/ResumeCompare";
import { ResumeSamples } from "@/components/playground/ResumeSamples";
import { Faqs } from "@/components/sections/Faqs";

export const metadata: Metadata = {
  title: "ResumeCraft: AI Resume Builder | upGrad School of Technology",
  description:
    "Create professional, ATS-friendly resumes with AI. Match your resume to job descriptions, check ATS compatibility, and land your dream job faster.",
};

/** the ResumeCraft Agent's own questions, as on sot.upgrad.com */
const RESUME_FAQS = [
  {
    q: "How does the ResumeCraft Agent help improve my resume?",
    a: "The ResumeCraft Agent uses AI to analyze your resume content, format, and structure. It provides instant feedback on ATS optimization, keyword matching, formatting suggestions, and overall presentation to maximize your chances of landing interviews.",
  },
  {
    q: "Can I customize my resume template?",
    a: "Yes! The ResumeCraft Agent offers 20+ professional templates across different industries. You can choose from various styles, customize colors, fonts, and layouts to match your personal brand and industry standards.",
  },
  {
    q: "Does the agent check for ATS compatibility?",
    a: "Absolutely! The ResumeCraft Agent automatically scans your resume for ATS compatibility, ensuring proper formatting, keyword optimization, and structure that passes through Applicant Tracking Systems used by most companies.",
  },
  {
    q: "How accurate is the resume scoring system?",
    a: "Our AI-powered scoring system evaluates multiple factors including content quality, keyword relevance, formatting, ATS compatibility, and industry best practices. The scores are based on real-world hiring data and provide actionable insights for improvement.",
  },
  {
    q: "Can the agent rewrite my resume for different job roles?",
    a: "Yes. Upload your base resume and job description, and the agent will auto-generate tailored versions highlighting relevant experience, quantifiable impact, and keywords for each role.",
  },
];

/** the AI Playground's resume builder: the hero, the features, the before/after, the sample resumes and the FAQs; then the footer */
export default function ResumeCraftPage() {
  return (
    <>
      <Navbar links={false} />
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <ResumeHero />
        <ResumeFeatures />
        <ResumeCompare />
        <ResumeSamples />
        <Faqs items={RESUME_FAQS} allHref="/faqs#faq-resumecraft" />
      </main>
      <Footer />
    </>
  );
}
