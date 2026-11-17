import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PostView, type TocItem } from "@/components/blogs/PostView";
import { POSTS } from "@/components/blogs/data";
import bodies from "@/components/blogs/bodies.json";

const BODIES = bodies as Record<string, { html: string; toc: TocItem[] }>;

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.title} | upGrad School of Technology`,
    description: p.sub,
  };
}

/** a blog post: the head, the article with its sticky outline, more posts.
    The post is read from the URL inside Suspense, so the page's shell
    (navbar, footer) stays shared and instant. */
export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <>
      <Navbar links={false} />
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <Suspense fallback={<div className="min-h-svh bg-[#f3f5f7]" />}>
          <BlogPost params={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POSTS.find((x) => x.slug === slug);
  const body = BODIES[slug];
  if (!p || !body) notFound();

  // three more: the same category first, then the newest
  const more = [
    ...POSTS.filter((x) => x.slug !== slug && x.category === p.category),
    ...POSTS.filter((x) => x.slug !== slug && x.category !== p.category),
  ].slice(0, 3);

  return <PostView post={p} html={body.html} toc={body.toc} more={more} />;
}
