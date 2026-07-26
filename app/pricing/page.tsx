"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { PricingSection } from "@/components/PricingSection";
import { ArrowRight, HelpCircle } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-ink selection:bg-accent/30 selection:text-white overflow-x-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#0099ff]/[0.06] blur-[140px]" />
        <div className="absolute top-[30%] right-[-5%] h-[400px] w-[500px] rounded-full bg-[#6a4cf5]/[0.05] blur-[120px]" />
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-canvas/70 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-[14px] font-medium text-muted transition hover:text-white">
              Home
            </Link>
            <Link href="/login" className="text-[14px] font-medium text-muted transition hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="relative inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-[14px] font-semibold text-black transition-all duration-200 hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-8 pb-20">
        <PricingSection showTitle={true} />

        {/* Custom enterprise / agency section */}
        <div className="mx-auto max-w-4xl px-6 mt-8">
          <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-surface-1/60 to-surface-1/20 p-8 md:p-12 text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-accent/10 blur-3xl pointer-events-none" />
            
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-accent">
              <HelpCircle className="h-3.5 w-3.5" /> High volume or Enterprise?
            </span>
            <h3 className="mt-4 font-display-md text-2xl text-white">Need white-label SLA or custom integration?</h3>
            <p className="mt-2 text-sm text-muted/80 max-w-lg mx-auto">
              We offer custom contract terms, tailored API limits, dedicated solutions engineers, and direct Slack support for high-scale teams.
            </p>
            <div className="mt-6">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-xs font-bold text-black transition-all hover:bg-white/90 hover:scale-105"
              >
                Talk to Sales <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col items-center justify-between gap-6 border-t border-white/[0.06] pt-8 sm:flex-row">
          <Logo />
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <Link href="/docs" className="transition hover:text-white">Docs</Link>
            <Link href="/blog" className="transition hover:text-white">Blog</Link>
            <Link href="/changelog" className="transition hover:text-white">Changelog</Link>
            <Link href="/login" className="transition hover:text-white">Log in</Link>
            <Link href="/signup" className="transition hover:text-white">Sign up</Link>
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          </div>
          <p className="text-xs text-muted">&copy; {new Date().getFullYear()} WallProud. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
