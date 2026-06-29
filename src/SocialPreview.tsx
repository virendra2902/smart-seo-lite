import React, { useState, useEffect } from "react";

interface SocialPreviewProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

type Platform = "twitter" | "linkedin" | "facebook";

const PLATFORM_LABELS: Record<Platform, string> = {
  twitter: "𝕏 Twitter / X",
  linkedin: "LinkedIn",
  facebook: "Facebook",
};

function readFromDom(): SocialPreviewProps {
  if (typeof document === "undefined") return {};
  const get = (sel: string, attr = "content") =>
    (document.querySelector(sel) as HTMLMetaElement)?.getAttribute(attr) ?? undefined;
  return {
    title:
      get('meta[property="og:title"]') || document.title || undefined,
    description: get('meta[property="og:description"]') || get('meta[name="description"]') || undefined,
    image: get('meta[property="og:image"]') || undefined,
    url: get('meta[property="og:url"]') || (typeof window !== "undefined" ? window.location.href : undefined),
    siteName: get('meta[property="og:site_name"]') || undefined,
  };
}

function TwitterCard({ data }: { data: SocialPreviewProps }) {
  return (
    <div
      style={{
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #2f3336",
        background: "#000",
        maxWidth: 500,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {data.image && (
        <img
          src={data.image}
          alt="og preview"
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}
      <div style={{ padding: "10px 14px 14px", color: "#e7e9ea" }}>
        <div style={{ fontSize: 13, color: "#71767b", marginBottom: 4 }}>
          {data.url ? new URL(data.url).hostname : data.siteName ?? "yoursite.com"}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 4 }}>
          {data.title ?? "No og:title found"}
        </div>
        <div style={{ fontSize: 14, color: "#71767b", lineHeight: 1.4 }}>
          {data.description
            ? data.description.slice(0, 120) + (data.description.length > 120 ? "…" : "")
            : "No og:description found"}
        </div>
      </div>
    </div>
  );
}

function LinkedInCard({ data }: { data: SocialPreviewProps }) {
  return (
    <div
      style={{
        border: "1px solid #e0e0e0",
        borderRadius: 4,
        overflow: "hidden",
        background: "#fff",
        maxWidth: 500,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      {data.image && (
        <img
          src={data.image}
          alt="og preview"
          style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}
      <div style={{ padding: "10px 14px 14px", background: "#f3f2ef" }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,.9)", marginBottom: 2 }}>
          {data.title ?? "No og:title found"}
        </div>
        <div style={{ fontSize: 12, color: "rgba(0,0,0,.6)" }}>
          {data.url ? new URL(data.url).hostname : data.siteName ?? "yoursite.com"}
        </div>
      </div>
    </div>
  );
}

function FacebookCard({ data }: { data: SocialPreviewProps }) {
  return (
    <div
      style={{
        border: "1px solid #dadde1",
        overflow: "hidden",
        background: "#f0f2f5",
        maxWidth: 500,
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {data.image && (
        <img
          src={data.image}
          alt="og preview"
          style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      )}
      <div style={{ padding: "10px 12px", background: "#f0f2f5", borderTop: "1px solid #dadde1" }}>
        <div style={{ fontSize: 12, color: "#606770", textTransform: "uppercase", marginBottom: 4 }}>
          {data.url ? new URL(data.url).hostname : data.siteName ?? "yoursite.com"}
        </div>
        <div style={{ fontSize: 16, fontWeight: 600, color: "#1d2129", lineHeight: 1.3, marginBottom: 4 }}>
          {data.title ?? "No og:title found"}
        </div>
        <div style={{ fontSize: 14, color: "#606770", lineHeight: 1.4 }}>
          {data.description
            ? data.description.slice(0, 100) + (data.description.length > 100 ? "…" : "")
            : "No og:description found"}
        </div>
      </div>
    </div>
  );
}

/**
 * SocialPreview - Dev-only component that shows a live preview of how your
 * page will look when shared on Twitter/X, LinkedIn, and Facebook.
 * Reads directly from your page's Open Graph meta tags in real time.
 * Automatically hidden in production.
 *
 * @example
 * // Drop anywhere in dev, usually near the bottom of your page
 * <SocialPreview />
 *
 * // Or pass props directly to preview without meta tags present yet
 * <SocialPreview title="My Page" description="..." image="/og.png" />
 */
export function SocialPreview(props: SocialPreviewProps) {
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [open, setOpen] = useState(false);
  const [domData, setDomData] = useState<SocialPreviewProps>({});

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    // Slight delay so useSEO has time to inject meta tags
    const t = setTimeout(() => setDomData(readFromDom()), 300);
    return () => clearTimeout(t);
  }, []);

  if (process.env.NODE_ENV !== "development") return null;

  // Props override DOM values
  const data: SocialPreviewProps = {
    title: props.title ?? domData.title,
    description: props.description ?? domData.description,
    image: props.image ?? domData.image,
    url: props.url ?? domData.url,
    siteName: props.siteName ?? domData.siteName,
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 90,
    left: 20,
    zIndex: 999998,
    background: "#0d1221",
    border: "1px solid #1e2a45",
    borderRadius: 16,
    padding: 20,
    width: 540,
    boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
    fontFamily: "'JetBrains Mono', monospace",
    display: open ? "block" : "none",
  };

  return (
    <div style={{ position: "fixed", bottom: 20, left: 20, zIndex: 999999 }}>
      <div style={overlayStyle}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ color: "#e8edf8", fontWeight: 700, fontSize: 13 }}>Social Preview</span>
          <div style={{ display: "flex", gap: 6 }}>
            {(["twitter", "linkedin", "facebook"] as Platform[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 6,
                  fontSize: 11,
                  cursor: "pointer",
                  border: "1px solid #1e2a45",
                  background: platform === p ? "#4fffb0" : "#0f1829",
                  color: platform === p ? "#060812" : "#6b7a99",
                  fontWeight: 600,
                }}
              >
                {p === "twitter" ? "𝕏" : p === "linkedin" ? "in" : "f"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#546e7a", marginBottom: 12 }}>
          {PLATFORM_LABELS[platform]} card preview
        </div>
        {platform === "twitter" && <TwitterCard data={data} />}
        {platform === "linkedin" && <LinkedInCard data={data} />}
        {platform === "facebook" && <FacebookCard data={data} />}
      </div>
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#0d1221",
          border: "2px solid #4fffb0",
          borderRadius: "50%",
          width: 56,
          height: 56,
          color: "#4fffb0",
          fontSize: 20,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
        title="Social Preview"
      >
        🔗
      </button>
    </div>
  );
}
