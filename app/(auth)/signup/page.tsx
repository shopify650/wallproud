"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, Eye, EyeOff, Check } from "lucide-react";
import toast from "react-hot-toast";
import { signUp } from "@/app/actions/auth";

function getPasswordStrength(password: string): {
  score: number;
  label: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Z genotypesZ-a-z0-9]/.test(password)) score++;
  if (score <= 1) return { score, label: "Weak" };
  if (score <= 3) return { score, label: "Fair" };
  if (score <= 4) return { score, label: "Good" };
  return { score, label: "Strong" };
}

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError("");

      const form = new FormData(e.currentTarget);
      const fullName = form.get("fullName") as string;
      const email = form.get("email") as string;
      const passwordVal = form.get("password") as string;
      const confirmPassword = form.get("confirmPassword") as string;

      if (!fullName || !email || !passwordVal || !confirmPassword) {
        setError("Please fill in all fields");
        return;
      }

      if (passwordVal !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      if (!agreed) {
        setError("Please agree to the terms of service");
        return;
      }

      setLoading(true);
      const result = await signUp(email, passwordVal, fullName);
      setLoading(false);

      if (result.success) {
        toast.success("Account created! Welcome to WallProud.");
        router.push("/dashboard");
      } else {
        setError(result.error || "Something went wrong");
        toast.error(result.error || "Something went wrong");
      }
    },
    [agreed, router],
  );

  return (
    <div className="flex w-full flex-col items-center gap-10 lg:flex-row lg:gap-16">
      <div className="hidden flex-1 lg:block">
        <h1 className="font-display-xxl text-ink">
          Collect
          <br />
          social proof
        </h1>
        <p className="font-body-lg mt-6 max-w-sm text-muted">
          Create your free account and start building trust with your audience in minutes.
        </p>
        <div className="mt-8 space-y-3">
          {[
            "Free plan includes 10 testimonials",
            "Beautiful widgets for any website",
            "No credit card required",
          ].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <Check className="h-4 w-4 text-success" />
              <span className="font-body text-muted">{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm">
        <div className="card-hairline p-8">
          <h2 className="font-display-md text-ink">Create account</h2>
          <p className="font-body-sm mt-1 text-muted">
            Get started with your free account.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="fullName" className="font-body-sm text-ink">
                Full name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                className="input-field mt-1"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="font-body-sm text-ink">
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
              <label htmlFor="password" className="font-body-sm text-ink">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full ${
                          i <= strength.score ? "bg-accent" : "bg-surface-1"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-1 font-caption text-muted">
                    Strength: {strength.label}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="font-body-sm text-ink">
                Confirm password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="input-field mt-1"
                placeholder="••••••••"
              />
            </div>

            <label className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-hairline bg-surface-1 accent-accent"
              />
              <span className="font-caption text-muted">
                I agree to the{" "}
                <Link href="/terms" className="text-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-accent hover:underline">
                  Privacy Policy
                </Link>
              </span>
            </label>

            {error && (
              <div className="rounded-md bg-surface-1 px-3 py-2 font-body-sm text-muted">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agreed}
              className="btn-primary w-full justify-center"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRight className="h-4 w-4" />
              )}
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center font-body-sm text-muted">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-ink hover:text-muted">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}