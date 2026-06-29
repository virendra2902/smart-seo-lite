# 🚀 smart-seo-lite

> **"Add SEO to your React/Next.js app in 3 lines of code."**

[![npm version](https://img.shields.io/npm/v/smart-seo-lite)](https://npmjs.com/package/smart-seo-lite)
[![license](https://img.shields.io/npm/l/smart-seo-lite)](LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/smart-seo-lite)](https://bundlephobia.com/package/smart-seo-lite)

The complete SEO toolkit for React + Next.js. **v3.0** adds global SEO context, live social card previews, Next.js App Router support, Core Web Vitals monitoring, and smart link handling.

---

## ✨ Full API — All 13 Tools

| Tool | Version | What it does |
|---|---|---|
| `useSEO()` | v1 | Auto meta, OG, Twitter, canonical, hreflang |
| `<Schema />` | v1 | JSON-LD structured data (7 types) |
| `<SEOImg />` | v1 | Smart image — auto-alt, lazy, dev warnings |
| `<Breadcrumbs />` | v2 | Visual nav + auto BreadcrumbList JSON-LD |
| `<SEOAudit />` | v2 | Dev SEO score widget (0–100) |
| `generateSitemap()` | v2 | Builds valid sitemap.xml string |
| `generateRobotsTxt()` | v2 | Builds valid robots.txt string |
| **`<SEOProvider />`** | **v3** | Global SEO defaults context |
| **`<SocialPreview />`** | **v3** | Live Twitter/LinkedIn/Facebook card preview |
| **`generateMetaTags()`** | **v3** | Next.js App Router metadata object |
| **`useWebVitals()`** | **v3** | Core Web Vitals hook (LCP, CLS, INP, FCP, TTFB) |
| **`<WebVitalsOverlay />`** | **v3** | Dev CWV floating badge |
| **`<SEOLink />`** | **v3** | Smart anchor with nofollow, prefetch, security |

---

## 📦 Installation

```bash
npm install smart-seo-lite
```

---

## 🔧 Usage

### 1. `<SEOProvider />` — Global defaults (NEW in v3)

```tsx
// _app.tsx or app/layout.tsx
import { SEOProvider } from "smart-seo-lite";

<SEOProvider defaults={{
  siteName: "My Shop",
  baseUrl: "https://myshop.com",
  twitterHandle: "@myshop",
  defaultImage: "/og-default.png",
  titleSeparator: " | ",
}}>
  <App />
</SEOProvider>
```

Now every `useSEO({ title: "Home" })` automatically outputs `"Home | My Shop"`.

---

### 2. `useSEO()` Hook

```tsx
import { useSEO } from "smart-seo-lite";

useSEO({
  title: "Home Page",          // → "Home Page | My Shop" (with SEOProvider)
  description: "Best products",
  image: "/banner.png",
  type: "website",
  alternateLocales: [
    { locale: "en", url: "https://myshop.com/en" },
    { locale: "fr", url: "https://myshop.com/fr" },
  ],
});
```

---

### 3. `generateMetaTags()` — Next.js App Router (NEW in v3)

```ts
// app/product/[id]/page.tsx
import { generateMetaTags } from "smart-seo-lite";

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  return generateMetaTags({
    title: product.name,
    description: product.description,
    image: product.image,
    url: `https://myshop.com/product/${params.id}`,
    siteName: "My Shop",
    titleSeparator: " | ",
    type: "product",
  });
}
```

Returns a fully-typed Next.js metadata object — no manual `openGraph`, `twitter`, or `alternates` wiring.

---

### 4. `<SocialPreview />` — Live card preview (NEW in v3)

```tsx
import { SocialPreview } from "smart-seo-lite";

// Drop near the bottom of your app — only shows in development
<SocialPreview />
```

A floating 🔗 button appears. Click to see exactly how your page looks when shared on Twitter/X, LinkedIn, or Facebook — live, reading from your actual OG meta tags.

---

### 5. `useWebVitals()` + `<WebVitalsOverlay />` (NEW in v3)

```tsx
import { useWebVitals, WebVitalsOverlay } from "smart-seo-lite";

// Get raw vitals data
const vitals = useWebVitals();
// [{ name: "LCP", value: 1250, rating: "good", unit: "ms" }, ...]

// Or just drop the overlay widget
<WebVitalsOverlay />  // CWV badge, dev only
```

Monitors LCP, CLS, INP, FCP, and TTFB via `PerformanceObserver`. Each metric is rated "good" / "needs-improvement" / "poor" per Google's thresholds.

---

### 6. `<SEOLink />` — Smart link (NEW in v3)

```tsx
import { SEOLink } from "smart-seo-lite";

// Internal — prefetches on hover
<SEOLink href="/products" prefetch>Products</SEOLink>

// External — auto nofollow + noopener + noreferrer + target="_blank"
<SEOLink href="https://partner.com">Partner Site</SEOLink>

// Sponsored link — disable nofollow
<SEOLink href="https://sponsor.com" noFollow={false}>Sponsor</SEOLink>
```

---

### 7. `<Schema />` Component

```tsx
import { Schema } from "smart-seo-lite";

<Schema type="product" data={{ name: "Shoes", price: 99.99, currency: "USD" }} />
<Schema type="faq" data={{ questions: [{ question: "Free shipping?", answer: "Yes!" }] }} />
```

Supported types: `article`, `product`, `organization`, `breadcrumb`, `faq`, `person`, `website`

---

### 8. `<Breadcrumbs />` Component

```tsx
import { Breadcrumbs } from "smart-seo-lite";

<Breadcrumbs items={[
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: "My Post", url: "/blog/my-post" },
]} />
```

---

### 9. `generateSitemap()` + `generateRobotsTxt()`

```ts
import { generateSitemap, generateRobotsTxt } from "smart-seo-lite";

// app/sitemap.xml/route.ts
export async function GET() {
  const xml = generateSitemap("https://myshop.com", [
    { url: "/", priority: 1.0, changeFrequency: "daily" },
    { url: "/about", priority: 0.8 },
  ]);
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

// app/robots.txt/route.ts
export async function GET() {
  const txt = generateRobotsTxt({
    disallow: ["/admin"],
    sitemap: "https://myshop.com/sitemap.xml",
  });
  return new Response(txt, { headers: { "Content-Type": "text/plain" } });
}
```

---

### 10. Dev Tools Summary

| Widget | Position | Production |
|---|---|---|
| `<SEOAudit />` | Bottom-right | Hidden |
| `<WebVitalsOverlay />` | Bottom-right (above audit) | Hidden |
| `<SocialPreview />` | Bottom-left | Hidden |

Drop all three in your root layout during development — zero bundle impact in production.

---

## 🎯 Philosophy

- **Zero dependencies** — just React as a peer dep
- **~5KB gzipped** — tiny even with 13 tools
- **Drop-in** — no breaking changes from v1 or v2
- **TypeScript-first** — full types on every API

---

## 📄 License

MIT © Virendra
