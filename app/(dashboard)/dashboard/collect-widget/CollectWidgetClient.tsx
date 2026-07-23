"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import {
  Plus, Trash2, Copy, Check, Code2, Settings,
  Eye, MousePointerClick, Timer, Smartphone, Monitor, Star, X, MessageCircle,
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
  show_image: boolean;
  max_characters: number;
  min_characters: number;
  auto_close_seconds: number;
  show_confetti: boolean;
  show_powered_by: boolean;
  auto_approve_5star: boolean;
  is_active: boolean;
}

const defaultForm: FormState = {
  name: "On-Site Widget",
  display_type: "floating",
  position: "bottom-right",
  trigger: "click",
  scroll_percent: 70,
  delay_seconds: 5,
  primary_color: "#000000",
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
  show_image: false,
  max_characters: 5000,
  min_characters: 10,
  auto_close_seconds: 3,
  show_confetti: true,
  show_powered_by: true,
  auto_approve_5star: false,
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
    show_image: w.show_image,
    max_characters: w.max_characters,
    min_characters: w.min_characters,
    auto_close_seconds: w.auto_close_seconds,
    show_confetti: w.show_confetti,
    show_powered_by: w.show_powered_by,
    auto_approve_5star: w.auto_approve_5star,
    is_active: w.is_active,
  };
}

