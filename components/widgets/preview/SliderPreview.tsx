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
  const [animating, setAnimating] = useState(false);
  const interval = config.animation?.interval ?? 4000;
  const autoplay = config.animation?.autoplay !== false;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setAnimating(true);
    setTimeout(() => {
      setIndex(i);
      setAnimating(false);
    }, 150);
  }, []);

  const next = useCallback(() => {
    goTo((index + 1) % items.length);
  }, [goTo, index, items.length]);

  const prev = useCallback(() => {
    goTo((index - 1 + items.length) % items.length);
  }, [goTo, index, items.length]);

  useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    timerRef.current = setInterval(next, interval);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [autoplay, next, interval, items.length]);

  const startX = useRef(0);

  if (items.length === 0) {
    return (
      <div style={{ background: s.backgroundColor, color: s.textColor, fontFamily: s.fontFamily || "system-ui,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 160, borderRadius: 8, fontSize: 14, opacity: 0.6, padding: 24 }}>
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
      width: "100%",
      boxSizing: "border-box",
      padding: "16px 12px",
    }}>
      {/* Card with fade animation */}
      <div
        style={{ position: "relative", touchAction: "pan-y" }}
        onTouchStart={(e) => { startX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - startX.current;
          if (Math.abs(dx) > 40) { if (dx > 0) { prev(); } else { next(); } }
        }}
      >
        <div
          style={{
            borderRadius: s.cardBorderRadius,
            padding: s.cardPadding,
            background: s.cardBackground,
            color: s.textColor,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            boxSizing: "border-box",
            transition: "opacity 0.25s ease",
            opacity: animating ? 0 : 1,
          }}
        >
          {s.showRating && <Stars rating={t.rating} color={s.accentColor!} />}
          <div style={{ fontSize: 15, lineHeight: 1.6, wordBreak: "break-word", overflowWrap: "break-word" }}>
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
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.author_name}</div>
              {s.showAuthorCompany && (t.author_company || t.author_role) && (
                <div style={{ fontSize: 12, opacity: 0.6 }}>{[t.author_company, t.author_role].filter(Boolean).join(" · ")}</div>
              )}
            </div>
            {s.showDate && (
              <span style={{ fontSize: 11, opacity: 0.5, whiteSpace: "nowrap", flexShrink: 0 }}>
                {new Date(t.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
          </div>
        </div>

        {/* Prev / Next arrows */}
        {items.length > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, gap: 8 }}>
            <button
              aria-label="Previous"
              onClick={prev}
              style={{
                flex: "0 0 auto",
                width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)", fontSize: 20, lineHeight: 1, color: "#333",
              }}
            >
              ‹
            </button>

            {/* Dot indicators in the middle */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap", flex: 1 }}>
              {items.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  style={{
                    width: i === index ? 20 : 8,
                    height: 8, borderRadius: 4, border: "none", cursor: "pointer", padding: 0,
                    background: i === index ? s.accentColor : "#d1d5db",
                    transition: "all 0.3s ease",
                  }}
                />
              ))}
            </div>

            <button
              aria-label="Next"
              onClick={next}
              style={{
                flex: "0 0 auto",
                width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.12)",
                background: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)", fontSize: 20, lineHeight: 1, color: "#333",
              }}
            >
              ›
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
