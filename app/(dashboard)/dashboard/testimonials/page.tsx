import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/auth-utils";
import TestimonialsClient from "./TestimonialsClient";

const ITEMS_PER_PAGE = 20;

async function TestimonialsData({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const workspace = await getCurrentWorkspace();

  if (!workspace) redirect("/login");

  const status = (resolvedParams.status === "approved" || resolvedParams.status === "pending" || resolvedParams.status === "rejected") ? resolvedParams.status : "all";
  const sort = resolvedParams.sort || "newest";
  const search = resolvedParams.search || "";
  const page = Math.max(1, parseInt(resolvedParams.page || "1"));
  const view = resolvedParams.view || "list";

  let query = supabase
    .from("testimonials")
    .select("*", { count: "exact" })
    .eq("workspace_id", workspace.id);

  if (status !== "all") {
    query = query.eq("status", status);
  }

  if (search) {
    const safe = search.replace(/[%_*(),'"]/g, "").trim().slice(0, 100);
    if (safe) {
      query = query.or(
        `author_name.ilike.%${safe}%,content.ilike.%${safe}%,author_company.ilike.%${safe}%`,
      );
    }
  }

  switch (sort) {
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "rating-high":
      query = query.order("rating", { ascending: false, nullsFirst: false });
      break;
    case "rating-low":
      query = query.order("rating", { ascending: true, nullsFirst: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;
  query = query.range(from, to);

  const { data: testimonials, count } = await query;

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  return (
    <TestimonialsClient
      testimonials={(testimonials || []) as any}
      count={count || 0}
      currentPage={page}
      totalPages={totalPages}
      currentStatus={status}
      currentSort={sort}
      currentSearch={search}
      currentView={view}
      workspaceId={workspace.id}
    />
  );
}

export default async function TestimonialsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-100" />
            ))}
          </div>
        </div>
      }
    >
      <TestimonialsData searchParams={searchParams} />
    </Suspense>
  );
}
