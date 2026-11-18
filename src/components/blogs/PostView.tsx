"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Link2,
  Phone,
} from "lucide-react";
import { lenis } from "@/components/motion/SmoothScroll";
import { CornerHandles } from "@/components/site/CornerHandles";
import { PROSE } from "@/components/site/prose";
import { fmtDate, type Post } from "./data";
import { Byline, PostCard, cover } from "./PostCard";
import { PHONE } from "@/components/site/contact";

gsap.registerPlugin(useGSAP);

export type TocItem = { id: string; text: string; level: number };

/**
 * A blog post's page, after the live one (sot.upgrad.com/blogs/<slug>).
 *
 * On the blogs page's soft grey band: the trail (Blogs / category), the
 * title, its line, the byline and a copy-link button. Below, the cover
 * whole and the article on the left; on the right a column that stays in
 * view while the article scrolls: "In this article" (the heading in view
 * marked red, a click scrolls to it) and an admissions card in the home
 * page's admission-card style (Apply Now, the helpline). On phones the outline folds into a button above the
 * article and the card follows it. Then three more posts.
 *
 * The article's HTML comes from the live site's blog API, cleaned to plain
 * tags (no scripts, styles or event handlers) when it was saved.
 */
export function PostView({
  post: p,
  html,
  toc,
  more,
}: {
  post: Post;
  html: string;
  toc: TocItem[];
  more: Post[];
}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(toc[0]?.id);
  const [openToc, setOpenToc] = useState(false);
  const [copied, setCopied] = useState(false);

  // the heading in view, for the outline
  useEffect(() => {
    const onScroll = () => {
      let cur = toc[0]?.id;
      for (const t of toc) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top < 140) cur = t.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [toc]);

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setOpenToc(false);
    if (lenis) lenis.scrollTo(el, { offset: -132 });
    else
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 96,
        behavior: "smooth",
      });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-hero-line]",
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, stagger: 0.07, ease: "expo.out" },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const outline = (
    <ol className="grid gap-0.5">
      {toc.map((t) => (
        <li key={t.id}>
          <button
            type="button"
            onClick={() => goTo(t.id)}
            className={`relative w-full border-l-2 py-1.5 text-left text-[13.5px] leading-snug transition-colors ${
              t.level === 3 ? "pl-7" : "pl-4"
            } ${
              active === t.id
                ? "border-accent font-medium text-accent"
                : "border-black/[0.08] text-body hover:text-ink"
            }`}
          >
            {t.text}
          </button>
        </li>
      ))}
    </ol>
  );

  return (
    <div ref={root}>
      {/* the head, on the blogs page's grey band */}
      <section className="bg-[#f3f5f7] pb-10 pt-[92px] lg:pb-14 lg:pt-[120px]">
        <div className="container-page max-w-[1200px]">
          <nav
            data-hero-line
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[13px] text-muted"
          >
            <Link href="/blogs" className="hover:text-ink">
              Blogs
            </Link>
            <span aria-hidden>/</span>
            <span className="text-accent">{p.category}</span>
          </nav>
          <h1
            data-hero-line
            className="mt-4 max-w-[900px] text-balance font-display text-[clamp(1.875rem,4.2vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.035em] text-ink"
          >
            {p.title}
          </h1>
          {p.sub && (
            <p
              data-hero-line
              className="mt-4 line-clamp-3 max-w-[760px] text-[15.5px] leading-[1.6] text-body lg:text-[17px]"
            >
              {p.sub}
            </p>
          )}
          <div
            data-hero-line
            className="mt-6 flex flex-wrap items-center justify-between gap-4 lg:mt-8"
          >
            <Byline post={p} />
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-[6px] border border-black/[0.1] bg-white px-3.5 py-2 text-[13px] font-medium text-ink transition-colors hover:border-ink/30"
            >
              {copied ? (
                <Check size={15} aria-hidden className="text-accent" />
              ) : (
                <Link2 size={15} aria-hidden />
              )}
              {copied ? "Link copied" : "Copy link"}
            </button>
          </div>
        </div>
      </section>

      {/* the article and the column beside it */}
      <section className="bg-canvas py-10 lg:py-16">
        <div className="container-page grid max-w-[1200px] gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0">
            <div className="relative aspect-[1350/709] overflow-hidden rounded-[8px] bg-[#f3f5f7]">
              <Image
                src={cover(p.slug)}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 760px, 100vw"
                className="object-cover"
              />
            </div>

            {/* phones: the outline, folded */}
            {toc.length > 1 && (
              <div className="mt-6 rounded-[8px] border border-black/[0.08] lg:hidden">
                <button
                  type="button"
                  aria-expanded={openToc}
                  onClick={() => setOpenToc((o) => !o)}
                  className="flex w-full items-center justify-between px-4 py-3.5 text-[14.5px] font-medium text-ink"
                >
                  In this article
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={`transition-transform duration-300 ${openToc ? "rotate-180" : ""}`}
                  />
                </button>
                {openToc && <div className="px-4 pb-4">{outline}</div>}
              </div>
            )}

            <article
              className={`mt-8 lg:mt-10 ${PROSE}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>

          {/* stays in view while the article scrolls */}
          <aside className="lg:block">
            <div className="grid gap-6 lg:sticky lg:top-[124px]">
              {toc.length > 1 && (
                <div className="hidden lg:block">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    In this article
                  </p>
                  <div
                    data-lenis-prevent
                    className="mt-3 max-h-[max(140px,calc(100svh-530px))] overflow-y-auto pr-1 [scrollbar-width:thin]"
                  >
                    {outline}
                  </div>
                </div>
              )}

              {/* the admissions card, as the home page's admission
                  process card: bold red, a hairline border with corner
                  handles, a full-width white button with the hero CTA's
                  sweeping glow round its edge */}
              <div className="relative border border-black/[0.08] bg-accent p-6 text-white">
                <CornerHandles />
                <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/75">
                  Admissions Open 2026
                </p>
                <h2 className="mt-3 font-display text-[22px] font-medium leading-[1.2] tracking-[-0.02em]">
                  Build what&rsquo;s next at upGrad School of Technology
                </h2>
                <p className="mt-3 text-[14px] leading-relaxed text-white/85">
                  A B.Tech in CSE with AI, Full Stack, Data Science and Quantum
                  specialisations. Scholarships up to 100%.
                </p>
                <Link
                  href="/admission"
                  className="group/cta relative mt-7 flex w-full overflow-hidden rounded-[6px] p-[2px]"
                >
                  <span
                    aria-hidden
                    style={{
                      backgroundImage:
                        "conic-gradient(transparent 200deg, #0b0d12)",
                    }}
                    className="cta-glow absolute left-1/2 top-1/2 aspect-square w-[160%]"
                  />
                  <span className="relative z-[2] flex w-full items-center justify-center gap-2 rounded-[4px] bg-white px-5 py-3.5 text-[15px] font-semibold text-ink transition-colors duration-200 group-hover/cta:bg-white/90">
                    Apply Now
                    <ArrowUpRight
                      size={17}
                      strokeWidth={2}
                      aria-hidden
                      className="transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
                    />
                  </span>
                </Link>
                <a
                  href={PHONE.href}
                  className="mt-4 flex items-center justify-center gap-2 text-[14px] font-medium text-white/90 hover:text-white"
                >
                  <Phone size={14} aria-hidden />
                  {PHONE.label}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* more posts */}
      {more.length > 0 && (
        <section className="border-t border-black/[0.06] bg-canvas py-12 lg:py-20">
          <div className="container-page max-w-[1200px]">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-medium tracking-[-0.025em] text-ink">
                More to read
              </h2>
              <Link
                href="/blogs"
                className="group inline-flex items-center gap-1 text-[14px] font-medium text-ink hover:text-accent"
              >
                All posts
                <ArrowRight
                  size={15}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
            </div>
            <ul className="mt-8 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {more.map((m) => (
                <li key={m.slug}>
                  <PostCard post={m} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
      <span className="sr-only">Published {fmtDate(p.date)}</span>
    </div>
  );
}
