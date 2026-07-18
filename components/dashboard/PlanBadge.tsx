import type { PlanType } from "@/types";

const planStyles: Record<PlanType, { bg: string; text: string; ring: string }> = {
  free: { bg: "bg-gray-100", text: "text-gray-700", ring: "ring-gray-300" },
  starter: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-300" },
  pro: { bg: "bg-purple-50", text: "text-purple-700", ring: "ring-purple-300" },
  agency: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-300" },
};

export default function PlanBadge({ plan }: { plan: PlanType }) {
  const s = planStyles[plan];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${s.bg} ${s.text} ${s.ring}`}
    >
      {plan === "free" ? "Free" : plan === "starter" ? "Starter" : plan === "pro" ? "Pro" : "Agency"}
    </span>
  );
}
