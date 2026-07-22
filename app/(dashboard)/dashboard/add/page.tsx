"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, X, Star, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { createTestimonial, uploadAuthorImage } from "@/app/actions/testimonials";

export default function AddTestimonialPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    author_name: "",
    author_email: "",
    author_company: "",
    author_role: "",
    content: "",
    rating: null as number | null,
    status: "approved",
  });
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [authorImage, setAuthorImage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadAuthorImage(fd);
    setLoading(false);

    if (res.error) {
      toast.error(res.error);
      setImagePreview(null);
      return;
    }

    setAuthorImage(res.url || "");
    if (res.url) {
      setImagePreview(res.url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const wsResp = await fetch("/api/workspace");
    const wsData = await wsResp.json();
    if (!wsData.id) {
      toast.error("Workspace not found");
      setLoading(false);
      return;
    }

    const res = await createTestimonial(wsData.id, {
      author_name: formData.author_name,
      author_email: formData.author_email,
      author_image: authorImage || undefined,
      author_company: formData.author_company,
      author_role: formData.author_role,
      content: formData.content,
      rating: formData.rating,
      tags: tags.length ? tags : undefined,
      status: formData.status as "approved" | "pending" | "rejected",
    });

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Testimonial added!");
      router.push("/dashboard/testimonials");
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link
          href="/dashboard/testimonials"
          className="font-caption inline-flex items-center gap-1 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to testimonials
        </Link>
        <h1 className="font-display-md mt-4 text-ink">Add testimonial</h1>
        <p className="font-body mt-1 text-muted">Manually input a testimonial from a customer</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card-hairline p-6">
          <p className="font-caption uppercase tracking-wider text-muted">Author details</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="font-body-sm block text-ink">
                Name <span className="text-muted">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.author_name}
                onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                placeholder="Jane Doe"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="font-body-sm block text-ink">Author Image</label>
              <div className="mt-1 flex items-center gap-3">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center">
                    <Upload className="h-4 w-4 text-muted" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-secondary text-xs"
                    disabled={loading}
                  >
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </button>
                  {imagePreview && authorImage && (
                    <button
                      type="button"
                      onClick={() => { setImagePreview(null); setAuthorImage(""); }}
                      className="ml-2 text-xs text-muted hover:text-ink"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-1 font-caption text-xs text-muted">PNG, JPG or WebP. Max 2MB.</p>
            </div>
            <div>
              <label className="font-body-sm block text-ink">Email</label>
              <input
                type="email"
                value={formData.author_email}
                onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                placeholder="jane@example.com"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="font-body-sm block text-ink">Company</label>
              <input
                type="text"
                value={formData.author_company}
                onChange={(e) => setFormData({ ...formData, author_company: e.target.value })}
                placeholder="Acme Inc"
                className="input-field mt-1"
              />
            </div>
            <div>
              <label className="font-body-sm block text-ink">Role</label>
              <input
                type="text"
                value={formData.author_role}
                onChange={(e) => setFormData({ ...formData, author_role: e.target.value })}
                placeholder="CEO"
                className="input-field mt-1"
              />
            </div>
          </div>
        </div>

        <div className="card-hairline p-6">
          <p className="font-caption uppercase tracking-wider text-muted">Content</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="font-body-sm block text-ink">
                Testimonial <span className="text-muted">*</span>
              </label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the testimonial here..."
                className="input-field mt-1"
              />
            </div>

            <div>
              <label className="font-body-sm block text-ink">Rating (optional)</label>
              <div className="mt-2 flex gap-1">
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
                      className={`h-8 w-8 transition ${
                        formData.rating && star <= formData.rating
                          ? "fill-ink text-ink"
                          : "text-muted"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card-hairline p-6">
          <p className="font-caption uppercase tracking-wider text-muted">Tags & Status</p>
          <div className="mt-4 space-y-4">
            <div>
              <label className="font-body-sm block text-ink">Tags</label>
              <div className="mt-1 flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addTag(); }
                  }}
                  placeholder="Add a tag..."
                  className="input-field flex-1"
                />
                <button type="button" onClick={addTag} className="btn-secondary p-2">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-pill bg-surface-1 px-3 py-1 font-caption text-muted"
                    >
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-muted hover:text-ink">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="font-body-sm block text-ink">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="input-field mt-1"
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href="/dashboard/testimonials" className="btn-secondary">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Adding..." : "Add testimonial"}
          </button>
        </div>
      </form>
    </div>
  );
}
