"use client";

import { useState, useCallback } from "react";
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
  ArrowUpRight,
  Globe,
  ChevronDown,
  Plus,
  Check,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { switchWorkspace, createWorkspace } from "@/app/actions/workspaces";
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
  workspaces,
  maxWorkspaces,
}: {
  user: User;
  workspace: Workspace | null;
  workspaces: Workspace[];
  maxWorkspaces: number;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [switchingId, setSwitchingId] = useState<string | null>(null);

  const atLimit = workspaces.length >= maxWorkspaces;

  const handleSwitch = useCallback(async (id: string) => {
    if (id === workspace?.id) {
      setShowSwitcher(false);
      return;
    }
    setSwitchingId(id);
    setShowSwitcher(false);
    const res = await switchWorkspace(id);
    setSwitchingId(null);
    if (!res.success) {
      toast.error(res.error || "Failed to switch workspace");
    }
  }, [workspace?.id]);

  const handleCreate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await createWorkspace(newName.trim());
    setCreating(false);
    if (res.success && res.data) {
      setNewName("");
      toast.success("Workspace created");
    } else {
      toast.error(res.error || "Failed to create workspace");
    }
  }, [newName]);

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
          <div className="flex items-center justify-between">
            <PlanBadge plan={user.plan} />
            {user.plan === "free" && (
              <Link
                href="/pricing"
                className="flex items-center gap-1 font-caption text-accent hover:underline"
              >
                <ArrowUpRight className="h-3 w-3" />
                Upgrade
              </Link>
            )}
          </div>

          {workspace && (
            <div className="mt-3">
              <button
                onClick={() => setShowSwitcher(!showSwitcher)}
                disabled={switchingId !== null}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-surface-1 disabled:opacity-50"
              >
                <div className="min-w-0">
                  <p className="font-caption text-muted">Active workspace</p>
                  <p className="font-body-sm truncate text-ink">
                    {workspace.name}
                  </p>
                </div>
                {switchingId ? (
                  <Loader2 className="h-4 w-4 shrink-0 text-muted animate-spin" />
                ) : (
                  <ChevronDown className={`h-4 w-4 shrink-0 text-muted transition-transform ${showSwitcher ? "rotate-180" : ""}`} />
                )}
              </button>

              {showSwitcher && (
                <div className="mt-2 rounded-lg border border-hairline bg-surface-1">
                  <div className="max-h-48 overflow-y-auto p-1">
                    {workspaces.map((ws) => {
                      const isActive = ws.id === workspace?.id;
                      const isSwitching = ws.id === switchingId;
                      return (
                        <button
                          key={ws.id}
                          onClick={() => handleSwitch(ws.id)}
                          disabled={isSwitching}
                          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-surface-2 disabled:opacity-50"
                        >
                          <span className="flex-1 truncate font-body-sm text-ink">
                            {isSwitching ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                Switching...
                              </span>
                            ) : (
                              ws.name
                            )}
                          </span>
                          {isActive && !isSwitching && <Check className="h-3.5 w-3.5 text-success" />}
                        </button>
                      );
                    })}
                  </div>

                  <form onSubmit={handleCreate} className="border-t border-hairline p-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder={atLimit ? `Limit reached (${maxWorkspaces})` : "New workspace..."}
                        className="input-field flex-1 py-1.5 text-xs"
                        maxLength={100}
                        disabled={atLimit}
                      />
                      <button
                        type="submit"
                        disabled={creating || !newName.trim() || atLimit}
                        className="rounded-md bg-surface-2 p-1.5 text-ink hover:bg-hairline disabled:opacity-50"
                      >
                        {creating ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Plus className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                    {atLimit && (
                      <p className="mt-1 font-caption text-muted">
                        Upgrade your plan to add more workspaces
                      </p>
                    )}
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
