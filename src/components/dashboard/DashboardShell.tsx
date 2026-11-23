"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  LayoutDashboard,
  Lock,
  LogOut,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { PHONE } from "@/components/site/contact";
import { signOut } from "@/components/apply/applicant";
import { useHydrated } from "@/components/apply/localStore";
import {
  applicationId,
  firstName,
  useApplication,
  type Application,
} from "./application";
import { STEPS, stepStates, type StepState } from "./steps";

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
  const r = (size - 8) / 2;
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
          strokeWidth={6}
          className={onDark ? "text-white/15" : "text-sunken"}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - share)}
          className="text-accent transition-[stroke-dashoffset] duration-700"
        />
      </svg>
      <span
        className={`absolute inset-0 grid place-items-center text-[13px] font-semibold ${onDark ? "text-white" : "text-ink"}`}
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
          ? "border-accent bg-accent text-white"
          : state === "current"
            ? "border-accent bg-accent-soft text-accent"
            : "border-black/[0.08] bg-sunken text-muted"
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
                  state === "done" ? "bg-accent" : "bg-black/[0.08]"
                }`}
              />
            )}
            {open ? (
              <Link
                href={step.href!}
                onClick={onPick}
                aria-current={here ? "page" : undefined}
                className={`flex items-start gap-3 rounded-[8px] px-3 py-2 transition-colors ${
                  here ? "bg-sunken" : "hover:bg-sunken/60"
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

/** the account menu: who is signed in, the application ID, sign out */
function AccountMenu({ app }: { app: Application }) {
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

  const initial = firstName(app.profile.name).charAt(0).toUpperCase();

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2 rounded-[6px] border border-black/[0.08] bg-white py-1 pl-1 pr-2.5 transition-colors hover:border-ink"
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent text-[13px] font-semibold text-white">
          {initial}
        </span>
        <span className="hidden text-[13.5px] font-medium text-ink sm:block">
          {firstName(app.profile.name)}
        </span>
        <ChevronDown size={15} className="text-muted" aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-[260px] rounded-[6px] border border-black/[0.08] bg-white p-2 shadow-[var(--shadow-lg)]"
        >
          <div className="px-3 py-2.5">
            <p className="truncate text-[14px] font-semibold text-ink">
              {app.profile.name}
            </p>
            <p className="text-[12.5px] text-muted">+91 {app.profile.phone}</p>
            <p className="mt-2 inline-block rounded-[4px] bg-sunken px-2 py-0.5 text-[11.5px] font-medium tracking-[0.04em] text-body">
              ID {applicationId(app.profile.phone)}
            </p>
          </div>
          <div className="my-1 h-px bg-black/[0.06]" />
          <Link
            role="menuitem"
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-[14px] text-ink hover:bg-sunken"
          >
            <ArrowRight size={15} className="rotate-180" aria-hidden />
            Back to website
          </Link>
          <button
            role="menuitem"
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-left text-[14px] text-accent hover:bg-accent-soft"
          >
            <LogOut size={15} aria-hidden />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function Header({ app }: { app?: Application }) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />
        <div className="flex items-center gap-4">
          <a
            href={PHONE.href}
            className="hidden items-center gap-2 text-[13.5px] text-body transition-colors hover:text-ink md:inline-flex"
          >
            <Phone size={15} aria-hidden />
            Need help?{" "}
            <span className="font-semibold text-ink">{PHONE.label}</span>
          </a>
          {app && <AccountMenu app={app} />}
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
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-[6px] bg-accent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-accent-hover"
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

  return (
    <ApplicationContext.Provider value={app}>
      <div className="min-h-svh bg-white">
        <Header app={app} />
        <div className="mx-auto grid max-w-[1240px] gap-6 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-[288px_minmax(0,1fr)] lg:gap-8 lg:pt-8">
          {/* desktop: the rail */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 grid gap-3">
              {/* the progress, on the site's dark ground with a red glow */}
              <div className="relative overflow-hidden rounded-[8px] bg-ink p-5 text-white">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-16 size-44 rounded-full bg-accent/45 blur-3xl"
                />
                <div className="relative flex items-center gap-4">
                  <ProgressRing done={done} onDark />
                  <div>
                    <p className="text-[15px] font-semibold">
                      Application progress
                    </p>
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
                className="rounded-[8px] border border-black/[0.08] bg-white p-3"
              >
                <Link
                  href="/dashboard"
                  aria-current={path === "/dashboard" ? "page" : undefined}
                  className={`mb-2 flex items-center gap-3 rounded-[6px] px-3 py-2.5 text-[14px] font-medium text-ink transition-colors ${
                    path === "/dashboard" ? "bg-sunken" : "hover:bg-sunken/60"
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
                <StepList states={states} />
              </nav>
            </div>
          </aside>

          {/* phones and tablets: the progress bar, opening to the steps */}
          <div className="rounded-[8px] border border-black/[0.08] bg-white lg:hidden">
            <button
              type="button"
              onClick={() => setStepsOpen((v) => !v)}
              aria-expanded={stepsOpen}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <ProgressRing done={done} size={48} />
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] text-muted">
                  {done} of {STEPS.length} steps completed
                </span>
                <span className="block truncate text-[15px] font-semibold text-ink">
                  {current ? `Next: ${current.title}` : "All steps done"}
                </span>
              </span>
              <ChevronDown
                size={18}
                aria-hidden
                className={`text-muted transition-transform ${stepsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {stepsOpen && (
              <nav
                aria-label="Application"
                className="border-t border-black/[0.06] p-2"
              >
                <Link
                  href="/dashboard"
                  onClick={() => setStepsOpen(false)}
                  className="mb-1 flex items-center gap-3 rounded-[6px] px-3 py-2 text-[14px] font-medium text-ink hover:bg-sunken/60"
                >
                  <span className="grid size-9 place-items-center rounded-full border border-black/[0.08] bg-white">
                    <LayoutDashboard size={16} aria-hidden />
                  </span>
                  Overview
                </Link>
                <StepList states={states} onPick={() => setStepsOpen(false)} />
              </nav>
            )}
          </div>

          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </ApplicationContext.Provider>
  );
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
    <div className="rounded-[8px] border border-black/[0.08] bg-white px-6 py-14 text-center">
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-sunken text-muted">
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
          className="mt-6 inline-flex h-11 items-center gap-2 rounded-[6px] bg-accent px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          Go to {blocker.title}
          <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  );
}
