import React, { useEffect, useState } from "react";

interface AuditIssue {
  type: "error" | "warning" | "success";
  message: string;
}

function runAudit(): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (typeof document === "undefined") return issues;

  // Title
  const title = document.title;
  if (!title) {
    issues.push({ type: "error", message: "Missing <title> tag" });
  } else if (title.length < 10 || title.length > 60) {
    issues.push({ type: "warning", message: `Title is ${title.length} chars (ideal: 10-60)` });
  } else {
    issues.push({ type: "success", message: "Title length looks good" });
  }

  // Meta description
  const desc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
  if (!desc || !desc.content) {
    issues.push({ type: "error", message: "Missing meta description" });
  } else if (desc.content.length < 50 || desc.content.length > 160) {
    issues.push({ type: "warning", message: `Description is ${desc.content.length} chars (ideal: 50-160)` });
  } else {
    issues.push({ type: "success", message: "Meta description length looks good" });
  }

  // H1 check
  const h1s = document.querySelectorAll("h1");
  if (h1s.length === 0) {
    issues.push({ type: "error", message: "No <h1> found on page" });
  } else if (h1s.length > 1) {
    issues.push({ type: "warning", message: `Found ${h1s.length} <h1> tags (should be exactly 1)` });
  } else {
    issues.push({ type: "success", message: "Exactly one <h1> found" });
  }

  // Image alt text
  const imgs = document.querySelectorAll("img");
  const missingAlt = Array.from(imgs).filter((img) => !img.getAttribute("alt"));
  if (missingAlt.length > 0) {
    issues.push({ type: "error", message: `${missingAlt.length} image(s) missing alt text` });
  } else if (imgs.length > 0) {
    issues.push({ type: "success", message: `All ${imgs.length} images have alt text` });
  }

  // Canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    issues.push({ type: "warning", message: "Missing canonical link" });
  } else {
    issues.push({ type: "success", message: "Canonical URL is set" });
  }

  // Open Graph
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    issues.push({ type: "warning", message: "Missing og:title (Open Graph)" });
  } else {
    issues.push({ type: "success", message: "Open Graph tags present" });
  }

  // Viewport (mobile SEO)
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    issues.push({ type: "error", message: "Missing viewport meta tag" });
  }

  return issues;
}

const colors: Record<AuditIssue["type"], string> = {
  error: "#ff5f57",
  warning: "#febc2e",
  success: "#28c840",
};

const icons: Record<AuditIssue["type"], string> = {
  error: "✕",
  warning: "⚠",
  success: "✓",
};

/**
 * SEOAudit - Dev-only floating widget that scans the current page
 * and shows a live SEO score with actionable issues.
 * Automatically disabled in production (NODE_ENV !== "development").
 *
 * @example
 * // Drop it once near the root of your app
 * <SEOAudit />
 */
export function SEOAudit() {
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    const timer = setTimeout(() => setIssues(runAudit()), 600);
    return () => clearTimeout(timer);
  }, []);

  if (process.env.NODE_ENV !== "development") return null;
  if (issues.length === 0) return null;

  const errors = issues.filter((i) => i.type === "error").length;
  const warnings = issues.filter((i) => i.type === "warning").length;
  const score = Math.max(0, 100 - errors * 20 - warnings * 8);
  const scoreColor = score >= 80 ? "#28c840" : score >= 50 ? "#febc2e" : "#ff5f57";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 999999,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13,
      }}
    >
      {open && (
        <div
          style={{
            background: "#0d1221",
            border: "1px solid #1e2a45",
            borderRadius: 12,
            padding: 16,
            width: 320,
            marginBottom: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            maxHeight: 360,
            overflowY: "auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: "#e8edf8", fontWeight: 700 }}>SEO Audit</span>
            <span style={{ color: scoreColor, fontWeight: 700 }}>{score}/100</span>
          </div>
          {issues.map((issue, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "6px 0",
                borderTop: i === 0 ? "none" : "1px solid #1e2a45",
                color: "#a8b3c7",
                fontSize: 12,
                lineHeight: 1.5,
              }}
            >
              <span style={{ color: colors[issue.type], flexShrink: 0 }}>{icons[issue.type]}</span>
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#0d1221",
          border: `2px solid ${scoreColor}`,
          borderRadius: "50%",
          width: 56,
          height: 56,
          color: scoreColor,
          fontWeight: 700,
          fontSize: 16,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
        }}
        title="smart-seo-lite SEO Audit"
      >
        {score}
      </button>
    </div>
  );
}
