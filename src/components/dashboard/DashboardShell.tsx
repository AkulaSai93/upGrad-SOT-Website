"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  LayoutDashboard,
  Lock,
  PanelLeft,
  Phone,
  X,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { PHONE } from "@/components/site/contact";
import { useHydrated } from "@/components/apply/localStore";
import { applicationId, useApplication, type Application } from "./application";
import { AccountMenu } from "./AccountMenu";
import { STEPS, stepStates, type StepState } from "./steps";
import { WelcomeBanner } from "./WelcomeBanner";

/**
 * The applicant dashboard's frame, around every page under /dashboard: a
 * slim header (logo, the helpline and the account menu), then the
 * application's nine steps beside the page. On desktop the steps run down
 * a rail on the left under a progress ring; on phones they fold into a
 * progress bar that opens to the same list.
 *
 * A step is done, the one to do next, or locked (each opens once the one
 * before it is done); done and current steps link to their pages.
 *
 * Signed-out visitors are sent to /apply; until the browser's saved
 * session is read the frame shows a quiet placeholder, so nobody sees a
 * flash of the sign-in prompt.
 */

const ApplicationContext = createContext<Application | null>(null);

/** the signed-in applicant's application, inside the dashboard */
export function useApp(): Application {
  const app = useContext(ApplicationContext);
  if (!app) throw new Error("useApp is only for pages inside the dashboard");
  return app;
}

/** the ring: a share of a circle in the brand red, the percentage inside */
function ProgressRing({
  done,
  size = 64,
  onDark = false,
}: {
  done: number;
  size?: number;
  onDark?: boolean;
}) {
  // a fine ring: thinner still on the small one in the phone strip
  const stroke = size <= 48 ? 3 : 4;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const share = done / STEPS.length;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={onDark ? "text-white/15" : "text-black/[0.07]"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - share)}
          className="text-accent transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span
        className={`absolute inset-0 grid place-items-center font-semibold ${size <= 48 ? "text-[11px]" : "text-[13px]"} ${onDark ? "text-white" : "text-ink"}`}
      >
        {Math.round(share * 100)}%
      </span>
    </div>
  );
}

function StepIcon({ state, index }: { state: StepState; index: number }) {
  const { Icon } = STEPS[index];
  return (
    <span
      className={`relative z-[1] grid size-9 shrink-0 place-items-center rounded-full border ${
        state === "done"
          ? "border-[#16a34a] bg-[#16a34a] text-white"
          : state === "current"
            ? "border-accent bg-accent-soft text-accent"
            : "border-black/[0.08] bg-black/[0.04] text-muted"
      }`}
    >
      {state === "done" ? (
        <Check size={16} strokeWidth={2.6} aria-hidden />
      ) : state === "current" ? (
        <Icon size={16} aria-hidden />
      ) : (
        <Lock size={14} aria-hidden />
      )}
    </span>
  );
}

