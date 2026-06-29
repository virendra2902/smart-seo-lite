// v1 core
export { useSEO } from "./useSEO";
export type { SEOProps, AlternateLocale } from "./useSEO";

export { Schema } from "./Schema";

export { SEOImg } from "./SEOImg";

// v2 additions
export { Breadcrumbs } from "./Breadcrumbs";
export type { BreadcrumbItem } from "./Breadcrumbs";

export { SEOAudit } from "./SEOAudit";

export { generateSitemap } from "./sitemap";
export type { SitemapRoute } from "./sitemap";

export { generateRobotsTxt } from "./robots";
export type { RobotsOptions, RobotsRule } from "./robots";

// v3 additions
export { SEOProvider, useSEODefaults } from "./SEOProvider";
export type { SEODefaults } from "./SEOProvider";

export { SocialPreview } from "./SocialPreview";

export { generateMetaTags } from "./generateMetaTags";
export type { MetaTagsInput, GeneratedMetaTags } from "./generateMetaTags";

export { useWebVitals, WebVitalsOverlay } from "./useWebVitals";
export type { VitalMetric } from "./useWebVitals";

export { SEOLink } from "./SEOLink";
