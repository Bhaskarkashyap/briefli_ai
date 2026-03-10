import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UsageMeter } from "@/components/dashboard/UsageMeter";
import Link from "next/link";
import { Scissors, FileText, Clock } from "lucide-react";
import { Summary } from "@prisma/client";

async function getUserUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  return user;
}

async function getRecentSummaries(userId: string): Promise<Summary[]> {
  const summaries = await prisma.summary.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  return summaries;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserUsage(session.user.id);
  const recentSummaries = await getRecentSummaries(session.user.id);

  const isPro = user?.subscription === "pro";
  const dailyLimit = isPro ? 0 : 3;
  const used = user?.dailyUsage || 0;

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Welcome back, {user?.name || "User"}!
        </h1>
        <p className="text-[var(--text-secondary)]">
          Here&apos;s your usage overview
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <UsageMeter
            used={used}
            limit={dailyLimit}
            label="Daily Summaries"
          />
        </div>
        <div className="card p-6 flex items-center justify-between">
          <div>
            <p className="text-[var(--text-secondary)] text-sm mb-1">
              Current Plan
            </p>
            <p
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {isPro ? "Pro" : "Free"}
            </p>
          </div>
          {!isPro && (
            <Link href="/dashboard/settings?upgrade=true" className="btn-primary">
              Upgrade
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/dashboard/tools"
          className="card p-6 hover:border-[var(--accent-primary)] transition group"
        >
          <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            New Summary
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">
            Create a new AI-powered summary
          </p>
        </Link>

        <div className="card p-6">
          <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Total Summaries
          </h3>
          <p className="text-2xl font-bold">{recentSummaries.length}</p>
        </div>

        <div className="card p-6">
          <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <h3
            className="text-lg font-semibold mb-2"
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Time Saved
          </h3>
          <p className="text-2xl font-bold">
            {Math.floor((recentSummaries.length * 5) / 60)}h{" "}
            {(recentSummaries.length * 5) % 60}m
          </p>
        </div>
      </div>

      <div className="card p-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          Recent Activity
        </h3>
        {recentSummaries.length > 0 ? (
          <div className="space-y-3">
            {recentSummaries.map((summary) => (
              <div
                key={summary.id}
                className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {summary.inputText.substring(0, 50)}...
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {new Date(summary.createdAt).toLocaleDateString()} •{" "}
                    {summary.mode}
                  </p>
                </div>
                <span className="text-sm text-[var(--text-secondary)] ml-4">
                  {summary.wordCount} words
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[var(--text-secondary)] text-center py-8">
            No summaries yet.{" "}
            <Link
              href="/dashboard/tools"
              className="text-[var(--accent-primary)] hover:underline"
            >
              Create your first one!
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
