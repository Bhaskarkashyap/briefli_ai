"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  const handleNavigate = (href: string) => {
    setLoading(true);
    router.push(href);
  };

  return (
    <div
      className={`card p-8 relative ${
        isPopular ? "border-accent-primary" : ""
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-accent-primary text-white text-xs px-3 py-1 rounded-full">
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
        {price > 0 && <span className="text-text-muted">/month</span>}
      </div>

      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
            <span className="text-text-secondary">{feature}</span>
          </li>
        ))}
      </ul>

      {currentPlan ? (
        <button disabled className="btn-secondary w-full opacity-50 cursor-not-allowed flex items-center justify-center gap-2">
          <Check className="w-5 h-5" />
          Current Plan
        </button>
      ) : price === 0 ? (
        <button
          onClick={() => handleNavigate("/register")}
          disabled={loading}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Get Started Free
        </button>
      ) : (
        <button
          onClick={() => handleNavigate("/dashboard/settings?upgrade=true")}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          Upgrade Now
        </button>
      )}
    </div>
  );
}
