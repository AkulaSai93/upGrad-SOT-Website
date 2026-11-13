/**
 * The four "selection" handles on a card's corners, as on the faculty
 * posters: a small white square with the site's border grey as its edge over each corner,
 * like a frame selected in a design tool. Put it inside a positioned
 * (relative) card that does not clip its overflow. `dim` greys them, for
 * cards that are not the one in focus.
 */
export function CornerHandles({ dim = false }: { dim?: boolean }) {
  return (
    <>
      {[
        "-left-[3px] -top-[3px]",
        "-right-[3px] -top-[3px]",
        "-bottom-[3px] -left-[3px]",
        "-bottom-[3px] -right-[3px]",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden
          className={`pointer-events-none absolute z-[3] size-[7px] border border-black/[0.08] transition-colors duration-700 ${
            dim ? "bg-white/60" : "bg-white"
          } ${pos}`}
        />
      ))}
    </>
  );
}
