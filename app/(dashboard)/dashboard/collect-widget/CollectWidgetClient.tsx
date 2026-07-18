"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Plus, Trash2, Copy, Check, Globe, Code2, Settings,
  Eye, MousePointerClick, Timer, X,
} from "lucide-react";
import type { CollectWidgetRow } from "@/lib/supabase/types";
import { upsertCollectWidget, deleteCollectWidget } from "@/app/actions/collect-widgets";

type DisplayType = "floating" | "inline" | "popup";
type Position = "bottom-right" | "bottom-left" | "bottom-center";
type Trigger = "click" | "scroll" | "exit-intent" | "timed";

interface FormState {
  id?: string;
  name: string;
  display_type: DisplayType;
  position: Position;
  trigger: Trigger;
  scroll_percent: number;
  delay_seconds: number;
  primary_color: string;
  heading: string;
  description: string;
  placeholder: string;
  thank_you_message: string;
  show_star_rating: boolean;
  show_name: boolean;
  name_required: boolean;
  show_email: boolean;
  email_required: boolean;
  show_company: boolean;
  company_required: boolean;
  show_phone: boolean;
  phone_required: boolean;
  show_video: boolean;
  max_characters: number;
  min_characters: number;
  auto_close_seconds: number;
  show_confetti: boolean;
  show_powered_by: boolean;
  auto_approve_5star: boolean;
  allowed_domains: string[];
  is_active: boolean;
}

const defaultForm: FormState = {
  name: "On-Site Widget",
  display_type: "floating",
  position: "bottom-right",
  trigger: "click",
  scroll_percent: 70,
  delay_seconds: 5,
  primary_color: "#6366f1",
  heading: "We'd love your feedback!",
  description: "Share your experience with us",
  placeholder: "Tell us about your experience...",
  thank_you_message: "Thanks for your feedback!",
  show_star_rating: true,
  show_name: true,
  name_required: true,
  show_email: true,
  email_required: false,
  show_company: false,
  company_required: false,
  show_phone: false,
  phone_required: false,
  show_video: false,
  max_characters: 5000,
  min_characters: 10,
  auto_close_seconds: 3,
  show_confetti: true,
  show_powered_by: true,
  auto_approve_5star: false,
  allowed_domains: [],
  is_active: true,
};

function widgetToForm(w: CollectWidgetRow): FormState {
  return {
    id: w.id,
    name: w.name,
    display_type: w.display_type,
    position: w.position,
    trigger: w.trigger,
    scroll_percent: w.scroll_percent,
    delay_seconds: w.delay_seconds,
    primary_color: w.primary_color,
    heading: w.heading,
    description: w.description,
    placeholder: w.placeholder,
    thank_you_message: w.thank_you_message,
    show_star_rating: w.show_star_rating,
    show_name: w.show_name,
    name_required: w.name_required,
    show_email: w.show_email,
    email_required: w.email_required,
    show_company: w.show_company,
    company_required: w.company_required,
    show_phone: w.show_phone,
    phone_required: w.phone_required,
    show_video: w.show_video,
    max_characters: w.max_characters,
    min_characters: w.min_characters,
    auto_close_seconds: w.auto_close_seconds,
    show_confetti: w.show_confetti,
    show_powered_by: w.show_powered_by,
    auto_approve_5star: w.auto_approve_5star,
    allowed_domains: w.allowed_domains || [],
    is_active: w.is_active,
  };
}

