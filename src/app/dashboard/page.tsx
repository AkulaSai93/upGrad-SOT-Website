import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { DashboardView } from "@/components/apply/DashboardView";

export const metadata: Metadata = {
  title: "Your Dashboard | upGrad School of Technology",
  robots: { index: false },
};

/** the applicant's dashboard: a placeholder until its design is ready */
export default function DashboardPage() {
  return (
    <>
      <Navbar links={false} />
      <main className="relative z-10 flex-1 bg-canvas">
        <DashboardView />
      </main>
      <Footer />
    </>
  );
}
