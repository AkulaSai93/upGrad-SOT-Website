"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type TouchEvent,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Volume2,
  VolumeX,
} from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";

/**
 * "Explore the uGSOT Brochure": the brochure as a book whose pages turn,
 * after the book on mastersunion.org ("Building Real Startups, Not Just
 * Projects"), with a soft paper sound on every turn.
 *
 * The pages are the brochure's own (public/images/brochure, rendered from
 * the PDF in public/brochure). On desktop the book lies open, two pages
 * side by side: it starts closed on the cover (shifted so the cover sits
 * in the middle), each turn swings a leaf over the spine in 3D, and it
 * ends closed on the back cover. Click the right page, the arrow buttons
 * or the keyboard's arrow keys to turn. On phones it is a single-page
 * book: the page swings over from its left edge to show the next, turned
 * with a tap, the buttons or a swipe.
 *
 * The sound is made in the browser (a short burst of filtered noise, no
 * audio file) after the first click, and can be muted. Only the pages
 * near the open spread load, so the book stays light. Reduced motion:
 * pages change without the swing.
 *
 * Its id, "brochure", is where the site's Download Brochure buttons point.
 */

const PAGES = Array.from(
  { length: 24 },
  (_, i) => `/images/brochure/p${String(i + 1).padStart(2, "0")}.webp`,
);
const LEAVES = PAGES.length / 2;
const TURN_MS = 900;
const PDF = "/brochure/uGSOT-Brochure.pdf";

/** a short paper-flip sound, made from filtered noise */
function useFlipSound() {
  const ctx = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);

  const play = useCallback(() => {
    if (muted) return;
    try {
      ctx.current ??= new AudioContext();
      const ac = ctx.current;
      const length = Math.floor(ac.sampleRate * 0.38);
      const buffer = ac.createBuffer(1, length, ac.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i++) {
        // noise that thins out, with a little flutter for the paper
        const t = i / length;
        data[i] =
          (Math.random() * 2 - 1) *
          (1 - t) ** 2 *
          (0.7 + 0.3 * Math.sin(t * 60));
      }
      const noise = ac.createBufferSource();
      noise.buffer = buffer;
      const band = ac.createBiquadFilter();
      band.type = "bandpass";
      band.Q.value = 0.8;
      band.frequency.setValueAtTime(2600, ac.currentTime);
      band.frequency.exponentialRampToValueAtTime(900, ac.currentTime + 0.35);
      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.35, ac.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.38);
      noise.connect(band).connect(gain).connect(ac.destination);
      noise.start();
    } catch {
      // no Web Audio: turn the page in silence
    }
  }, [muted]);

  return { play, muted, setMuted };
}

