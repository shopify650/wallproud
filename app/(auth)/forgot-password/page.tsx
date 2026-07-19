"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;

    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);

    // Call Supabase directly from the client so the PKCE code verifier
    // is stored in the browser (localStorage), not on the server.
    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      toast.error(resetError.message);
    } else {
      setSent(true);
      toast.success("Reset link sent to your email");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-16">
      <div className="hidden flex-1 lg:block">
        <h1 className="font-display-xxl text-ink">
          Reset your
          <br />
          password
        </h1>
        <p className="font-body-lg mt-6 max-w-sm text-muted">
          Enter your email address and we&apos;ll send you a secure link to set
          a new password.
        </p>
      </div>

      <div className="w-full max-w-sm">
        <div className="card-hairline p-8">
          <h2 className="font-display-md text-ink">Reset password</h2>
          <p className="font-body-sm mt-1 text-muted">
            {sent
              ? "Check your inbox for a link to set a new password."
              : "Enter your email and we'll send you a reset link."}
          </p>

          {sent ? (
            <div className="mt-6 flex items-center gap-3 rounded-lg bg-surface-1 px-4 py-3 font-body-sm text-muted">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
              We&apos;ve emailed you a password reset link. Check your inbox.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="email" className="font-body-sm block text-ink">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field mt-1"
                  placeholder="you@example.com"
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
                {loading ? "Sending..." : "Send reset link"}
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