function OnSiteWidgetPreview({ form }: { form: FormState }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [isOpen, setIsOpen] = useState(true);
  const [starRating, setStarRating] = useState<number | null>(4);
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isPopup = form.display_type === "popup";
  const isFloating = form.display_type === "floating";

  const posClass = form.position === "bottom-left"
    ? "left-6"
    : form.position === "bottom-center"
    ? "left-1/2 -translate-x-1/2"
    : "right-6";

  return (
    <div className="card-hairline overflow-hidden rounded-2xl bg-surface-1 p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-accent" />
          <h3 className="font-display-md text-ink text-sm">Interactive Responsive Preview</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-surface-2 p-1">
            <button
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                device === "desktop" ? "bg-surface-1 text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" /> Desktop
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                device === "mobile" ? "bg-surface-1 text-ink shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" /> Mobile
            </button>
          </div>

          {(isPopup || isFloating) && (
            <button
              onClick={() => { setIsOpen(!isOpen); setSubmitted(false); }}
              className="btn-secondary text-xs py-1 px-3"
            >
              {isOpen ? "Close Preview" : "Open Preview"}
            </button>
          )}
        </div>
      </div>

      {/* Simulated Web Page Container */}
      <div className="flex justify-center bg-gray-900/5 p-4 rounded-xl">
        <div
          className={`relative min-h-[460px] w-full overflow-hidden rounded-xl border border-hairline bg-white shadow-sm transition-all duration-300 ${
            device === "mobile" ? "max-w-[375px]" : "max-w-full"
          }`}
        >
          {/* Mock Browser Top Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/80 px-4 py-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <span className="text-[11px] text-gray-400 font-mono">yourwebsite.com</span>
            <span className="w-10" />
          </div>

          {/* Mock Web Page Skeleton Content */}
          <div className="p-6 space-y-4 opacity-30 select-none pointer-events-none">
            <div className="h-7 w-2/3 rounded-lg bg-gray-300" />
            <div className="h-3.5 w-full rounded bg-gray-200" />
            <div className="h-3.5 w-5/6 rounded bg-gray-200" />
            <div className="grid grid-cols-2 gap-3 pt-3 sm:grid-cols-3">
              <div className="h-20 rounded-lg bg-gray-200" />
              <div className="h-20 rounded-lg bg-gray-200" />
              <div className="h-20 hidden rounded-lg bg-gray-200 sm:block" />
            </div>
          </div>

          {/* Floating Widget Trigger Button */}
          {isFloating && (
            <button
              onClick={() => { setIsOpen(!isOpen); setSubmitted(false); }}
              style={{ backgroundColor: form.primary_color }}
              className={`absolute bottom-4 ${posClass} flex h-12 w-12 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 active:scale-95 z-10`}
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          )}

          {/* Popup Modal Backdrop */}
          {isPopup && isOpen && (
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 transition-opacity"
            />
          )}

          {/* Responsive Modal / Panel Content */}
          {((isPopup && isOpen) || (isFloating && isOpen) || form.display_type === "inline") && (
            <div
              className={`bg-white shadow-2xl flex flex-col transition-all duration-300 ${
                form.display_type === "inline"
                  ? "relative mx-auto my-4 w-[92%] max-w-[480px] rounded-2xl border border-gray-100"
                  : isPopup
                  ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[calc(100%-24px)] max-w-[460px] max-h-[calc(100%-24px)] rounded-2xl border border-gray-100"
                  : `absolute bottom-16 ${posClass} z-20 w-[calc(100%-24px)] max-w-[380px] max-h-[calc(100%-80px)] rounded-2xl border border-gray-100`
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-4 pb-0">
                <div>
                  <h4 className="font-bold text-gray-900 text-base leading-snug">{form.heading}</h4>
                  {form.description && (
                    <p className="mt-0.5 text-xs text-gray-500">{form.description}</p>
                  )}
                </div>
                {form.display_type !== "inline" && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="rounded-lg border border-gray-200 p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Form Body */}
              {submitted ? (
                <div className="p-6 text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                    <Check className="h-6 w-6" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-base">{form.thank_you_message}</h5>
                  <p className="text-xs text-gray-500">Your feedback has been received.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs text-accent underline mt-2 inline-block"
                  >
                    Reset preview
                  </button>
                </div>
              ) : (
                <div className="p-4 space-y-3 overflow-y-auto max-h-[340px]">
                  {form.show_star_rating && (
                    <div className="flex justify-center gap-1 py-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setStarRating(star)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star
                            className="h-6 w-6"
                            style={{
                              color: starRating && star <= starRating ? "#fbbf24" : "#d1d5db",
                              fill: starRating && star <= starRating ? "#fbbf24" : "transparent",
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <textarea
                      rows={3}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder={form.placeholder}
                      className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-accent"
                    />
                    <div className="mt-0.5 text-right text-[10px] text-gray-400">
                      {content.length} / {form.max_characters}
                    </div>
                  </div>

                  {form.show_name && (
                    <input
                      type="text"
                      placeholder={`Your name${form.name_required ? " *" : ""}`}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-accent"
                    />
                  )}

                  {form.show_email && (
                    <input
                      type="email"
                      placeholder={`Email${form.email_required ? " *" : ""}`}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-accent"
                    />
                  )}

                  {form.show_company && (
                    <input
                      type="text"
                      placeholder={`Company${form.company_required ? " *" : ""}`}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-accent"
                    />
                  )}

                  {form.show_phone && (
                    <input
                      type="tel"
                      placeholder={`Phone${form.phone_required ? " *" : ""}`}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-accent"
                    />
                  )}

                  {form.show_video && (
                    <input
                      type="url"
                      placeholder="Video URL"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none focus:border-accent"
                    />
                  )}

                  <button
                    type="button"
                    onClick={() => setSubmitted(true)}
                    style={{ backgroundColor: form.primary_color }}
                    className="w-full rounded-xl py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 active:scale-[0.99]"
                  >
                    Submit Testimonial
                  </button>
                </div>
              )}

              {/* Footer */}
              {form.show_powered_by && (
                <div className="border-t border-gray-100 p-2.5 text-center text-[10px] text-gray-400">
                  Powered by <span className="font-semibold text-gray-600">WallProud</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function CollectWidgetClient({
  workspaceId,
  workspaceName,
  workspaceColor,
  widgets,
  plan,
}: {
  workspaceId: string;
  workspaceName: string;
  workspaceColor: string;
  widgets: CollectWidgetRow[];
  plan: string;
}) {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tab, setTab] = useState<"settings" | "embed">("settings");
  const [copied, setCopied] = useState(false);

  const selectedWidget = widgets.find((w) => w.id === selectedId);

  useEffect(() => {
    if (widgets.length > 0 && !selectedId) {
      setSelectedId(widgets[0].id);
      setForm({ ...widgetToForm(widgets[0]), show_powered_by: true });
    }
  }, [widgets, selectedId]);

  const selectWidget = useCallback((id: string) => {
    setSelectedId(id);
    const w = widgets.find((x) => x.id === id);
    if (w) setForm({ ...widgetToForm(w), show_powered_by: true });
  }, [widgets]);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (plan === "free" && key === "show_powered_by") {
        next.show_powered_by = true;
      }
      return next;
    });
  }, [plan]);

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

  const copyEmbed = useCallback(async () => {
    const origin = window.location.origin;
    const id = form.id || selectedId;
    if (!id) return toast.error("Save the widget first");
    
    const scriptCode = `<script src="${origin}/collect-widget/${id}.js" async></script>`;

    try {
      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      toast.success("Embed code copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }, [form.id, selectedId]);

  const getEmbedCode = () => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const id = form.id || selectedId;
    if (!id) return "";
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
                ["Image", "show_image"],
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
                  {plan === "free" && (
                    <span className="ml-2 font-caption text-muted">(required on free plan)</span>
                  )}
                </div>
                <input
                  type="checkbox"
                  checked={form.show_powered_by}
                  onChange={(e) => update("show_powered_by", e.target.checked)}
                  disabled={plan === "free"}
                  className="h-4 w-4 rounded border-hairline disabled:opacity-50"
                />
              </label>
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
          
          {/* Interactive Live Responsive Preview */}
          <OnSiteWidgetPreview form={form} />
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

          {/* Interactive Live Responsive Preview */}
          <OnSiteWidgetPreview form={form} />
        </div>
      )}
    </div>
  );
}
