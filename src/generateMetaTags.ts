import { AlternateLocale } from "./useSEO";

export interface MetaTagsInput {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: "website" | "article" | "product";
  twitterHandle?: string;
  noIndex?: boolean;
  keywords?: string[];
  alternateLocales?: AlternateLocale[];
  /** Auto-appended to title: "Title {separator} SiteName" */
  titleSeparator?: string;
}

export interface GeneratedMetaTags {
  title: string;
  description?: string;
  keywords?: string;
  robots: string;
  openGraph: {
    title: string;
    description?: string;
    images?: Array<{ url: string }>;
    url?: string;
    type: string;
    siteName?: string;
  };
  twitter: {
    card: string;
    title: string;
    description?: string;
    images?: string[];
    site?: string;
  };
  alternates?: {
    canonical?: string;
    languages?: Record<string, string>;
  };
}

/**
 * generateMetaTags - Server-side utility that returns a Next.js-compatible
 * metadata object for use with the App Router's generateMetadata() function.
 * No hooks, no React — runs on the server.
 *
 * @example
 * // app/page.tsx
 * import { generateMetaTags } from "smart-seo-lite";
 *
 * export async function generateMetadata() {
 *   return generateMetaTags({
 *     title: "Home Page",
 *     description: "Best products online",
 *     image: "https://myshop.com/og.png",
 *     siteName: "My Shop",
 *   });
 * }
 */
export function generateMetaTags(input: MetaTagsInput): GeneratedMetaTags {
  const {
    title,
    description,
    image,
    url,
    siteName,
    type = "website",
    twitterHandle,
    noIndex = false,
    keywords = [],
    alternateLocales = [],
    titleSeparator,
  } = input;

  const fullTitle =
    titleSeparator && siteName && !title.includes(siteName)
      ? `${title}${titleSeparator}${siteName}`
      : title;

  const result: GeneratedMetaTags = {
    title: fullTitle,
    robots: noIndex ? "noindex,nofollow" : "index,follow",
    openGraph: {
      title: fullTitle,
      type,
      ...(description && { description }),
      ...(image && { images: [{ url: image }] }),
      ...(url && { url }),
      ...(siteName && { siteName }),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      ...(description && { description }),
      ...(image && { images: [image] }),
      ...(twitterHandle && { site: twitterHandle }),
    },
  };

  if (description) result.description = description;
  if (keywords.length > 0) result.keywords = keywords.join(", ");

  if (url || alternateLocales.length > 0) {
    result.alternates = {};
    if (url) result.alternates.canonical = url;
    if (alternateLocales.length > 0) {
      result.alternates.languages = Object.fromEntries(
        alternateLocales.map((l) => [l.locale, l.url])
      );
    }
  }

  return result;
}
