"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import { SessionProvider, useSession } from "next-auth/react";
import { CreditCard, User, Check, X } from "lucide-react";
import { useSearchParams } from "next/navigation";

function SettingsContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const showUpgrade = searchParams.get("upgrade") === "true";

  const [subscription, setSubscription] = useState("free");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const res = await fetch("/api/user/usage");
        const data = await res.json();
        setSubscription(data.subscription || "free");
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      }
    }
    fetchSubscription();
  }, []);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to create checkout session", err);
    } finally {
      setLoading(false);
    }
  };

  const isPro = subscription === "pro";

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Settings
        </h1>
        <p className="text-text-secondary">
          Manage your account and subscription
        </p>
      </div>

      {showUpgrade && !isPro && (
        <div className="card p-6 mb-6 border-accent-primary">
          <h2
            className="text-xl font-semibold mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Upgrade to Pro
          </h2>
          <p className="text-text-secondary mb-4">
            Unlock unlimited summaries, longer inputs, and export features.
          </p>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? "Processing..." : "Upgrade for $19/month"}
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Profile Information
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <div className="px-4 py-3 rounded-lg bg-bg-tertiary">
                {session?.user?.name || "Not set"}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="px-4 py-3 rounded-lg bg-bg-tertiary">
                {session?.user?.email || "Not set"}
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Subscription
            </h2>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-bg-tertiary mb-4">
            <div>
              <p className="font-medium">
                {isPro ? "Pro Plan" : "Free Plan"}
              </p>
              <p className="text-sm text-text-secondary">
                {isPro ? "$19/month" : "$0"}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                isPro
                  ? "bg-success/20 text-success"
                  : "bg-text-muted/20 text-text-secondary"
              }`}
            >
              {isPro ? "Active" : "Free"}
            </span>
          </div>

          {!isPro && (
            <button onClick={() => handleUpgrade()} className="btn-primary w-full">
              Upgrade to Pro
            </button>
          )}

          {isPro && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                Unlimited summaries
              </div>
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                10,000 words input
              </div>
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                Priority processing
              </div>
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                Export to PDF/Docx
              </div>
              <div className="flex items-center gap-2 text-sm text-success">
                <Check className="w-4 h-4" />
                API access
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <SessionProvider>
      <SettingsContent />
    </SessionProvider>
  );
}
