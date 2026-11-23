import type { Metadata } from "next";
import { SlotView } from "@/components/dashboard/SlotView";

export const metadata: Metadata = {
  title: "uGNET Slot Selection | upGrad School of Technology",
  robots: { index: false },
};

export default function Page() {
  return <SlotView />;
}
