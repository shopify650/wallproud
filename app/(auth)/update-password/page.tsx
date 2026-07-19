"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePassword } from "@/app/actions/auth";
import { Suspense } from "react";

function UpdatePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Show error if redirected back from callback with error flag
  const linkError = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await updatePassword(password);
    setLoading(false);

    if (result.success) {
      toast.success("Password updated!");
      router.push("/dashboard");
    } else {
      setError(result.error || "Something went wrong");
      toast.error(result.error || "Something went wrong");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-16">
      <div className="hidden flex-1 lg:block">
        <h1 className="font-display-xxl text-ink">
          Set a new
          <br />
          password
        </h1>
        <p className="font-body-lg mt-6 max-w-sm text-muted">
          Choose a strong password to keep your account safe.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="card-hairline p-8">
          <h2 className="font-display-md text-ink">Set a new password</h2>
          <p className="font-body-sm mt-1 text-muted">
            Choose a new password for your account.
          </p>

          {/* Invalid/expired link */}
          {linkError ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-md bg-surface-1 px-3 py-2 font-body-sm text-muted">
                This reset link has expired or already been used. Please request a new one.
              </div>
              <Link href="/forgot-password" className="btn-primary w-full justify-center">
                Request a new link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="font-body-sm block text-ink">
                  New password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="input-field mt-1"
                    placeholder="••••••••"
                  />
              </div>

              <div>
                <label htmlFor="confirm" className="font-body-sm block text-ink">
                  Confirm password
                </label>
                <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="input-field mt-1"
                    placeholder="••••••••"
                  />
              </div>

              {error && (
                <div className="rounded-md bg-surface-1 px-3 py-2 font-body-sm text-muted">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
                {loading ? "Updating..." : "Update password"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center font-body-sm text-muted">
            <Link href="/login" className="font-medium text-ink hover:text-muted">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center gap-3 font-body-sm text-muted">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading...
      </div>
    }>
      <UpdatePasswordForm />
    </Suspense>
  );
}
