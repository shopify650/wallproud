import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, Code, Settings, Paintbrush, Globe } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] h-[500px] w-[500px] rounded-full bg-[#6a4cf5]/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[600px] rounded-full bg-[#0099ff]/[0.03] blur-[120px]" />
      </div>

      <header className="relative z-10 border-b border-white/[0.04] bg-canvas/70 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo />
          <nav className="flex items-center gap-3">
            <Link href="/" className="btn-secondary text-sm">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex max-w-6xl px-6 pb-28 pt-10">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 md:block pr-8">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Getting Started</h3>
              <ul className="space-y-2">
                <li><a href="#quickstart" className="text-sm text-accent font-medium">Quickstart</a></li>
                <li><a href="#installation" className="text-sm text-muted hover:text-white transition">Installation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Widgets</h3>
              <ul className="space-y-2">
                <li><a href="#embed" className="text-sm text-muted hover:text-white transition">How to embed</a></li>
                <li><a href="#customization" className="text-sm text-muted hover:text-white transition">Customization</a></li>
                <li><a href="#frameworks" className="text-sm text-muted hover:text-white transition">React / Next.js</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">API Reference</h3>
              <ul className="space-y-2">
                <li><a href="#api" className="text-sm text-muted hover:text-white transition">REST API</a></li>
                <li><a href="#webhooks" className="text-sm text-muted hover:text-white transition">Webhooks</a></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl">
          <div className="mb-12">
            <h1 className="font-display-xl text-ink">Documentation</h1>
            <p className="font-body-lg mt-3 text-muted">
              Learn how to integrate WallProud into your application in minutes.
            </p>
          </div>

          <div className="space-y-16">
            <section id="quickstart">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" /> Quickstart
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                The fastest way to get started with WallProud is by copying your widget&apos;s embed code from the dashboard and pasting it into your HTML.
              </p>
              <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-4 overflow-x-auto">
                <pre className="text-sm text-muted/90 font-mono">
                  <code className="text-accent">&lt;script</code> type=<span className="text-green-300">"text/javascript"</span> src=<span className="text-green-300">"https://wallproud.com/embed.js"</span> data-widget-id=<span className="text-green-300">"YOUR_WIDGET_ID"</span><span className="text-accent">&gt;&lt;/script&gt;</span>
                </pre>
              </div>
            </section>

            <section id="embed">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" /> How to Embed
              </h2>
              <p className="text-muted leading-relaxed mb-6">
                WallProud widgets use Shadow DOM isolation, meaning they will never conflict with your site&apos;s CSS (like Tailwind, Bootstrap, or custom styles).
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-surface-1/40 p-5">
                  <h3 className="font-semibold text-white mb-2">HTML / Vanilla</h3>
                  <p className="text-sm text-muted mb-4">Just paste the script tag where you want the widget to appear.</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-surface-1/40 p-5">
                  <h3 className="font-semibold text-white mb-2">React / Next.js</h3>
                  <p className="text-sm text-muted mb-4">Use our official React component for seamless integration.</p>
                </div>
              </div>
            </section>

            <section id="customization">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-accent" /> Customization
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                You can customize the look and feel of your widgets directly from the dashboard. Changes are published instantly to all your embedded widgets.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Primary brand color (for stars, buttons, and highlights)</li>
                <li>Background colors (light, dark, or transparent)</li>
                <li>Font family (inherits from your site by default)</li>
                <li>Border radius and shadow intensity</li>
              </ul>
            </section>

            <section id="api">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent" /> REST API
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Pro and Agency customers have access to our REST API to programmatically fetch testimonials or manage widget settings.
              </p>
              <div className="rounded-xl border border-white/[0.06] bg-surface-1/40 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs font-bold text-blue-400">GET</span>
                  <code className="text-sm text-white">/v1/testimonials</code>
                </div>
                <p className="text-sm text-muted">Returns a paginated list of approved testimonials for your workspace.</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
