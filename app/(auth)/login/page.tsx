"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { signIn } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);

    if (result.success) {
      toast.success("Welcome back!");
      router.push("/dashboard");
    } else {
      setError(result.error || "Invalid email or password");
      toast.error(result.error || "Invalid email or password");
    }
  }

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-16">
      <div className="hidden flex-1 lg:block">
        <h1 className="font-display-xxl text-ink">
          Showcase
          <br />
          testimonials
        </h1>
        <p className="font-body-lg mt-6 max-w-sm text-muted">
          Collect, curate, and display social proof that converts visitors into
          customers.
        </p>
        <div className="mt-8 space-y-3">
          {[
            "Collect testimonials from multiple sources",
            "Beautiful customizable widgets for any site",
            "AI-powered tagging and insights",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-1">
                <div className="h-1.5 w-1.5 rounded-full bg-muted" />
              </div>
              <span className="font-body text-muted">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="card-hairline p-8">
          <h2 className="font-display-md text-ink">Sign in</h2>
          <p className="font-body-sm mt-1 text-muted">
            Welcome back! Enter your credentials.
          </p>

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

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="font-body-sm text-ink">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="font-caption text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center font-body-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-medium text-ink hover:text-muted">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
