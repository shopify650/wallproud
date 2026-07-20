import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  MessageSquare,
  Grid,
  Eye,
  TrendingUp,
  ArrowRight,
  Star,
  Upload,
  ArrowUpRight,
  Link2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDashboardData } from "@/lib/dashboard-data";
import { DashboardSkeleton } from "@/components/dashboard/SkeletonLoader";
import PlanBadge from "@/components/dashboard/PlanBadge";

function FramerBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
      <svg className="absolute -right-40 -top-40 h-96 w-96 text-surface-1" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" stroke="currentColor" strokeOpacity={0.4} strokeWidth={2} />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
      </svg>
      <svg className="absolute -bottom-20 -left-20 h-64 w-64 text-surface-1" viewBox="0 0 200 200" fill="none">
        <rect x="20" y="20" width="160" height="160" rx="30" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
        <rect x="40" y="40" width="120" height="120" rx="20" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
      </svg>
    </div>
  );
}

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return null;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating ? "fill-ink text-ink" : "text-muted"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-1">
        <MessageSquare className="h-10 w-10 text-ink/60" />
      </div>
      <h2 className="font-display-md mt-6 text-ink">
        No testimonials yet
      </h2>
      <p className="mt-2 max-w-sm text-muted">
        Start collecting social proof from your customers. It only takes a
        minute to set up.
      </p>

      <Link
        href="/dashboard/collections"
        className="btn-primary mt-6 gap-2"
      >
        <Link2 className="h-4 w-4" />
        Create a collection link
      </Link>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        {[
          {
            icon: Link2,
            title: "1. Create a collection link",
            desc: "Get a shareable link for your customers",
          },
          {
            icon: Star,
            title: "2. Share with customers",
            desc: "Send via email, social media, or website",
          },
          {
            icon: MessageSquare,
            title: "3. Watch them roll in",
            desc: "Testimonials appear here automatically",
          },
        ].map((step) => (
          <div key={step.title} className="card-hairline p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-1">
              <step.icon className="h-5 w-5 text-muted" />
            </div>
            <h3 className="font-display-md mt-4 text-ink">{step.title}</h3>
            <p className="font-body mt-1 text-muted">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

async function DashboardContent() {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const { profile, workspace } = await getDashboardData(authUser.id);

  if (!profile || !workspace) redirect("/login");

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [totalTestimonialsResult, thisMonthTestimonialsResult, totalWidgetsResult, recentTestimonialsResult, totalViewsResult] = await Promise.all([
    supabase.from("testimonials").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase.from("testimonials").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id).gte("created_at", firstOfMonth),
    supabase.from("widgets").select("*", { count: "exact", head: true }).eq("workspace_id", workspace.id),
    supabase.from("testimonials").select("*").eq("workspace_id", workspace.id).eq("status", "approved").order("created_at", { ascending: false }).limit(5),
    supabase.from("widgets").select("views_count").eq("workspace_id", workspace.id),
  ]);

  const totalTestimonials = totalTestimonialsResult.count || 0;
  const thisMonthTestimonials = thisMonthTestimonialsResult.count || 0;
  const totalWidgets = totalWidgetsResult.count || 0;
  const recentTestimonials = recentTestimonialsResult.data;
  const totalViews = totalViewsResult.data?.reduce((sum, w) => sum + (w.views_count || 0), 0) || 0;

  const firstName = profile.full_name?.split(" ")[0] || "there";

  return (
    <>
      <FramerBg />
      <div className="relative z-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display-md text-ink">
            Welcome back, {firstName}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm text-muted">{profile.plan === "free" ? "Free" : profile.plan === "starter" || profile.plan === "pro" ? "Pro" : "Agency"} plan</span>
            <PlanBadge plan={profile.plan} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Testimonials", value: totalTestimonials || 0, icon: MessageSquare },
          { label: "Total Widgets", value: totalWidgets || 0, icon: Grid },
          { label: "Widget Views", value: totalViews, icon: Eye },
          { label: "Collected This Month", value: thisMonthTestimonials || 0, icon: TrendingUp },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="card-hairline p-5"
            >
              <div className="flex items-center justify-between">
                <span className="font-caption text-muted">{stat.label}</span>
                <div className="rounded-lg bg-surface-1 p-2">
                  <Icon className="h-4 w-4 text-muted" />
                </div>
              </div>
              <p className="font-display-md mt-3 text-ink">
                {stat.value.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {(totalTestimonials || 0) === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="font-display-md text-ink">
                Recent Testimonials
              </h2>
              <Link
                href="/dashboard/testimonials"
                className="font-caption text-accent hover:underline"
              >
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentTestimonials?.length === 0 ? (
                <p className="font-body py-8 text-center text-muted">
                  No testimonials collected yet.
                </p>
              ) : (
                recentTestimonials?.map((t) => (
                  <div
                    key={t.id}
                    className="card-hairline p-4 transition hover:bg-surface-2"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 text-sm font-medium text-ink">
                          {t.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-body-sm text-ink">
                            {t.author_name}
                          </p>
                          <p className="font-caption text-muted">
                            {t.author_company || ""}
                            {t.author_company && t.author_role ? " · " : ""}
                            {t.author_role || ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <StarRating rating={t.rating} />
                        <span className="font-caption text-muted">
                          {formatDate(t.created_at)}
                        </span>
                      </div>
                    </div>
                    <p className="font-body mt-3 leading-relaxed text-muted">
                      &ldquo;{truncate(t.content, 200)}&rdquo;
                    </p>
                    {t.tags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {t.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-pill bg-surface-1 px-2 py-0.5 font-caption text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="font-display-md text-ink">
              Quick Actions
            </h2>
            <div className="mt-4 space-y-3">
              <Link
                href="/dashboard/collections"
                className="flex items-center gap-4 rounded-lg border border-hairline bg-surface-card p-4 transition hover:border-muted-soft"
              >
                <div className="rounded-lg bg-surface-1 p-2">
                  <Link2 className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <p className="font-body-sm text-ink">Collect Testimonial</p>
                  <p className="font-caption text-muted">Share your collection link</p>
                </div>
              </Link>

              <Link
                href="/dashboard/widgets"
                className="flex items-center gap-4 rounded-lg border border-hairline bg-surface-card p-4 transition hover:border-muted-soft"
              >
                <div className="rounded-lg bg-surface-1 p-2">
                  <Grid className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <p className="font-body-sm text-ink">Create Widget</p>
                  <p className="font-caption text-muted">Display testimonials on your site</p>
                </div>
              </Link>

              <Link
                href="/dashboard/import"
                className="flex items-center gap-4 rounded-lg border border-hairline bg-surface-card p-4 transition hover:border-muted-soft"
              >
                <div className="rounded-lg bg-surface-1 p-2">
                  <Upload className="h-5 w-5 text-muted" />
                </div>
                <div>
                  <p className="font-body-sm text-ink">Import Testimonials</p>
                  <p className="font-caption text-muted">Bulk import from CSV or other sources</p>
                </div>
              </Link>

              {profile.plan === "free" && (
                <Link
                  href="/pricing"
                className="flex items-center gap-4 card-hairline p-4 transition hover:bg-surface-2"
                >
                  <div className="rounded-lg bg-surface-1 p-2">
                    <ArrowUpRight className="h-5 w-5 text-muted" />
                  </div>
                  <div>
                    <p className="font-body-sm text-ink">Upgrade Plan</p>
                    <p className="font-caption text-muted">
                      Unlock unlimited testimonials
                    </p>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}
