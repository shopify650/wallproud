import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-accent/[0.05] blur-[100px]" />
      </div>

      <header className="relative z-10 mx-auto flex h-14 w-full max-w-6xl items-center px-6">
        <Logo />
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display-xxl text-accent/20 select-none">404</h1>
        <h2 className="mt-4 font-display-lg text-white">Page not found</h2>
        <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        <Link 
          href="/" 
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:scale-[1.02]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
      </main>
    </div>
  );
}
