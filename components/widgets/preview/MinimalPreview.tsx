"use client";

import type { WidgetConfig } from "@/types";

function Stars({ rating, color }: { rating: number | null; color: string }) {
  if (!rating) return null;
  return (
    <div style={{ marginBottom: 6, whiteSpace: "nowrap" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 20 20" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 1 }}>
          <path fill={i < rating ? color : "#d1d5db"} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.174 0l-2.8 2.034c-.784.57-1.838-.381-1.54-1.205.384-1.107 1.07-3.292 1.07-3.292a1 1 0 00-.364-1.118L2.979 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function MinimalPreview({
  config,
  testimonials,
}: {
  config: WidgetConfig;
  testimonials: any[];
}) {
  const s = config.styling!;
  const max = config.filter?.maxItems ?? testimonials.length;
  const items = testimonials.slice(0, max);

  if (items.length === 0) {
    return (
      <div style={{ background: s.backgroundColor, color: s.textColor, fontFamily: s.fontFamily || "system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: 200, borderRadius: 8, fontSize: 14, opacity: 0.6 }}>
        No testimonials to display
      </div>
    );
  }

  return (
    <div style={{
      background: s.backgroundColor,
      color: s.textColor,
      fontFamily: s.fontFamily || "system-ui,sans-serif",
      maxWidth: config.layout?.maxWidth || 700,
      margin: "0 auto",
      padding: "24px 16px",
    }}>
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            padding: s.cardPadding,
            borderLeft: `3px solid ${s.accentColor}`,
            marginBottom: 12,
            borderRadius: `0 ${s.cardBorderRadius}px ${s.cardBorderRadius}px 0`,
          }}
        >
          {s.showRating && <Stars rating={t.rating} color={s.accentColor!} />}
          <div style={{ fontSize: 15, lineHeight: 1.6, wordWrap: "break-word", marginBottom: 8 }}>
            &ldquo;{t.content}&rdquo;
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <div style={{ fontWeight: 600, fontSize: 13 }}>{t.author_name}</div>
            {s.showAuthorCompany && t.author_company && (
              <div style={{ fontSize: 12, opacity: 0.6 }}>{t.author_company}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
