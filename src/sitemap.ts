export interface SitemapRoute {
  url: string;
  lastModified?: string;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
}

/**
 * generateSitemap - Builds a valid sitemap.xml string from a list of routes.
 * Use this in a Next.js API route, app/sitemap.xml/route.ts, or a build script.
 *
 * @example
 * const xml = generateSitemap("https://myapp.com", [
 *   { url: "/", priority: 1.0, changeFrequency: "daily" },
 *   { url: "/about", priority: 0.8 },
 * ]);
 */
export function generateSitemap(baseUrl: string, routes: SitemapRoute[]): string {
  const base = baseUrl.replace(/\/$/, "");

  const urlEntries = routes
    .map((route) => {
      const loc = `${base}${route.url.startsWith("/") ? "" : "/"}${route.url}`;
      const parts = [`    <loc>${loc}</loc>`];
      if (route.lastModified) parts.push(`    <lastmod>${route.lastModified}</lastmod>`);
      if (route.changeFrequency) parts.push(`    <changefreq>${route.changeFrequency}</changefreq>`);
      if (route.priority !== undefined) parts.push(`    <priority>${route.priority}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;
}
