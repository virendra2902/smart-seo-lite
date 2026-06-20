import { useEffect } from "react";

export interface AlternateLocale {
  /** Language/region code, e.g. "en-US", "fr", "x-default" */
  locale: string;
  /** Fully-qualified URL for that locale's version of the page */
  url: string;
}

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: "website" | "article" | "product";
  twitterHandle?: string;
  noIndex?: boolean;
  canonical?: string;
  keywords?: string[];
  /** Multilingual SEO: renders <link rel="alternate" hreflang="..."> for each locale */
  alternateLocales?: AlternateLocale[];
}

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function setAlternateLink(hreflang: string, href: string) {
  if (typeof document === "undefined") return;
  let el = document.querySelector(
    `link[rel="alternate"][hreflang="${hreflang}"]`
  ) as HTMLLinkElement;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "alternate");
    el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

/**
 * useSEO - Automatically handles:
 * ✅ title, description
 * ✅ Open Graph tags
 * ✅ Twitter Card tags
 * ✅ Canonical URL
 * ✅ Keywords, robots
 *
 * @example
 * useSEO({
 *   title: "Home Page",
 *   description: "Best products online",
 *   image: "/banner.png"
 * });
 */
export function useSEO({
  title,
  description,
  image,
  url,
  siteName = "My App",
  type = "website",
  twitterHandle,
  noIndex = false,
  canonical,
  keywords = [],
  alternateLocales = [],
}: SEOProps) {
  const localesKey = alternateLocales.map((l) => `${l.locale}:${l.url}`).join(",");

  useEffect(() => {
    if (typeof document === "undefined") return;

    const resolvedURL = url || (typeof window !== "undefined" ? window.location.href : "");
    const canonicalURL = canonical || resolvedURL;

    // --- Basic Meta ---
    if (title) document.title = title;
    if (description) setMeta("description", description);
    if (keywords.length > 0) setMeta("keywords", keywords.join(", "));
    setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");

    // --- Open Graph ---
    if (title) setMeta("og:title", title, "property");
    if (description) setMeta("og:description", description, "property");
    if (image) setMeta("og:image", image, "property");
    if (resolvedURL) setMeta("og:url", resolvedURL, "property");
    setMeta("og:type", type, "property");
    setMeta("og:site_name", siteName, "property");

    // --- Twitter Card ---
    setMeta("twitter:card", image ? "summary_large_image" : "summary");
    if (title) setMeta("twitter:title", title);
    if (description) setMeta("twitter:description", description);
    if (image) setMeta("twitter:image", image);
    if (twitterHandle) setMeta("twitter:site", twitterHandle);

    // --- Canonical ---
    if (canonicalURL) setLink("canonical", canonicalURL);

    // --- Hreflang (multilingual SEO) ---
    alternateLocales.forEach((alt) => setAlternateLink(alt.locale, alt.url));
  }, [
    title,
    description,
    image,
    url,
    siteName,
    type,
    twitterHandle,
    noIndex,
    canonical,
    keywords,
    localesKey,
  ]);
}
