import type { Metadata } from "next";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { BlogsPage } from "@/components/blogs/BlogsPage";

export const metadata: Metadata = {
  title: "Blogs: Tech, Careers & B.Tech Guides | upGrad School of Technology",
  description:
    "Articles from upGrad School of Technology on AI, full stack development, system design, data science, B.Tech admissions, JEE and careers in tech.",
};

/** the Blogs page: the featured slider, the posts by category; then the footer */
export default function Blogs() {
  return (
    <>
      <Navbar links={false} />
      {/* the page sits above the footer and slides up off it, as on the home page */}
      <main className="relative z-10 min-h-svh flex-1 bg-canvas">
        <BlogsPage />
      </main>
      <Footer />
    </>
  );
}
