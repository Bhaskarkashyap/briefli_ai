import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UsageMeter } from "@/components/dashboard/UsageMeter";
import Link from "next/link";
import { 
  Scissors, 
  FileText, 
  Clock, 
  TrendingUp, 
  Zap, 
  Crown,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { Summary } from "@prisma/client";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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

async function getTotalStats(userId: string) {
  const [totalSummaries, totalWords] = await Promise.all([
    prisma.summary.count({ where: { userId } }),
    prisma.summary.aggregate({
      where: { userId },
      _sum: { wordCount: true },
    }),
  ]);
  return { totalSummaries, totalWords: totalWords._sum.wordCount || 0 };
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await getUserUsage(session.user.id);
  const recentSummaries = await getRecentSummaries(session.user.id);
  const stats = await getTotalStats(session.user.id);

  const isPro = user?.subscription === "pro";
  const dailyLimit = isPro ? 999 : 3;
  const used = user?.dailyUsage || 0;
  const timeSaved = Math.floor((stats.totalSummaries * 5));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 
            className="text-3xl font-bold mb-2" 
            style={{ fontFamily: "var(--font-outfit)" }}
          >
            Welcome back, {user?.name?.split(" ")[0] || "User"}!
          </h1>
          <p className="text-text-secondary">
            Here&apos;s what&apos;s happening with your summaries today
          </p>
        </div>
        <div className="flex gap-x-5 items-center justify-center">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
          isPro 
            ? "bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30" 
            : "bg-bg-tertiary border border-border"
        }`}>
          {isPro ? (
            <>
              <Crown className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-rose-500">Pro Member</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 text-accent-primary" />
              <span className="text-sm font-medium">Free Plan</span>
            </>
          )}
        </div>
            <div className="flex items-center justify-between">
          <ThemeToggle />
        </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <UsageMeter
            used={used}
            limit={dailyLimit}
            label="Daily Summaries"
          />
        </div>
        
        <div className="card p-6 flex flex-col justify-between bg-gradient-to-br from-bg-secondary to-bg-tertiary">
          <div>
            <p className="text-text-secondary text-sm mb-1">
              {isPro ? "Pro Features Active" : "Current Plan"}
            </p>
            <p 
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              {isPro ? "Unlimited" : "Free"}
            </p>
          </div>
          {!isPro && (
            <Link 
              href="/pricing" 
              className="mt-4 btn-primary text-center flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Upgrade
            </Link>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/dashboard/tools"
          className="card p-5 hover:border-accent-primary transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent-primary/5 rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform" />
          <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-all">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold mb-1">
            New Summary
          </h3>
          <p className="text-text-secondary text-sm">
            Create AI-powered summary
          </p>
        </Link>

        <div className="card p-5">
          <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-accent-primary" />
          </div>
          <p className="text-text-secondary text-sm mb-1">Total Summaries</p>
          <p className="text-2xl font-bold">{stats.totalSummaries}</p>
          <div className="flex items-center gap-1 mt-2 text-rose-500 text-xs">
            <TrendingUp className="w-3 h-3" />
            <span>All time</span>
          </div>
        </div>

        <div className="card p-5">
          <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-text-secondary text-sm mb-1">Time Saved</p>
          <p className="text-2xl font-bold">
            {timeSaved >= 60 ? `${Math.floor(timeSaved / 60)}h` : `${timeSaved}m`}
          </p>
          <p className="text-text-muted text-xs mt-2">Reading time</p>
        </div>

        <div className="card p-5">
          <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center mb-4">
            <Scissors className="w-6 h-6 text-rose-500" />
          </div>
          <p className="text-text-secondary text-sm mb-1">Words Processed</p>
          <p className="text-2xl font-bold">
            {stats.totalWords.toLocaleString()}
          </p>
          <p className="text-text-muted text-xs mt-2">Total</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold" style={{ fontFamily: "var(--font-outfit)" }}>
              Recent Activity
            </h3>
            {recentSummaries.length > 0 && (
              <Link 
                href="/dashboard/tools" 
                className="text-sm text-accent-primary hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
          
          {recentSummaries.length > 0 ? (
            <div className="space-y-1">
              {recentSummaries.map((summary, index) => (
                <div
                  key={summary.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-tertiary transition"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    index === 0 ? "gradient-bg" : "bg-bg-tertiary"
                  }`}>
                    {index === 0 ? (
                      <Sparkles className="w-5 h-5 text-white" />
                    ) : (
                      <FileText className="w-5 h-5 text-text-secondary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {summary.mode.charAt(0).toUpperCase() + summary.mode.slice(1)} Summary
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {summary.inputText.substring(0, 60)}...
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{summary.wordCount} words</p>
                    <p className="text-xs text-text-muted">
                      {new Date(summary.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-4">
                <Scissors className="w-8 h-8 text-text-muted" />
              </div>
              <p className="text-text-secondary mb-4">
                No summaries yet. Start summarizing!
              </p>
              <Link href="/dashboard/tools" className="btn-primary inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Your First Summary
              </Link>
            </div>
          )}
        </div>

        <div className="card p-6 bg-gradient-to-br from-accent-primary/10 to-transparent border-accent-primary/20">
          <h3 className="text-lg font-semibold mb-4" style={{ fontFamily: "var(--font-outfit)" }}>
            Quick Tips
          </h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Use keyboard shortcuts</p>
                <p className="text-xs text-text-muted">Ctrl+Enter to submit</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Paste any content</p>
                <p className="text-xs text-text-muted">Articles, emails, documents</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Multiple modes</p>
                <p className="text-xs text-text-muted">Brief, Detailed, Bullet points</p>
              </div>
            </div>
          </div>
          
          {!isPro && (
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium mb-3">Unlock more features</p>
              <Link href="/pricing" className="btn-primary w-full text-center block">
                Upgrade to Pro
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
