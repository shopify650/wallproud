"use client";

import { useState } from "react";
import { LogOut, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { updateProfile } from "@/app/actions/auth";

export default function SettingsClient({
  email, fullName, workspaceName, workspaceSlug, plan,
}: {
  email: string; fullName: string; workspaceName: string; workspaceSlug: string; plan: string;
}) {
  const [name, setName] = useState(fullName);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaved(false);
    setLoading(true);
    const res = await updateProfile({ fullName: name });
    setLoading(false);
    if (res.success) { setSaved(true); toast.success("Profile updated"); }
    else { toast.error(res.error || "Update failed"); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-md text-ink">Settings</h1>
        <p className="font-body mt-1 text-muted">Manage your profile and workspace.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-hairline p-6">
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
        <p className="font-body-sm text-ink">Workspace</p>
        <dl className="mt-4 space-y-3 font-body">
          <div className="flex justify-between"><dt className="text-muted">Name</dt><dd className="font-body-sm text-ink">{workspaceName}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Slug</dt><dd className="font-body-sm font-mono text-ink">{workspaceSlug}</dd></div>
          <div className="flex justify-between"><dt className="text-muted">Plan</dt><dd className="font-body-sm capitalize text-ink">{plan}</dd></div>
        </dl>
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
