"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Link2, Copy, Check, Plus, Trash2, Send, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { createCollection, deleteCollection } from "@/app/actions/collect";

type CollectionRequest = {
  id: string;
  workspace_id: string;
  recipient_email: string;
  recipient_name: string | null;
  status: "pending" | "sent" | "completed" | "expired";
  token: string | null;
  expires_at: string | null;
  created_at: string;
};

const statusMeta: Record<CollectionRequest["status"], { label: string; icon: typeof Clock; className: string }> = {
  pending:   { label: "Active",    icon: Clock,        className: "bg-surface-1 text-accent" },
  sent:      { label: "Sent",     icon: Send,          className: "bg-surface-1 text-ink" },
  completed: { label: "Completed",icon: CheckCircle2,  className: "bg-surface-1 text-success" },
  expired:   { label: "Expired",  icon: XCircle,       className: "bg-surface-1 text-muted" },
};

export default function CollectionsClient({
  collections, workspaceId,
}: {
  collections: CollectionRequest[];
  workspaceId: string;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [expiresInDays, setExpiresInDays] = useState("");
  const [creating, setCreating] = useState(false);
  const [justCreated, setJustCreated] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const shareLink = useCallback((token: string) => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/collect/${token}`;
  }, []);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter the recipient's email");
    setCreating(true);
    const res = await createCollection({ workspaceId, recipientEmail: email.trim(), recipientName: name.trim(), expiresInDays: expiresInDays ? parseInt(expiresInDays) : null });
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
                  <button onClick={() => handleDelete(c.id)} disabled={deletingId === c.id} className="rounded-lg p-1.5 text-muted hover:bg-surface-1 hover:text-ink disabled:opacity-50" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
