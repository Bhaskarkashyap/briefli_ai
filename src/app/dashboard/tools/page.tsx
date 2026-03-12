"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { Scissors, Copy, Download, Loader2 } from "lucide-react";

function SummarizerContent() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"bullet" | "paragraph">("bullet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState(3);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    async function fetchUsage() {
      try {
        const res = await fetch("/api/user/usage");
        const data = await res.json();
        setRemaining(data.remaining);
        setIsPro(data.subscription === "pro");
      } catch (err) {
        console.error("Failed to fetch usage", err);
      }
    }
    fetchUsage();
  }, []);

  const maxWords = isPro ? 10000 : 500;

  const handleInputChange = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words <= maxWords || text.length < input.length) {
      setInput(text);
      setWordCount(words);
    }
  };

  const handleSummarize = async () => {
    if (!input.trim()) return;
    if (remaining <= 0 && !isPro) {
      setError("Daily limit reached. Upgrade to Pro for unlimited summaries.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input, mode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setOutput(data.summary);
      setRemaining((prev) => prev - 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-3xl font-bold mb-2"
          style={{ fontFamily: "var(--font-outfit)" }}
        >
          AI Summarizer
        </h1>
        <p className="text-text-secondary">
          Transform long content into concise summaries
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Input Text
            </h2>
            <span
              className={`text-sm ${
                wordCount > maxWords * 0.9
                  ? "text-error"
                  : "text-text-muted"
              }`}
            >
              {wordCount} / {maxWords} words
            </span>
          </div>

          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste or type your content here..."
            className="w-full h-64 px-4 py-3 rounded-lg bg-bg-tertiary border border-border focus:border-accent-primary outline-none transition resize-none"
          />

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              Summary Mode
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setMode("bullet")}
                className={`px-4 py-2 rounded-lg transition ${
                  mode === "bullet"
                    ? "gradient-bg text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                }`}
              >
                Bullet Points
              </button>
              <button
                onClick={() => setMode("paragraph")}
                className={`px-4 py-2 rounded-lg transition ${
                  mode === "paragraph"
                    ? "gradient-bg text-white"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-primary"
                }`}
              >
                Paragraph
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-error/10 border border-error text-error px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={handleSummarize}
            disabled={loading || !input.trim()}
            className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Scissors className="w-5 h-5" />
                Generate Summary
              </>
            )}
          </button>

          <p className="text-sm text-text-muted mt-3 text-center">
            {isPro ? (
              <span className="text-success">Unlimited summaries remaining</span>
            ) : (
              <span>{remaining} of 3 free summaries remaining today</span>
            )}
          </p>
        </div>

        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--font-outfit)" }}
            >
              Summary
            </h2>
            {output && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-bg-tertiary hover:bg-bg-primary transition"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                {isPro && (
                  <button
                    onClick={handleExport}
                    className="p-2 rounded-lg bg-bg-tertiary hover:bg-bg-primary transition"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="w-full h-64 px-4 py-3 rounded-lg bg-bg-tertiary border border-border overflow-auto">
            {output ? (
              <pre className="whitespace-pre-wrap text-text-secondary">
                {output}
              </pre>
            ) : (
              <p className="text-text-muted text-center py-8">
                Your summary will appear here
              </p>
            )}
          </div>

          {copied && (
            <p className="text-sm text-success mt-2 text-center">
              Copied to clipboard!
            </p>
          )}

          {!isPro && output && (
            <p className="text-sm text-text-muted mt-3 text-center">
              Upgrade to Pro for export and unlimited summaries
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SummarizerPage() {
  return (
    <SessionProvider>
      <SummarizerContent />
    </SessionProvider>
  );
}
