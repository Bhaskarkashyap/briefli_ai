"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface PricingCardProps {
  name: string;
  price: number;
  features: string[];
  isPopular?: boolean;
  currentPlan?: boolean;
}

export function PricingCard({
  name,
  price,
  features,
  isPopular,
  currentPlan,
}: PricingCardProps) {
  const router = useRouter();

  return (
    <div
      className={`card p-8 relative ${
        isPopular ? "border-[var(--accent-primary)]" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-[var(--accent-primary)] text-white text-xs px-3 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}

      <h3
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {name}
      </h3>

      <div className="flex items-baseline gap-1 mb-6">
        <span
          className="text-4xl font-bold"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          ${price}
        </span>
        {price > 0 && <span className="text-[var(--text-muted)]">/month</span>}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[var(--success)] flex-shrink-0 mt-0.5" />
            <span className="text-[var(--text-secondary)]">{feature}</span>
          </li>
        ))}
      </ul>

      {currentPlan ? (
        <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed">
          Current Plan
        </button>
      ) : price === 0 ? (
        <button
          onClick={() => router.push("/register")}
          className="btn-secondary w-full"
        >
          Get Started Free
        </button>
      ) : (
        <button
          onClick={() => router.push("/dashboard/settings?upgrade=true")}
          className="btn-primary w-full"
        >
          Upgrade Now
        </button>
      )}
    </div>
  );
}
