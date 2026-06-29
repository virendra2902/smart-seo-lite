# Changelog

## [3.0.0] — Power Tools Update

### Added
- **`<SEOProvider />`** — Set global SEO defaults (siteName, baseUrl, twitterHandle, defaultImage, titleSeparator) once at your app root. All `useSEO()` calls inherit and can override them per-page. Auto-appends `titleSeparator + siteName` to every page title.
- **`<SocialPreview />`** — Dev-only floating widget showing a live preview of your page as it would appear when shared on Twitter/X, LinkedIn, and Facebook. Reads directly from the page's Open Graph meta tags in real time.
- **`generateMetaTags()`** — Server-side utility that returns a Next.js App Router-compatible metadata object. Use it inside `generateMetadata()` for perfect SSR SEO. No hooks, no React required.
- **`useWebVitals()`** — Hook that monitors Core Web Vitals (LCP, CLS, INP, FCP, TTFB) via PerformanceObserver and returns rated metrics ("good" / "needs-improvement" / "poor").
- **`<WebVitalsOverlay />`** — Dev-only floating badge that shows live CWV scores with colour-coded ratings. Auto-hidden in production.
- **`<SEOLink />`** — Smart anchor component that auto-applies `nofollow`, `noopener`, `noreferrer` to external links, prefetches internal pages on hover, and warns in dev about empty `href` values.

### Changed
- `useSEO()` now reads from the nearest `<SEOProvider>` context and merges defaults with per-page props. Fully backward compatible — if no provider is present, it behaves exactly as v2.

### Unchanged
- All v1 + v2 APIs (`Schema`, `SEOImg`, `Breadcrumbs`, `SEOAudit`, `generateSitemap`, `generateRobotsTxt`, hreflang) — zero breaking changes.

## [2.0.0]
- Added `<Breadcrumbs>`, `<SEOAudit>`, `generateSitemap`, `generateRobotsTxt`, hreflang support

## [1.0.0]
- Initial release: `useSEO`, `<Schema>`, `<SEOImg>`
