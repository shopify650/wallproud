"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { Workspace } from "@/types/database";

export default function DashboardHeader({
  workspace,
}: {
  workspace: Workspace | null;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-hairline bg-canvas/80 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="ml-10 lg:ml-0" />
        {workspace && (
          <div className="flex items-center gap-2">
            <h1 className="font-body-sm tracking-tight text-ink">
              {workspace.name}
            </h1>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/collections"
          className="btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          Collect Testimonial
        </Link>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-1 text-xs font-medium text-ink">
          {workspace?.name?.charAt(0).toUpperCase() || "W"}
        </div>
      </div>
    </header>
  );
}
