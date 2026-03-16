"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Zap, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error("Invalid email or password");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Something went wrong");
  }
} finally {
  setLoading(false);
}
  }

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
            Welcome back
          </h1>
          <p className="text-text-secondary mb-8">
            Enter your credentials to access your account
          </p>

          {error && (
            <div className="bg-error/10 border border-error text-error px-4 py-2 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="*******"
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-text-secondary mt-8">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-accent-primary hover:underline font-medium">
              Sign up for free
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
              <p className="text-text-secondary text-sm leading-relaxed">
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
