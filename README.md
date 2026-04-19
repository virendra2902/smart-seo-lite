# 🚀 smart-seo-lite

> **"Add SEO to your React/Next.js app in 3 lines of code."**

[![npm version](https://img.shields.io/npm/v/smart-seo-lite)](https://npmjs.com/package/smart-seo-lite)
[![license](https://img.shields.io/npm/l/smart-seo-lite)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-seo-lite)](https://bundlephobia.com/package/smart-seo-lite)

A lightweight SEO utility for React + Next.js that covers **80% of SEO needs** with zero configuration.

---

## ✨ Features

| Feature | What it does |
|---|---|
| `useSEO()` | Auto meta tags, Open Graph, Twitter Cards, canonical URL |
| `<Schema />` | JSON-LD structured data for articles, products, FAQs & more |
| `<SEOImg />` | Smart image SEO with auto-alt, lazy loading & dev warnings |

---

## 📦 Installation

```bash
npm install smart-seo-lite
# or
yarn add smart-seo-lite
# or
pnpm add smart-seo-lite
```

---

## 🔧 Usage

### 1. `useSEO` Hook

```tsx
import { useSEO } from "smart-seo-lite";

function HomePage() {
  useSEO({
    title: "Home Page | My Shop",
    description: "Best products online",
    image: "/banner.png",
    type: "website",
  });

  return <main>...</main>;
}
```

**What it sets automatically:**
- `<title>` tag
- `<meta name="description">`
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `<link rel="canonical">`
- `<meta name="robots">`

**All options:**
```ts
useSEO({
  title?: string;           // Page title
  description?: string;     // Meta description
  image?: string;           // OG/Twitter image URL
  url?: string;             // Canonical URL (auto-detects if not set)
  siteName?: string;        // OG site name
  type?: "website" | "article" | "product";
  twitterHandle?: string;   // e.g. "@myapp"
  noIndex?: boolean;        // Set true to noindex
  canonical?: string;       // Override canonical URL
  keywords?: string[];      // Meta keywords array
});
```

---

### 2. `<Schema />` Component

```tsx
import { Schema } from "smart-seo-lite";

// Article
<Schema type="article" data={{
  title: "My Blog Post",
  author: "Virendra",
  datePublished: "2025-01-01",
  description: "An amazing post",
}} />

// Product
<Schema type="product" data={{
  name: "Running Shoes",
  price: 99.99,
  currency: "USD",
  availability: "InStock",
  brand: "Nike",
}} />

// FAQ
<Schema type="faq" data={{
  questions: [
    { question: "What is this?", answer: "A great SEO library." },
    { question: "Is it free?", answer: "Yes, MIT licensed!" },
  ]
}} />

// Breadcrumb
<Schema type="breadcrumb" data={{
  items: [
    { name: "Home", url: "https://myapp.com" },
    { name: "Blog", url: "https://myapp.com/blog" },
    { name: "Post Title", url: "https://myapp.com/blog/post" },
  ]
}} />
```

**Supported schema types:** `article`, `product`, `organization`, `breadcrumb`, `faq`, `person`, `website`

---

### 3. `<SEOImg />` Component

```tsx
import { SEOImg } from "smart-seo-lite";

// Auto-generates alt from title
<SEOImg src="/product.jpg" title="Running Shoes" />

// Or provide explicit alt
<SEOImg src="/hero.jpg" alt="Hero banner for summer sale" width={1200} height={600} />
```

**What it does automatically:**
- Generates `alt` from `title` or filename if not provided
- Adds `loading="lazy"` by default
- Warns in development if `src` is missing
- Warns in development if no `alt`/`title` provided
- Warns if `width`/`height` missing (CLS prevention)

---

## ⚙️ Next.js Usage

Works with both App Router and Pages Router. For SSR with `next/head`, use the `useSEO` hook inside your page components — it runs on the client side and updates the head.

For SSR-first meta tags in Next.js App Router, combine with `generateMetadata()`:

```ts
// app/page.tsx
export const metadata = {
  title: "My Page",
  description: "My description",
};
```

And use `useSEO` for dynamic updates (after user interactions, filtering, etc.).

---

## 🎯 Philosophy

- **Zero dependencies** (just React as a peer dep)
- **Tiny bundle** — < 3KB gzipped
- **Drop-in** — no providers, no wrappers
- **Dev-friendly** — helpful console warnings during development

---

## 📄 License

MIT © Virendra
