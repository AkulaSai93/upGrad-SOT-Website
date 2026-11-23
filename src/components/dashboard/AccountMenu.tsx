"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  RotateCcw,
  UserRound,
} from "lucide-react";
import { signOut } from "@/components/apply/applicant";
import {
  applicationId,
  firstName,
  resetApplication,
  useApplication,
} from "./application";

/**
 * The signed-in applicant's menu: their name, application ID and email
 * (or mobile number until an email is added), then Dashboard and Log out.
 * In the dashboard it also offers Reset application (after a confirm),
 * which clears every step and starts again from step 1. Log out clears
 * the saved application too, while it lives only in this browser.
 * One menu for the whole site: on the website it opens from the navbar's
 * user icon, in the dashboard from the name in the header (where it also
 * offers the way back to the website). A white card in the site's style;
 * Escape or a click outside closes it.
 *
 * `trigger`: "icon" is the navbar's square user button (`onDark` for the
 * bar's dark look), "pill" the dashboard's initial-and-name button.
 */
export function AccountMenu({
  trigger = "icon",
  onDark = false,
  inDashboard = false,
  className = "",
}: {
  trigger?: "icon" | "pill";
  onDark?: boolean;
  inDashboard?: boolean;
  className?: string;
}) {
  const app = useApplication();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (
        e instanceof KeyboardEvent
          ? e.key === "Escape"
          : !box.current?.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  if (!app) return null;
  const { name, phone, email } = app.profile;
  const initial = firstName(name).charAt(0).toUpperCase();
  const item =
    "flex w-full items-center gap-3 rounded-[4px] px-3 py-2.5 text-left text-[14.5px] font-medium transition-colors";

  return (
    <div ref={box} className={`relative ${className}`}>
      {trigger === "icon" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`${name}: account menu`}
          className={`grid size-[38px] place-items-center rounded-[4px] transition-colors ${
            onDark
              ? "bg-white/15 text-white hover:bg-white/25"
              : "bg-accent text-white hover:bg-accent-hover"
          }`}
        >
          <UserRound size={17} strokeWidth={2.2} aria-hidden />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="flex items-center gap-2 rounded-[4px] border border-black/[0.08] bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-ink"
        >
          <span className="grid size-8 place-items-center rounded-full bg-accent text-[13px] font-semibold text-white">
            {initial}
          </span>
          <span className="hidden text-[13.5px] font-medium text-ink sm:block">
            {firstName(name)}
          </span>
          <ChevronDown
            size={15}
            aria-hidden
            className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+10px)] z-[60] w-[272px] overflow-hidden rounded-[6px] border border-black/[0.08] bg-white shadow-[var(--shadow-lg)]"
        >
          <div className="px-4 pb-3.5 pt-4">
            <p className="truncate text-[16px] font-semibold text-ink">
              {name}
            </p>
            <p className="mt-1 text-[13px] font-medium tracking-[0.02em] text-body">
              ID: {applicationId(phone)}
            </p>
            <p className="mt-0.5 truncate text-[13px] text-muted">
              {email || `+91 ${phone}`}
            </p>
          </div>
          <div className="border-t border-black/[0.06] p-1.5">
            <Link
              role="menuitem"
              href="/dashboard"
              onClick={() => setOpen(false)}
              className={`${item} text-ink hover:bg-black/[0.04]`}
            >
              <LayoutDashboard size={17} aria-hidden />
              Dashboard
            </Link>
            {inDashboard && (
              <Link
                role="menuitem"
                href="/"
                onClick={() => setOpen(false)}
                className={`${item} text-ink hover:bg-black/[0.04]`}
              >
                <ArrowLeft size={17} aria-hidden />
                Back to website
              </Link>
            )}
            {inDashboard && (
              <button
                role="menuitem"
                type="button"
                onClick={() => {
                  if (
                    !window.confirm(
                      "Reset your application? Everything you have filled in will be cleared and you will start again from step 1.",
                    )
                  )
                    return;
                  setOpen(false);
                  resetApplication(phone);
                  router.push("/dashboard");
                  window.scrollTo({ top: 0 });
                }}
                className={`${item} text-ink hover:bg-black/[0.04]`}
              >
                <RotateCcw size={17} aria-hidden />
                Reset application
              </button>
            )}
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false);
                // until the back end keeps applications, logging out also
                // clears this one, so the next sign-in starts fresh
                resetApplication(phone);
                signOut();
              }}
              className={`${item} text-accent hover:bg-accent-soft`}
            >
              <LogOut size={17} aria-hidden />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
