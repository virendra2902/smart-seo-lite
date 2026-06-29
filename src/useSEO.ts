import { useEffect } from "react";
import { useSEODefaults } from "./SEOProvider";

export interface AlternateLocale {
  locale: string;
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
 * ✅ Hreflang (multilingual)
 * ✅ Merges with SEOProvider global defaults (v3)
 *
 * @example
 * useSEO({ title: "Home Page", description: "Best products", image: "/banner.png" });
 */
export function useSEO(props: SEOProps) {
  const defaults = useSEODefaults();

  // Merge: page props override global defaults
  const siteName = props.siteName ?? defaults.siteName ?? "My App";
  const twitterHandle = props.twitterHandle ?? defaults.twitterHandle;
  const defaultImage = props.image ?? defaults.defaultImage;
  const alternateLocales = props.alternateLocales ?? [];
  const localesKey = alternateLocales.map((l) => `${l.locale}:${l.url}`).join(",");

  // Append titleSeparator + siteName to title if separator is set and title doesn't already include siteName
  let resolvedTitle = props.title;
  if (
    resolvedTitle &&
    defaults.titleSeparator &&
    siteName &&
    !resolvedTitle.includes(siteName)
  ) {
    resolvedTitle = `${resolvedTitle}${defaults.titleSeparator}${siteName}`;
  }

  useEffect(() => {
    if (typeof document === "undefined") return;

    const baseUrl = defaults.baseUrl?.replace(/\/$/, "") ?? "";
    const resolvedURL =
      props.url ||
      (typeof window !== "undefined" ? window.location.href : "");
    const canonicalURL = props.canonical || (baseUrl ? `${baseUrl}${typeof window !== "undefined" ? window.location.pathname : ""}` : resolvedURL);

    if (resolvedTitle) document.title = resolvedTitle;
    if (props.description) setMeta("description", props.description);
    if (props.keywords && props.keywords.length > 0)
      setMeta("keywords", props.keywords.join(", "));
    setMeta("robots", props.noIndex ? "noindex,nofollow" : "index,follow");

    if (resolvedTitle) setMeta("og:title", resolvedTitle, "property");
    if (props.description) setMeta("og:description", props.description, "property");
    if (defaultImage) setMeta("og:image", defaultImage, "property");
    if (resolvedURL) setMeta("og:url", resolvedURL, "property");
    setMeta("og:type", props.type ?? "website", "property");
    setMeta("og:site_name", siteName, "property");

    setMeta("twitter:card", defaultImage ? "summary_large_image" : "summary");
    if (resolvedTitle) setMeta("twitter:title", resolvedTitle);
    if (props.description) setMeta("twitter:description", props.description);
    if (defaultImage) setMeta("twitter:image", defaultImage);
    if (twitterHandle) setMeta("twitter:site", twitterHandle);

    if (canonicalURL) setLink("canonical", canonicalURL);

    alternateLocales.forEach((alt) => setAlternateLink(alt.locale, alt.url));
  }, [
    resolvedTitle,
    props.description,
    defaultImage,
    props.url,
    siteName,
    props.type,
    twitterHandle,
    props.noIndex,
    props.canonical,
    props.keywords,
    localesKey,
  ]);
}
