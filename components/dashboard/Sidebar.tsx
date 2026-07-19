"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageSquare,
  Grid,
  Folder,
  Download,
  Settings,
  Menu,
  X,
  Sparkles,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import type { User, Workspace } from "@/types/database";
import PlanBadge from "./PlanBadge";

const navItems: { label: string; href: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
  { label: "Widgets", href: "/dashboard/widgets", icon: Grid },
  { label: "Collections", href: "/dashboard/collections", icon: Folder },
  { label: "On-Site Widget", href: "/dashboard/collect-widget", icon: Globe },
  { label: "Import", href: "/dashboard/import", icon: Download },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar({
  user,
  workspace,
}: {
  user: User;
  workspace: Workspace | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-1 lg:hidden"
      >
        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-hairline bg-canvas transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-hairline px-5">
          <Logo />
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 font-body-sm transition-colors",
                  isActive
                    ? "bg-surface-2 text-ink"
                    : "text-muted hover:bg-surface-1 hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
                {"badge" in item && item.badge && (
                  <span className="ml-auto rounded-pill bg-surface-2 px-2 py-0.5 font-caption text-muted">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-hairline px-4 py-4">
          {workspace && (
            <div className="mb-3 rounded-lg px-3 py-2">
              <p className="font-caption text-muted">Active workspace</p>
              <p className="font-body-sm truncate text-ink">
                {workspace.name}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <PlanBadge plan={user.plan} />
            {user.plan === "free" && (
              <Link
                href="/pricing"
                className="flex items-center gap-1 font-caption text-accent hover:underline"
              >
                <Sparkles className="h-3 w-3" />
                Upgrade
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
