"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Zap, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold" style={{ fontFamily: "var(--font-outfit)" }}>
              Briefliii AI
            </span>
          </Link>

          <h1
            className="text-3xl font-bold mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Create your account
          </h1>
          <p className="text-text-secondary mb-8">
            Start summarizing content in seconds
          </p>

          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-accent-primary outline-none transition"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-accent-primary outline-none transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-accent-primary outline-none transition pr-12"
                  placeholder="******"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg bg-bg-tertiary border border-border focus:border-accent-primary outline-none transition"
                placeholder="******"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-text-secondary mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 auth-gradient" />
        <div className="absolute inset-0 auth-pattern" />
        
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="floating-card card p-8 mb-8 max-w-md">
            <div className="text-left">
              <p className="text-sm text-text-muted mb-2">Sample Summary</p>
              <h3 className="text-lg font-semibold mb-3">The Future of AI Summarization</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                Briefliii AI uses advanced AI to transform lengthy content into concise, 
                actionable summaries in seconds. Perfect for professionals, students, 
                and content creators...
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-white/80">AI Processing Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
