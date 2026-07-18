"use client";

import { X } from "lucide-react";
import { WIDGET_TYPES } from "@/lib/widgets";
import type { WidgetType } from "@/types";

function Illustration({ kind }: { kind: string }) {
  const base = "h-3 rounded bg-accent/40";
  switch (kind) {
    case "grid":
      return (
        <div className="grid grid-cols-2 gap-1.5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={base} />
          ))}
        </div>
      );
    case "carousel":
      return (
        <div className="flex items-center gap-1">
          <div className={`${base} flex-1`} />
          <div className="h-3 w-3 rounded-full bg-accent" />
          <div className="h-3 w-3 rounded-full bg-accent/40" />
        </div>
      );
    case "wall":
    case "masonry":
      return (
        <div className="grid grid-cols-3 gap-1">
          <div className="h-6 rounded bg-accent/40" />
          <div className="h-4 rounded bg-accent/40" />
          <div className="h-5 rounded bg-accent/40" />
          <div className="h-3 rounded bg-accent/40" />
          <div className="h-6 rounded bg-accent/40" />
          <div className="h-4 rounded bg-accent/40" />
        </div>
      );
    case "slider":
      return (
        <div className="flex flex-col items-center gap-1">
          <div className={`${base} w-full`} />
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-accent" />
            <div className="h-2 w-2 rounded-full bg-accent/40" />
          </div>
        </div>
      );
    case "minimal":
      return (
        <div className="space-y-1.5">
          <div className={base} />
          <div className={`${base} w-4/5`} />
          <div className={`${base} w-3/5`} />
        </div>
      );
    default:
      return null;
  }
}

export default function WidgetTypeSelector({
  open,
  onClose,
  onSelect,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (type: WidgetType) => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-canvas/60 backdrop-blur-sm" onClick={onClose} />
      <div className="card-surface-1 relative z-10 w-full max-w-2xl p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display-md text-ink">
            Choose a widget type
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {WIDGET_TYPES.map((wt) => (
            <button
              key={wt.type}
              onClick={() => onSelect(wt.type)}
              className="card-hairline group flex flex-col p-4 text-left transition hover:bg-surface-2"
            >
              <div className="mb-3 h-10 rounded-lg bg-surface-2 p-2">
                <Illustration kind={wt.illustration} />
              </div>
              <p className="font-body-sm text-ink">{wt.name}</p>
              <p className="font-caption mt-0.5 leading-relaxed text-muted">
                {wt.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
