import type { Metadata } from "next";
import { ApplyView } from "@/components/apply/ApplyView";

export const metadata: Metadata = {
  title: "Apply Now | upGrad School of Technology",
  description:
    "Start your application for the AI-First B.Tech in Computer Science at upGrad School of Technology: verify your mobile number to begin.",
};

/** the application sign-up: a full screen of its own, with no navbar or footer */
export default function ApplyPage() {
  return <ApplyView />;
}
