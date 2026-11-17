"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { lenis } from "@/components/motion/SmoothScroll";
import { POSTS, postHref, type Post } from "./data";
import { Byline, PostCard, cover } from "./PostCard";

gsap.registerPlugin(useGSAP);

/**
 * The Blogs page, from the Figma design (SOT Website, node 250:18639).
 *
 * Restyled after a client reference: the covers carry their own words, so
 * they are always shown whole, at their own shape, never under copy.
 *
 * Hero: the four newest posts as a slider in a soft rounded card, the
 * cover on the left and "Featured", the title, its line and the byline on
 * the right; small dots (the current one a red bar). It moves on by itself
 * every few seconds and pauses on hover.
 *
 * Then the posts by category, as on the FAQs page: a sticky row of chips
 * (the category in view red, a click scrolls to it) over each category in
 * turn, a big red number, its name and count, then its posts three across
 * on desktop: the rounded cover, the title, two lines of the post and the
 * byline (initials, author, date, reading time). Every post opens its page.
 */

const FEATURED = POSTS.slice(0, 4);
const pad = (n: number) => String(n).padStart(2, "0");
const catId = (c: string) =>
  "cat-" + c.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export function BlogsPage() {
  const root = useRef<HTMLDivElement>(null);
  const posts = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  // the posts by category, the busiest first
  const groups = useMemo(() => {
    const m = new Map<string, Post[]>();
    POSTS.forEach((p) => m.set(p.category, [...(m.get(p.category) ?? []), p]));
    return [...m.entries()]
      .sort((a, b) => b[1].length - a[1].length)
      .map(([name, list]) => ({ name, id: catId(name), list }));
  }, []);
  const [active, setActive] = useState(groups[0].id);

  // the slider moves on by itself
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(
      () => setSlide((s) => (s + 1) % FEATURED.length),
      6000,
    );
    return () => clearTimeout(t);
  }, [slide, paused]);

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
    { scope: root, dependencies: [slide], revertOnUpdate: true },
  );

  // the category in view lights its chip (as on the FAQs page), and a
  // hairline shows under the chips once they are stuck
  useEffect(() => {
    const el = posts.current?.querySelector<HTMLElement>("[data-chips]");
    if (!el) return;
    const onScroll = () => {
      el.toggleAttribute(
        "data-stuck",
        (posts.current?.getBoundingClientRect().top ?? 1) < 0,
      );
      const line = el.getBoundingClientRect().bottom + 40;
      let cur = groups[0].id;
      for (const g of groups) {
        const s = document.getElementById(g.id);
        if (s && s.getBoundingClientRect().top < line) cur = g.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [groups]);

  // keep the lit chip in view in the row
  useEffect(() => {
    const chip = document.getElementById(`chip-${active}`);
    const row = chip?.parentElement;
    if (!chip || !row) return;
    row.scrollTo({
      left: chip.offsetLeft - row.clientWidth / 2 + chip.clientWidth / 2,
      behavior: "smooth",
    });
  }, [active]);

  // a chip scrolls to its category, just under the stuck chips
  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const chips =
      posts.current?.querySelector<HTMLElement>("[data-chips]")?.offsetHeight ??
      60;
    const offset = -(96 + chips + 24);
    if (lenis) lenis.scrollTo(el, { offset });
    else
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY + offset,
        behavior: "smooth",
      });
  };

  return (
    <div ref={root}>
      <h1 className="sr-only">uGSOT Blogs</h1>

      {/* the featured posts on a soft grey band, full width: the cover whole (never cropped,
          so the words on it stay readable) beside its title and line */}
      <section
        aria-roledescription="carousel"
        aria-label="Featured posts"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="bg-[#f3f5f7] pb-8 pt-[84px] lg:pb-14 lg:pt-[108px]"
      >
        <div className="container-page grid">
          {FEATURED.map((p, i) => (
            <div
              key={p.slug}
              aria-hidden={i !== slide}
              className={`group grid items-center gap-5 [grid-area:1/1] transition-opacity duration-700 ease-out lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14 ${
                i === slide
                  ? "z-[1] opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <Link
                href={postHref(p.slug)}
                tabIndex={-1}
                aria-hidden
                className="relative block aspect-[1350/709] overflow-hidden rounded-[8px] bg-white"
              >
                <Image
                  src={cover(p.slug)}
                  alt=""
                  fill
                  priority={i === 0}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
                />
              </Link>
              {i === slide && (
                <div className="px-1 lg:px-0 lg:pr-6">
                  <p
                    data-hero-line
                    className="text-[13px] font-medium text-accent"
                  >
                    Featured · {p.category}
                  </p>
                  <h2
                    data-hero-line
                    className="mt-2.5 line-clamp-3 text-balance font-display text-[clamp(1.375rem,2.1vw,1.875rem)] font-medium leading-[1.2] tracking-[-0.02em] text-ink"
                  >
                    <Link
                      href={postHref(p.slug)}
                      className="transition-colors hover:text-accent"
                    >
                      {p.title}
                    </Link>
                  </h2>
                  {p.sub && (
                    <p
                      data-hero-line
                      className="mt-3 line-clamp-2 text-[14.5px] leading-[1.55] text-body lg:text-[15px]"
                    >
                      {p.sub}
                    </p>
                  )}
                  <div data-hero-line className="mt-5">
                    <Byline post={p} />
                  </div>

                  {/* the dots, under the byline (centred on phones) */}
                  <div
                    data-hero-line
                    className="mt-7 flex justify-center gap-2 lg:mt-9 lg:justify-start"
                  >
                    {FEATURED.map((f, j) => (
                      <button
                        key={f.slug}
                        type="button"
                        aria-label={`Go to slide ${j + 1}`}
                        aria-current={j === slide}
                        onClick={() => setSlide(j)}
                        className={`h-2 rounded-[2px] transition-all duration-500 ${
                          j === slide
                            ? "w-6 bg-accent"
                            : "w-2 bg-ink/15 hover:bg-ink/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* the categories and the posts */}
      <section ref={posts} className="bg-canvas pb-10 pt-7 lg:pb-20 lg:pt-14">
        {/* the chips stay under the navbar while the posts scroll */}
        <div
          className="sticky top-[96px] z-20 border-b border-transparent bg-white/95 py-3 backdrop-blur data-[stuck]:border-black/[0.08]"
          data-chips
        >
          <div
            role="tablist"
            aria-label="Categories"
            className="container-page flex gap-3 overflow-x-auto [scrollbar-width:none] lg:gap-4 [&::-webkit-scrollbar]:hidden"
          >
            {groups.map((g) => (
              <button
                key={g.id}
                id={`chip-${g.id}`}
                type="button"
                role="tab"
                aria-selected={active === g.id}
                onClick={() => goTo(g.id)}
                className={`shrink-0 whitespace-nowrap rounded-[2px] border px-4 py-2 text-[14px] transition-colors duration-300 lg:text-[16px] ${
                  active === g.id
                    ? "border-accent bg-accent text-white"
                    : "border-black/[0.1] bg-white text-ink hover:border-ink/30"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        {/* every category in turn: a big red number, its name and count,
            then its posts */}
        <div className="container-page mt-8 grid gap-16 lg:mt-12 lg:gap-24">
          {groups.map((g, gi) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-title`}>
              <div className="flex items-start gap-4 lg:gap-5">
                <span className="font-display text-[clamp(2.5rem,4.4vw,3.75rem)] font-medium leading-[0.85] tracking-[-0.05em] text-accent">
                  {pad(gi + 1)}
                </span>
                <div>
                  <h2
                    id={`${g.id}-title`}
                    className="font-display text-[clamp(1.375rem,2.2vw,1.75rem)] font-medium leading-tight tracking-[-0.025em] text-ink"
                  >
                    {g.name}
                  </h2>
                  <p className="mt-1 text-[14px] text-muted">
                    {g.list.length} {g.list.length === 1 ? "post" : "posts"}
                  </p>
                </div>
              </div>
              <ul className="mt-6 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-8 lg:grid-cols-3 lg:gap-y-14">
                {g.list.map((p) => (
                  <li key={p.slug}>
                    <PostCard post={p} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
