import type { Metadata } from "next";
import { UgnetFormView } from "@/components/dashboard/UgnetFormView";

export const metadata: Metadata = {
  title: "uGNET Form | upGrad School of Technology",
  robots: { index: false },
};

export default function Page() {
  return <UgnetFormView />;
}
