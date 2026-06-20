import React from "react";

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: string;
  className?: string;
  linkClassName?: string;
  activeClassName?: string;
}

/**
 * Breadcrumbs - Visual breadcrumb navigation that ALSO auto-injects
 * valid BreadcrumbList JSON-LD schema. One component, two SEO wins.
 *
 * @example
 * <Breadcrumbs items={[
 *   { name: "Home", url: "/" },
 *   { name: "Blog", url: "/blog" },
 *   { name: "My Post", url: "/blog/my-post" },
 * ]} />
 */
export function Breadcrumbs({
  items,
  separator = "/",
  className,
  linkClassName,
  activeClassName,
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            listStyle: "none",
            padding: 0,
            margin: 0,
            gap: "8px",
          }}
        >
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={item.url} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {isLast ? (
                  <span aria-current="page" className={activeClassName}>
                    {item.name}
                  </span>
                ) : (
                  <a href={item.url} className={linkClassName}>
                    {item.name}
                  </a>
                )}
                {!isLast && <span aria-hidden="true">{separator}</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
