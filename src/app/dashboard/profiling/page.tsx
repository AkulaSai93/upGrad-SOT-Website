import type { Metadata } from "next";
import { ProfilingView } from "@/components/dashboard/ProfilingView";

export const metadata: Metadata = {
  title: "Comprehensive Profiling | upGrad School of Technology",
  robots: { index: false },
};

export default function Page() {
  return <ProfilingView />;
}
