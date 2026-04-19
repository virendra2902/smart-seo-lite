import React, { ImgHTMLAttributes, useEffect } from "react";

interface SEOImgProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "alt" | "loading"> {
  src: string;
  title?: string;
  alt?: string;
  loading?: "lazy" | "eager" | "auto";
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

function generateAlt(src: string, title?: string): string {
  if (title) return title;

  // Extract filename from src, clean it up
  const filename = src.split("/").pop()?.split("?")[0] || "";
  const withoutExt = filename.replace(/\.[^.]+$/, "");
  const humanized = withoutExt
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .trim();

  return humanized || "image";
}

/**
 * SEOImg - Smart image component for SEO
 * ✅ Auto-generates alt text from title or filename
 * ✅ Adds loading="lazy" by default
 * ✅ Warns in development if src is missing
 * ✅ Adds width/height to prevent CLS
 *
 * @example
 * <SEOImg src="/product.jpg" title="Running Shoes" />
 */
export function SEOImg({
  src,
  title,
  alt,
  loading = "lazy",
  width,
  height,
  className,
  style,
  ...rest
}: SEOImgProps) {
  const resolvedAlt = alt || generateAlt(src, title);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      if (!src) {
        console.warn("[smart-seo-lite] <SEOImg> is missing the `src` prop.");
      }
      if (!alt && !title) {
        console.warn(
          `[smart-seo-lite] <SEOImg src="${src}"> has no explicit 'alt' or 'title'. Auto-generated: "${resolvedAlt}". Consider providing explicit alt text for better SEO.`
        );
      }
      if (!width || !height) {
        console.warn(
          `[smart-seo-lite] <SEOImg src="${src}"> is missing width/height props. This may cause Cumulative Layout Shift (CLS).`
        );
      }
    }
  }, [src, alt, title, resolvedAlt, width, height]);

  if (!src) return null;

  return (
    <img
      src={src}
      alt={resolvedAlt}
      loading={loading === "auto" ? undefined : loading}
      width={width}
      height={height}
      className={className}
      style={style}
      {...rest}
    />
  );
}
