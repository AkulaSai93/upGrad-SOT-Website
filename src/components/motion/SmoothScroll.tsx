"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** The live Lenis instance (null under reduced motion), so overlays can pause it. */
export let lenis: Lenis | null = null;

/**
 * Site-wide inertial scrolling. Lenis is driven from GSAP's ticker so smooth
 * scroll and ScrollTrigger scrub share one clock and never drift apart.
 * Skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  // a new page starts at its top: Lenis keeps its own scroll position, so
  // after a client-side navigation (home to a campus page, say) it would
  // otherwise hold the old page's offset and land near the footer. A link to
  // a #section on the new page still scrolls there, after this.
  useEffect(() => {
    if (window.location.hash) return;
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({
      lerp: 0.09,
      anchors: { offset: -116 },
      autoRaf: false,
    });
    instance.on("scroll", ScrollTrigger.update);
    lenis = instance;

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger measures where each scrubbed section starts and ends once;
    // when the page grows or shrinks afterwards (images, sticky stacks, revealed
    // sections) those marks go stale and, say, the Spotlight cards spread before
    // you reach them. Re-measure whenever the page height settles on a new value.
    // Two guards keep this from stuttering a phone mid-scroll: a height change
    // that comes only from the browser's address bar sliding in or out (the
    // viewport height changed with it) is ignored, and the re-measure waits
    // until the page has stopped scrolling.
    let height = document.body.scrollHeight;
    let viewH = window.innerHeight;
    let timer = 0;
    const settle = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (instance.isScrolling) return settle();
        const h = document.body.scrollHeight;
        const vh = window.innerHeight;
        const barOnly = vh !== viewH;
        viewH = vh;
        if (Math.abs(h - height) < 2) return;
        height = h;
        if (barOnly) return;
        ScrollTrigger.refresh();
      }, 250);
    };
    const ro = new ResizeObserver(settle);
    ro.observe(document.body);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  return null;
}
