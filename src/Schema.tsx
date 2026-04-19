import React from "react";

type SchemaType = "article" | "product" | "organization" | "breadcrumb" | "faq" | "person" | "website";

interface ArticleData {
  title: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  description?: string;
  image?: string;
  url?: string;
}

interface ProductData {
  name: string;
  description?: string;
  image?: string;
  price?: number;
  currency?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  brand?: string;
  sku?: string;
}

interface OrganizationData {
  name: string;
  url?: string;
  logo?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface BreadcrumbData {
  items: Array<{ name: string; url: string }>;
}

interface FAQData {
  questions: Array<{ question: string; answer: string }>;
}

interface PersonData {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
}

interface WebsiteData {
  name: string;
  url?: string;
  description?: string;
}

type SchemaData =
  | ArticleData
  | ProductData
  | OrganizationData
  | BreadcrumbData
  | FAQData
  | PersonData
  | WebsiteData;

interface SchemaProps {
  type: SchemaType;
  data: SchemaData;
}

function buildSchema(type: SchemaType, data: SchemaData): object {
  switch (type) {
    case "article": {
      const d = data as ArticleData;
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: d.title,
        author: d.author ? { "@type": "Person", name: d.author } : undefined,
        datePublished: d.datePublished,
        dateModified: d.dateModified || d.datePublished,
        description: d.description,
        image: d.image,
        url: d.url,
      };
    }
    case "product": {
      const d = data as ProductData;
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        name: d.name,
        description: d.description,
        image: d.image,
        sku: d.sku,
        brand: d.brand ? { "@type": "Brand", name: d.brand } : undefined,
        offers: {
          "@type": "Offer",
          price: d.price,
          priceCurrency: d.currency || "USD",
          availability: d.availability
            ? `https://schema.org/${d.availability}`
            : "https://schema.org/InStock",
        },
      };
    }
    case "organization": {
      const d = data as OrganizationData;
      return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: d.name,
        url: d.url,
        logo: d.logo,
        description: d.description,
        email: d.email,
        telephone: d.phone,
        address: d.address,
      };
    }
    case "breadcrumb": {
      const d = data as BreadcrumbData;
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: d.items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: item.url,
        })),
      };
    }
    case "faq": {
      const d = data as FAQData;
      return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: d.questions.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      };
    }
    case "person": {
      const d = data as PersonData;
      return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: d.name,
        url: d.url,
        image: d.image,
        jobTitle: d.jobTitle,
        description: d.description,
      };
    }
    case "website": {
      const d = data as WebsiteData;
      return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: d.name,
        url: d.url,
        description: d.description,
      };
    }
    default:
      return { "@context": "https://schema.org" };
  }
}

/**
 * Schema - Generates structured JSON-LD data for SEO
 * Supports: article, product, organization, breadcrumb, faq, person, website
 *
 * @example
 * <Schema type="article" data={{
 *   title: "Blog Title",
 *   author: "Virendra"
 * }} />
 */
export function Schema({ type, data }: SchemaProps) {
  const schema = buildSchema(type, data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}
