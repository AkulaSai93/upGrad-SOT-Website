"use client";

import { useEffect } from "react";
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
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ lerp: 0.09, anchors: { offset: -80 }, autoRaf: false });
    instance.on("scroll", ScrollTrigger.update);
    lenis = instance;

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger measures where each scrubbed section starts and ends once;
    // when the page grows or shrinks afterwards (images, sticky stacks, revealed
    // sections) those marks go stale and, say, the Spotlight cards spread before
    // you reach them. Re-measure whenever the page height settles on a new value.
    let height = document.body.scrollHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const h = document.body.scrollHeight;
        if (Math.abs(h - height) < 2) return;
        height = h;
        ScrollTrigger.refresh();
      }, 200);
    });
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
