import React, { createContext, useContext, ReactNode } from "react";

export interface SEODefaults {
  /** Site name applied to all og:site_name tags */
  siteName?: string;
  /** Base URL used for canonical URL generation */
  baseUrl?: string;
  /** Default Twitter/X handle, e.g. "@myapp" */
  twitterHandle?: string;
  /** Default fallback OG/Twitter image */
  defaultImage?: string;
  /** Separator used in page titles, e.g. " | " → "Page | My Site" */
  titleSeparator?: string;
}

const SEOContext = createContext<SEODefaults>({});

interface SEOProviderProps {
  defaults: SEODefaults;
  children: ReactNode;
}

/**
 * SEOProvider - Set global SEO defaults once at the root of your app.
 * All useSEO() calls inherit these values and can override them per-page.
 *
 * @example
 * // _app.tsx or layout.tsx
 * <SEOProvider defaults={{
 *   siteName: "My Shop",
 *   baseUrl: "https://myshop.com",
 *   twitterHandle: "@myshop",
 *   defaultImage: "/og-default.png",
 *   titleSeparator: " | ",
 * }}>
 *   <App />
 * </SEOProvider>
 */
export function SEOProvider({ defaults, children }: SEOProviderProps) {
  return <SEOContext.Provider value={defaults}>{children}</SEOContext.Provider>;
}

/**
 * useSEODefaults - Internal hook to read the nearest SEOProvider context.
 * Use this inside useSEO to merge global defaults with per-page overrides.
 */
export function useSEODefaults(): SEODefaults {
  return useContext(SEOContext);
}
