"use client";

import { useState } from "react";
import { LogOut, Loader2, CheckCircle2, Pencil, Trash2, Plus, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "@/app/actions/auth";
import { updateWorkspace as updateWorkspaceAction, deleteWorkspace as deleteWorkspaceAction, createWorkspace } from "@/app/actions/workspaces";
import type { Workspace } from "@/types/database";

export default function SettingsClient({
  email, fullName, workspaceName, workspaceSlug, plan, workspaces, currentWorkspaceId,
}: {
  email: string; fullName: string; workspaceName: string; workspaceSlug: string; plan: string;
  workspaces: Workspace[]; currentWorkspaceId: string;
}) {
  const [name, setName] = useState(fullName);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState<string | null>(null);
  const [workspaceNameEdit, setWorkspaceNameEdit] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setLoading(true);
    const res = await updateProfile({ fullName: name });
    setLoading(false);
    if (res.success) { setSaved(true); toast.success("Profile updated"); }
    else { toast.error(res.error || "Update failed"); }
  }

  async function handleWorkspaceUpdate(id: string, name: string) {
    const res = await updateWorkspaceAction({ workspaceId: id, name });
    if (res.success) {
      toast.success("Workspace updated");
      setEditingWorkspace(null);
    } else {
      toast.error(res.error || "Update failed");
    }
  }

  async function handleDeleteWorkspace(id: string) {
    if (workspaces.length <= 1) {
      toast.error("You must have at least one workspace");
      return;
    }
    if (!confirm("Delete this workspace? All data will be lost.")) return;
    setDeletingId(id);
    const res = await deleteWorkspaceAction(id);
    setDeletingId(null);
    if (res.success) {
      toast.success("Workspace deleted");
    } else {
      toast.error(res.error || "Delete failed");
    }
  }

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    setCreating(true);
    const res = await createWorkspace(newWorkspaceName.trim());
    setCreating(false);
    if (res.success) {
      toast.success("Workspace created");
      setNewWorkspaceName("");
    } else {
      toast.error(res.error || "Failed to create workspace");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-md text-ink">Settings</h1>
        <p className="font-body mt-1 text-muted">Manage your profile and workspaces.</p>
      </div>

      <form onSubmit={handleProfileSubmit} className="card-hairline p-6">
        <p className="font-body-sm text-ink">Profile</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="fullName" className="font-body-sm block text-ink">Display name</label>
            <input id="fullName" value={name} onChange={(e) => setName(e.target.value)} className="input-field mt-1" />
          </div>
          <div>
            <label htmlFor="email" className="font-body-sm block text-ink">Email</label>
            <input id="email" value={email} disabled className="input-field mt-1 opacity-50" />
          </div>
        </div>
        {saved && <div className="mt-3 flex items-center gap-2 font-body-sm text-success"><CheckCircle2 className="h-4 w-4" />Saved</div>}
        <button type="submit" disabled={loading} className="btn-primary mt-5">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div className="card-hairline p-6">
        <div className="flex items-center justify-between">
          <p className="font-body-sm text-ink">Workspaces ({workspaces.length})</p>
          <form onSubmit={handleCreateWorkspace} className="flex gap-2">
            <input
              type="text"
              value={newWorkspaceName}
              onChange={(e) => setNewWorkspaceName(e.target.value)}
              placeholder="New workspace..."
              className="input-field py-1.5 text-xs"
              maxLength={100}
            />
            <button
              type="submit"
              disabled={creating || !newWorkspaceName.trim()}
              className="btn-primary py-1.5 px-3"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        <div className="mt-4 space-y-2">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
                ws.id === currentWorkspaceId ? "bg-surface-2" : "hover:bg-surface-1"
              }`}
            >
              {editingWorkspace === ws.id ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    type="text"
                    value={workspaceNameEdit}
                    onChange={(e) => setWorkspaceNameEdit(e.target.value)}
                    className="input-field flex-1 py-1.5 text-xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleWorkspaceUpdate(ws.id, workspaceNameEdit);
                      if (e.key === "Escape") setEditingWorkspace(null);
                    }}
                  />
                  <button
                    onClick={() => handleWorkspaceUpdate(ws.id, workspaceNameEdit)}
                    className="rounded-md p-1 text-success hover:bg-surface-2"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setEditingWorkspace(null)}
                    className="rounded-md p-1 text-muted hover:bg-surface-2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="font-body-sm truncate text-ink">{ws.name}</p>
                    <p className="font-caption truncate text-muted">{ws.slug}</p>
                  </div>
                  {ws.id === currentWorkspaceId && (
                    <span className="rounded-pill bg-surface-2 px-2 py-0.5 font-caption text-accent">Active</span>
                  )}
                  <button
                    onClick={() => {
                      setWorkspaceNameEdit(ws.name);
                      setEditingWorkspace(ws.id);
                    }}
                    className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-ink"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteWorkspace(ws.id)}
                    disabled={deletingId === ws.id}
                    className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="card-hairline p-6">
        <p className="font-body-sm text-ink">Session</p>
        <p className="font-body mt-1 text-muted">Sign out of your WallProud account on this device.</p>
        <form action="/auth/signout" method="post" className="mt-4">
          <button type="submit" className="btn-secondary">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </form>
      </div>
    </div>
  );
}
