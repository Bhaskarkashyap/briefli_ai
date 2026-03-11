import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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
    const dailyLimit = isPro ? 999 : 3;

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

    let prompt;
    if (mode === "bullet") {
      prompt = `Summarize the following text into bullet points. Make it concise and capture the main points:\n\n${text}`;
    } else if (mode === "detailed") {
      prompt = `Summarize the following text in detail. Provide a comprehensive summary while keeping it focused on key points:\n\n${text}`;
    } else {
      prompt = `Summarize the following text concisely in paragraph format. Capture the main points:\n\n${text}`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    if (!summary || summary.trim().length === 0) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

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
    
    return NextResponse.json(
      { error: "Failed to generate summary" },
      { status: 500 }
    );
  }
}
