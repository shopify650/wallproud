"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Copy,
  Pencil,
  LayoutGrid,
  Rows3,
  GalleryVerticalEnd,
  SlidersHorizontal,
  List,
  LayoutPanelTop,
  Trash2,
  Box,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { createWidget, deleteWidget } from "@/app/actions/widgets";
import type { WidgetType } from "@/types";
import WidgetTypeSelector from "./WidgetTypeSelector";

const TYPE_ICON: Record<WidgetType, React.ComponentType<{ className?: string }>> = {
  grid: LayoutGrid,
  carousel: SlidersHorizontal,
  wall: GalleryVerticalEnd,
  slider: Rows3,
  minimal: List,
  masonry: LayoutPanelTop,
};

export default function WidgetsListClient({
  widgets,
  workspaceId,
  maxWidgets,
  currentCount,
}: {
  widgets: any[];
  workspaceId: string;
  plan: string;
  maxWidgets: number;
  currentCount: number;
}) {
  const router = useRouter();
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const limitReached = maxWidgets > 0 && currentCount >= maxWidgets;

  const handleSelectType = async (type: WidgetType) => {
    setSelectorOpen(false);
    setCreating(true);
    const name = `${type.charAt(0).toUpperCase() + type.slice(1)} Widget`;
    const res = await createWidget(workspaceId, name, type);
    setCreating(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Widget created");
    router.push(`/dashboard/widgets/${res.id}`);
  };

  const handleCopyEmbed = async (id: string) => {
    const code = `<script src="${process.env.NEXT_PUBLIC_APP_URL || "https://wallproud.com"}/embed/${id}.js" async></script>`;
    await navigator.clipboard.writeText(code);
    toast.success("Embed code copied!");
  };

  const handleCopyFramer = async (id: string) => {
    const code = `import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function Wallproud(props) {
    const containerRef = React.useRef(null)

    React.useEffect(() => {
        if (!containerRef.current || !props.widgetId) return

        containerRef.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = \`${process.env.NEXT_PUBLIC_APP_URL || "https://wallproud.com"}/embed/\${props.widgetId}.js\`
        script.async = true
        containerRef.current.appendChild(script)
    }, [props.widgetId])

    return <div ref={containerRef} style={{ ...props.style, width: "100%", display: "block" }} />
}

addPropertyControls(Wallproud, {
    widgetId: {
        title: "Widget ID",
        type: ControlType.String,
        defaultValue: "${id}",
    }
})`;
    await navigator.clipboard.writeText(code);
    toast.success("Framer component copied!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this widget?")) return;
    const res = await deleteWidget(id);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Deleted");
    router.refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display-md text-ink">Widgets</h1>
          <p className="font-body text-muted">
            Embed your best testimonials anywhere
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-body-sm text-muted">
            {currentCount}
            {maxWidgets > 0 ? ` / ${maxWidgets}` : ""} widgets used
          </span>
          <button
            onClick={() => {
              if (limitReached) {
                toast.error("Widget limit reached. Upgrade your plan.");
                return;
              }
              setSelectorOpen(true);
            }}
            disabled={creating}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            {creating ? "Creating..." : "Create new widget"}
          </button>
        </div>
      </div>

      {widgets.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-hairline py-16 text-center">
          <LayoutGrid className="h-10 w-10 text-muted" />
          <h3 className="font-display-md mt-3 text-ink">
            No widgets yet
          </h3>
          <p className="font-body mt-1 max-w-sm text-muted">
            Create a widget to showcase your testimonials on your website,
            landing pages, or anywhere with a snippet of code.
          </p>
          <button
            onClick={() => {
              if (limitReached) {
                toast.error("Widget limit reached. Upgrade your plan.");
                return;
              }
              setSelectorOpen(true);
            }}
            className="btn-primary mt-6"
          >
            <Plus className="h-4 w-4" />
            Create your first widget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {widgets.map((w) => {
            const Icon = TYPE_ICON[w.type as WidgetType] || LayoutGrid;
            return (
              <div
                key={w.id}
                className="card-hairline group flex flex-col p-4 transition hover:bg-surface-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-2 text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center rounded-pill bg-surface-1 px-2 py-0.5 font-caption capitalize text-muted">
                    {w.type}
                  </span>
                </div>

                <h3 className="font-body-sm mt-3 text-ink">{w.name}</h3>
                <p className="font-caption text-muted">
                  {w.views_count || 0} views
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/widgets/${w.id}`}
                    className="btn-secondary flex flex-1 items-center justify-center gap-1.5 py-2 px-3"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </Link>
                  <button
                    onClick={() => handleCopyEmbed(w.id)}
                    className="btn-secondary flex flex-1 items-center justify-center gap-1.5 py-2 px-3"
                    title="Copy HTML Script"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">HTML</span>
                  </button>
                  <button
                    onClick={() => handleCopyFramer(w.id)}
                    className="btn-secondary flex flex-1 items-center justify-center gap-1.5 py-2 px-3"
                    title="Copy Framer Component"
                  >
                    <Box className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Framer</span>
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
                    className="rounded-lg border border-hairline p-2 text-muted hover:border-hairline hover:bg-surface-1 hover:text-ink shrink-0"
                    title="Delete Widget"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <WidgetTypeSelector
        open={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleSelectType}
      />
    </div>
  );
}
