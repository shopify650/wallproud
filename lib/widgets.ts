import type { WidgetConfig, WidgetType } from "@/types";

export interface WidgetTypeMeta {
  type: WidgetType;
  name: string;
  description: string;
  /** simple inline preview illustration */
  illustration: "grid" | "carousel" | "wall" | "slider" | "minimal" | "masonry";
}

export const WIDGET_TYPES: WidgetTypeMeta[] = [
  {
    type: "grid",
    name: "Grid",
    description: "Testimonial cards arranged in a clean responsive grid.",
    illustration: "grid",
  },
  {
    type: "carousel",
    name: "Carousel",
    description: "Sliding carousel that auto-rotates through testimonials.",
    illustration: "carousel",
  },
  {
    type: "wall",
    name: "Wall of Love",
    description: "A beautiful masonry-style wall to showcase social proof.",
    illustration: "wall",
  },
  {
    type: "slider",
    name: "Slider",
    description: "One focused testimonial at a time with smooth transitions.",
    illustration: "slider",
  },
  {
    type: "minimal",
    name: "Minimal",
    description: "A simple, distraction-free list of testimonials.",
    illustration: "minimal",
  },
  {
    type: "masonry",
    name: "Masonry",
    description: "Pinterest-style layout with variable height cards.",
    illustration: "masonry",
  },
];

export const FONT_OPTIONS: { value: string; label: string }[] = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "system-ui, sans-serif", label: "System" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "'Playfair Display', serif", label: "Playfair" },
  { value: "'Courier New', monospace", label: "Monospace" },
];

export const ANIMATION_OPTIONS: { value: string; label: string }[] = [
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "none", label: "None" },
];

export function getDefaultConfig(type: WidgetType): WidgetConfig {
  const base: WidgetConfig = {
    styling: {
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      accentColor: "#000000",
      cardBackground: "#ffffff",
      cardBorderRadius: 16,
      cardPadding: 20,
      fontFamily: "Inter, sans-serif",
      fontSize: "base",
      showRating: true,
      showDate: true,
      showAuthorImage: true,
      showAuthorCompany: true,
    },
    layout: {
      columns: type === "minimal" ? 1 : 2,
      gap: 20,
      maxWidth: 1000,
    },
    animation: {
      autoplay: type === "carousel" || type === "slider",
      interval: 4000,
      transition: type === "slider" ? "fade" : "slide",
    },
    filter: {
      maxItems: 12,
      sortBy: "newest",
    },
  };
  return base;
}

/** Merge a partial config over the default so the editor always has full values. */
export function mergeConfig(
  type: WidgetType,
  config?: Record<string, unknown> | null,
): WidgetConfig {
  const def = getDefaultConfig(type);
  if (!config) return def;
  return {
    styling: { ...def.styling, ...(config.styling as object) },
    layout: { ...def.layout, ...(config.layout as object) },
    animation: { ...def.animation, ...(config.animation as object) },
    filter: { ...def.filter, ...(config.filter as object) },
    cta: config.cta as WidgetConfig["cta"],
  } as WidgetConfig;
}
