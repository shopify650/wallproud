"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, ArrowRight, Loader2, Zap, Shield, HelpCircle, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface PricingSectionProps {
  showTitle?: boolean;
}

const plans = [
  {
    key: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Everything you need to start collecting testimonials.",
    badge: "Forever Free",
    features: [
      "Up to 10 testimonials",
      "1 collection link",
      "1 embeddable widget",
      "1 import source (CSV)",
      "1 workspace",
      "Standard widget layouts",
      "Community support",
    ],
    cta: "Get started free",
    href: "/signup",
    highlighted: false,
    planKey: null,
  },
  {
    key: "pro",
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 15,
    description: "For scaling businesses & creators that live on social proof.",
    badge: "Most Popular",
    features: [
      "Up to 2,500 testimonials",
      "20 collection links",
      "20 widgets (all 6 styles)",
      "10 import sources",
      "3 workspaces",
      "Remove WallProud branding",
      "Advanced analytics & conversion tracking",
      "AI sentiment tagging & insights (soon)",
      "Priority email support",
    ],
    cta: "Start 14-day free trial",
    href: "/signup",
    highlighted: true,
    planKey: "pro",
  },
  {
    key: "agency",
    name: "Agency",
    monthlyPrice: 99,
    yearlyPrice: 79,
    description: "For agencies and high-volume teams managing client sites.",
    badge: "Max Power",
    features: [
      "Up to 25,000 testimonials",
      "100 collection links",
      "100 widgets",
      "50 import sources",
      "15 workspaces",
      "White-label options & custom CSS",
      "Unlimited team seats",
      "Advanced analytics & export",
      "Dedicated account manager",
      "AI sentiment & video transcribing (soon)",
    ],
    cta: "Available Soon",
    href: "/signup",
    highlighted: false,
    planKey: null,
  },
];

const featureComparison = [
  {
    category: "Core Limits",
    items: [
      { name: "Testimonial Storage", free: "10", pro: "2,500", agency: "25,000" },
      { name: "Collection Links", free: "1", pro: "20", agency: "100" },
      { name: "Embeddable Widgets", free: "1", pro: "20", agency: "100" },
      { name: "Workspaces", free: "1", pro: "3", agency: "15" },
    ],
  },
  {
    category: "Customization & Branding",
    items: [
      { name: "Widget Layout Styles", free: "Standard", pro: "All 6 styles", agency: "All 6 + Custom CSS" },
      { name: "Remove WallProud Logo", free: "No", pro: "Yes", agency: "White-label" },
      { name: "Custom Colors & Fonts", free: "Basic", pro: "Full", agency: "Full + Custom Fonts" },
    ],
  },
  {
    category: "Analytics & Intelligence",
    items: [
      { name: "Impression & Click Analytics", free: "Basic", pro: "Advanced", agency: "Real-time & Export" },
      { name: "AI Sentiment Tagging", free: "No", pro: "Soon", agency: "Soon" },
      { name: "Video Testimonial Recording", free: "No", pro: "Yes", agency: "Yes (4K Support)" },
    ],
  },
  {
    category: "Support & Administration",
    items: [
      { name: "Team Seats", free: "1 seat", pro: "3 seats", agency: "Unlimited" },
      { name: "Support Tier", free: "Community", pro: "Priority Email", agency: "Dedicated Manager" },
    ],
  },
];

