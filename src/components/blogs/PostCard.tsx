import Image from "next/image";
import Link from "next/link";
import { fmtDate, postHref, type Post } from "./data";

export const cover = (slug: string) => `/images/blogs/${slug}.webp`;

/** a post as a card: the rounded cover whole, the title, two lines of
    the post and the byline; the cover zooms on hover */
export function PostCard({ post: p }: { post: Post }) {
  return (
    <Link href={postHref(p.slug)} className="group flex h-full flex-col">
      {/* the cover whole, at its own shape */}
      <div className="relative aspect-[1350/709] overflow-hidden rounded-[8px] bg-[#f3f5f7]">
        <Image
          src={cover(p.slug)}
          alt=""
          fill
          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
        />
      </div>
      <h3 className="mt-5 line-clamp-2 text-[18px] font-medium leading-[1.35] tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
        {p.title}
      </h3>
      {p.sub && (
        <p className="mt-2 line-clamp-2 text-[14px] leading-[1.55] text-body">
          {p.sub}
        </p>
      )}
      <div className="mt-auto pt-4">
        <Byline post={p} />
      </div>
    </Link>
  );
}

/** the author's initials in a small circle, their name, date and read */
export function Byline({ post: p }: { post: Post }) {
  const initials = p.author
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div className="flex items-center gap-2.5 text-[13px] text-ink">
      <span
        aria-hidden
        className="grid size-7 shrink-0 place-items-center rounded-full bg-accent/10 text-[11px] font-semibold text-accent"
      >
        {initials}
      </span>
      <span className="font-medium">{p.author}</span>
      <span className="text-muted">
        · {fmtDate(p.date)} · {p.mins} min read
      </span>
    </div>
  );
}
