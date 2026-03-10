"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/ui/Navbar";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { PricingCard } from "@/components/ui/PricingCard";
import { Zap, Clock, FileText, Shield } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading" || session) {
    return null;
  }

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get your summaries in seconds. Our AI processes content quickly and efficiently.",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Transform hours of reading into minutes. Extract key points instantly.",
    },
    {
      icon: FileText,
      title: "Multiple Formats",
      description: "Summarize articles, emails, documents, and more. Supports various content types.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared. We prioritize your privacy.",
    },
  ];

  const freeFeatures = [
    "3 summaries per day",
    "500 words input limit",
    "Basic summarization",
    "Standard speed",
  ];

  const proFeatures = [
    "Unlimited summaries",
    "10,000 words input limit",
    "Advanced summarization modes",
    "Priority processing",
    "Export to PDF/Docx",
    "API access",
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Summarize Anything in{" "}
              <span className="gradient-text">Seconds</span>
            </h1>
            <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
              AI-powered tool that transforms long content into concise, actionable
              summaries. Perfect for content creators, students, and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="btn-primary text-lg px-8 py-4">
                Start for Free
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Powerful Features
            </h2>
            <p className="text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto">
              Everything you need to summarize content quickly and efficiently
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold text-center mb-4"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Simple Pricing
            </h2>
            <p className="text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade or downgrade anytime.
            </p>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <PricingCard
                name="Free"
                price={0}
                features={freeFeatures}
              />
              <PricingCard
                name="Pro"
                price={19}
                features={proFeatures}
                isPopular
              />
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Ready to Get Started?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-xl mx-auto">
              Join thousands of content creators who trust Briefly.io for their
              summarization needs.
            </p>
            <Link href="/register" className="btn-primary text-lg px-8 py-4">
              Create Free Account
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 px-4 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Briefly.io</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            © 2026 Briefly.io. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