export default function CollectWidgetClient({
  workspaceId,
  workspaceName,
  workspaceColor,
  widgets,
}: {
  workspaceId: string;
  workspaceName: string;
  workspaceColor: string;
  widgets: CollectWidgetRow[];
}) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"settings" | "embed">("settings");
  const [domainInput, setDomainInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [embedFormat, setEmbedFormat] = useState<"script" | "framer">("script");

  const selectedWidget = widgets.find((w) => w.id === selectedId);

  useEffect(() => {
    if (widgets.length > 0 && !selectedId) {
      setSelectedId(widgets[0].id);
      setForm(widgetToForm(widgets[0]));
    }
  }, [widgets, selectedId]);

  const selectWidget = useCallback((id: string) => {
    setSelectedId(id);
    const w = widgets.find((x) => x.id === id);
    if (w) setForm(widgetToForm(w));
  }, [widgets]);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const res = await upsertCollectWidget(form);
    setSaving(false);
    if (res.error) return toast.error(res.error);
    toast.success(res.id === form.id ? "Widget updated" : "Widget created");
    if (res.id) {
      setSelectedId(res.id);
      setForm((prev) => ({ ...prev, id: res.id }));
    }
  }, [form]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this widget?")) return;
    const res = await deleteCollectWidget(id);
    if (res.error) return toast.error(res.error);
    toast.success("Widget deleted");
    setSelectedId(null);
    setForm(defaultForm);
  }, []);

  const addDomain = useCallback(() => {
    const d = domainInput.trim().toLowerCase().replace(/^https?:\/\//, "");
    if (!d) return;
    if (form.allowed_domains.includes(d)) return toast.error("Domain already added");
    update("allowed_domains", [...form.allowed_domains, d]);
    setDomainInput("");
  }, [domainInput, form.allowed_domains, update]);

  const removeDomain = useCallback((d: string) => {
    update("allowed_domains", form.allowed_domains.filter((x) => x !== d));
  }, [form.allowed_domains, update]);

  const copyEmbed = useCallback(async () => {
    const origin = window.location.origin;
    const id = form.id || selectedId;
    if (!id) return toast.error("Save the widget first");
    
    const scriptCode = `<script src="${origin}/collect-widget/${id}.js" async></script>`;
    const framerCode = `import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function WallproudCollectWidget(props) {
    const containerRef = React.useRef(null)

    React.useEffect(() => {
        if (!containerRef.current || !props.widgetId) return

        containerRef.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = \`${origin}/collect-widget/\${props.widgetId}.js?t=\${Date.now()}\`
        script.async = true
        containerRef.current.appendChild(script)
    }, [props.widgetId])

    return <div ref={containerRef} style={{ ...props.style, width: "100%", height: "100%", display: "block" }} />
}

addPropertyControls(WallproudCollectWidget, {
    widgetId: {
        title: "Widget ID",
        type: ControlType.String,
        defaultValue: "${id}",
    }
})`;

    const code = embedFormat === "framer" ? framerCode : scriptCode;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(embedFormat === "framer" ? "Framer component copied" : "Embed code copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }, [form.id, selectedId, embedFormat]);

  const getEmbedCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const id = form.id || selectedId;
    if (!id) return "";
    
    if (embedFormat === "framer") {
      return `import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

export default function WallproudCollectWidget(props) {
    const containerRef = React.useRef(null)

    React.useEffect(() => {
        if (!containerRef.current || !props.widgetId) return

        containerRef.current.innerHTML = ""

        const script = document.createElement("script")
        script.src = \`${origin}/collect-widget/\${props.widgetId}.js?t=\${Date.now()}\`
        script.async = true
        containerRef.current.appendChild(script)
    }, [props.widgetId])

    return <div ref={containerRef} style={{ ...props.style, width: "100%", height: "100%", display: "block" }} />
}

addPropertyControls(WallproudCollectWidget, {
    widgetId: {
        title: "Widget ID",
        type: ControlType.String,
        defaultValue: "${id}",
    }
})`;
    }
    return `<script src="${origin}/collect-widget/${id}.js" async></script>`;
  };

  const previewUrl = form.id
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/collect-widget/${form.id}.js`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-md text-ink">On-Site Collection Widget</h1>
        <p className="font-body mt-1 text-muted">
          Embed a testimonial collection form directly on your website. Visitors submit without leaving your site.
        </p>
      </div>

      {/* Widget selector */}
      <div className="flex flex-wrap items-center gap-3">
        {widgets.map((w) => (
          <button
            key={w.id}
            onClick={() => selectWidget(w.id)}
            className={`rounded-lg px-4 py-2 font-body-sm transition-colors ${
              selectedId === w.id
                ? "bg-accent text-white"
                : "bg-surface-1 text-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {w.name}
            {!w.is_active && (
              <span className="ml-2 text-xs opacity-60">(disabled)</span>
            )}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedId(null);
            setForm(defaultForm);
            setTab("settings");
          }}
          className="btn-secondary gap-2"
        >
          <Plus className="h-4 w-4" /> New widget
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-surface-1 p-1">
        <button
          onClick={() => setTab("settings")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-body-sm transition-colors ${
            tab === "settings" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
          }`}
        >
          <Settings className="h-4 w-4" /> Settings
        </button>
        <button
          onClick={() => setTab("embed")}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-body-sm transition-colors ${
            tab === "embed" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
          }`}
        >
          <Code2 className="h-4 w-4" /> Embed
        </button>
      </div>

      {tab === "settings" && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column */}
          <div className="space-y-6">
            {/* Name */}
            <div className="card-hairline p-5">
              <label className="font-body-sm text-ink">Widget name</label>
              <input
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="input-field mt-1"
                placeholder="On-Site Widget"
              />
            </div>

            {/* Display */}
            <div className="card-hairline p-5 space-y-4">
              <p className="font-body-sm text-ink">Display</p>
              <div>
                <label className="font-caption text-muted">Type</label>
                <select
                  value={form.display_type}
                  onChange={(e) => update("display_type", e.target.value as DisplayType)}
                  className="input-field mt-1"
                >
                  <option value="floating">Floating button (bottom corner)</option>
                  <option value="inline">Inline (embedded in page)</option>
                  <option value="popup">Pop-up overlay (center screen)</option>
                </select>
              </div>
              {form.display_type === "floating" && (
                <div>
                  <label className="font-caption text-muted">Position</label>
                  <select
                    value={form.position}
                    onChange={(e) => update("position", e.target.value as Position)}
                    className="input-field mt-1"
                  >
                    <option value="bottom-right">Bottom right</option>
                    <option value="bottom-left">Bottom left</option>
                    <option value="bottom-center">Bottom center</option>
                  </select>
                </div>
              )}
              <div>
                <label className="font-caption text-muted">Primary color</label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="color"
                    value={form.primary_color}
                    onChange={(e) => update("primary_color", e.target.value)}
                    className="h-10 w-10 cursor-pointer rounded-lg border border-hairline bg-transparent"
                  />
                  <input
                    value={form.primary_color}
                    onChange={(e) => update("primary_color", e.target.value)}
                    className="input-field flex-1 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Trigger */}
            <div className="card-hairline p-5 space-y-4">
              <p className="font-body-sm text-ink">Trigger</p>
              <div>
                <label className="font-caption text-muted">When to show</label>
                <select
                  value={form.trigger}
                  onChange={(e) => update("trigger", e.target.value as Trigger)}
                  className="input-field mt-1"
                >
                  <option value="click">On button click</option>
                  <option value="scroll">After scrolling down</option>
                  <option value="exit-intent">Exit intent (mouse leaves)</option>
                  <option value="timed">After a delay</option>
                </select>
              </div>
              {form.trigger === "scroll" && (
                <div>
                  <label className="font-caption text-muted">Scroll percentage: {form.scroll_percent}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={form.scroll_percent}
                    onChange={(e) => update("scroll_percent", parseInt(e.target.value))}
                    className="mt-1 w-full"
                  />
                </div>
              )}
              {form.trigger === "timed" && (
                <div>
                  <label className="font-caption text-muted">Delay: {form.delay_seconds} seconds</label>
                  <input
                    type="range"
                    min={1}
                    max={120}
                    value={form.delay_seconds}
                    onChange={(e) => update("delay_seconds", parseInt(e.target.value))}
                    className="mt-1 w-full"
                  />
                </div>
              )}
            </div>

            {/* Form fields */}
            <div className="card-hairline p-5 space-y-4">
              <p className="font-body-sm text-ink">Form content</p>
              <div>
                <label className="font-caption text-muted">Heading</label>
                <input
                  value={form.heading}
                  onChange={(e) => update("heading", e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="font-caption text-muted">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="font-caption text-muted">Textarea placeholder</label>
                <input
                  value={form.placeholder}
                  onChange={(e) => update("placeholder", e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-caption text-muted">Min characters</label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={form.min_characters}
                    onChange={(e) => update("min_characters", parseInt(e.target.value) || 10)}
                    className="input-field mt-1"
                  />
                </div>
                <div>
                  <label className="font-caption text-muted">Max characters</label>
                  <input
                    type="number"
                    min={100}
                    max={10000}
                    value={form.max_characters}
                    onChange={(e) => update("max_characters", parseInt(e.target.value) || 5000)}
                    className="input-field mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Fields toggles */}
            <div className="card-hairline p-5 space-y-3">
              <p className="font-body-sm text-ink">Fields</p>
              {([
                ["Star rating", "show_star_rating"],
                ["Name", "show_name"],
                ["Email", "show_email"],
                ["Company", "show_company"],
                ["Phone", "show_phone"],
                ["Video URL", "show_video"],
              ] as const).map(([label, key]) => (
                <div key={key}>
                  <label className="flex items-center justify-between py-1">
                    <span className="font-body-sm text-ink">{label}</span>
                    <input
                      type="checkbox"
                      checked={form[key] as boolean}
                      onChange={(e) => update(key as keyof FormState, e.target.checked)}
                      className="h-4 w-4 rounded border-hairline"
                    />
                  </label>
                  {form[key] && key !== "show_star_rating" && (
                    <label className="flex items-center justify-between py-1 pl-4">
                      <span className="font-caption text-muted">Required</span>
                      <input
                        type="checkbox"
                        checked={
                          form[`${key.replace("show_", "")}_required` as keyof FormState] as boolean
                        }
                        onChange={(e) =>
                          update(
                            `${key.replace("show_", "")}_required` as keyof FormState,
                            e.target.checked,
                          )
                        }
                        className="h-4 w-4 rounded border-hairline"
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>

            {/* After submit */}
            <div className="card-hairline p-5 space-y-4">
              <p className="font-body-sm text-ink">After submit</p>
              <div>
                <label className="font-caption text-muted">Thank you message</label>
                <input
                  value={form.thank_you_message}
                  onChange={(e) => update("thank_you_message", e.target.value)}
                  className="input-field mt-1"
                />
              </div>
              <div>
                <label className="font-caption text-muted">Auto-close after: {form.auto_close_seconds}s</label>
                <input
                  type="range"
                  min={0}
                  max={30}
                  value={form.auto_close_seconds}
                  onChange={(e) => update("auto_close_seconds", parseInt(e.target.value))}
                  className="mt-1 w-full"
                />
              </div>
              <label className="flex items-center justify-between">
                <span className="font-body-sm text-ink">Show confetti animation</span>
                <input
                  type="checkbox"
                  checked={form.show_confetti}
                  onChange={(e) => update("show_confetti", e.target.checked)}
                  className="h-4 w-4 rounded border-hairline"
                />
              </label>
            </div>

            {/* Targeting */}
            <div className="card-hairline p-5 space-y-4">
              <p className="font-body-sm text-ink">Targeting & restrictions</p>
              <label className="flex items-center justify-between">
                <div>
                  <span className="font-body-sm text-ink">Auto-approve 5-star</span>
                  <p className="font-caption text-muted">Automatically approve 5-star testimonials</p>
                </div>
                <input
                  type="checkbox"
                  checked={form.auto_approve_5star}
                  onChange={(e) => update("auto_approve_5star", e.target.checked)}
                  className="h-4 w-4 rounded border-hairline"
                />
              </label>
              <label className="flex items-center justify-between">
                <div>
                  <span className="font-body-sm text-ink">Show "Powered by WallProud"</span>
                </div>
                <input
                  type="checkbox"
                  checked={form.show_powered_by}
                  onChange={(e) => update("show_powered_by", e.target.checked)}
                  className="h-4 w-4 rounded border-hairline"
                />
              </label>
              <div>
                <label className="font-caption text-muted">Allowed domains (empty = all domains)</label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDomain())}
                    className="input-field flex-1"
                    placeholder="mywebsite.com"
                  />
                  <button onClick={addDomain} className="btn-secondary text-xs">
                    Add
                  </button>
                </div>
                {form.allowed_domains.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {form.allowed_domains.map((d) => (
                      <span
                        key={d}
                        className="inline-flex items-center gap-1 rounded-pill bg-surface-2 px-3 py-1 font-caption text-muted"
                      >
                        <Globe className="h-3 w-3" />
                        {d}
                        <button onClick={() => removeDomain(d)} className="ml-1 hover:text-ink">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="card-hairline p-5">
              <label className="flex items-center justify-between">
                <div>
                  <span className="font-body-sm text-ink">Widget active</span>
                  <p className="font-caption text-muted">
                    {form.is_active ? "Widget is live and accepting submissions" : "Widget is disabled"}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => update("is_active", e.target.checked)}
                  className="h-4 w-4 rounded border-hairline"
                />
              </label>
            </div>

            {/* Save + Delete */}
            <div className="flex items-center gap-3">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                {saving ? "Saving..." : "Save widget"}
              </button>
              {selectedId && (
                <button onClick={() => handleDelete(selectedId)} className="btn-secondary text-error">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {tab === "embed" && (
        <div className="space-y-6">
          <div className="card-hairline p-6">
            <p className="font-body-sm text-ink">Embed code</p>
            <p className="font-body mt-1 text-muted">
              Choose your platform below to get the correct integration code.
            </p>
            {form.id || selectedId ? (
              <div className="mt-4 space-y-4">
                <div className="flex rounded-lg border border-hairline w-fit">
                  <button
                    onClick={() => setEmbedFormat("script")}
                    className={`px-4 py-1.5 font-body-sm transition-colors ${
                      embedFormat === "script" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    HTML Script
                  </button>
                  <button
                    onClick={() => setEmbedFormat("framer")}
                    className={`px-4 py-1.5 font-body-sm transition-colors ${
                      embedFormat === "framer" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    Framer Component
                  </button>
                </div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-lg bg-surface-1 p-4 font-mono text-sm text-ink max-h-[350px]">
                    {getEmbedCode()}
                  </pre>
                </div>
                <button onClick={copyEmbed} className="btn-primary gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy embed code"}
                </button>
                <div className="rounded-lg bg-surface-1 p-4">
                  <p className="font-caption text-ink">Stats</p>
                  <p className="font-body-sm text-muted">
                    Submissions received: {selectedWidget?.submission_count || 0}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-surface-1 p-6 text-center">
                <Code2 className="mx-auto h-8 w-8 text-muted" />
                <p className="font-body-sm mt-2 text-ink">Save the widget first</p>
                <p className="font-body mt-1 text-muted">
                  Configure and save your widget settings, then come here to get the embed code.
                </p>
              </div>
            )}
          </div>

          {/* Preview note */}
          <div className="card-hairline p-6">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-muted" />
              <div>
                <p className="font-body-sm text-ink">Preview</p>
                <p className="font-body text-muted">
                  Add the embed code to your website, then load the page to see the widget in action. 
                  The widget uses Shadow DOM so it will never break your website styles.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
