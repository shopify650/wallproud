"use client";

import { memo, useState, useRef, useEffect } from "react";
import { Trash2, Copy, Sparkles, Pencil, Star, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { toggleFeatured, deleteTestimonial } from "@/app/actions/testimonials";
import AddTestimonialModal from "./AddTestimonialModal";

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-surface-1 text-success",
  pending: "bg-surface-1 text-muted",
  rejected: "bg-surface-1 text-muted",
};

const SOURCE_LABELS: Record<string, string> = {
  manual: "Manual", email: "Email", google: "Google", twitter: "Twitter", import: "Import", phone: "Phone", other: "Other",
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3 w-3 ${i < rating ? "fill-ink text-ink" : "text-muted"}`} />
      ))}
    </div>
  );
}

export default memo(function TestimonialCard({
  testimonial,
  onRefresh,
  selected,
}: {
  testimonial: any;
  onRefresh: () => void;
  selected?: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleToggleFeatured = async () => {
    const res = await toggleFeatured(testimonial.id);
    if (res.error) toast.error(res.error);
    else { toast.success(res.featured ? "Featured!" : "Unfeatured"); onRefresh(); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this testimonial?")) return;
    const res = await deleteTestimonial(testimonial.id);
    if (res.error) toast.error(res.error);
    else { toast.success("Deleted"); onRefresh(); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testimonial.content);
    toast.success("Copied!");
  };

  return (
    <>
      <div className={`group relative rounded-xl border h-full flex flex-col p-4 transition ${
        selected ? "border-accent bg-surface-2" : "border-hairline bg-surface-1 hover:bg-surface-2"
      }`}>
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-2 overflow-hidden">
            {testimonial.author_image ? (
              <img src={testimonial.author_image} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-body-sm font-bold text-accent">{testimonial.author_name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="font-body-sm truncate text-ink">{testimonial.author_name}</p>
              {testimonial.featured && (
                <Sparkles className="h-3.5 w-3.5 shrink-0 fill-ink text-ink" />
              )}
              <div className="ml-auto flex shrink-0 items-center gap-2">
                <StarRating rating={testimonial.rating} />
                <span className="font-caption shrink-0 text-muted">{formatDate(testimonial.created_at)}</span>
              </div>
            </div>
            <p className="font-caption truncate text-muted">
              {[testimonial.author_company, testimonial.author_role].filter(Boolean).join(" \u00b7 ") || testimonial.author_email || ""}
            </p>
          </div>
        </div>

        <p className="font-body mt-3 leading-relaxed text-muted">
          &ldquo;{truncate(testimonial.content, 200)}&rdquo;
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
          <span className={`inline-flex items-center rounded-pill px-2 py-0.5 font-caption ${STATUS_COLORS[testimonial.status] || STATUS_COLORS.approved}`}>
            {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
          </span>
          {testimonial.source && (
            <span className="inline-flex items-center rounded-pill bg-surface-2 px-2 py-0.5 font-caption text-muted">
              {SOURCE_LABELS[testimonial.source] || testimonial.source}
            </span>
          )}
          {testimonial.tags?.slice(0, 3).map((tag: string) => (
            <span key={tag} className="rounded-pill bg-surface-2 px-2 py-0.5 font-caption text-muted">{tag}</span>
          ))}

          <div className="relative ml-auto shrink-0" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink">
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div className="card-surface-1 absolute right-0 top-full z-20 mt-1 w-40 overflow-hidden py-1 shadow-xl">
                <button onClick={() => { setMenuOpen(false); handleToggleFeatured(); }} className="flex w-full items-center gap-2 px-4 py-2 font-body-sm text-ink hover:bg-surface-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  {testimonial.featured ? "Unfeature" : "Feature"}
                </button>
                <button onClick={() => { setMenuOpen(false); setEditOpen(true); }} className="flex w-full items-center gap-2 px-4 py-2 font-body-sm text-ink hover:bg-surface-2">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button onClick={() => { setMenuOpen(false); handleCopy(); }} className="flex w-full items-center gap-2 px-4 py-2 font-body-sm text-ink hover:bg-surface-2">
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
                <div className="mx-2 my-1 border-t border-hairline" />
                <button onClick={() => { setMenuOpen(false); handleDelete(); }} className="flex w-full items-center gap-2 px-4 py-2 font-body-sm text-muted hover:bg-surface-2 hover:text-ink">
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {editOpen && <AddTestimonialModal open={editOpen} onClose={() => setEditOpen(false)} onSuccess={onRefresh} editTestimonial={testimonial} />}
    </>
  );
});
