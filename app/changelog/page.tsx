import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, Sparkles, Zap, Bug, Wrench } from "lucide-react";

const changeTypes = {
  added: { label: "Added", color: "text-green-400 bg-green-400/10 border-green-400/20", icon: Sparkles },
  improved: { label: "Improved", color: "text-blue-400 bg-blue-400/10 border-blue-400/20", icon: Zap },
  fixed: { label: "Fixed", color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: Bug },
  infra: { label: "Infrastructure", color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: Wrench },
};

type ChangeType = keyof typeof changeTypes;

interface Change {
  type: ChangeType;
  text: string;
}

interface Release {
  version: string;
  date: string;
  title: string;
  description: string;
  changes: Change[];
  latest?: boolean;
}

const releases: Release[] = [
  {
    version: "1.4.0",
    date: "July 15, 2026",
    title: "Video testimonials & AI tagging",
    description: "Customers can now record video testimonials directly from your collection link. Plus, AI-powered automatic tagging to organize feedback effortlessly.",
    latest: true,
    changes: [
      { type: "added", text: "Video testimonial recording on collection pages" },
      { type: "added", text: "AI auto-tagging for incoming testimonials" },
      { type: "added", text: "Bulk actions — approve, archive, or tag multiple at once" },
      { type: "improved", text: "Collection page load time reduced by 40%" },
      { type: "fixed", text: "Fixed an issue where Masonry layout broke on Safari 17" },
    ],
  },
  {
    version: "1.3.0",
    date: "June 28, 2026",
    title: "Masonry layout & custom domains",
    description: "The new Masonry widget layout arranges testimonials in a Pinterest-style grid. Custom domains let you brand your collection pages.",
    changes: [
      { type: "added", text: "Masonry widget layout style" },
      { type: "added", text: "Custom domain support for collection pages (Pro+)" },
      { type: "improved", text: "Widget script bundle size reduced by 22%" },
      { type: "fixed", text: "Star rating display glitch on Firefox" },
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-[#0099ff]/[0.04] blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] h-[300px] w-[400px] rounded-full bg-[#6a4cf5]/[0.04] blur-[100px]" />
      </div>

      <header className="relative z-10 mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link href="/" className="btn-secondary text-sm">
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-28 pt-16">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-1 border border-white/[0.06] px-3 py-1 text-[13px] tracking-tight text-muted">
            <Sparkles className="h-3 w-3 text-accent" /> Product updates
          </span>
          <h1 className="font-display-xl mt-6 text-ink">Changelog</h1>
          <p className="font-body-lg mx-auto mt-3 max-w-xl text-muted">
            Every improvement, feature, and fix — documented as we ship.
          </p>
        </div>

        <div className="mt-16 relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/[0.06] to-transparent hidden md:block" />

          <div className="space-y-12">
            {releases.map((release) => (
              <div key={release.version} className="relative">
                <div className="absolute left-0 top-1.5 hidden md:flex">
                  <div className={`h-[15px] w-[15px] rounded-full border-2 ${
                    release.latest ? "border-accent bg-accent/30" : "border-white/20 bg-surface-2"
                  }`} />
                </div>

                <div className="md:ml-10">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-surface-2 border border-white/[0.06] px-3 py-0.5 text-xs font-semibold text-white tracking-wide">
                      v{release.version}
                    </span>
                    <span className="text-xs text-muted">{release.date}</span>
                    {release.latest && (
                      <span className="rounded-full bg-accent/15 border border-accent/25 px-2.5 py-0.5 text-[10px] font-bold text-accent uppercase tracking-widest">
                        Latest
                      </span>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/[0.06] bg-surface-1/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display-md text-white tracking-tight">{release.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted/80">{release.description}</p>

                    <div className="mt-5 space-y-2.5">
                      {release.changes.map((change, i) => {
                        const ct = changeTypes[change.type];
                        const Icon = ct.icon;
                        return (
                          <div key={i} className="flex items-start gap-3 rounded-lg bg-surface-2/40 px-4 py-2.5">
                            <span className={`mt-0.5 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider shrink-0 ${ct.color}`}>
                              <Icon className="h-2.5 w-2.5" />
                              {ct.label}
                            </span>
                            <span className="text-sm text-ink/85 leading-relaxed">{change.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
