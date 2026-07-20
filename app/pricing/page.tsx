import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    description: "Everything you need to start collecting testimonials.",
    features: [
      "Up to 10 testimonials",
      "1 collection link",
      "1 widget",
      "1 import source",
      "1 workspace",
      "Embeddable widget scripts",
    ],
    cta: "Get started",
    href: "/signup",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    description: "For teams that live on social proof.",
    features: [
      "Up to 1,000 testimonials",
      "20 collection links",
      "20 widgets",
      "10 import sources",
      "10 workspaces",
      "10 team members",
      "Custom domains",
      "Remove branding",
      "Advanced analytics",
      "Priority support",
      "API access",
      "AI tagging & insights (soon)",
    ],
    cta: "Start free trial",
    href: "/signup",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/mo",
    description: "For agencies managing multiple clients.",
    features: [
      "Up to 10,000 testimonials",
      "100 collection links",
      "100 widgets",
      "50 import sources",
      "50 workspaces",
      "50 team members",
      "Custom domains",
      "White-label option",
      "Advanced analytics",
      "Dedicated support",
      "AI tagging & insights (soon)",
    ],
    cta: "Contact us",
    href: "/signup",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-canvas text-ink">
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

      <header className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Logo />
        <nav className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm">
            Sign in
          </Link>
          <Link href="/signup" className="btn-primary text-sm">
            Get started free
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-28 pt-14">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-surface-1 px-3 py-1 text-[13px] tracking-tight text-muted">
            <Sparkles className="h-3 w-3" /> Simple, transparent pricing
          </span>
          <h1 className="font-display-xl mt-6 text-ink">
            Pick the plan that fits
          </h1>
          <p className="font-body-lg mx-auto mt-3 max-w-2xl text-muted">
            Start free. Upgrade when you&apos;re ready to scale your social proof.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-[20px] p-8 ${
                plan.highlighted
                  ? "bg-surface-2 ring-1 ring-white/10"
                  : "card-hairline"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-pill bg-white px-4 py-1 font-caption text-black">
                  Popular
                </span>
              )}
              <div className="flex items-center justify-between">
                <h2 className="font-display-md text-ink">{plan.name}</h2>
              </div>
              <p className="font-body mt-1 text-muted">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display-xl text-ink">{plan.price}</span>
                <span className="font-body text-muted">{plan.period}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-4 w-4 shrink-0 text-accent" />
                    <span className="font-body-sm text-ink">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`mt-8 flex items-center justify-center gap-2 rounded-pill px-4 py-2.5 font-body-sm transition ${
                  plan.highlighted
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                {plan.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center font-body text-muted">
          Need something custom?{" "}
          <Link href="/login" className="font-body-sm text-accent hover:underline">
            Talk to us
          </Link>
        </p>
      </main>
    </div>
  );
}