export function PricingSection({ showTitle = true }: PricingSectionProps) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [loadingPlan, setLoadingPlan] = useState<string>("");
  const [showComparison, setShowComparison] = useState(false);

  const handleCheckout = async (planKey: string | null) => {
    if (!planKey) {
      router.push("/signup");
      return;
    }

    setLoadingPlan(planKey);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/signup");
        return;
      }

      const res = await fetch("/api/whop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, cycle: billingCycle }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        const message = data.error || "Failed to start checkout";
        console.error("Checkout error:", message);
        alert(message);
        setLoadingPlan("");
        return;
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed. Please try again or contact support.");
      setLoadingPlan("");
    }
  };

  return (
    <section id="pricing" className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:py-24">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[700px] rounded-full bg-[#0099ff]/[0.04] blur-[140px] pointer-events-none" />

      {showTitle && (
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-1/60 px-4 py-1.5 text-xs font-semibold tracking-wide text-muted backdrop-blur-md shadow-inner"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent animate-pulse" />
            <span>Simple, transparent pricing</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 font-display-lg leading-tight text-white tracking-tight"
          >
            Pick the plan that fits your growth
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3.5 text-[16px] leading-relaxed text-muted/80"
          >
            Start free with 10 testimonials. Upgrade anytime as your audience and social proof scale.
          </motion.p>
        </div>
      )}

      {/* Billing Switcher */}
      <div className="mt-10 flex justify-center">
        <div className="relative flex items-center rounded-full border border-white/[0.08] bg-surface-1/70 p-1 backdrop-blur-md">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`relative z-10 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
              billingCycle === "monthly" ? "bg-white text-black shadow-md" : "text-muted hover:text-white"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`relative z-10 flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold transition-all duration-200 ${
              billingCycle === "yearly" ? "bg-white text-black shadow-md" : "text-muted hover:text-white"
            }`}
          >
            <span>Annual Billing</span>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                billingCycle === "yearly" ? "bg-black text-white" : "bg-emerald-500/20 text-emerald-400"
              }`}
            >
              Save 20%
            </span>
          </button>
        </div>
      </div>

      {/* Plan Cards Grid */}
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((plan, idx) => {
          const price = billingCycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
          const isHighlighted = plan.highlighted;

          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                isHighlighted
                  ? "border border-accent/40 bg-gradient-to-b from-surface-1/90 via-surface-1/70 to-surface-1/90 shadow-2xl shadow-accent/10 ring-1 ring-accent/30 scale-[1.02] md:z-10"
                  : "border border-white/[0.06] bg-surface-1/40 hover:border-white/[0.12] hover:bg-surface-1/60"
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500 to-accent px-4 py-1 text-[11px] font-bold text-white shadow-lg uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-display-md text-xl text-white tracking-tight">{plan.name}</h3>
                  {!isHighlighted && (
                    <span className="text-[11px] font-semibold text-muted bg-surface-2 px-2.5 py-1 rounded-full border border-white/[0.04]">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs leading-relaxed text-muted/80 min-h-[36px]">{plan.description}</p>

                {/* Price Display */}
                <div className="mt-6 border-b border-white/[0.06] pb-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display-xl text-3xl sm:text-4xl text-white font-bold tracking-tight">${price}</span>
                      <span className="text-xs sm:text-sm font-medium text-muted">/month</span>
                    </div>
                    {billingCycle === "yearly" && price > 0 && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
                        Billed annually
                      </span>
                    )}
                  </div>
                </div>

                {/* Feature List */}
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs text-muted/90 leading-snug">
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${isHighlighted ? "bg-accent/20 text-accent" : "bg-surface-2 text-white/70"}`}>
                        <Check className="h-2.5 w-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-4 border-t border-white/[0.04]">
                <button
                  onClick={() => handleCheckout(plan.planKey)}
                  disabled={loadingPlan === plan.planKey}
                  className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 px-5 text-xs font-bold transition-all duration-200 shadow-lg ${
                    isHighlighted
                      ? "bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] shadow-white/10"
                      : "bg-surface-2 text-white hover:bg-surface-1 border border-white/[0.08] hover:border-white/20 active:scale-[0.98]"
                  } ${loadingPlan === plan.planKey ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {loadingPlan === plan.planKey ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-current" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Feature Comparison Accordion Toggle */}
      <div className="mt-14 text-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-surface-1/50 px-5 py-2.5 text-xs font-semibold text-muted transition-all hover:border-white/20 hover:text-white"
        >
          <span>{showComparison ? "Hide full feature comparison" : "Compare all plan features"}</span>
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${showComparison ? "rotate-180" : ""}`} />
        </button>
      </div>

      {/* Detailed Feature Comparison Grid */}
      <AnimatePresence>
        {showComparison && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 overflow-hidden rounded-3xl border border-white/[0.08] bg-surface-1/30 p-6 md:p-8 backdrop-blur-md"
          >
            <h4 className="font-display-md text-lg text-white mb-6 text-center">Detailed Feature Breakdown</h4>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 px-4 font-semibold text-muted w-2/5">Feature</th>
                    <th className="py-3 px-4 font-semibold text-white text-center w-1/5">Free</th>
                    <th className="py-3 px-4 font-semibold text-accent text-center w-1/5">Pro</th>
                    <th className="py-3 px-4 font-semibold text-white text-center w-1/5">Agency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {featureComparison.map((section) => (
                    <tr key={section.category} className="contents">
                      <tr className="bg-surface-2/40">
                        <td colSpan={4} className="py-2.5 px-4 font-bold text-accent uppercase tracking-wider text-[10px]">
                          {section.category}
                        </td>
                      </tr>
                      {section.items.map((item) => (
                        <tr key={item.name} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3 px-4 font-medium text-muted/90">{item.name}</td>
                          <td className="py-3 px-4 text-center text-muted">{item.free}</td>
                          <td className="py-3 px-4 text-center font-semibold text-white bg-accent/5">{item.pro}</td>
                          <td className="py-3 px-4 text-center font-semibold text-white">{item.agency}</td>
                        </tr>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Assurances */}
      <div className="mt-14 grid gap-4 sm:grid-cols-3 text-center">
        <div className="rounded-2xl border border-white/[0.05] bg-surface-1/20 p-4">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-accent">
            <Zap className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-semibold text-white">Instant 5-minute setup</p>
          <p className="mt-0.5 text-[11px] text-muted">No developer required. Works on Framer, Webflow, Shopify.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-surface-1/20 p-4">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-emerald-400">
            <Shield className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-semibold text-white">Cancel anytime</p>
          <p className="mt-0.5 text-[11px] text-muted">1-click cancellation in account dashboard without questions.</p>
        </div>

        <div className="rounded-2xl border border-white/[0.05] bg-surface-1/20 p-4">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-blue-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <p className="mt-2 text-xs font-semibold text-white">Have custom requirements?</p>
          <p className="mt-0.5 text-[11px] text-muted">
            <Link href="/login" className="text-accent hover:underline font-medium">Contact our team</Link> for tailored enterprise limits.
          </p>
        </div>
      </div>
    </section>
  );
}
