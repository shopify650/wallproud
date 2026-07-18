"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

export default function SliderPreview({
  config,
  testimonials,
}: {
  config: WidgetConfig;
  testimonials: any[];
}) {
  const s = config.styling!;
  const max = config.filter?.maxItems ?? testimonials.length;
  const items = testimonials.slice(0, max);
  const [index, setIndex] = useState(0);
  const interval = config.animation?.interval ?? 4000;
  const autoplay = config.animation?.autoplay !== false;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % items.length);
  }, [items.length]);

  useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    timerRef.current = setInterval(next, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoplay, next, interval, items.length]);

  const startX = useRef(0);

  if (items.length === 0) {
    return (
      <div style={{ background: s.backgroundColor, color: s.textColor, fontFamily: s.fontFamily || "system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", height: 200, borderRadius: 8, fontSize: 14, opacity: 0.6 }}>
        No testimonials to display
      </div>
    );
  }

  const t = items[index];

  return (
    <div style={{
      background: s.backgroundColor,
      color: s.textColor,
      fontFamily: s.fontFamily || "system-ui,sans-serif",
      maxWidth: Math.min(config.layout?.maxWidth || 600, 600),
      margin: "0 auto",
      padding: "24px 16px",
    }}>
      <div
        style={{ position: "relative", overflow: "hidden", minHeight: 180 }}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) {
            if (dx > 0) {
              setIndex((i) => (i - 1 + items.length) % items.length);
            } else {
              next();
            }
          }
        }}
      >
        <div
          key={index}
          style={{
            borderRadius: s.cardBorderRadius,
            padding: s.cardPadding,
            background: s.cardBackground,
            color: s.textColor,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            opacity: 1,
            transition: "opacity 0.6s ease",
          }}
        >
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

        {items.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + items.length) % items.length)}
              style={{
                position: "absolute", left: -4, top: "50%", transform: "translateY(-50%)",
                width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)", zIndex: 2, fontSize: 16, lineHeight: 1, color: "#333",
              }}
            >
              &#8249;
            </button>
            <button
              onClick={next}
              style={{
                position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)",
                width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.9)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)", zIndex: 2, fontSize: 16, lineHeight: 1, color: "#333",
              }}
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {items.length > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16 }}>
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              style={{
                width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
                background: i === index ? s.accentColor : "#d1d5db", transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
