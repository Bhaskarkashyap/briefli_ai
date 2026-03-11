import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const lastReset = new Date(user.lastResetDate);
    
    if (now.toDateString() !== lastReset.toDateString()) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          dailyUsage: 0,
          lastResetDate: now,
        },
      });
      user.dailyUsage = 0;
    }

    const isPro = user.subscription === "pro";
    const limit = isPro ? 0 : 3;

    return NextResponse.json({
      dailyUsage: user.dailyUsage,
      subscription: user.subscription,
      remaining: isPro ? -1 : Math.max(0, limit - user.dailyUsage),
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage" },
      { status: 500 }
    );
  }
}
