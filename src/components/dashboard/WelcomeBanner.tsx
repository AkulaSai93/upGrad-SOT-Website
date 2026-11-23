"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowDown, ArrowRight } from "lucide-react";
import { GlowButton } from "@/components/site/GlowButton";
import { useApp } from "./DashboardShell";
import { firstName } from "./application";
import { STEPS, stepStates } from "./steps";

/**
 * The welcome banner at the top of every dashboard tab: students on
 * campus under a blue sky (Figma AI), the greeting, and the one thing to
 * do next on the site's glowing button. The button scrolls to the step's
 * form when it is on this page (the overview, or that step's own tab) and
 * goes to that step's tab from anywhere else.
 */
export function WelcomeBanner() {
  const app = useApp();
  const path = usePathname();
  const states = stepStates(app);
  const next = STEPS[states.indexOf("current")];
  const done = states.filter((s) => s === "done").length;

  // the step to fill in, when the next one has a page
  const shown = next?.href ? next : undefined;
  const here = path === "/dashboard" || path === shown?.href;
  const target = shown && (here ? "#current-step" : shown.href);
  const Arrow = here ? ArrowDown : ArrowRight;

  return (
    <section className="relative overflow-hidden rounded-[6px] bg-[linear-gradient(180deg,#e3eefe_0%,#b0d9fd_50%,#d4eafe_100%)]">
      {/* the photo at the right at the banner's full height, its left
            edge fading into the matching sky behind the copy (on phones
            too, so the banner stays short) */}
      <div className="absolute inset-y-0 right-0 aspect-[1600/686] [mask-image:linear-gradient(90deg,transparent_0%,#000_28%)]">
        <Image
          src="/images/dashboard/banner.webp"
          alt=""
          fill
          priority
          sizes="(min-width: 768px) 560px, 360px"
          className="object-cover"
        />
      </div>
      <div className="relative z-[1] max-w-[60%] px-4 py-4 sm:px-7 md:max-w-[55%] md:py-6 xl:max-w-[560px]">
        <p className="hidden items-center gap-2 rounded-[4px] sm:inline-flex bg-white/70 px-2.5 py-0.5 text-[11.5px] font-semibold text-[#294454] backdrop-blur">
          <span className="size-1.5 rounded-full bg-accent" />
          AI-First B.Tech · 2027 intake
        </p>
        <h1 className="font-display text-[clamp(1.35rem,2.6vw,2.1rem)] sm:mt-3 font-medium leading-[1.05] tracking-[-0.035em] text-ink">
          Hi, {firstName(app.profile.name)}.{" "}
          <span className="text-accent">
            {done === 0 ? "Let's begin." : "Keep going."}
          </span>
        </h1>
        {/* the next step and the way to it, on one line so the banner
              stays short */}
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mt-2">
          <p
            className={`text-[14px] leading-[1.5] text-[#294454] ${target ? "max-sm:hidden" : ""}`}
          >
            {next ? (
              shown ? (
                <>
                  Up next:{" "}
                  <span className="font-semibold text-ink">{next.title}</span>
                </>
              ) : (
                `Up next: ${next.title}. ${next.line}.`
              )
            ) : (
              "Every step is done. We will be in touch soon."
            )}
          </p>
          {target && (
            <GlowButton href={target} streak="#0b0d12" size="sm">
              {done === 0 ? "Start your application" : `Go to ${shown.title}`}
              <Arrow size={14} strokeWidth={2.2} aria-hidden />
            </GlowButton>
          )}
        </div>
      </div>
    </section>
  );
}
