"use client";

import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="card p-6 hover:border-[var(--accent-primary)] transition border-transparent">
      <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3
        className="text-lg font-semibold mb-2"
        style={{ fontFamily: "var(--font-outfit)" }}
      >
        {title}
      </h3>
      <p className="text-[var(--text-secondary)]">{description}</p>
    </div>
  );
}
