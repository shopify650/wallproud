"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Check,
  MoreHorizontal,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { bulkUpdateTestimonials, deleteTestimonial } from "@/app/actions/testimonials";
import TestimonialCard from "@/components/testimonials/TestimonialCard";
import AddTestimonialModal from "@/components/testimonials/AddTestimonialModal";

function GridIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} />
      <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} />
      <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} />
      <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill={active ? "currentColor" : "none"} />
    </svg>
  );
}

function ListIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="14" height="3" rx="1.5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="6.5" width="14" height="3" rx="1.5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="12" width="14" height="3" rx="1.5" fill={active ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SelectAllCheck({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="flex items-center gap-2 font-caption text-muted hover:text-ink">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="0.5" y="0.5" width="13" height="13" rx="3" stroke="currentColor" strokeWidth="1.5" fill={checked ? "currentColor" : "none"} />
        {checked && <path d="M4 7L6.5 9.5L10 5" stroke="#090909" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />}
      </svg>
      {checked ? "Deselect all" : "Select all"}
    </button>
  );
}

export default function TestimonialsClient({
  testimonials,
  count,
  currentPage,
  totalPages,
  currentStatus,
  currentSort,
  currentSearch,
  currentView,
  workspaceId: _workspaceId,
}: {
  testimonials: any[];
  count: number;
  currentPage: number;
  totalPages: number;
  currentStatus: string;
  currentSort: string;
  currentSearch: string;
  currentView: string;
  workspaceId: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [view, setView] = useState(currentView);
  const [addOpen, setAddOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all" && value !== "newest") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      if (key !== "page") params.delete("page");
      router.push(`/dashboard/testimonials?${params.toString()}`);
    },
    [router, searchParams],
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParam("search", searchInput);
    },
    [searchInput, updateParam],
  );

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === testimonials.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(testimonials.map((t: any) => t.id)));
    }
  }, [selectedIds, testimonials]);

  const handleBulkAction = useCallback(
    async (action: string) => {
      if (selectedIds.size === 0) return;
      const ids = Array.from(selectedIds);
      if (action === "delete") {
        for (const id of ids) await deleteTestimonial(id);
        toast.success(`Deleted ${ids.length}`);
      } else {
        const res = await bulkUpdateTestimonials(ids, { status: action });
        if (res.error) return toast.error(res.error);
        toast.success(`${ids.length} marked as ${action}`);
      }
      setSelectedIds(new Set());
      router.refresh();
    },
    [selectedIds, router],
  );

  const handleRefresh = useCallback(() => router.refresh(), [router]);

  const isEmpty = testimonials.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-md text-ink">Testimonials</h1>
          <p className="font-body text-muted">{count} testimonial{count !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(!menuOpen)} className="btn-secondary">
              <Plus className="h-4 w-4" />
              Add
            </button>
            {menuOpen && (
              <div className="card-surface-1 absolute right-0 top-full z-20 mt-1 w-48 overflow-hidden py-1 shadow-xl">
                <button onClick={() => { setMenuOpen(false); setAddOpen(true); }} className="flex w-full items-center gap-2 px-4 py-2 font-body-sm text-ink hover:bg-surface-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v12M1 7h12" strokeLinecap="round" /></svg>
                  Manually
                </button>
                <Link href="/dashboard/import" onClick={() => setMenuOpen(false)} className="flex w-full items-center gap-2 px-4 py-2 font-body-sm text-ink hover:bg-surface-2">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 1v8M3 5l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 11v1.5A1.5 1.5 0 002.5 14h9a1.5 1.5 0 001.5-1.5V11" strokeLinecap="round" /></svg>
                  Import CSV
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="w-full sm:max-w-xs sm:flex-1">
          <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name, company, content..." className="input-field w-full rounded-lg" />
        </form>

        <select value={currentStatus} onChange={(e) => updateParam("status", e.target.value)} className="input-field rounded-lg">
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select value={currentSort} onChange={(e) => updateParam("sort", e.target.value)} className="input-field rounded-lg">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="rating-high">Rating: High-Low</option>
          <option value="rating-low">Rating: Low-High</option>
        </select>

        <div className="flex rounded-lg border border-hairline">
          <button onClick={() => { setView("list"); updateParam("view", "list"); }} className={`rounded-l-lg p-2 ${view === "list" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"}`}>
            <ListIcon active={view === "list"} />
          </button>
          <button onClick={() => { setView("grid"); updateParam("view", "grid"); }} className={`rounded-r-lg border-l border-hairline p-2 ${view === "grid" ? "bg-surface-2 text-ink" : "text-muted hover:text-ink"}`}>
            <GridIcon active={view === "grid"} />
          </button>
        </div>
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg bg-surface-2 px-4 py-3">
          <span className="font-body-sm text-ink">{selectedIds.size} selected</span>
          <button onClick={() => handleBulkAction("approved")} className="rounded-lg bg-success px-3 py-1.5 font-caption text-canvas hover:opacity-80">Approve</button>
          <button onClick={() => handleBulkAction("pending")} className="rounded-lg bg-surface-1 px-3 py-1.5 font-caption text-muted hover:text-ink">Pending</button>
          <button onClick={() => handleBulkAction("rejected")} className="rounded-lg bg-surface-1 px-3 py-1.5 font-caption text-muted hover:text-ink">Reject</button>
          <button onClick={() => handleBulkAction("delete")} className="rounded-lg border border-hairline px-3 py-1.5 font-caption text-muted hover:bg-surface-1 hover:text-ink">Delete</button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto font-caption text-muted hover:text-ink">Clear</button>
        </div>
      )}

      <SelectAllCheck checked={selectedIds.size === testimonials.length && testimonials.length > 0} onChange={toggleSelectAll} />

      {isEmpty ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-1">
            <MessageSquare className="h-8 w-8 text-muted" />
          </div>
          <h3 className="font-display-md mt-4 text-ink">
            {currentSearch || currentStatus !== "all" ? "No testimonials match your filters" : "No testimonials yet"}
          </h3>
          <p className="font-body mt-1 text-muted">
            {currentSearch || currentStatus !== "all" ? "Try adjusting your search or filter criteria" : "Start collecting social proof from your customers"}
          </p>
          {!currentSearch && currentStatus === "all" && (
            <button onClick={() => setAddOpen(true)} className="btn-primary mt-6">Collect Your First Testimonial</button>
          )}
        </div>
      ) : (
        <div className={view === "grid" ? "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" : "space-y-3"}>
          {testimonials.map((t: any) => (
            <div key={t.id} className="relative">
              <button
                onClick={() => toggleSelect(t.id)}
                className={`absolute left-3 top-4 z-10 transition-opacity ${selectedIds.has(t.id) ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              >
                <div className={`flex h-5 w-5 items-center justify-center rounded border ${selectedIds.has(t.id) ? "border-accent bg-accent" : "border-hairline bg-surface-1"}`}>
                  {selectedIds.has(t.id) && <Check className="h-3 w-3 text-canvas" />}
                </div>
              </button>
              <TestimonialCard testimonial={t} onRefresh={handleRefresh} selected={selectedIds.has(t.id)} />
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={currentPage <= 1} onClick={() => updateParam("page", String(currentPage - 1))} className="rounded-lg border border-hairline p-2 text-muted hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, idx, arr) => (
            <span key={p} className="flex items-center gap-1">
              {idx > 0 && arr[idx - 1] !== p - 1 && <span className="px-1 font-caption text-muted">...</span>}
              <button onClick={() => updateParam("page", String(p))} className={`min-w-[36px] rounded-lg px-3 py-2 font-body-sm ${p === currentPage ? "bg-primary text-on-primary" : "border border-hairline text-muted hover:bg-surface-1 hover:text-ink"}`}>{p}</button>
            </span>
          ))}
          <button disabled={currentPage >= totalPages} onClick={() => updateParam("page", String(currentPage + 1))} className="rounded-lg border border-hairline p-2 text-muted hover:bg-surface-1 disabled:cursor-not-allowed disabled:opacity-40">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <AddTestimonialModal open={addOpen} onClose={() => setAddOpen(false)} onSuccess={() => { handleRefresh(); setSelectedIds(new Set()); }} />
    </div>
  );
}
