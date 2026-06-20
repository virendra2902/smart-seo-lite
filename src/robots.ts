export interface RobotsRule {
  userAgent?: string;
  allow?: string[];
  disallow?: string[];
}

export interface RobotsOptions extends RobotsRule {
  sitemap?: string;
  rules?: RobotsRule[];
}

/**
 * generateRobotsTxt - Builds a valid robots.txt string.
 * Use this in a Next.js API route, app/robots.txt/route.ts, or a build script.
 *
 * @example
 * const txt = generateRobotsTxt({
 *   disallow: ["/admin", "/api"],
 *   sitemap: "https://myapp.com/sitemap.xml",
 * });
 */
export function generateRobotsTxt(options: RobotsOptions = {}): string {
  const rules: RobotsRule[] = options.rules?.length
    ? options.rules
    : [{ userAgent: options.userAgent, allow: options.allow, disallow: options.disallow }];

  const lines: string[] = [];

  rules.forEach((rule) => {
    lines.push(`User-agent: ${rule.userAgent || "*"}`);
    (rule.allow || []).forEach((path) => lines.push(`Allow: ${path}`));
    (rule.disallow || []).forEach((path) => lines.push(`Disallow: ${path}`));
    lines.push("");
  });

  if (options.sitemap) {
    lines.push(`Sitemap: ${options.sitemap}`);
  }

  return lines.join("\n").trim();
}
