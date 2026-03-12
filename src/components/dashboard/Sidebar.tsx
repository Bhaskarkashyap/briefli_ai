"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Zap,
  LayoutDashboard,
  Scissors,
  Settings,
  LogOut,
  Crown,
  CreditCard,
  HelpCircle,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "../ui/ThemeToggle";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/tools", icon: Scissors, label: "Summarizer" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const bottomItems = [
  { href: "/pricing", icon: Crown, label: "Upgrade Plan" },
  { href: "/dashboard/settings", icon: HelpCircle, label: "Help & Support" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="w-64 h-screen bg-bg-secondary border-r border-border fixed left-0 top-0 flex flex-col">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center shadow-lg shadow-accent-primary/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-base font-semibold" style={{ fontFamily: "var(--font-outfit)" }}>
            Briefliii AI
          </span>
        </Link>
      </div>

      <div className="p-3">
        <div className="card p-3 bg-gradient-to-br from-bg-tertiary to-bg-secondary">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {session?.user?.name?.[0] || session?.user?.email?.[0] || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || session?.user?.email || "User"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-bg-primary/50">
            <Crown className="w-3 h-3 text-rose-500" />
            <span className="text-xs">Free Plan</span>
            <Link href="/pricing" className="ml-auto text-xs text-accent-primary hover:underline">
              Upgrade
            </Link>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-3 mb-2">
          Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-accent-primary/20 to-transparent text-accent-primary border-l-2 border-accent-primary"
                      : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? "text-accent-primary" : ""}`} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-xs font-medium text-text-muted uppercase tracking-wider px-3 mt-4 mb-2">
          Support
        </p>
        <ul className="space-y-0.5">
          {bottomItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-all"
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-3 border-t border-border">
      
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary bg-red-500/10 hover:text-red-500 w-full transition-all group justify-center cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
