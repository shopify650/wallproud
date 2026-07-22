import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, Code, Settings, Paintbrush, Globe, Users, Video, Upload, Link2, Mic, ShieldCheck, LayoutDashboard, Star, Layers } from "lucide-react";

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
        <aside className="hidden w-64 shrink-0 md:block pr-8">
          <div className="sticky top-24 space-y-8">
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Getting Started</h3>
              <ul className="space-y-2">
                <li><a href="#overview" className="text-sm text-accent font-medium">Overview</a></li>
                <li><a href="#authentication" className="text-sm text-muted hover:text-white transition">Authentication</a></li>
                <li><a href="#workspaces" className="text-sm text-muted hover:text-white transition">Workspaces</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Testimonials</h3>
              <ul className="space-y-2">
                <li><a href="#managing-testimonials" className="text-sm text-muted hover:text-white transition">Managing testimonials</a></li>
                <li><a href="#approval-workflow" className="text-sm text-muted hover:text-white transition">Approval workflow</a></li>
                <li><a href="#import" className="text-sm text-muted hover:text-white transition">CSV import</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Widgets</h3>
              <ul className="space-y-2">
                <li><a href="#widget-types" className="text-sm text-muted hover:text-white transition">6 widget types</a></li>
                <li><a href="#customization" className="text-sm text-muted hover:text-white transition">Customization</a></li>
                <li><a href="#embed-options" className="text-sm text-muted hover:text-white transition">Embed options</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Collection</h3>
              <ul className="space-y-2">
                <li><a href="#collection-links" className="text-sm text-muted hover:text-white transition">Collection links</a></li>
                <li><a href="#collect-widget" className="text-sm text-muted hover:text-white transition">On-site collect widget</a></li>
                <li><a href="#video-testimonials" className="text-sm text-muted hover:text-white transition">Video testimonials</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-display-sm text-sm text-white mb-3">Reference</h3>
              <ul className="space-y-2">
                <li><a href="#plans" className="text-sm text-muted hover:text-white transition">Plans &amp; limits</a></li>
                <li><a href="#changelog" className="text-sm text-muted hover:text-white transition">Changelog</a></li>
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1 max-w-3xl">
          <div className="mb-12">
            <h1 className="font-display-xl text-ink">Documentation</h1>
            <p className="font-body-lg mt-3 text-muted">
              A complete guide to every feature available in your WallProud workspace.
            </p>
          </div>

          <div className="space-y-16">
            <section id="overview">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-accent" /> Overview
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                WallProud is a testimonial management platform with three core workflows: accept new testimonials, curate them in the dashboard, and publish them as embedded widgets. This page documents every feature currently available.
              </p>
            </section>

            <section id="authentication">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" /> Authentication
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                WallProud uses email and password authentication through Supabase Auth. Account creation also creates your first workspace.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Sign up with email, password (min 8 characters), and full name</li>
                <li>Sign in with email and password</li>
                <li>Password reset via forgot-password flow</li>
                <li>Update password from your account settings</li>
                <li>No OAuth or magic-link providers are currently configured</li>
              </ul>
            </section>

            <section id="workspaces">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" /> Workspaces
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Every account starts with one workspace. You can create additional workspaces to separate brands, clients, or teams.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Create workspaces with a name and auto-generated slug</li>
                <li>Switch between workspaces from the sidebar</li>
                <li>Rename or delete workspaces (must keep at least one)</li>
                <li>Workspace settings: name, slug, logo URL, primary color</li>
                <li>All testimonials, widgets, and collection links belong to the active workspace</li>
              </ul>
            </section>

            <section id="managing-testimonials">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Layers className="h-5 w-5 text-accent" /> Managing testimonials
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Testimonials live inside a workspace and feed every embed and collection link.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Create manually: author name, email, company, role, content, rating, and optional video URL</li>
                <li>Edit any field after creation</li>
                <li>Delete with confirmation</li>
                <li>Mark as featured to highlight them in widgets</li>
                <li>Sources tracked per testimonial: manual, email, google, twitter, or import</li>
                <li>Tags: up to 10 per testimonial for organization and filtering</li>
              </ul>
            </section>

            <section id="approval-workflow">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-accent" /> Approval workflow
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Every new testimonial has a status so nothing goes public before you review it.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Statuses: pending, approved, rejected</li>
                <li>Only approved testimonials appear in public embeds</li>
                <li>Bulk actions: select multiple testimonials to approve, reject, reset to pending, or delete</li>
                <li>Search across author name, content, and company</li>
                <li>Filter by status, minimum rating, and tags</li>
                <li>Sort by newest, oldest, rating high-to-low, or rating low-to-high</li>
              </ul>
            </section>

            <section id="import">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-accent" /> CSV import
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Bulk import testimonials from a CSV file or pasted CSV text.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Upload a .csv or paste CSV text directly</li>
                <li>Auto-detects columns: author_name, author_email, author_company, author_role, content, rating</li>
                <li>Requires author_name and content columns; rows without content are skipped</li>
                <li>Imported testimonials receive status pending and source tag import</li>
                <li>Plan import limit enforced on row count</li>
              </ul>
            </section>

            <section id="widget-types">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <LayoutDashboard className="h-5 w-5 text-accent" /> 6 widget types
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Create embeddable widgets and choose from six layout styles.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li><strong>Grid</strong> — responsive card grid, 1 to 4 columns</li>
                <li><strong>Carousel</strong> — horizontal slide with autoplay, touch swipe, dot navigation</li>
                <li><strong>Wall of Love</strong> — CSS columns masonry layout</li>
                <li><strong>Slider</strong> — single testimonial fade transition with autoplay</li>
                <li><strong>Minimal</strong> — simple list with left accent border, no card chrome</li>
                <li><strong>Masonry</strong> — Pinterest-style variable-height layout</li>
              </ul>
            </section>

            <section id="customization">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-accent" /> Customization
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Each widget has a live editor updating three viewports at once: desktop, tablet, and mobile.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Styling: background, text, accent, card background, border radius, padding, font family, font size</li>
                <li>Layout: columns, gap, max width</li>
                <li>Animation: autoplay, interval, transition type (fade, slide, none)</li>
                <li>Filtering: max items, sort order, minimum rating, tag filter, featured only</li>
                <li>CTA button: toggle, text, and URL</li>
              </ul>
            </section>

            <section id="embed-options">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" /> Embed options
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Publish widgets with three embed formats, all generated from the widget editor.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li><strong>Script tag</strong> — self-contained JavaScript that renders a Shadow DOM custom element. No CSS conflicts with your site.</li>
                <li><strong>iFrame</strong> — HTML page served from WallProud, embeddable via src URL.</li>
                <li><strong>Framer component</strong> — copy-paste React component for Framer sites.</li>
                <li>View counting is tracked per widget load.</li>
                <li>Embed routes are CORS-enabled and cached for performance.</li>
              </ul>
            </section>

            <section id="collection-links">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Link2 className="h-5 w-5 text-accent" /> Collection links
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Share a unique URL to collect testimonials from specific people.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Generate a tokenized link from the Collections dashboard</li>
                <li>Set recipient name, email, optional expiration date (1-365 days)</li>
                <li>Customize the collection page title, description, button text, thank-you message, brand color, and post-submit redirect</li>
                <li>Toggle fields: star rating, name, email, company, role, video upload</li>
                <li>Status workflow: pending → sent → completed → expired</li>
                <li>One-time submit: a recipient can submit once; later visits show Already submitted</li>
              </ul>
            </section>

            <section id="collect-widget">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-accent" /> On-site collect widget
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Embed a live testimonial form directly on any website with three display modes.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li><strong>Floating</strong> — bottom-corner button that opens a popup form</li>
                <li><strong>Inline</strong> — directly embedded in page flow</li>
                <li><strong>Popup</strong> — center modal with backdrop</li>
                <li>Triggers: click, scroll percent, exit intent, or timed auto-open</li>
                <li>Form fields with per-field required toggles: star rating, name, email, company, phone, video</li>
                <li>Auto-approve 5-star submissions</li>
                <li>Confetti animation on success (toggleable)</li>
                <li>Powered by WallProud footer; forced on for free plan</li>
                <li>Rate limited to 1 submission per IP per 24 hours per workspace</li>
              </ul>
            </section>

            <section id="video-testimonials">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Video className="h-5 w-5 text-accent" /> Video testimonials
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Accept video testimonials from collection forms and store them in your workspace.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>Browser-based webcam recording using MediaRecorder (WebM)</li>
                <li>Preview and re-record before submitting</li>
                <li>Skip option to submit text only</li>
                <li>50 MB max size enforced server-side</li>
                <li>Videos uploaded to dedicated storage and linked on the testimonial record</li>
                <li>Video field is also available on manually created testimonials</li>
              </ul>
            </section>

            <section id="plans">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-accent" /> Plans &amp; limits
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                Current plan enforcement applies to storage, embed display, and collection actions. Features marked soon are not yet active.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li><strong>Free</strong> — 10 testimonials, 1 workspace, 1 collection link, 1 widget, 1 import source</li>
                <li><strong>Pro</strong> — 2,500 testimonials, 3 workspaces, 20 collection links, 20 widgets, 10 import sources, 15 team members (soon), remove branding, advanced analytics (soon), priority support</li>
                <li><strong>Agency</strong> — 25,000 testimonials, 15 workspaces, 100 collection links, 100 widgets, 50 import sources, 15 team members (soon), white-label (soon), advanced analytics (soon), dedicated support</li>
              </ul>
            </section>

            <section id="changelog">
              <h2 className="font-display-md text-white mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-accent" /> Changelog
              </h2>
              <p className="text-muted leading-relaxed mb-4">
                For detailed release history, see the <Link href="/changelog" className="text-accent hover:underline">changelog</Link>.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted">
                <li>v1.4.0 — On-site collect widgets, video testimonials, confetti, auto-approve</li>
                <li>v1.3.0 — Collection links, embed upgrades</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
