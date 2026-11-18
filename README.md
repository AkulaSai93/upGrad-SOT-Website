# upGrad School of Technology website

The marketing site for upGrad School of Technology (uGSOT): the home page,
admissions, uGNET, the partner campuses, the ResumeCraft playground, blogs,
FAQs, contact and the legal pages.

## Stack

- **Next.js 16** (App Router, Turbopack, `cacheComponents`) on **React 19**
- **Tailwind CSS v4**, with the design tokens in `src/app/globals.css`
- **GSAP** (`gsap`, `@gsap/react`, ScrollTrigger) for motion, **Lenis** for
  smooth scrolling
- **lucide-react** for icons
- Plus Jakarta Sans, medium weight, throughout

## Getting started

```bash
npm install
npm run dev
```

The site runs at http://localhost:3000 (pass `-- -p <port>` for another port).

| Script          | What it does                    |
| --------------- | ------------------------------- |
| `npm run dev`   | Development server              |
| `npm run build` | Production build                |
| `npm run start` | Serve the production build      |
| `npm run lint`  | ESLint (`eslint-config-next`)   |

Code is formatted with Prettier's defaults (`npx prettier --write src`).

## Project structure

```
src/
  app/                    routes (one folder per page)
    page.tsx              home
    admission/            admissions
    ugnet/                the uGNET entrance test
    university/[slug]/    the partner campuses
    playground/resumecraft/
    blogs/, blogs/[slug]/
    faqs/, contact/
    privacy-policy/, terms-and-conditions/
    globals.css           tokens, base styles and shared keyframes
    layout.tsx            fonts, metadata, smooth scroll
  components/
    site/                 shared chrome and building blocks: Navbar, Footer,
                          GlowButton, SectionHeading, VideoPlayer, … and the
                          shared data (contact.ts, socials.ts, channel.ts)
    motion/               reusable motion: Reveal, MaskWord, CountUp,
                          Magnetic, SmoothScroll
    sections/             the home page's sections, in page order in
                          app/page.tsx (some are reused on other pages)
    admission/, ugnet/, campus/, playground/, blogs/, faqs/, contact/,
    legal/                each page's own sections and data
public/images/            images, one folder per section
scripts/                  one-off generators for the campus and faculty
                          poster images (Python + headless Chrome)
```

## Conventions

- Each component starts with a short comment saying what it is, where its
  copy and layout come from, and how it moves.
- Contact details and the main-site URL live in
  `src/components/site/contact.ts`; import them rather than retyping them.
- Header heights: a 36px announcement strip plus a 60px bar, so sticky
  elements sit at `top-[96px]` and `--header-h` is 128px.
- Motion respects `prefers-reduced-motion`.
