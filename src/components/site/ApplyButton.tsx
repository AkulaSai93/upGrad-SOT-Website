"use client";

import Link from "next/link";
import { ArrowRight, UserRound } from "lucide-react";
import { useApplicant } from "@/components/apply/applicant";
import { AccountMenu } from "@/components/dashboard/AccountMenu";
import { GlowButton } from "./GlowButton";

/**
 * The navbar's Apply Now, which becomes a user icon once the visitor has
 * signed in on /apply: the icon opens the account menu (name, ID, email,
 * Dashboard, Log out).
 *
 * `labelled` adds "My Dashboard" beside the icon, for the places with room
 * for it (the phone's bottom bar and the menu panel). `onDark` styles the
 * icon for the bar's dark look.
 */
export function ApplyButton({
  streak = "#0b0d12",
  labelled = false,
  onDark = false,
  className = "",
  onClick,
}: {
  streak?: string;
  labelled?: boolean;
  onDark?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  const applicant = useApplicant();

  if (!applicant) {
    return (
      <GlowButton
        href="/apply"
        size="sm"
        streak={streak}
        className={className}
        onClick={onClick}
      >
        Apply Now
        <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
      </GlowButton>
    );
  }

  // the bar's icon opens the account menu; the roomier spots link straight
  // to the dashboard
  if (!labelled) return <AccountMenu onDark={onDark} className={className} />;

  return (
    <Link
      href="/dashboard"
      onClick={onClick}
      className={`inline-flex h-[38px] items-center justify-center gap-2 rounded-[6px] px-3.5 text-[13.5px] font-semibold transition-colors ${
        onDark
          ? "bg-white/15 text-white hover:bg-white/25"
          : "bg-accent text-white hover:bg-accent-hover"
      } ${className}`}
    >
      <UserRound size={17} strokeWidth={2.2} aria-hidden />
      My Dashboard
    </Link>
  );
}
