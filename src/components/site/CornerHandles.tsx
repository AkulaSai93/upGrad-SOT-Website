/**
 * The four "selection" handles on a card's corners, as on the faculty
 * posters: a small white square with an ink edge sitting over each corner,
 * like a frame selected in a design tool. Put it inside a positioned
 * (relative) card that does not clip its overflow. `dim` greys them, for
 * cards that are not the one in focus.
 */
export function CornerHandles({ dim = false }: { dim?: boolean }) {
  return (
    <>
      {[
        "-left-[5px] -top-[5px]",
        "-right-[5px] -top-[5px]",
        "-bottom-[5px] -left-[5px]",
        "-bottom-[5px] -right-[5px]",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute z-[3] size-2.5 border border-ink transition-colors duration-700 ${
            dim ? "bg-white/60" : "bg-white"
          } ${pos}`}
        />
      ))}
    </>
  );
}
