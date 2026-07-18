"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import type { WidgetConfig } from "@/types";
import type { WidgetType } from "@/types";

function Stars({ rating, color }: { rating: number | null; color: string }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          style={{
            color: i < rating ? color : "#e5e7eb",
            fill: i < rating ? color : "transparent",
          }}
        />
      ))}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CardBody({
  t,
  config,
}: {
  t: any;
  config: WidgetConfig;
}) {
  const s = config.styling!;
  return (
    <div
      style={{
        background: s.cardBackground,
        borderRadius: s.cardBorderRadius,
        padding: s.cardPadding,
        color: s.textColor,
        fontFamily: s.fontFamily,
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
      }}
      className="h-full"
    >
      {s.showRating && <Stars rating={t.rating} color={s.accentColor!} />}
      <p
        className="mt-2 leading-relaxed"
        style={{
          fontSize:
            s.fontSize === "sm"
              ? 13
              : s.fontSize === "lg"
                ? 17
                : s.fontSize === "xl"
                  ? 19
                  : 15,
        }}
      >
        &ldquo;{t.content}&rdquo;
      </p>
      <div className="mt-3 flex items-center gap-2">
        {s.showAuthorImage && t.author_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={t.author_image}
            alt={t.author_name}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold"
            style={{ background: s.accentColor, color: "#fff" }}
          >
            {t.author_name?.charAt(0)?.toUpperCase() || "?"}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{t.author_name}</p>
          {(s.showAuthorCompany && (t.author_company || t.author_role)) && (
            <p className="truncate text-xs opacity-60">
              {[t.author_company, t.author_role].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {s.showDate && (
          <span className="ml-auto text-xs opacity-50">
            {formatDate(t.created_at)}
          </span>
        )}
      </div>
    </div>
  );
}

export default function WidgetPreview({
  type,
  config,
  testimonials,
}: {
  type: WidgetType;
  config: WidgetConfig;
  testimonials: any[];
}) {
  const s = config.styling!;
  const layout = config.layout!;
  const maxItems = config.filter?.maxItems ?? testimonials.length;
  const items = testimonials.slice(0, maxItems);

  const [index, setIndex] = useState(0);

  const rotating = (type === "carousel" || type === "slider") &&
    (config.animation?.autoplay ?? false) &&
    items.length > 1;

  useEffect(() => {
    if (!rotating) return;
    const interval = config.animation?.interval ?? 4000;
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, interval);
    return () => clearInterval(t);
  }, [rotating, items.length, config.animation?.interval]);

  if (items.length === 0) {
    return (
      <div
        className="flex h-64 items-center justify-center rounded-lg text-center text-sm"
        style={{ background: s.backgroundColor, color: s.textColor }}
      >
        <div>
          <p className="font-medium">No testimonials selected</p>
          <p className="mt-1 opacity-60">
            Pick testimonials from the left panel to preview them here.
          </p>
        </div>
      </div>
    );
  }

  const columns = Math.min(layout.columns ?? 2, items.length || 1);
  const gap = layout.gap ?? 20;

  const gridStyle: React.CSSProperties = {
    background: s.backgroundColor,
    fontFamily: s.fontFamily,
    display: "grid",
    gap,
    gridTemplateColumns:
      type === "slider"
        ? "1fr"
        : `repeat(${columns}, minmax(0, 1fr))`,
  };

  if (type === "slider") {
    const t = items[index];
    return (
      <div
        className="overflow-hidden rounded-lg p-2"
        style={{ background: s.backgroundColor, fontFamily: s.fontFamily }}
      >
        <div key={index} className={config.animation?.transition === "fade" ? "animate-[fadeIn_0.5s_ease]" : "animate-[slideIn_0.5s_ease]"}>
          <CardBody t={t} config={config} />
        </div>
        {items.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="h-2 w-2 rounded-full"
                style={{
                  background: i === index ? s.accentColor : "#d1d5db",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "carousel") {
    const t = items[index];
    return (
      <div
        className="overflow-hidden rounded-lg p-2"
        style={{ background: s.backgroundColor, fontFamily: s.fontFamily }}
      >
        <div key={index} className={config.animation?.transition === "fade" ? "animate-[fadeIn_0.5s_ease]" : "animate-[slideIn_0.5s_ease]"}>
          <CardBody t={t} config={config} />
        </div>
        {items.length > 1 && (
          <div className="mt-3 flex justify-center gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="h-2 w-2 rounded-full"
                style={{
                  background: i === index ? s.accentColor : "#d1d5db",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "minimal") {
    return (
      <div
        className="space-y-3 rounded-lg p-2"
        style={{ background: s.backgroundColor, fontFamily: s.fontFamily }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              borderLeft: `3px solid ${s.accentColor}`,
              padding: s.cardPadding,
              color: s.textColor,
            }}
            className="rounded-r"
          >
            {s.showRating && <Stars rating={t.rating} color={s.accentColor!} />}
            <p className="mt-1 text-sm leading-relaxed">&ldquo;{t.content}&rdquo;</p>
            <p className="mt-2 text-xs font-semibold">
              — {t.author_name}
              {s.showAuthorCompany && t.author_company
                ? `, ${t.author_company}`
                : ""}
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (type === "masonry" || type === "wall") {
    return (
      <div
        className="rounded-lg p-2"
        style={{ background: s.backgroundColor, fontFamily: s.fontFamily }}
      >
        <div
          style={{
            columnCount: type === "wall" ? columns : columns,
            columnGap: gap,
          }}
          className="[&>*]:mb-4"
        >
          {items.map((t) => (
            <div key={t.id} style={{ breakInside: "avoid" }}>
              <CardBody t={{ ...t, content: type === "wall" ? t.content : t.content }} config={config} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // grid (default)
  return (
    <div className="rounded-lg p-2" style={gridStyle}>
      {items.map((t) => (
        <CardBody key={t.id} t={t} config={config} />
      ))}
    </div>
  );
}
