import type { Metadata } from "next";
import { ApplicationFee } from "@/components/dashboard/ApplicationFee";

export const metadata: Metadata = {
  title: "Application Fee | upGrad School of Technology",
  robots: { index: false },
};

export default function Page() {
  return <ApplicationFee />;
}
