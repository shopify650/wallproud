"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { updatePassword } from "@/app/actions/auth";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(true);
  const [error, setError] = useState("");
  const [sessionReady, setSessionReady] = useState(false);

  // Exchange the code from the URL for a real session
  useEffect(() => {
    const code = searchParams.get("code");

    async function exchange() {
      if (!code) {
        setError("Invalid or expired reset link. Please request a new one.");
        setExchanging(false);
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        setError("This reset link has expired or already been used. Please request a new one.");
      } else {
        setSessionReady(true);
      }
      setExchanging(false);
    }

    exchange();
  }, [searchParams]);

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

          {/* Loading state while exchanging code */}
          {exchanging && (
            <div className="mt-6 flex items-center gap-3 font-body-sm text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying reset link...
            </div>
          )}

          {/* Error state (expired/invalid link) */}
          {!exchanging && !sessionReady && (
            <div className="mt-6 space-y-4">
              <div className="rounded-md bg-surface-1 px-3 py-2 font-body-sm text-muted">
                {error}
              </div>
              <Link
                href="/forgot-password"
                className="btn-primary w-full justify-center"
              >
                Request a new link
              </Link>
            </div>
          )}

          {/* Password form — only shown once session is ready */}
          {!exchanging && sessionReady && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="password" className="font-body-sm block text-ink">
                  New password
                </label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="input-field mt-0 pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="font-body-sm block text-ink">
                  Confirm password
                </label>
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                  <input
                    id="confirm"
                    name="confirm"
                    type="password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    className="input-field mt-0 pl-10"
                    placeholder="••••••••"
                  />
                </div>
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
