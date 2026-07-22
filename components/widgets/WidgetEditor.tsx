"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  X,
  Copy,
  Save,
  GripVertical,
  Search,
  ChevronLeft,
  Code2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { updateWidget } from "@/app/actions/widgets";
import PreviewContainer from "./preview/PreviewContainer";
import { FONT_OPTIONS, ANIMATION_OPTIONS, mergeConfig } from "@/lib/widgets";
import type { WidgetConfig, WidgetType } from "@/types";

const WIDGET_TYPE_LABELS: Record<WidgetType, string> = {
  grid: "Grid",
  carousel: "Carousel",
  wall: "Wall of Love",
  slider: "Slider",
  minimal: "Minimal",
  masonry: "Masonry",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-hairline px-4 py-4">
      <h3 className="font-caption mb-3 uppercase tracking-wider text-muted">
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <label className="font-body-sm text-muted">{label}</label>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
}

export default function WidgetEditor({
  widget,
  testimonials,
}: {
  widget: any;
  testimonials: any[];
}) {
  const router = useRouter();

  const [name, setName] = useState(widget.name);
  const [type, setType] = useState<WidgetType>(widget.type);
  const [config, setConfig] = useState<WidgetConfig>(
    () => mergeConfig(widget.type, widget.config) as WidgetConfig,
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(
    widget.testimonial_ids || [],
  );
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [embedTab, setEmbedTab] = useState<"script" | "iframe" | "framer">("script");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterTag, setFilterTag] = useState("all");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    testimonials.forEach((t) => t.tags?.forEach((tag: string) => set.add(tag)));
    return Array.from(set);
  }, [testimonials]);

  const filteredPool = useMemo(() => {
    return testimonials.filter((t) => {
      if (
        search &&
        !`${t.author_name} ${t.content} ${t.author_company || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      if (filterStatus !== "all" && t.status !== filterStatus) return false;
      if (filterMinRating > 0 && (t.rating || 0) < filterMinRating) return false;
      if (filterTag !== "all" && !t.tags?.includes(filterTag)) return false;
      return true;
    });
  }, [testimonials, search, filterStatus, filterMinRating, filterTag]);

  const selectedTestimonials = useMemo(
    () =>
      selectedIds
        .map((id) => testimonials.find((t) => t.id === id))
        .filter(Boolean),
    [selectedIds, testimonials],
  );

  const updateStyling = useCallback(
    (patch: Partial<NonNullable<WidgetConfig["styling"]>>) => {
      setConfig((prev) => ({
        ...prev,
        styling: { ...prev.styling!, ...patch },
      }) as WidgetConfig);
      setDirty(true);
    },
    [],
  );

  const updateLayout = useCallback(
    (patch: Partial<NonNullable<WidgetConfig["layout"]>>) => {
      setConfig((prev) => ({
        ...prev,
        layout: { ...prev.layout!, ...patch },
      }) as WidgetConfig);
      setDirty(true);
    },
    [],
  );

  const updateAnimation = useCallback(
    (patch: Partial<NonNullable<WidgetConfig["animation"]>>) => {
      setConfig((prev) => ({
        ...prev,
        animation: { ...prev.animation!, ...patch },
      }) as WidgetConfig);
      setDirty(true);
    },
    [],
  );

  const updateFilterCfg = useCallback(
    (patch: Partial<NonNullable<WidgetConfig["filter"]>>) => {
      setConfig((prev) => ({
        ...prev,
        filter: { ...prev.filter!, ...patch },
      }) as WidgetConfig);
      setDirty(true);
    },
    [],
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
    setDirty(true);
  };

  const selectAllApproved = () => {
    const approved = testimonials
      .filter((t) => t.status === "approved")
      .map((t) => t.id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...approved])));
    setDirty(true);
    toast.success(`Added ${approved.length} approved testimonials`);
  };

  const removeSelected = (id: string) => {
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    setDirty(true);
  };

  const [dragId, setDragId] = useState<string | null>(null);
  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setSelectedIds((prev) => {
      const next = [...prev];
      const from = next.indexOf(dragId);
      const to = next.indexOf(targetId);
      next.splice(from, 1);
      next.splice(to, 0, dragId);
      return next;
    });
    setDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await updateWidget(widget.id, {
      name,
      type,
      config,
      testimonial_ids: selectedIds,
    });
    setSaving(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    setDirty(false);
    toast.success("Saved");
    router.refresh();
  };

  const embedOrigin = process.env.NEXT_PUBLIC_APP_URL || "https://wallproud.vercel.app";
  
  const framerCode = `// Get Started: https://www.framer.com/developers

import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */
export default function Wallproud(props) {
    const { widgetId, sizeMode, customWidth, customHeight } = props
    const [content, setContent] = React.useState("")
    const [error, setError] = React.useState(false)

    React.useEffect(() => {
        if (!widgetId) return
        fetch("${embedOrigin}/embed/" + widgetId + ".js")
            .then(res => {
                if (!res.ok) throw new Error("Failed to load")
                return res.text()
            })
            .then(code => {
                var marker = "root.innerHTML='"
                var start = code.indexOf(marker)
                if (start === -1) {
                    console.error("WallProud: marker not found")
                    setError(true)
                    return
                }
                var afterStart = start + marker.length
                var end = code.indexOf("';", afterStart)
                if (end === -1) end = code.indexOf("';", afterStart + 1)
                var html = code.slice(afterStart, end)
                html = html.split("\\\\n").join("")
                html = html.split('\\\\"').join('"')
                html = html.split("\\\\'").join("'")
                setContent(html)
            })
            .catch(() => setError(true))
    }, [widgetId])

    if (error) {
        return <p style={{ color: "#666", padding: 24 }}>Failed to load widget</p>
    }

    if (!content) {
        return <p style={{ color: "#999", padding: 24 }}>Loading widget...</p>
    }

    var containerStyle = { width: "100%", ...props.style }

    if (sizeMode === "fill") {
        containerStyle = { ...containerStyle, width: "100%", height: "100%" }
    } else if (sizeMode === "fit") {
        containerStyle = { ...containerStyle, width: "auto", height: "auto" }
    } else if (sizeMode === "fixed") {
        containerStyle = { ...containerStyle, width: (customWidth || 800) + "px", height: (customHeight || 600) + "px" }
    } else if (sizeMode === "relative") {
        containerStyle = { ...containerStyle, width: "100%", height: "600px" }
    }

    return (
        <div style={containerStyle}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
    )
}

addPropertyControls(Wallproud, {
    widgetId: {
        title: "Widget ID",
        type: ControlType.String,
        defaultValue: "${widget.id}",
    },
    sizeMode: {
        title: "Size Mode",
        type: ControlType.Enum,
        options: ["fill", "fit", "fixed", "relative"],
        optionTitles: ["Fill", "Fit", "Fixed", "Relative"],
        defaultValue: "fill",
    },
    customWidth: {
        title: "Width (px)",
        type: ControlType.Number,
        defaultValue: 800,
        hidden: (props) => props.sizeMode !== "fixed",
    },
    customHeight: {
        title: "Height (px)",
        type: ControlType.Number,
        defaultValue: 600,
        hidden: (props) => props.sizeMode !== "fixed",
    },
})`;

  const embedCode =
    embedTab === "iframe"
      ? `<iframe src="${embedOrigin}/embed/${widget.id}" width="100%" height="600" frameborder="0" loading="lazy" title="WallProud Testimonials"></iframe>`
      : embedTab === "framer"
      ? framerCode
      : `<script src="${embedOrigin}/embed/${widget.id}.js" async></script>`;

  const previewTestimonials =
    type === "carousel" || type === "slider"
      ? selectedTestimonials
      : selectedTestimonials;

  return (
    <div className="space-y-4">
      {/* top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/widgets"
            className="rounded-lg p-1.5 text-muted hover:bg-surface-1 hover:text-ink"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setDirty(true);
            }}
            className="border-none bg-transparent font-display-md text-ink focus:outline-none focus:ring-0"
          />
          {dirty && (
            <span className="rounded-pill bg-surface-1 px-2 py-0.5 font-caption text-muted">
              Unsaved
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !dirty}
          className="btn-primary"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr_300px]">
        {/* LEFT PANEL */}
        <div className="card-hairline flex max-h-[78vh] flex-col bg-surface-1">
          <div className="border-b border-hairline p-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search testimonials"
                className="input-field w-full pl-8"
              />
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field text-xs"
              >
                <option value="all">All status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="input-field text-xs"
              >
                <option value="all">All tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <select
                value={filterMinRating}
                onChange={(e) => setFilterMinRating(Number(e.target.value))}
                className="input-field flex-1 text-xs"
              >
                <option value={0}>Any rating</option>
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}+ stars
                  </option>
                ))}
              </select>
              <button
                onClick={selectAllApproved}
                className="rounded-lg bg-surface-2 px-2 py-1.5 font-caption text-accent hover:bg-surface-2"
              >
                Select all approved
              </button>
            </div>
          </div>

          <div className="border-b border-hairline bg-surface-2 px-3 py-2 font-caption text-muted">
            Selected ({selectedIds.length})
          </div>
          <div className="max-h-40 overflow-y-auto px-2 py-2">
            {selectedTestimonials.length === 0 ? (
              <p className="px-2 py-4 text-center font-caption text-muted">
                None selected yet
              </p>
            ) : (
              selectedTestimonials.map((t) => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={() => setDragId(t.id)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(t.id)}
                  className="card-hairline group mb-1 flex items-center gap-2 bg-surface-1 px-2 py-1.5 font-body-sm"
                >
                  <GripVertical className="h-4 w-4 cursor-grab text-muted" />
                  <span className="min-w-0 flex-1 truncate text-ink">{t.author_name}</span>
                  <button
                    onClick={() => removeSelected(t.id)}
                    className="text-muted hover:text-ink"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="border-y border-hairline bg-surface-2 px-3 py-2 font-caption text-muted">
            All testimonials ({filteredPool.length})
          </div>
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {filteredPool.map((t) => (
              <label
                key={t.id}
                className="mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 font-body-sm hover:bg-surface-2"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(t.id)}
                  onChange={() => toggleSelect(t.id)}
                  className="h-4 w-4 rounded border-hairline bg-surface-1 text-accent focus:ring-accent"
                />
                <span className="min-w-0 flex-1 truncate text-ink">{t.author_name}</span>
                {t.rating ? <Star className="h-3 w-3 fill-ink text-ink" /> : null}
              </label>
            ))}
          </div>
        </div>

        {/* CENTER PANEL */}
        <PreviewContainer
          type={type}
          config={config}
          testimonials={previewTestimonials as any}
          viewport={viewport}
          onViewportChange={setViewport}
        />

        {/* RIGHT PANEL */}
        <div className="card-hairline max-h-[78vh] overflow-y-auto bg-surface-1">
          <Section title="General">
            <Field label="Widget type">
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value as WidgetType);
                  setDirty(true);
                }}
                className="input-field text-sm"
              >
                {(Object.keys(WIDGET_TYPE_LABELS) as WidgetType[]).map((t) => (
                  <option key={t} value={t}>
                    {WIDGET_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          <Section title="Colors">
            <Field label="Primary">
              <input
                type="color"
                value={config.styling!.accentColor}
                onChange={(e) => updateStyling({ accentColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-hairline bg-surface-1"
              />
            </Field>
            <Field label="Background">
              <input
                type="color"
                value={config.styling!.backgroundColor}
                onChange={(e) =>
                  updateStyling({ backgroundColor: e.target.value })
                }
                className="h-8 w-10 cursor-pointer rounded border border-hairline bg-surface-1"
              />
            </Field>
            <Field label="Text">
              <input
                type="color"
                value={config.styling!.textColor}
                onChange={(e) => updateStyling({ textColor: e.target.value })}
                className="h-8 w-10 cursor-pointer rounded border border-hairline bg-surface-1"
              />
            </Field>
          </Section>

          <Section title="Typography & Style">
            <Field label="Font family">
              <select
                value={config.styling!.fontFamily}
                onChange={(e) => updateStyling({ fontFamily: e.target.value })}
                className="input-field text-sm"
              >
                {FONT_OPTIONS.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Border radius">
              <input
                type="range"
                min={0}
                max={32}
                value={config.styling!.cardBorderRadius}
                onChange={(e) =>
                  updateStyling({ cardBorderRadius: Number(e.target.value) })
                }
                className="w-28 accent-accent"
              />
            </Field>
            <Field label="Card padding">
              <input
                type="range"
                min={8}
                max={40}
                value={config.styling!.cardPadding}
                onChange={(e) =>
                  updateStyling({ cardPadding: Number(e.target.value) })
                }
                className="w-28 accent-accent"
              />
            </Field>
          </Section>

          <Section title="Layout">
            <Field label="Columns (1-4)">
              <input
                type="range"
                min={1}
                max={4}
                value={config.layout!.columns}
                onChange={(e) =>
                  updateLayout({ columns: Number(e.target.value) })
                }
                className="w-28 accent-accent"
              />
            </Field>
            <Field label="Gap">
              <input
                type="range"
                min={8}
                max={48}
                value={config.layout!.gap}
                onChange={(e) => updateLayout({ gap: Number(e.target.value) })}
                className="w-28 accent-accent"
              />
            </Field>
            <Field label="Max testimonials">
              <input
                type="number"
                min={1}
                max={100}
                value={config.filter!.maxItems}
                onChange={(e) =>
                  updateFilterCfg({ maxItems: Number(e.target.value) })
                }
                className="input-field w-16 text-sm"
              />
            </Field>
          </Section>

          <Section title="Visibility">
            {(
              [
                ["showRating", "Rating"],
                ["showAuthorImage", "Author image"],
                ["showAuthorCompany", "Company"],
                ["showDate", "Date"],
              ] as const
            ).map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  type="checkbox"
                  checked={config.styling![key] as boolean}
                  onChange={(e) => updateStyling({ [key]: e.target.checked })}
                  className="h-4 w-4 rounded border-hairline bg-surface-1 text-accent focus:ring-accent"
                />
              </Field>
            ))}
          </Section>

          <Section title="Animation">
            <Field label="Transition">
              <select
                value={config.animation!.transition}
                onChange={(e) =>
                  updateAnimation({ transition: e.target.value as any })
                }
                className="input-field text-sm"
              >
                {ANIMATION_OPTIONS.map((a) => (
                  <option key={a.value} value={a.value}>
                    {a.label}
                  </option>
                ))}
              </select>
            </Field>
            {(type === "carousel" || type === "slider") && (
              <>
                <Field label="Auto-rotate">
                  <input
                    type="checkbox"
                    checked={config.animation!.autoplay ?? false}
                    onChange={(e) =>
                      updateAnimation({ autoplay: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-hairline bg-surface-1 text-accent focus:ring-accent"
                  />
                </Field>
                <Field label="Speed (ms)">
                  <input
                    type="number"
                    min={1000}
                    step={500}
                    value={config.animation!.interval}
                    onChange={(e) =>
                      updateAnimation({ interval: Number(e.target.value) })
                    }
                    className="input-field w-20 text-sm"
                  />
                </Field>
              </>
            )}
          </Section>
        </div>
      </div>

      {/* BOTTOM: EMBED */}
      <div className="card-hairline p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-body-sm text-ink">
            <Code2 className="h-4 w-4" />
            Embed code
          </h3>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-hairline">
              <button
                onClick={() => setEmbedTab("script")}
                className={`px-3 py-1 font-caption ${
                  embedTab === "script"
                    ? "bg-surface-2 text-ink"
                    : "text-muted"
                }`}
              >
                Script
              </button>
              <button
                onClick={() => setEmbedTab("iframe")}
                className={`px-3 py-1 font-caption ${
                  embedTab === "iframe"
                    ? "bg-surface-2 text-ink"
                    : "text-muted"
                }`}
              >
                iFrame
              </button>
              <button
                onClick={() => setEmbedTab("framer")}
                className={`px-3 py-1 font-caption ${
                  embedTab === "framer"
                    ? "bg-surface-2 text-ink"
                    : "text-muted"
                }`}
              >
                Framer
              </button>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(embedCode);
                toast.success("Copied!");
              }}
              className="btn-primary text-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
        </div>

        <div className="mb-2 rounded-lg bg-surface-2 p-3">
          <p className="font-caption text-muted">
            {embedTab === "script" && "Paste this script tag anywhere in your website's HTML. The widget will load automatically."}
            {embedTab === "iframe" && "Use this iframe code to embed the widget in a specific container. Adjust the height as needed."}
            {embedTab === "framer" && "Paste this into a Framer Code Component. The widget ID is pre-filled."}
          </p>
        </div>

        <pre className="overflow-x-auto rounded-lg bg-surface-1 p-3 font-mono text-xs text-ink">
          <code>{embedCode}</code>
        </pre>
        <p className="font-caption mt-2 text-muted">
          Showing up to {config.filter!.maxItems} testimonials in this widget.
          Your plan may limit the total number of testimonials per workspace.
        </p>
      </div>
    </div>
  );
}