/** the nine steps, joined by a line, each linking when it can be opened */
function StepList({
  states,
  onPick,
}: {
  states: StepState[];
  onPick?: () => void;
}) {
  const path = usePathname();
  return (
    <ol className="relative">
      {STEPS.map((step, i) => {
        const state = states[i];
        const open = state !== "locked" && step.href;
        const here = path === step.href;
        const body = (
          <>
            <StepIcon state={state} index={i} />
            <span className="min-w-0 pt-0.5">
              <span
                className={`block text-[14px] leading-tight ${
                  state === "locked" ? "text-muted" : "font-medium text-ink"
                }`}
              >
                {step.title}
              </span>
              <span className="mt-0.5 block text-[12px] text-muted">
                {state === "done"
                  ? "Completed"
                  : state === "current"
                    ? "Up next"
                    : "Locked"}
              </span>
            </span>
          </>
        );
        return (
          <li key={step.id} className="relative pb-2 last:pb-0">
            {/* the line down to the next step */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={`absolute left-[29px] top-[46px] h-[calc(100%-38px)] w-px ${
                  state === "done" ? "bg-[#16a34a]" : "bg-black/[0.08]"
                }`}
              />
            )}
            {open ? (
              <Link
                href={step.href!}
                onClick={onPick}
                aria-current={here ? "page" : undefined}
                className={`flex items-start gap-3 rounded-[6px] px-3 py-2 transition-colors ${
                  here ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
                }`}
              >
                {body}
              </Link>
            ) : (
              <div className="flex items-start gap-3 px-3 py-2">{body}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** the progress card, then Overview and the nine steps: the desktop rail,
    and the phone's slide-in panel */
function StepsPanel({
  app,
  states,
  done,
  onPick,
}: {
  app: Application;
  states: StepState[];
  done: number;
  onPick?: () => void;
}) {
  const path = usePathname();
  return (
    <>
      {/* the progress, on the site's dark ground with a red glow */}
      <div className="relative overflow-hidden rounded-[6px] bg-ink p-5 text-white">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full bg-accent/45 blur-3xl"
        />
        <div className="relative flex items-center gap-4">
          <ProgressRing done={done} onDark />
          <div>
            <p className="text-[15px] font-semibold">Application progress</p>
            <p className="mt-0.5 text-[13px] text-white/65">
              {done} of {STEPS.length} steps completed
            </p>
          </div>
        </div>
        <p className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[12.5px] text-white/60">
          Application ID
          <span className="font-semibold tracking-[0.04em] text-white">
            {applicationId(app.profile.phone)}
          </span>
        </p>
      </div>
      <nav
        aria-label="Application"
        className="rounded-[6px] border border-black/[0.08] bg-white p-3"
      >
        <Link
          href="/dashboard"
          onClick={onPick}
          aria-current={path === "/dashboard" ? "page" : undefined}
          className={`mb-2 flex items-center gap-3 rounded-[4px] px-3 py-2.5 text-[14px] font-medium text-ink transition-colors ${
            path === "/dashboard" ? "bg-black/[0.04]" : "hover:bg-black/[0.03]"
          }`}
        >
          <span className="grid size-9 place-items-center rounded-full border border-black/[0.08] bg-white">
            <LayoutDashboard size={16} aria-hidden />
          </span>
          Overview
        </Link>
        <p className="px-3 pb-2 pt-3 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-muted">
          Application steps
        </p>
        <StepList states={states} onPick={onPick} />
      </nav>
    </>
  );
}

function Header({ app, onMenu }: { app?: Application; onMenu?: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          {onMenu && (
            <button
              type="button"
              onClick={onMenu}
              aria-label="Show application steps"
              className="grid size-10 place-items-center rounded-[4px] border border-black/[0.08] text-ink transition-colors hover:border-ink lg:hidden"
            >
              <PanelLeft size={18} aria-hidden />
            </button>
          )}
          <Logo />
        </div>
        <div className="flex items-center gap-4">
          <a
            href={PHONE.href}
            className="hidden items-center gap-2 text-[13.5px] text-body transition-colors hover:text-ink md:inline-flex"
          >
            <Phone size={15} aria-hidden />
            Need help?{" "}
            <span className="font-semibold text-ink">{PHONE.label}</span>
          </a>
          {app && <AccountMenu trigger="pill" inDashboard />}
        </div>
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  const app = useApplication();
  const path = usePathname();
  const [stepsOpen, setStepsOpen] = useState(false);

  useEffect(() => {
    if (!stepsOpen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setStepsOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [stepsOpen]);

  if (!hydrated) {
    return (
      <div className="min-h-svh bg-white">
        <Header />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-svh bg-white">
        <Header />
        <div className="mx-auto flex max-w-[480px] flex-col items-center px-5 pt-28 text-center">
          <h1 className="font-display text-[28px] font-medium tracking-[-0.03em] text-ink">
            Sign in to see your dashboard
          </h1>
          <p className="mt-3 text-[15px] leading-[1.6] text-body">
            Verify your mobile number to start or continue your application.
          </p>
          <Link
            href="/apply"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-[4px] bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
          >
            Apply Now
            <ArrowRight size={16} strokeWidth={2.2} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }

  const states = stepStates(app);
  const done = states.filter((s) => s === "done").length;
  const current = STEPS[states.indexOf("current")];
  const isOverview = path === "/dashboard";

  return (
    <ApplicationContext.Provider value={app}>
      <div className="min-h-svh bg-[#f3f5f8]">
        <Header app={app} onMenu={() => setStepsOpen(true)} />
        {/* phones and tablets: a slim progress strip pinned under the
            header, opening the steps */}
        <button
          type="button"
          onClick={() => setStepsOpen(true)}
          className="sticky top-16 z-30 flex w-full items-center gap-3 border-b border-black/[0.06] bg-white/95 px-4 py-2.5 text-left backdrop-blur-xl sm:px-6 lg:hidden"
        >
          <ProgressRing done={done} size={40} />
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] text-muted">
              {done} of {STEPS.length} steps completed
            </span>
            <span className="block truncate text-[14.5px] font-semibold text-ink">
              {current ? `Next: ${current.title}` : "All steps done"}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-accent">
            All steps
            <ChevronRight size={16} aria-hidden />
          </span>
        </button>
        <div className="mx-auto grid max-w-[1240px] gap-6 px-4 pb-24 pt-6 lg:pb-16 sm:px-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-8 lg:pt-8">
          {/* desktop: the rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-3">
              <StepsPanel app={app} states={states} done={done} />
            </div>
          </aside>

          <main className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6">
            <WelcomeBanner />
            {/* a step's own tab: its form is where the banner's button
                scrolls to (the overview marks its own) */}
            {isOverview ? (
              children
            ) : (
              <div id="current-step" className="min-w-0 scroll-mt-32">
                {children}
              </div>
            )}
          </main>
        </div>

        {/* phones and tablets: the steps slide in from the left */}
        <div
          className={`fixed inset-0 z-[60] lg:hidden ${stepsOpen ? "" : "pointer-events-none"}`}
          inert={!stepsOpen}
        >
          <div
            onClick={() => setStepsOpen(false)}
            className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${
              stepsOpen ? "opacity-100" : "opacity-0"
            }`}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Application steps"
            className={`absolute inset-y-0 left-0 grid w-[min(340px,86vw)] auto-rows-max content-start gap-3 overflow-y-auto overscroll-contain bg-white p-4 shadow-[var(--shadow-lg)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              stepsOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-[13.5px] font-semibold uppercase tracking-[0.08em] text-ink">
                Your application
              </p>
              <button
                type="button"
                onClick={() => setStepsOpen(false)}
                aria-label="Close"
                className="grid size-9 place-items-center rounded-full text-muted transition-colors hover:bg-black/[0.04] hover:text-ink"
              >
                <X size={18} aria-hidden />
              </button>
            </div>
            <StepsPanel
              app={app}
              states={states}
              done={done}
              onPick={() => setStepsOpen(false)}
            />
          </aside>
        </div>
      </div>
    </ApplicationContext.Provider>
  );
}

/**
 * Once a step is done, on to the next: its own page, or, on the overview
 * (which shows the next step's form in place of the one just done), a
 * scroll up to it.
 */
export function useGoToNext() {
  const router = useRouter();
  const path = usePathname();
  return (href: string) => {
    if (path === "/dashboard") {
      window.setTimeout(() =>
        document
          .getElementById("current-step")
          ?.scrollIntoView({ behavior: "smooth", block: "start" }),
      );
    } else router.push(href);
  };
}

/**
 * Shows the page only once its step is open; otherwise says which step to
 * finish first.
 */
export function StepGate({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) {
  const app = useApp();
  const states = stepStates(app);
  const index = STEPS.findIndex((s) => s.id === id);
  if (states[index] !== "locked") return <>{children}</>;
  const blocker = STEPS[states.indexOf("current")];
  return (
    <div className="rounded-[6px] border border-black/[0.08] bg-white px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-black/[0.04] text-muted">
        <Lock size={20} aria-hidden />
      </span>
      <h1 className="mt-4 font-display text-[22px] font-medium tracking-[-0.02em] text-ink">
        {STEPS[index].title} is locked
      </h1>
      <p className="mx-auto mt-2 max-w-[380px] text-[14.5px] text-body">
        It opens once you finish {blocker?.title ?? "the step before it"}.
      </p>
      {blocker?.href && (
        <Link
          href={blocker.href}
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-[4px] bg-accent px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Go to {blocker.title}
          <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  );
}
