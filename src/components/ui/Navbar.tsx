"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const isDashboard = pathname?.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isLanding = !isDashboard && !isAuthPage;

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold" style={{ fontFamily: "var(--font-outfit)" }}>
              Briefliii AI
            </span>
          </Link>

          {isLanding && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/#features"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                Pricing
              </Link>
            </div>
          )}

          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <>
                <Link href="/dashboard" className="btn-primary">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : isAuthPage ? (
              <ThemeToggle />
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
                >
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary">
                  Get Started
                </Link>
                <ThemeToggle />
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {isLanding && !session && (
              <Link href="/register" className="btn-primary text-sm px-3 py-2">
                Get Started
              </Link>
            )}
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden glass border-t border-[var(--border)]">
          <div className="px-4 py-4 space-y-3">
            {isLanding && (
              <>
                <Link
                  href="/#features"
                  className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => setIsOpen(false)}
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => setIsOpen(false)}
                >
                  Pricing
                </Link>
              </>
            )}
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : !isAuthPage && (
              <>
                <Link
                  href="/login"
                  className="block text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link href="/register" className="btn-primary block text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
