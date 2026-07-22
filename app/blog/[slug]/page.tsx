import { notFound } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { posts, getPostBySlug } from "@/lib/blog-posts";

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const currentIndex = posts.findIndex((p) => p.slug === params.slug);
  const nextPost = posts[currentIndex + 1] || null;
  const prevPost = posts[currentIndex - 1] || null;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/*WallProud blog post page */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] h-[600px] w-[600px] rounded-full bg-[#d44df0]/[0.03] blur-[120px]" />
      </div>

      <header className="relative z-10 mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
        <Logo />
        <nav className="flex items-center gap-3">
          <Link href="/blog" className="btn-secondary text-sm">
            <ArrowLeft className="h-3.5 w-3.5" /> All posts
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-6 pb-28 pt-16">
        <article>
          <div className="mb-8">
            <span className="inline-block rounded-full bg-surface-2 border border-white/[0.04] px-3 py-1 text-xs font-medium text-white mb-6">
              {post.category}
            </span>
            <h1 className="font-display-xl text-white mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" /> {post.date}
              </span>
            </div>
          </div>

          <div
            className="max-w-none space-y-6 text-muted leading-relaxed text-[15px]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-white/[0.06] flex items-center justify-between">
            {prevPost ? (
              <Link
                href={"/blog/" + prevPost.slug}
                className="group flex items-center gap-2 text-sm text-muted hover:text-white transition"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-xs text-muted/60">Previous post</div>
                  <div className="text-white">{prevPost.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={"/blog/" + nextPost.slug}
                className="group flex items-center gap-2 text-sm text-muted hover:text-white transition text-right"
              >
                <div>
                  <div className="text-xs text-muted/60">Next post</div>
                  <div className="text-white">{nextPost.title}</div>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </article>
      </main>
    </div>
  );
}
