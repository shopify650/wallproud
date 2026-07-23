"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Link2, Copy, Check, Plus, Trash2, Send, Clock, CheckCircle2, XCircle,
  Pencil, X, Upload,
} from "lucide-react";
import { createCollection, deleteCollection, updateCollection, uploadCollectionImage } from "@/app/actions/collect";

export type CollectionRequest = {
  id: string;
  workspace_id: string;
  recipient_email: string;
  recipient_name: string | null;
  status: "pending" | "sent" | "completed" | "expired";
  token: string | null;
  expires_at: string | null;
  created_at: string;
  title: string;
  description: string;
  button_text: string;
  thank_you_message: string;
  brand_color: string;
  field_config: Record<string, any>;
  redirect_url: string | null;
  logo_image: string | null;
  show_powered_by: boolean;
};

const statusMeta: Record<CollectionRequest["status"], { label: string; icon: typeof Clock; className: string }> = {
  pending:   { label: "Active",    icon: Clock,        className: "bg-surface-1 text-accent" },
  sent:      { label: "Sent",     icon: Send,          className: "bg-surface-1 text-ink" },
  completed: { label: "Completed",icon: CheckCircle2,  className: "bg-surface-1 text-success" },
  expired:   { label: "Expired",  icon: XCircle,       className: "bg-surface-1 text-muted" },
};

const defaultFieldConfig = {
  show_rating: true,
  show_name: true,
  name_required: false,
  show_email: false,
  email_required: false,
  show_company: false,
  company_required: false,
  show_role: false,
  role_required: false,
  show_video: false,
  show_image: false,
  min_characters: 10,
  max_characters: 5000,
};

