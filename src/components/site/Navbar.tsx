"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CircleHelp,
  ClipboardCheck,
  FilePen,
  GraduationCap,
  House,
  Megaphone,
  MessageCircle,
  Newspaper,
  Phone,
  Sparkles,
  X,
} from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";
import { GlowButton } from "./GlowButton";
import { Logo } from "./Logo";
import { SOCIAL } from "./socials";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** sections with a black background: the nav switches to its dark style over
 *  them (campus-hero: the campus pages' film) */
const DARK_SECTIONS = [
  "pathways",
  "partners",
  "faculty",
  "leaders",
  "campus-hero",
  "about",
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Campuses", href: "/#campuses" },
  { label: "Curriculum", href: "/#curriculum" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Admission", href: "/#admission" },
];

const SOT = "https://sot.upgrad.com";

type MenuLink = { label: string; href: string };

/**
 * Everything the Menu lists, as on sot.upgrad.com's menu (read 16 Nov 2026):
 * its top-level pages, its two campuses, and the Events, Resource and Help
 * and Support lists under its More. The menu is drawn from these alone: the
 * pages as a list (icon, name, a short line); beside them the campuses as picture cards,
 * the featured event as a red card and the resources as icon chips; help and
 * support as small links at the foot. (Ignite AI Buildathon, listed under
 * Resources on sot.upgrad.com too, is the featured event here.)
 * Admissions and FAQs go to this site's own sections.
 */
const PAGES = [
  { label: "Home", line: "AI-First B.Tech in CSE", href: "/", Icon: House },
  {
    label: "Admissions",
    line: "Apply through uGNET",
    href: "/#admission",
    Icon: FilePen,
  },
  {
    label: "FAQs",
    line: "Answers to common questions",
    href: "/#faqs",
    Icon: CircleHelp,
  },
  {
    label: "Catalyst",
    line: "Campus ambassador programme",
    href: `${SOT}/catalyst`,
    Icon: Megaphone,
  },
  {
    label: "Get in Touch",
    line: "Talk to our admissions team",
    href: `${SOT}/contactus`,
    Icon: MessageCircle,
  },
];

/** the campuses, as picture cards */
const CAMPUSES = [
  {
    name: "Sri Siddhartha Academy",
    href: "/university/ssahe",
    place: "Tumkuru, Karnataka",
    tag: "NAAC A+",
    img: "/images/campuses/ssahe.webp",
  },
  {
    name: "Ajeenkya DY Patil University",
    href: `${SOT}/university/adypu`,
    place: "Pune, Maharashtra",
    tag: "NAAC A",
    img: "/images/campuses/adypu.webp",
  },
];

/** the featured event, as on sot.upgrad.com's Events list */
const EVENT = {
  name: "IAIB",
  full: "Ignite AI Buildathon",
  line: "Join India's biggest AI talent discovery event.",
  href: `${SOT}/events/iaib`,
};

/** the resources, as small chips with an icon each */
const RESOURCES = [
  { label: "AI Playground", href: `${SOT}/Playground`, Icon: Sparkles },
  { label: "uGNET", href: "/ugnet", Icon: ClipboardCheck },
  { label: "EDP", href: `${SOT}/edp`, Icon: GraduationCap },
  { label: "Blogs", href: `${SOT}/blogs`, Icon: Newspaper },
];

/** help and support: small links at the panel's foot */
const HELP: MenuLink[] = [
  { label: "Contact Us", href: `${SOT}/contactus` },
  { label: "Privacy Policy", href: `${SOT}/privacy-policy` },
  { label: "Terms & Conditions", href: `${SOT}/terms-and-conditions` },
  {
    label: "Admission Policy",
    href: `${SOT}/terms-and-conditions/admission-policy`,
  },
];

/**
 * Split floating nav — no full-width bar.
 *
 *  left    the logo on its own, no backing.
 *  centre  a compact link pill with an ink "tab" that slides to whichever link
 *          is hovered (resting on Home).
 *  right   Apply Now (rotating border glow) and a Menu button.
 *
 * The bar stays pinned to the top while scrolling. Over the hero it floats
 * with no backing; once the hero has scrolled away it gains a white bar
 * (blurred, hairline bottom edge) so it never sits on top of section content.
 * Over the dark sections (Pathways, Leaders) it switches to a dark bar (white logo and
 * links, white tab and Menu button), as makro.framer.website does.
 * Menu opens a side panel, after quadcse.com and lusion.co: a white panel
 * the screen's full height slides in from the right edge while the page dims
 * and blurs behind it. In it, on two columns from tablets up, the PAGES as
 * a list (an icon, the name and a short line each), and beside them the campuses as picture cards, the featured event
 * and the resources as tiles, all shown at once; on phones they follow the
 * pages. Help and support sit as small links at the foot. At its foot the programme line,
 * Apply Now, the admissions number and the school's social links. The panel
 * scrolls if the list grows past the screen; on phones it leaves a strip of
 * the dimmed page showing at the left. The panel has its own header (logo
 * and Close) and the bar fades away while it is open. Esc, Close or a click
 * on the dimmed page dismisses it; smooth scroll is paused while it is open.
 */
/** `links`: the centre pill of section links, which belong to the home page;
 *  other pages (the campus pages) leave it out */
export function Navbar({ links = true }: { links?: boolean } = {}) {
  const root = useRef<HTMLElement>(null);
  const pill = useRef<HTMLUListElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);

  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);
  const [tab, setTab] = useState({ left: 0, width: 0, index: 0 });

  /* ------------------------------------------------ sliding tab in the pill */
  const moveTab = (index: number) => {
    const li = pill.current?.children[index] as HTMLElement | undefined;
    if (li) setTab({ left: li.offsetLeft, width: li.offsetWidth, index });
  };
  useEffect(() => {
    const reset = () => moveTab(0);
    reset();
    document.fonts?.ready.then(reset);
    // the pill is display:none below lg, so re-measure when it appears
    window.addEventListener("resize", reset);
    return () => window.removeEventListener("resize", reset);
  }, []);

  /* ------------------------------------------------ white bar after the hero */
  useEffect(() => {
    let trigger: ScrollTrigger | undefined;
    // the first section in main: the hero (on the campus pages it sits a
    // level deeper, inside the page's own wrapper)
    const attach = () => {
      const hero = document.querySelector("main section");
      if (!hero) return false;
      trigger = ScrollTrigger.create({
        trigger: hero,
        start: "bottom top+=60",
        onEnter: () => setSolid(true),
        onLeaveBack: () => setSolid(false),
      });
      return true;
    };
    if (attach()) return () => trigger?.kill();
    // a campus page's content can stream in after the bar mounts (arriving
    // by a link): wait for its hero, then attach
    const main = document.querySelector("main");
    if (!main) return;
    const mo = new MutationObserver(() => {
      if (attach()) mo.disconnect();
    });
    mo.observe(main, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      trigger?.kill();
    };
  }, []);

  /* ------------------------------------------------ dark bar over dark sections */
  // Read from the section's live position on every scroll rather than from
  // precomputed trigger offsets: Pathways changes height when it switches
  // between its pinned and plain layouts, which would leave offsets stale.
  useEffect(() => {
    const check = () => {
      const h = window.innerHeight;
      setDark(
        DARK_SECTIONS.some((id) => {
          const r = document.getElementById(id)?.getBoundingClientRect();
          return !!r && r.top < h * 0.55 && r.bottom > h * 0.45;
        }),
      );
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  /* ------------------------------------------------ side-panel menu */
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(q(".menu-root"), { autoAlpha: 1 })
        .fromTo(
          q(".menu-backdrop"),
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.5, ease: "power2.out" },
          0,
        )
        .fromTo(
          q(".menu-panel"),
          { xPercent: 106 },
          { xPercent: 0, duration: 0.85 },
          0,
        )
        .fromTo(
          q(".menu-link"),
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 },
          0.2,
        )
        .fromTo(
          q(".menu-fade"),
          { y: 16, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 },
          0.4,
        );
    },
    { scope: root },
  );

  useEffect(() => {
    const t = tl.current;
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
        t?.progress(1);
      else t?.timeScale(1).play();
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      t?.timeScale(1.6).reverse();
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header ref={root}>
      {/* ------------------------------------------------------------ bar */}
      <div
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter,opacity] duration-500 ${
          open ? "pointer-events-none opacity-0" : ""
        } ${
          !solid || open
            ? "border-transparent bg-transparent"
            : dark
              ? "border-white/10 bg-black/85 backdrop-blur-xl"
              : "border-black/[0.08] bg-white/90 backdrop-blur-xl"
        }`}
      >
        <nav className="container-page flex h-[60px] items-center justify-between gap-4">
          <Logo onDark={dark && !open} />

          {links && (
            <ul
              ref={pill}
              onMouseLeave={() => moveTab(0)}
              className={`relative hidden items-center rounded-[6px] border p-1 backdrop-blur-xl transition-[opacity,background-color,border-color,box-shadow] duration-300 lg:flex ${
                solid
                  ? "border-transparent bg-transparent"
                  : "border-white/70 bg-white/70 shadow-[var(--shadow-sm)]"
              } ${open ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              {NAV_LINKS.map((link, i) => (
                <li
                  key={link.href}
                  onMouseEnter={() => moveTab(i)}
                  className="relative z-[1]"
                >
                  <Link
                    href={link.href}
                    className={`block whitespace-nowrap rounded-[4px] px-4 py-1.5 text-[14px] font-medium transition-colors duration-300 ${
                      tab.index === i
                        ? dark
                          ? "text-ink"
                          : "text-white"
                        : dark
                          ? "text-white/70 hover:text-white"
                          : "text-body hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {/* the sliding tab */}
              <span
                aria-hidden
                style={{ left: tab.left, width: tab.width }}
                className={`absolute inset-y-1 rounded-[4px] transition-[left,width,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  dark ? "bg-white" : "bg-ink"
                }`}
              />
            </ul>
          )}

          <div className="flex items-center gap-2">
            <GlowButton
              href="#apply"
              size="sm"
              streak={dark ? "#fff" : "#0b0d12"}
              className={`transition-opacity duration-300 max-sm:hidden ${open ? "pointer-events-none opacity-0" : ""}`}
            >
              Apply Now
              <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
            </GlowButton>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="site-menu"
              className={`group inline-flex h-[38px] items-center gap-3 rounded-[6px] pl-4 pr-3.5 text-[13.5px] font-semibold transition-colors ${
                dark && !open
                  ? "bg-white text-ink hover:bg-white/90"
                  : "bg-ink text-white hover:bg-black"
              }`}
            >
              <span className="relative block h-4 overflow-hidden">
                <span
                  className={`block transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open ? "-translate-y-4" : "translate-y-0"
                  }`}
                >
                  <span className="block h-4 leading-4">Menu</span>
                  <span className="block h-4 leading-4">Close</span>
                </span>
              </span>
              {/* two bars that cross into an X */}
              <span aria-hidden className="relative block size-3.5">
                <span
                  className={`absolute left-0 h-[1.5px] w-full transition-all ${dark && !open ? "bg-ink" : "bg-white"} duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open
                      ? "top-1/2 -translate-y-1/2 rotate-45"
                      : "top-[3px] rotate-0"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[1.5px] transition-all ${dark && !open ? "bg-ink" : "bg-white"} duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    open
                      ? "top-1/2 w-full -translate-y-1/2 -rotate-45"
                      : "bottom-[3px] w-2/3 rotate-0 group-hover:w-full"
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      {/* ------------------------------------------------------------ panel */}
      <div
        id="site-menu"
        aria-hidden={!open}
        inert={!open}
        className="menu-root invisible fixed inset-0 z-40"
      >
        {/* the page, dimmed and blurred; a click on it closes the menu */}
        <div
          onClick={close}
          className="menu-backdrop absolute inset-0 bg-ink/30 backdrop-blur-[3px]"
        />

        <div
          data-lenis-prevent
          className="menu-panel absolute inset-y-0 right-0 flex w-[min(420px,88vw)] flex-col md:w-[min(820px,92vw)] overflow-y-auto rounded-l-[6px] bg-white shadow-[var(--shadow-lg)]"
        >
          {/* the panel's own header: the logo, and Close level with the
              panel's padding (the bar fades away while the panel is open) */}
          <div className="flex items-center justify-between px-6 pb-5 pt-5 sm:px-8 sm:pt-6">
            <Logo />
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="group inline-flex h-[38px] items-center gap-2 rounded-[6px] bg-ink pl-4 pr-3 text-[13.5px] font-semibold text-white transition-colors hover:bg-accent"
            >
              Close
              <X
                size={15}
                strokeWidth={2.2}
                aria-hidden
                className="transition-transform duration-500 group-hover:rotate-90"
              />
            </button>
          </div>
          <nav
            aria-label="Site"
            className="grid gap-8 px-6 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] md:gap-10"
          >
            {/* the pages: an icon, the name and a short line each */}
            <ul className="grid content-start gap-1.5 self-start">
              {PAGES.map(({ label, line, href, Icon }) => (
                <li key={label} className="menu-link">
                  <Link
                    href={href}
                    onClick={close}
                    className="group flex items-center gap-3.5 rounded-[6px] px-2.5 py-2.5 transition-colors duration-300 hover:bg-sunken"
                  >
                    <span className="grid size-10 shrink-0 place-items-center rounded-[6px] border border-black/[0.08] bg-white text-ink transition-colors duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                      <Icon size={17} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-[17px] font-medium leading-tight tracking-[-0.02em] text-ink">
                        {label}
                      </span>
                      <span className="mt-0.5 block truncate text-[12.5px] text-body">
                        {line}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 shrink-0 text-ink/25 transition-all duration-300 group-hover:rotate-45 group-hover:text-accent"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            {/* beside the pages: the campuses, the featured event and the
                resources, as pictures and tiles */}
            <div className="grid content-start gap-6">
              <div className="menu-link">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Campuses
                </p>
                <ul className="mt-3 grid grid-cols-2 gap-3">
                  {CAMPUSES.map((c) => (
                    <li key={c.name}>
                      <Link
                        href={c.href}
                        onClick={close}
                        className="group/c relative block aspect-[4/3] overflow-hidden rounded-[6px] bg-ink"
                      >
                        <Image
                          src={c.img}
                          alt=""
                          fill
                          sizes="(min-width: 768px) 220px, 40vw"
                          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/c:scale-[1.06]"
                        />
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0)_100%)]"
                        />
                        <span className="absolute left-2.5 top-2.5 rounded-[3px] bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {c.tag}
                        </span>
                        <span className="absolute inset-x-2.5 bottom-2.5 text-white">
                          <span className="block text-[13px] font-semibold leading-tight sm:text-[14px]">
                            {c.name}
                          </span>
                          <span className="mt-0.5 block text-[11.5px] text-white/75">
                            {c.place}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="menu-link grid gap-3 sm:grid-cols-2">
                {/* the featured event */}
                <Link
                  href={EVENT.href}
                  onClick={close}
                  className="group/e relative flex flex-col justify-between overflow-hidden rounded-[6px] bg-accent p-4 text-white"
                >
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/80">
                    Featured event
                  </span>
                  <span className="mt-6">
                    <span className="block font-display text-[22px] font-medium leading-none tracking-[-0.03em]">
                      {EVENT.name}
                    </span>
                    <span className="mt-1 block text-[13px] font-semibold">
                      {EVENT.full}
                    </span>
                    <span className="mt-1.5 block text-[12px] leading-snug text-white/80">
                      {EVENT.line}
                    </span>
                  </span>
                  <ArrowUpRight
                    size={16}
                    aria-hidden
                    className="absolute right-3.5 top-3.5 transition-transform duration-300 group-hover/e:rotate-45"
                  />
                </Link>

                {/* the resources */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                    Resources
                  </p>
                  <ul className="mt-2 grid gap-1.5">
                    {RESOURCES.map(({ label, href, Icon }) => (
                      <li key={label}>
                        <Link
                          href={href}
                          onClick={close}
                          className="group/r flex h-11 items-center gap-2.5 rounded-[6px] border border-black/[0.08] pl-2 pr-2.5 transition-colors duration-300 hover:border-accent hover:bg-accent-soft"
                        >
                          <span className="grid size-7 shrink-0 place-items-center rounded-[4px] bg-accent-soft text-accent transition-colors duration-300 group-hover/r:bg-accent group-hover/r:text-white">
                            <Icon size={14} aria-hidden />
                          </span>
                          <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[12.5px] font-semibold text-ink">
                            {label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </nav>

          {/* the foot: the programme, Apply Now and the admissions line,
              then the school's channels */}
          <div className="mt-auto px-6 pb-6 pt-8 sm:px-8">
            <div className="menu-fade rounded-[6px] bg-sunken p-4">
              <p className="font-display text-[17px] font-medium leading-tight tracking-[-0.02em] text-ink">
                AI-First B.Tech in{" "}
                <span className="text-accent">Computer Science</span>
              </p>
              <p className="mt-1 text-[13.5px] text-body">
                Admission starts with uGNET
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <GlowButton
                  href="#apply"
                  streak="#0b0d12"
                  size="sm"
                  onClick={close}
                >
                  Apply Now
                  <ArrowRight size={14} strokeWidth={2.2} aria-hidden />
                </GlowButton>
                <a
                  href="tel:18002108080"
                  className="inline-flex items-center gap-2 text-[13.5px] text-body transition-colors hover:text-ink"
                >
                  <Phone size={14} aria-hidden />
                  <span className="font-semibold text-ink">1800 210 8080</span>
                </a>
              </div>
            </div>
            {/* help and support, small */}
            <ul className="menu-fade mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-[12.5px] text-body">
              {HELP.map((h) => (
                <li key={h.label}>
                  <Link
                    href={h.href}
                    onClick={close}
                    className="transition-colors hover:text-ink"
                  >
                    {h.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="menu-fade mt-5 flex items-center gap-2">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`upGrad School of Technology on ${s.label}`}
                    className="grid size-9 place-items-center rounded-[6px] border border-black/[0.08] text-ink/70 transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden
                      className="size-4"
                      fill="currentColor"
                    >
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
