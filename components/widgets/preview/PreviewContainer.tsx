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

const viewportConfig = {
  desktop: { width: "100%", minWidth: 720, label: "Desktop" },
  tablet: { width: 768, label: "Tablet" },
  mobile: { width: 375, label: "Mobile" },
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
          minWidth: 720,
          borderRadius: 8,
          overflow: "hidden",
          border: "1px solid #262626",
          background: "#1c1c1c",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            background: "#141414",
            borderBottom: "1px solid #262626",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ef4444", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b", display: "inline-block" }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          </div>
          <div
            style={{
              flex: 1,
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
        <div style={{ background: bg }}>{children}</div>
      </div>
    );
  }

  if (viewport === "tablet") {
    return (
      <div
        style={{
          width: 768,
          margin: "0 auto",
          borderRadius: 28,
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
          <div style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid #262626" }} />
        </div>
        <div style={{ background: bg }}>{children}</div>
        <div
          style={{
            height: 4,
            width: 60,
            margin: "8px auto",
            borderRadius: 2,
            background: "#262626",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: 375,
        margin: "0 auto",
        borderRadius: 36,
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
        <div style={{ width: 10, height: 10, borderRadius: 2, border: "2px solid #262626" }} />
      </div>
      <div style={{ background: bg }}>{children}</div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "6px 0",
        }}
      >
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
    <div className="card-hairline flex flex-col bg-surface-1">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
        <span className="font-body-sm text-ink">Live preview</span>
        <div className="flex rounded-lg border border-hairline">
          {(Object.keys(viewportConfig) as ("desktop" | "tablet" | "mobile")[]).map((v) => {
            const Icon = v === "desktop" ? Monitor : v === "tablet" ? Tablet : Smartphone;
            return (
              <button
                key={v}
                onClick={() => onViewportChange(v)}
                className={`p-1.5 ${viewport === v ? "bg-surface-2 text-accent" : "text-muted hover:text-ink"}`}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      </div>
      <div className="overflow-auto bg-canvas p-4" style={{ minHeight: 420 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <DeviceFrame viewport={viewport} bg={s.backgroundColor || "#090909"}>
            <Preview config={config} testimonials={testimonials} />
          </DeviceFrame>
        </div>
      </div>
    </div>
  );
}
