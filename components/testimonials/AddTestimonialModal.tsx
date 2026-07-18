"use client";

import { useState, useEffect } from "react";
import { X, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";
import {
  createTestimonial,
  updateTestimonial,
} from "@/app/actions/testimonials";

type AddTestimonialModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editTestimonial?: any;
};

const defaultForm = {
  author_name: "",
  author_email: "",
  author_company: "",
  author_role: "",
  content: "",
  rating: null,
  source: "manual",
  status: "approved",
  tags: [],
} as any;

export default function AddTestimonialModal({
  open,
  onClose,
  onSuccess,
  editTestimonial,
}: AddTestimonialModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (open) {
      setFormData(
        editTestimonial
          ? {
              author_name: editTestimonial.author_name || "",
              author_email: editTestimonial.author_email || "",
              author_company: editTestimonial.author_company || "",
              author_role: editTestimonial.author_role || "",
              content: editTestimonial.content || "",
              rating: editTestimonial.rating || null,
              source: editTestimonial.source || "manual",
              status: editTestimonial.status || "approved",
              tags: editTestimonial.tags || [],
            }
          : defaultForm,
      );
      setTagInput("");
    }
  }, [editTestimonial, open]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !formData.tags.includes(t)) {
      setFormData({ ...formData, tags: [...formData.tags, t] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t: string) => t !== tag),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (editTestimonial) {
      const res = await updateTestimonial(editTestimonial.id, {
        author_name: formData.author_name,
        author_email: formData.author_email,
        author_company: formData.author_company,
        author_role: formData.author_role,
        content: formData.content,
        rating: formData.rating,
        source: formData.source,
        tags: formData.tags.length ? formData.tags : undefined,
        status: formData.status,
      });
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      toast.success("Updated!");
    } else {
      const wsResp = await fetch("/api/workspace");
      const wsData = await wsResp.json();
      if (!wsData.id) {
        toast.error("Workspace not found");
        setLoading(false);
        return;
      }
      const res = await createTestimonial(wsData.id, formData);
      if (res.error) {
        toast.error(res.error);
        setLoading(false);
        return;
      }
      toast.success("Testimonial added!");
    }

    setLoading(false);
    onSuccess();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-canvas/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="card-surface-1 relative z-10 mx-auto max-h-[90vh] w-full max-w-lg overflow-y-auto p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display-md text-ink">
            {editTestimonial ? "Edit Testimonial" : "Add Testimonial"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-surface-2 hover:text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-body-sm block text-ink">
                Name <span className="text-accent">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author_name}
                onChange={(e) =>
                  setFormData({ ...formData, author_name: e.target.value })
                }
                placeholder="Jane Doe"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="font-body-sm block text-ink">
                Email
              </label>
              <input
                type="email"
                value={formData.author_email}
                onChange={(e) =>
                  setFormData({ ...formData, author_email: e.target.value })
                }
                placeholder="jane@example.com"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="font-body-sm block text-ink">
                Company
              </label>
              <input
                type="text"
                value={formData.author_company}
                onChange={(e) =>
                  setFormData({ ...formData, author_company: e.target.value })
                }
                placeholder="Acme Inc"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="font-body-sm block text-ink">
                Role
              </label>
              <input
                type="text"
                value={formData.author_role}
                onChange={(e) =>
                  setFormData({ ...formData, author_role: e.target.value })
                }
                placeholder="CEO"
                className="input-field mt-1"
              />
            </div>
          </div>

          <div>
            <label className="font-body-sm block text-ink">
              Testimonial <span className="text-accent">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Write the testimonial here..."
              className="input-field mt-1"
            />
          </div>

          <div>
            <label className="font-body-sm block text-ink">
              Rating
            </label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      rating: formData.rating === star ? null : star,
                    });
                  }}
                  className="cursor-pointer"
                >
                  <Star
                    className={`h-7 w-7 transition ${
                      formData.rating && star <= formData.rating
                        ? "fill-ink text-ink"
                        : "text-muted"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-body-sm block text-ink">
                Source
              </label>
              <select
                value={formData.source}
                onChange={(e) =>
                  setFormData({ ...formData, source: e.target.value })
                }
                className="input-field mt-1"
              >
                <option value="manual">Manual</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-body-sm block text-ink">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="input-field mt-1"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-body-sm block text-ink">
              Tags
            </label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Type and press enter"
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addTag}
                className="btn-secondary p-2"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-pill bg-surface-2 px-2.5 py-1 font-caption text-muted"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-muted hover:text-ink"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
            >
              {loading
                ? "Saving..."
                : editTestimonial
                  ? "Save changes"
                  : "Add testimonial"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