const WIDE = "(min-width: 768px)";
const onWideChange = (cb: () => void) => {
  const mq = window.matchMedia(WIDE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

/** true on screens wide enough for the open book */
function useWide() {
  return useSyncExternalStore(
    onWideChange,
    () => window.matchMedia(WIDE).matches,
    () => true,
  );
}

/** one face of a leaf: the page, or plain paper until it is near */
function Face({
  page,
  near,
  side,
}: {
  page: number;
  near: boolean;
  side: "front" | "back";
}) {
  return (
    <div
      className="absolute inset-0 overflow-hidden bg-white [backface-visibility:hidden]"
      style={side === "back" ? { transform: "rotateY(180deg)" } : undefined}
    >
      {near && (
        <Image
          src={PAGES[page]}
          alt={`Brochure page ${page + 1}`}
          fill
          sizes="(min-width: 1280px) 560px, 46vw"
          className="object-cover"
        />
      )}
      {/* the fold's shadow at the spine */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 w-10 ${
          side === "front"
            ? "left-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.18),transparent)]"
            : "right-0 bg-[linear-gradient(270deg,rgba(0,0,0,0.18),transparent)]"
        }`}
      />
    </div>
  );
}

export function BrochureBook({ id = "brochure" }: { id?: string }) {
  const { play, muted, setMuted } = useFlipSound();
  const wide = useWide();
  // desktop: how many leaves have turned (0 = closed on the cover)
  const [turned, setTurned] = useState(0);
  const [moving, setMoving] = useState<number | null>(null);
  // phones: the page on show
  const [page, setPage] = useState(0);
  const [movingPage, setMovingPage] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const turn = (to: number) => {
    if (to < 0 || to > LEAVES || to === turned) return;
    play();
    setMoving(to > turned ? turned : to);
    setTurned(to);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMoving(null), TURN_MS);
  };

  const flip = (to: number) => {
    if (to < 0 || to >= PAGES.length || to === page) return;
    play();
    setMovingPage(to > page ? page : to);
    setPage(to);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMovingPage(null), TURN_MS);
  };

  /** a page on (+1) or back (-1), in whichever view is showing */
  const go = (by: 1 | -1) => (wide ? turn(turned + by) : flip(page + by));
  const atStart = wide ? turned === 0 : page === 0;
  const atEnd = wide ? turned === LEAVES : page === PAGES.length - 1;

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") go(1);
    else if (e.key === "ArrowLeft") go(-1);
    else return;
    e.preventDefault();
  };

  const onTouchEnd = (e: TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) flip(dx < 0 ? page + 1 : page - 1);
  };

  // what the open spread shows, for the caption
  const spread =
    turned === 0
      ? "Cover"
      : turned === LEAVES
        ? "Back cover"
        : `Pages ${turned * 2}–${turned * 2 + 1} of ${PAGES.length}`;

  // closed books sit centred; an open one fills the frame
  const shift = turned === 0 ? "-25%" : turned === LEAVES ? "25%" : "0%";

  const arrow =
    "grid size-11 place-items-center rounded-[6px] border border-black/[0.1] bg-white text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <section id={id} className="scroll-mt-24 bg-canvas py-8 lg:py-16">
      <style>{`@media (prefers-reduced-motion:reduce){.bk-leaf,.bk-book{transition:none!important}}`}</style>
      <div className="container-page">
        <SectionHeading
          title="Explore the"
          accent="uGSOT Brochure"
          intro="Turn the pages: the programme, its three pathways, the curriculum, campus life, faculty and how to apply."
        />

        <div
          tabIndex={0}
          onKeyDown={onKey}
          aria-label="Brochure. Use the left and right arrow keys to turn the pages."
          className="mt-10 outline-none focus-visible:ring-2 focus-visible:ring-accent/30 lg:mt-14"
        >
          {/* desktop: the open book */}
          <div className="hidden md:block">
            <div
              className="relative mx-auto w-full max-w-[1120px] [perspective:2600px]"
              style={{ aspectRatio: "1682 / 595" }}
            >
              <div
                className="bk-book absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(${shift})` }}
              >
                {/* the book's shadow on the table */}
                <span
                  aria-hidden
                  className={`absolute inset-y-[3%] rounded-[4px] shadow-[0_30px_60px_-24px_rgba(11,13,18,0.45)] transition-[left,right] duration-700 ${
                    turned === 0
                      ? "left-1/2 right-0"
                      : turned === LEAVES
                        ? "left-0 right-1/2"
                        : "left-0 right-0"
                  }`}
                />
                {Array.from({ length: LEAVES }, (_, i) => {
                  const isTurned = i < turned;
                  const near = Math.abs(i - turned) <= 2;
                  return (
                    <button
                      key={i}
                      type="button"
                      tabIndex={-1}
                      aria-label={isTurned ? "Previous page" : "Next page"}
                      onClick={() => turn(isTurned ? i : i + 1)}
                      className="bk-leaf absolute left-1/2 top-0 h-full w-1/2 cursor-pointer [transform-origin:left_center] [transform-style:preserve-3d]"
                      style={{
                        transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                        transition: `transform ${TURN_MS}ms cubic-bezier(0.645,0.045,0.355,1)`,
                        zIndex:
                          moving === i ? 100 : isTurned ? i + 1 : LEAVES - i,
                      }}
                    >
                      <Face page={i * 2} near={near} side="front" />
                      <Face page={i * 2 + 1} near={near} side="back" />
                    </button>
                  );
                })}
                {/* the spine */}
                {turned > 0 && turned < LEAVES && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-1/2 z-[200] w-px -translate-x-1/2 bg-black/10"
                  />
                )}
              </div>
            </div>
          </div>

          {/* phones: one page at a time */}
          <div
            className="md:hidden"
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={onTouchEnd}
          >
            {/* a pile of pages; the top one swings over from its left
                edge, like a page of a book, showing the next beneath it */}
            <div
              className="relative w-full [perspective:1800px]"
              style={{ aspectRatio: "841 / 595" }}
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-[4px] bg-white shadow-[0_20px_40px_-20px_rgba(11,13,18,0.4)]"
              />
              {PAGES.map((src, i) => {
                const isTurned = i < page;
                const near = Math.abs(i - page) <= 2;
                return (
                  <button
                    key={src}
                    type="button"
                    tabIndex={-1}
                    aria-hidden={i !== page}
                    aria-label="Next page"
                    onClick={() => flip(page + 1)}
                    className="bk-leaf absolute inset-0 [transform-origin:left_center] [transform-style:preserve-3d]"
                    style={{
                      transform: `rotateY(${isTurned ? -180 : 0}deg)`,
                      transition: `transform ${TURN_MS}ms cubic-bezier(0.645,0.045,0.355,1)`,
                      zIndex:
                        movingPage === i
                          ? 100
                          : isTurned
                            ? i + 1
                            : PAGES.length - i,
                      visibility:
                        isTurned && movingPage !== i ? "hidden" : undefined,
                    }}
                  >
                    {/* the page */}
                    <span className="absolute inset-0 overflow-hidden rounded-[4px] bg-white [backface-visibility:hidden]">
                      {near && (
                        <Image
                          src={src}
                          alt={`Brochure page ${i + 1}`}
                          fill
                          sizes="100vw"
                          className="object-cover"
                        />
                      )}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-[linear-gradient(90deg,rgba(0,0,0,0.14),transparent)]"
                      />
                    </span>
                    {/* its back, plain paper, seen as it turns over */}
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-[4px] bg-[linear-gradient(270deg,#e9e9e4_0%,#fafaf8_30%,#ffffff_100%)] [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    />
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-center text-[12.5px] text-muted">
              Swipe to turn the page
            </p>
          </div>

          {/* the controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              disabled={atStart}
              aria-label="Previous page"
              className={arrow}
            >
              <ChevronLeft size={20} aria-hidden />
            </button>
            <p
              aria-live="polite"
              className="min-w-[150px] text-center text-[14px] font-medium tabular-nums text-ink"
            >
              <span className="hidden md:inline">{spread}</span>
              <span className="md:hidden">
                Page {page + 1} of {PAGES.length}
              </span>
            </p>
            <button
              type="button"
              onClick={() => go(1)}
              disabled={atEnd}
              aria-label="Next page"
              className={arrow}
            >
              <ChevronRight size={20} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={muted}
              aria-label={muted ? "Turn page sound on" : "Turn page sound off"}
              title={muted ? "Sound off" : "Sound on"}
              className={arrow}
            >
              {muted ? (
                <VolumeX size={18} aria-hidden />
              ) : (
                <Volume2 size={18} aria-hidden />
              )}
            </button>
            <a
              href={PDF}
              download="uGSOT-Brochure.pdf"
              className="inline-flex h-11 items-center gap-2 rounded-[6px] bg-accent px-5 text-[14.5px] font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              <Download size={16} aria-hidden />
              Download brochure
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
