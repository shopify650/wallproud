import { Logo } from "@/components/logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-30">
        <svg className="absolute -right-40 -top-40 h-96 w-96 text-surface-1" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeOpacity={0.4} strokeWidth={2} />
          <circle cx="100" cy="100" r="50" stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
        </svg>
        <svg className="absolute -bottom-20 -left-20 h-64 w-64 text-surface-1" viewBox="0 0 200 200" fill="none">
          <rect x="20" y="20" width="160" height="160" rx="30" stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5} />
          <rect x="40" y="40" width="120" height="120" rx="20" stroke="currentColor" strokeOpacity={0.15} strokeWidth={1} />
        </svg>
      </div>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6">
        <Logo />
        <div className="flex flex-1 items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
