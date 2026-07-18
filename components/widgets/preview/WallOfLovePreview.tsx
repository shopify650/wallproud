"use client";

import type { WidgetConfig } from "@/types";

function Stars({ rating, color }: { rating: number | null; color: string }) {
  if (!rating) return null;
  return (
    <div style={{ marginBottom: 8, whiteSpace: "nowrap" }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 20 20" style={{ display: "inline-block", verticalAlign: "middle", marginRight: 1 }}>
          <path fill={i < rating ? color : "#d1d5db"} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.174 0l-2.8 2.034c-.784.57-1.838-.381-1.54-1.205.384-1.107 1.07-3.292 1.07-3.292a1 1 0 00-.364-1.118L2.979 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function CardBody({ t, config }: { t: any; config: WidgetConfig }) {
  const s = config.styling!;
  return (
    <div style={{
      borderRadius: s.cardBorderRadius,
      padding: s.cardPadding,
      background: s.cardBackground,
      color: s.textColor,
      boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
      breakInside: "avoid",
      display: "inline-block",
      width: "100%",
      marginBottom: config.layout?.gap ?? 20,
      boxSizing: "border-box",
    }}>
      {s.showRating && <Stars rating={t.rating} color={s.accentColor!} />}
      <div style={{ fontSize: 15, lineHeight: 1.6, wordWrap: "break-word" }}>
        &ldquo;{t.content}&rdquo;
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
        {s.showAuthorImage && t.author_image ? (
          <img src={t.author_image} alt="" loading="lazy" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        ) : (
          <span style={{ width: 36, height: 36, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", background: s.accentColor, flexShrink: 0 }}>
            {(t.author_name || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.author_name}</div>
          {s.showAuthorCompany && (t.author_company || t.author_role) && (
            <div style={{ fontSize: 12, opacity: 0.6 }}>{[t.author_company, t.author_role].filter(Boolean).join(" · ")}</div>
          )}
        </div>
        {s.showDate && (
          <span style={{ fontSize: 11, opacity: 0.5, marginLeft: "auto", whiteSpace: "nowrap" }}>
            {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        )}
      </div>
    </div>
  );
}

export default function WallOfLovePreview({
  config,
  testimonials,
}: {
  config: WidgetConfig;
  testimonials: any[];
}) {
  const s = config.styling!;
  const l = config.layout!;
  const max = config.filter?.maxItems ?? testimonials.length;
  const items = testimonials.slice(0, max);
  const columns = Math.min(l.columns ?? 3, 4);
  const gap = l.gap ?? 20;

  if (items.length === 0) {
    return (
      <div style={{ background: s.backgroundColor, color: s.textColor, fontFamily: s.fontFamily || "system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: 200, borderRadius: 8, fontSize: 14, opacity: 0.6 }}>
        No testimonials to display
      </div>
    );
  }

  const colHeights = new Array(columns).fill(0);
  const cols: any[][] = Array.from({ length: columns }, () => []);

  items.forEach((t) => {
    const minIdx = colHeights.indexOf(Math.min(...colHeights));
    const charCount = (t.content || "").length;
    colHeights[minIdx] += Math.max(120, charCount * 0.8 + 100);
    cols[minIdx].push(t);
  });

  return (
    <div style={{
      background: s.backgroundColor,
      color: s.textColor,
      fontFamily: s.fontFamily || "system-ui,sans-serif",
      maxWidth: l.maxWidth || 1000,
      margin: "0 auto",
      padding: "24px 16px",
    }}>
      <div style={{ display: "flex", gap, alignItems: "flex-start" }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ flex: 1, minWidth: 0 }}>
            {col.map((t: any) => (
              <CardBody key={t.id} t={t} config={config} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
