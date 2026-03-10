import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { text, mode } = await req.json();

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
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
    const dailyLimit = isPro ? 0 : 3;

    if (!isPro && user.dailyUsage >= dailyLimit) {
      return NextResponse.json(
        { error: "Daily limit reached. Upgrade to Pro for unlimited summaries." },
        { status: 429 }
      );
    }

    const wordCount = text.trim().split(/\s+/).length;
    const maxWords = isPro ? 10000 : 500;

    if (wordCount > maxWords) {
      return NextResponse.json(
        { error: `Word limit exceeded. ${isPro ? "Pro allows up to 10,000 words." : "Free tier allows up to 500 words."}` },
        { status: 400 }
      );
    }

    const style = mode === "bullet" ? "bullet points" : "paragraph format";
    
    const prompt = `Summarize the following text in ${style}. Make it concise and capture the main points:\n\n${text}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert at summarizing content. Provide clear, accurate summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1000,
    });

    const summary = completion.choices[0]?.message?.content || "Failed to generate summary";

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        dailyUsage: user.dailyUsage + 1,
      },
    });

    await prisma.summary.create({
      data: {
        userId: session.user.id,
        inputText: text,
        output: summary,
        mode,
        wordCount,
      },
    });

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("Summarization error:", error);
    
    if (error.code === "insufficient_quota") {
      return NextResponse.json(
        { error: "AI service temporarily unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
