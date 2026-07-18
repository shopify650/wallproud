import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";

const posts = [
  {
    title: "How to collect testimonials that actually convert",
    excerpt: "Not all testimonials are created equal. Learn the framework for asking customers the right questions to get powerful, conversion-driving social proof.",
    date: "July 12, 2026",
    author: "Alex Rivera",
    category: "Guides",
    slug: "how-to-collect-testimonials",
  },
  {
    title: "Why video testimonials are the future of SaaS marketing",
    excerpt: "Text reviews are great, but video builds authentic trust. See how adding just 3 video testimonials to your landing page can boost conversions by 30%.",
    date: "June 24, 2026",
    author: "Sarah Chen",
    category: "Marketing",
    slug: "video-testimonials-future",
  },
  {
    title: "Social proof best practices for 2026",
    excerpt: "From Shadow DOM isolation to AI tagging, discover the modern technical and psychological strategies for leveraging customer love.",
    date: "June 5, 2026",
    author: "Alex Rivera",
    category: "Strategy",
    slug: "social-proof-best-practices",
  },
  {
    title: "How we built WallProud to be the fastest widget on the web",
    excerpt: "A deep dive into our architecture, edge caching, and why we chose Shadow DOM to guarantee zero style conflicts and sub-100ms load times.",
    date: "May 18, 2026",
    author: "James Wilson",
    category: "Engineering",
    slug: "building-fastest-widget",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#d44df0]/[0.03] blur-[120px]" />
      </div>

      <header className="relative z-10 mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link href="/" className="btn-secondary text-sm">
            <ArrowLeft className="h-3.5 w-3.5" /> Home
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-28 pt-16">
        <div className="text-center mb-16">
          <h1 className="font-display-xl text-ink">The WallProud Blog</h1>
          <p className="font-body-lg mx-auto mt-4 max-w-2xl text-muted">
            Insights, guides, and engineering deep dives on building trust and growing your business with social proof.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link 
              href={`/blog/${post.slug}`} 
              key={post.slug}
              className="group flex flex-col rounded-2xl border border-white/[0.06] bg-surface-1/30 p-6 hover:bg-surface-1/60 hover:border-white/[0.12] transition-all duration-300"
            >
              <div className="mb-4">
                <span className="inline-block rounded-full bg-surface-2 border border-white/[0.04] px-3 py-1 text-xs font-medium text-white mb-4">
                  {post.category}
                </span>
                <h2 className="font-display-md text-xl text-white group-hover:text-accent transition-colors leading-tight">
                  {post.title}
                </h2>
              </div>
              <p className="text-sm text-muted leading-relaxed flex-grow mb-6">
                {post.excerpt}
              </p>
              
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User className="h-3 w-3" /> {post.author}</span>
                </div>
                <div className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-white group-hover:bg-accent group-hover:text-black transition-colors">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