function EditModal({ collection, onClose, onSave, plan }: {
  collection: CollectionRequest;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
  plan: string;
}) {
  const isFree = plan === "free";
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: collection.title || "Share your feedback",
    description: collection.description || "We'd love to hear about your experience.",
    buttonText: collection.button_text || "Submit Testimonial",
    thankYouMessage: collection.thank_you_message || "Thanks for your feedback!",
    brandColor: collection.brand_color || "#000000",
    redirectUrl: collection.redirect_url || "",
    fieldConfig: collection.field_config || defaultFieldConfig,
    logoImage: collection.logo_image || "",
    showPoweredBy: collection.show_powered_by ?? true,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(collection.logo_image || null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const updateField = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateFieldConfig = (key: string, value: any) => {
    setForm(prev => ({
      ...prev,
      fieldConfig: { ...prev.fieldConfig, [key]: value },
    }));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadCollectionImage(fd);
    setUploading(false);

    if (res.error) {
      toast.error(res.error);
      setImagePreview(collection.logo_image || null);
      return;
    }

    if (res.url) {
      setForm(prev => ({ ...prev, logoImage: res.url! }));
      setImagePreview(res.url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(collection.id, form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-surface-1 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display-md text-ink">Customize Collection Link</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-caption text-muted">Form Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="input-field mt-1"
                maxLength={255}
              />
            </div>
            <div>
              <label className="font-caption text-muted">Button Text</label>
              <input
                type="text"
                value={form.buttonText}
                onChange={(e) => updateField("buttonText", e.target.value)}
                className="input-field mt-1"
                maxLength={100}
              />
            </div>
          </div>

          <div>
            <label className="font-caption text-muted">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="input-field mt-1"
              rows={2}
              maxLength={500}
            />
          </div>

          <div>
            <label className="font-caption text-muted">Thank You Message</label>
            <input
              type="text"
              value={form.thankYouMessage}
              onChange={(e) => updateField("thankYouMessage", e.target.value)}
              className="input-field mt-1"
              maxLength={255}
            />
          </div>

          <div>
            <label className="font-caption text-muted">Logo Image</label>
            <div className="mt-1 flex items-center gap-3">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-12 w-12 rounded-lg object-cover" />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-surface-2 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-muted" />
                </div>
              )}
              <div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  ref={fileRef}
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="btn-secondary text-xs"
                  disabled={uploading}
                >
                  {imagePreview ? "Change Image" : "Upload Image"}
                </button>
                {imagePreview && form.logoImage && (
                  <button
                    type="button"
                    onClick={() => { setImagePreview(null); setForm(prev => ({ ...prev, logoImage: "" })); }}
                    className="ml-2 text-xs text-muted hover:text-ink"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 font-caption text-xs text-muted">PNG, JPG or WebP. Max 2MB.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-caption text-muted">Theme Color</label>
              <p className="font-caption mt-0.5 text-muted">Controls the form button, stars, and accents. Milestone toggle stays blue.</p>
              <div className="mt-1 flex items-center gap-3">
                <input
                  type="color"
                  value={form.brandColor}
                  onChange={(e) => updateField("brandColor", e.target.value)}
                  className="h-10 w-14 rounded-lg border border-hairline bg-transparent p-1"
                />
                <input
                  type="text"
                  value={form.brandColor}
                  onChange={(e) => updateField("brandColor", e.target.value)}
                  className="input-field flex-1"
                  maxLength={20}
                />
              </div>
            </div>
            <div>
              <label className="font-caption text-muted">Redirect URL after submit (optional)</label>
              <input
                type="url"
                value={form.redirectUrl}
                onChange={(e) => updateField("redirectUrl", e.target.value)}
                placeholder="https://your-site.com/thank-you"
                className="input-field mt-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
            <div>
              <span className="font-body-sm text-ink">Show "Powered by WallProud"</span>
              {isFree && (
                <span className="ml-2 font-caption text-xs text-muted">(required on free plan)</span>
              )}
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={form.showPoweredBy}
                onChange={(e) => updateField("showPoweredBy", e.target.checked)}
                disabled={isFree}
                className="h-4 w-4 rounded border-hairline bg-surface-1 text-accent focus:ring-accent disabled:opacity-50"
              />
            </label>
          </div>

          <div>
            <p className="font-caption text-ink">Form Fields</p>
            <p className="font-caption mt-1 text-muted">Choose which fields to show in the collection form.</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {[
                { key: "show_rating", label: "Star Rating", type: "toggle" },
                { key: "show_name", label: "Name Field", type: "toggle" },
                { key: "show_email", label: "Email Field", type: "toggle" },
                { key: "show_company", label: "Company Field", type: "toggle" },
                { key: "show_role", label: "Role Field", type: "toggle" },
                { key: "show_video", label: "Video Upload", type: "toggle" },
                { key: "show_image", label: "Image Upload", type: "toggle" },
              ].map((field) => (
                <div key={field.key} className="flex items-center justify-between rounded-lg bg-surface-2 p-3">
                  <span className="font-body-sm text-ink">{field.label}</span>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={!!form.fieldConfig[field.key]}
                      onChange={(e) => updateFieldConfig(field.key, e.target.checked)}
                      className="h-4 w-4 rounded border-hairline bg-surface-1 text-accent focus:ring-accent"
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={saving || uploading} className="btn-primary">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CollectionsClient({
  collections, workspaceId, plan,
}: {
  collections: CollectionRequest[];
  workspaceId: string;
  plan: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const shareLink = useCallback((token: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/collect/${token}`;
  }, []);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter the recipient's email");
    setCreating(true);
    const res = await createCollection({
      workspaceId,
      recipientEmail: email.trim(),
      recipientName: name.trim(),
      expiresInDays: expiresInDays ? parseInt(expiresInDays) : null,
    });
    setCreating(false);
    if (res.error) return toast.error(res.error);
    if (!res.token) return toast.error("Something went wrong");
    toast.success("Collection link created");
    setJustCreated(res.token);
    setEmail(""); setName(""); setExpiresInDays("");
  }, [email, name, expiresInDays, workspaceId]);

  const copyLink = useCallback(async (token: string) => {
    const link = shareLink(token);
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(token);
      toast.success("Link copied");
      setTimeout(() => setCopiedId((c) => (c === token ? null : c)), 2000);
    } catch { toast.error("Could not copy link"); }
  }, [shareLink]);

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm("Delete this collection link?")) return;
    setDeletingId(id);
    const res = await deleteCollection(id);
    setDeletingId(null);
    if (res.error) return toast.error(res.error);
    toast.success("Collection deleted");
  }, []);

  const handleSaveEdit = useCallback(async (id: string, data: any) => {
    const res = await updateCollection(id, {
      title: data.title,
      description: data.description,
      buttonText: data.buttonText,
      thankYouMessage: data.thankYouMessage,
      brandColor: data.brandColor,
      fieldConfig: data.fieldConfig,
      redirectUrl: data.redirectUrl,
      logoImage: data.logoImage,
      showPoweredBy: data.showPoweredBy,
    });
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Collection updated");
    setEditingId(null);
  }, []);

  const editingCollection = collections.find(c => c.id === editingId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-md text-ink">Collections</h1>
        <p className="font-body mt-1 text-muted">
          Create a shareable link and send it to customers to collect real testimonials.
        </p>
      </div>

      <div className="card-hairline p-6">
        <p className="font-body-sm text-ink">New collection link</p>
        <p className="font-body mt-1 text-muted">
          Share the link with a customer. When they submit, their testimonial lands in
          your Testimonials page as &ldquo;pending&rdquo;.
        </p>
        <form onSubmit={handleCreate} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="font-caption text-muted">Recipient email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@company.com" className="input-field mt-1" />
          </div>
          <div>
            <label className="font-caption text-muted">Recipient name <span className="text-muted">(optional)</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="input-field mt-1" />
          </div>
          <div>
            <label className="font-caption text-muted">Expires in <span className="text-muted">(optional, days)</span></label>
            <input type="number" min={1} max={365} value={expiresInDays} onChange={(e) => setExpiresInDays(e.target.value)} placeholder="Never" className="input-field mt-1" />
          </div>
          <div className="flex items-end">
            <button type="submit" disabled={creating} className="btn-primary">
              <Plus className="h-4 w-4" />
              {creating ? "Creating..." : "Generate link"}
            </button>
          </div>
        </form>
        {justCreated && (
          <div className="mt-4 rounded-lg bg-surface-2 p-4">
            <p className="font-caption text-ink">Your collection link is ready — share it anywhere:</p>
            <div className="mt-2 flex items-center gap-2">
              <code className="flex-1 truncate rounded bg-surface-1 px-3 py-2 font-body-sm text-ink">
                {shareLink(justCreated)}
              </code>
              <button onClick={() => copyLink(justCreated)} className="btn-primary">
                {copiedId === justCreated ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      <Link href="/dashboard/collect-widget" className="card-hairline relative block overflow-hidden p-6 transition-colors hover:bg-surface-1">
        <div className="absolute right-4 top-4 rounded-pill bg-accent/10 px-3 py-1 font-caption text-accent">
          Live
        </div>
        <p className="font-body-sm text-ink">On-Site Collection Widget</p>
        <p className="font-body mt-1 text-muted">
          Embed a testimonial collection form directly on your website. Visitors submit without leaving your site.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Floating button", desc: "Bottom-right popup triggered by click, scroll, or exit intent" },
            { label: "Inline embed", desc: "Drop the form directly into any page section" },
            { label: "One line of code", desc: "Paste a single script tag and you're live" },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-surface-1 p-3">
              <p className="font-caption text-ink">{item.label}</p>
              <p className="font-caption mt-0.5 text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </Link>

      <div>
        <p className="font-body-sm mb-3 text-ink">Your collection links ({collections.length})</p>
        {collections.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-hairline py-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-1">
              <Link2 className="h-6 w-6 text-muted" />
            </div>
            <p className="font-body-sm mt-3 text-ink">No links yet</p>
            <p className="font-body mt-1 text-muted">Generate your first collection link above to start collecting.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {collections.map((c) => {
              const meta = statusMeta[c.status];
              const Icon = meta.icon;
              return (
                <div key={c.id} className="card-hairline flex flex-wrap items-center gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-body-sm truncate text-ink">{c.recipient_name || c.recipient_email}</p>
                      <span className={`inline-flex items-center gap-1 rounded-pill px-2 py-0.5 font-caption ${meta.className}`}>
                        <Icon className="h-3 w-3" />
                        {meta.label}
                      </span>
                    </div>
                    {c.recipient_name && <p className="font-caption truncate text-muted">{c.recipient_email}</p>}
                  </div>
                  {c.token && (
                    <div className="flex items-center gap-2">
                      <button onClick={() => copyLink(c.token!)} className="btn-secondary text-xs py-1.5 px-3">
                        {copiedId === c.token ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy link
                      </button>
                      <a href={`/collect/${c.token}`} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-1.5 px-3">
                        Preview
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingId(c.id)} className="rounded-lg p-1.5 text-muted hover:bg-surface-1 hover:text-ink" title="Customize">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id} className="rounded-lg p-1.5 text-muted hover:bg-surface-1 hover:text-ink disabled:opacity-50" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {editingCollection && (
        <EditModal
          collection={editingCollection}
          onClose={() => setEditingId(null)}
          onSave={handleSaveEdit}
          plan={plan}
        />
      )}
    </div>
  );
}
