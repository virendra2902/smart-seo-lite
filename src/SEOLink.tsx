import React, { AnchorHTMLAttributes } from "react";

interface SEOLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  /** Force nofollow rel (auto-applied to external links unless overridden) */
  noFollow?: boolean;
  /** Force noopener/noreferrer for external links (default: true) */
  secure?: boolean;
  /** Prefetch the page on hover using <link rel="prefetch"> */
  prefetch?: boolean;
  /** Explicitly mark as internal link (skips external detection) */
  internal?: boolean;
  children: React.ReactNode;
}

function isExternal(href: string): boolean {
  if (typeof window === "undefined") return href.startsWith("http");
  try {
    return new URL(href).hostname !== window.location.hostname;
  } catch {
    return false;
  }
}

let prefetchedUrls = new Set<string>();

function prefetchUrl(href: string) {
  if (typeof document === "undefined") return;
  if (prefetchedUrls.has(href)) return;
  prefetchedUrls.add(href);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

/**
 * SEOLink - Smart anchor component with automatic:
 * ✅ nofollow on external links
 * ✅ noopener + noreferrer on external links (security)
 * ✅ Prefetch on hover (improves LCP for next page)
 * ✅ Dev warning for broken/empty hrefs
 *
 * @example
 * // Internal link — no rel added, optional prefetch
 * <SEOLink href="/about" prefetch>About Us</SEOLink>
 *
 * // External link — auto nofollow + noopener + noreferrer + target="_blank"
 * <SEOLink href="https://example.com">Visit Site</SEOLink>
 *
 * // Sponsor link — override nofollow
 * <SEOLink href="https://sponsor.com" noFollow={false}>Sponsor</SEOLink>
 */
export function SEOLink({
  href,
  noFollow,
  secure = true,
  prefetch = false,
  internal,
  children,
  onMouseEnter,
  rel,
  target,
  ...rest
}: SEOLinkProps) {
  const external = internal ? false : isExternal(href);

  // Dev warnings
  if (process.env.NODE_ENV === "development") {
    if (!href || href === "#") {
      console.warn(`[smart-seo-lite] <SEOLink> has an empty or placeholder href="${href}". This hurts SEO.`);
    }
  }

  // Build rel attribute
  const relParts: string[] = rel ? [rel] : [];
  if (external && (noFollow ?? true)) relParts.push("nofollow");
  if (external && secure) {
    if (!relParts.includes("noopener")) relParts.push("noopener");
    if (!relParts.includes("noreferrer")) relParts.push("noreferrer");
  }
  const resolvedRel = relParts.length > 0 ? relParts.join(" ") : undefined;
  const resolvedTarget = target ?? (external ? "_blank" : undefined);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefetch && !external) prefetchUrl(href);
    onMouseEnter?.(e);
  };

  return (
    <a
      href={href}
      rel={resolvedRel}
      target={resolvedTarget}
      onMouseEnter={handleMouseEnter}
      {...rest}
    >
      {children}
    </a>
  );
}
