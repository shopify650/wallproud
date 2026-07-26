"use client";

import { Monitor, Tablet, Smartphone } from "lucide-react";
import type { WidgetConfig, WidgetType } from "@/types";
import dynamic from "next/dynamic";

const GridPreview = dynamic(() => import("./GridPreview"));
const CarouselPreview = dynamic(() => import("./CarouselPreview"));
const WallOfLovePreview = dynamic(() => import("./WallOfLovePreview"));
const SliderPreview = dynamic(() => import("./SliderPreview"));
const MinimalPreview = dynamic(() => import("./MinimalPreview"));

const previews: Record<WidgetType, React.ComponentType<{ config: WidgetConfig; testimonials: any[] }>> = {
  grid: GridPreview,
  carousel: CarouselPreview,
  wall: WallOfLovePreview,
  masonry: WallOfLovePreview,
  slider: SliderPreview,
  minimal: MinimalPreview,
};

function DeviceFrame({
  viewport,
  children,
  bg,
}: {
  viewport: "desktop" | "tablet" | "mobile";
  children: React.ReactNode;
  bg: string;
}) {
  if (viewport === "desktop") {
    return (
      <div
        style={{
          width: "100%",
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #262626",
          background: "#1c1c1c",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        {/* Browser chrome bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            background: "#141414",
            borderBottom: "1px solid #262626",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          </div>
          <div
            style={{
              flex: 1,
              minWidth: 0,
              height: 20,
              borderRadius: 4,
              background: "#090909",
              marginLeft: 8,
              fontSize: 10,
              display: "flex",
              alignItems: "center",
              paddingLeft: 10,
              color: "#999",
            }}
          >
            wallproud.com
          </div>
        </div>
        <div style={{ background: bg, overflowX: "auto" }}>{children}</div>
      </div>
    );
  }

  if (viewport === "tablet") {
    return (
      /* Outer scroller so 768px frame can scroll horizontally on narrow panels */
      <div style={{ width: "100%", overflowX: "auto" }}>
        <div
          style={{
            width: 620,
            minWidth: 620,
            margin: "0 auto",
            borderRadius: 24,
            border: "3px solid #262626",
            overflow: "hidden",
            background: "#1c1c1c",
            boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 0",
              background: "#141414",
              borderBottom: "1px solid #262626",
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #333" }} />
          </div>
          <div style={{ background: bg }}>{children}</div>
          <div style={{ height: 4, width: 60, margin: "8px auto", borderRadius: 2, background: "#262626" }} />
        </div>
      </div>
    );
  }

  // Mobile
  return (
    <div
      style={{
        width: 320,
        minWidth: 320,
        margin: "0 auto",
        borderRadius: 32,
        border: "3px solid #262626",
        overflow: "hidden",
        background: "#1c1c1c",
        boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "8px 16px",
          background: "#141414",
          borderBottom: "1px solid #262626",
        }}
      >
        <span style={{ fontSize: 10, color: "#999" }}>9:41</span>
        <div style={{ width: 10, height: 10, borderRadius: 2, border: "2px solid #333" }} />
      </div>
      <div style={{ background: bg }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
        <div style={{ width: 40, height: 4, borderRadius: 2, background: "#262626" }} />
      </div>
    </div>
  );
}

export default function PreviewContainer({
  type,
  config,
  testimonials,
  viewport,
  onViewportChange,
}: {
  type: WidgetType;
  config: WidgetConfig;
  testimonials: any[];
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (v: "desktop" | "tablet" | "mobile") => void;
}) {
  const s = config.styling!;
  const Preview = previews[type] || GridPreview;

  return (
    <div className="card-hairline flex min-w-0 flex-col bg-surface-1">
      {/* toolbar */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
        <span className="font-body-sm text-ink">Live preview</span>
        <div className="flex rounded-lg border border-hairline">
          {(Object.keys({ desktop: 1, tablet: 1, mobile: 1 }) as ("desktop" | "tablet" | "mobile")[]).map((v) => {
            const Icon = v === "desktop" ? Monitor : v === "tablet" ? Tablet : Smartphone;
            return (
              <button
                key={v}
                onClick={() => onViewportChange(v)}
                title={v.charAt(0).toUpperCase() + v.slice(1)}
                className={`p-1.5 ${viewport === v ? "bg-surface-2 text-accent" : "text-muted hover:text-ink"}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* preview area — always scrollable so device frames never escape bounds */}
      <div
        className="overflow-auto bg-canvas p-4"
        style={{ minHeight: 420 }}
      >
        <div className="flex min-w-0 justify-center">
          <DeviceFrame viewport={viewport} bg={s.backgroundColor || "#090909"}>
            <Preview config={config} testimonials={testimonials} />
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
