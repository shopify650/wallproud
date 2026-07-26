import Script from "next/script";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Widget Test Page — WallProud",
  description: "Test page for WallProud on-site collection widget and testimonial embed widget.",
};

export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-accent/30 selection:text-white overflow-x-hidden">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#0099ff]/[0.05] blur-[140px]" />
        <div className="absolute bottom-[20%] right-[-5%] h-[400px] w-[500px] rounded-full bg-[#6a4cf5]/[0.04] blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 border border-white/10">
              <svg className="h-4 w-4 text-accent" viewBox="0 0 16 16" fill="currentColor">
                <circle cx="8" cy="8" r="7" fillOpacity="0.3" />
                <circle cx="8" cy="8" r="3" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">WallProud Widget Test</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-semibold text-emerald-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              Widgets Live
            </span>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/[0.08] bg-white/5 px-4 py-1.5 text-xs font-medium text-muted transition hover:bg-white/10 hover:text-white"
            >
              Dashboard →
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-6 py-14 space-y-20">

        {/* Page Title */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/5 px-4 py-1.5 text-xs font-semibold text-muted">
            🧪 Internal Test Environment
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
            Widget Integration Test
          </h1>
          <p className="mt-3 text-[15px] text-white/50 max-w-lg mx-auto leading-relaxed">
            This page tests both WallProud widgets live — the on-site collection form and the testimonial display embed.
          </p>
        </div>

        {/* Section 1: On-Site Collection Widget */}
        <section>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0099ff]/15 border border-[#0099ff]/20 text-[#0099ff] text-sm font-bold shrink-0">
              1
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">On-Site Collection Widget</h2>
              <p className="text-xs text-white/40 mt-0.5 font-mono">
                collect-widget/5e00ad7d-c69a-4a35-8895-cf321fc292c5
              </p>
            </div>
          </div>

          {/* Widget render target */}
          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-10 min-h-[200px] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0099ff]/[0.03] to-transparent pointer-events-none rounded-2xl" />
            {/* Widget renders here */}
            <div id="wallproud-collect-widget" className="w-full" />
          </div>

          <p className="mt-3 text-[11px] text-white/30 text-center font-mono">
            Script: https://wallproud.vercel.app/collect-widget/5e00ad7d-c69a-4a35-8895-cf321fc292c5.js
          </p>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-white/[0.06]" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-white/20">Next Widget</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>

        {/* Section 2: Testimonial Embed Widget */}
        <section>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6a4cf5]/15 border border-[#6a4cf5]/20 text-[#6a4cf5] text-sm font-bold shrink-0">
              2
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Testimonial Embed Widget</h2>
              <p className="text-xs text-white/40 mt-0.5 font-mono">
                embed/ac5915cf-ac99-41bd-83a4-4688bf382089
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-10 min-h-[200px] flex flex-col items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-[#6a4cf5]/[0.03] to-transparent pointer-events-none rounded-2xl" />
            {/* Widget renders here */}
            <div id="wallproud-embed-widget" className="w-full" />
          </div>

          <p className="mt-3 text-[11px] text-white/30 text-center font-mono">
            Script: https://wallproud.vercel.app/embed/ac5915cf-ac99-41bd-83a4-4688bf382089.js
          </p>
        </section>

        {/* Embed codes reference box */}
        <section className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6">
          <h3 className="text-sm font-semibold text-white mb-4">📋 Embed Codes Reference</h3>
          <div className="space-y-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Collection Widget</p>
              <div className="rounded-lg bg-black/60 border border-white/[0.06] px-4 py-3 font-mono text-[11px] text-[#0099ff]/80 overflow-x-auto">
                {`<script src="https://wallproud.vercel.app/collect-widget/5e00ad7d-c69a-4a35-8895-cf321fc292c5.js" async></script>`}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-1.5">Testimonial Widget</p>
              <div className="rounded-lg bg-black/60 border border-white/[0.06] px-4 py-3 font-mono text-[11px] text-[#6a4cf5]/80 overflow-x-auto">
                {`<script src="https://wallproud.vercel.app/embed/ac5915cf-ac99-41bd-83a4-4688bf382089.js" async></script>`}
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] mt-20">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-xs text-white/30">
          <span>WallProud Widget Test Page</span>
          <Link href="/" className="hover:text-white transition">← Back to Home</Link>
        </div>
      </footer>

      {/* Widget Scripts — load after page */}
      <Script
        src="https://wallproud.vercel.app/collect-widget/5e00ad7d-c69a-4a35-8895-cf321fc292c5.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://wallproud.vercel.app/embed/ac5915cf-ac99-41bd-83a4-4688bf382089.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
