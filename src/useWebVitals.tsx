import React, { useEffect, useState } from "react";

export interface VitalMetric {
  name: "LCP" | "CLS" | "INP" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  unit: string;
}

const THRESHOLDS: Record<
  VitalMetric["name"],
  { good: number; poor: number; unit: string }
> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
  INP: { good: 200, poor: 500, unit: "ms" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
};

function getRating(name: VitalMetric["name"], value: number): VitalMetric["rating"] {
  const t = THRESHOLDS[name];
  if (value <= t.good) return "good";
  if (value <= t.poor) return "needs-improvement";
  return "poor";
}

const ratingColors: Record<VitalMetric["rating"], string> = {
  good: "#28c840",
  "needs-improvement": "#febc2e",
  poor: "#ff5f57",
};

/**
 * useWebVitals - Monitors Core Web Vitals (LCP, CLS, INP, FCP, TTFB)
 * using the browser's PerformanceObserver API.
 * Returns an array of VitalMetric objects.
 * Only runs in browser; safe to call in SSR apps.
 *
 * @example
 * const vitals = useWebVitals();
 * // vitals → [{ name: "LCP", value: 1200, rating: "good", unit: "ms" }, ...]
 */
export function useWebVitals(): VitalMetric[] {
  const [vitals, setVitals] = useState<VitalMetric[]>([]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return;

    const update = (name: VitalMetric["name"], value: number) => {
      const t = THRESHOLDS[name];
      setVitals((prev) => {
        const next = prev.filter((v) => v.name !== name);
        return [
          ...next,
          { name, value, rating: getRating(name, value), unit: t.unit },
        ];
      });
    };

    // LCP
    try {
      const lcp = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
        update("LCP", last.startTime);
      });
      lcp.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (_) {}

    // CLS
    try {
      let clsValue = 0;
      const cls = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShift = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
          if (!layoutShift.hadRecentInput) {
            clsValue += layoutShift.value;
            update("CLS", Math.round(clsValue * 1000) / 1000);
          }
        }
      });
      cls.observe({ type: "layout-shift", buffered: true });
    } catch (_) {}

    // INP
    try {
      const inp = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { processingStart: number; startTime: number };
          update("INP", e.processingStart - e.startTime);
        }
      });
      inp.observe({ type: "event", buffered: true } as PerformanceObserverInit);
    } catch (_) {}

    // FCP
    try {
      const fcp = new PerformanceObserver((list) => {
        const entry = list.getEntriesByName("first-contentful-paint")[0];
        if (entry) update("FCP", entry.startTime);
      });
      fcp.observe({ type: "paint", buffered: true });
    } catch (_) {}

    // TTFB
    try {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      if (nav) update("TTFB", nav.responseStart - nav.requestStart);
    } catch (_) {}
  }, []);

  return vitals;
}

/**
 * WebVitalsOverlay - Dev-only floating badge showing live Core Web Vitals.
 * Automatically hidden in production.
 *
 * @example
 * <WebVitalsOverlay />
 */
export function WebVitalsOverlay() {
  const vitals = useWebVitals();
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") return null;

  const worstRating =
    vitals.some((v) => v.rating === "poor")
      ? "poor"
      : vitals.some((v) => v.rating === "needs-improvement")
      ? "needs-improvement"
      : "good";

  const badgeColor = ratingColors[worstRating] ?? "#6b7a99";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 88,
        right: 20,
        zIndex: 999997,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
      }}
    >
      {open && (
        <div
          style={{
            background: "#0d1221",
            border: "1px solid #1e2a45",
            borderRadius: 12,
            padding: 16,
            width: 260,
            marginBottom: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              color: "#e8edf8",
              fontWeight: 700,
              marginBottom: 12,
              fontSize: 13,
            }}
          >
            Core Web Vitals
          </div>
          {vitals.length === 0 && (
            <div style={{ color: "#546e7a", fontSize: 12 }}>
              Measuring… interact with the page to trigger INP.
            </div>
          )}
          {vitals.map((v) => (
            <div
              key={v.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 0",
                borderTop: "1px solid #1e2a45",
                color: "#a8b3c7",
              }}
            >
              <span>{v.name}</span>
              <span style={{ color: ratingColors[v.rating], fontWeight: 700 }}>
                {v.name === "CLS"
                  ? v.value.toFixed(3)
                  : Math.round(v.value)}
                {v.unit}
              </span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: "#0d1221",
          border: `2px solid ${badgeColor}`,
          borderRadius: "50%",
          width: 56,
          height: 56,
          color: badgeColor,
          fontWeight: 700,
          fontSize: 12,
          cursor: "pointer",
          boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
          lineHeight: 1.2,
        }}
        title="Core Web Vitals"
      >
        CWV
      </button>
    </div>
  );
}
