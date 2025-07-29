"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/app/ui/components/button";
import { Card } from "@/app/ui/components/card";
import { Textarea } from "@/app/ui/components/textarea";
import { Separator } from "@/app/ui/components/separator";
import { Loader2, RotateCcw, Search } from "lucide-react";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const LOCAL_KEY = "agent-chat-history";

export default function AgentChatBox() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = localStorage.getItem(LOCAL_KEY);
    if (cached) setMessages(JSON.parse(cached));
    else {
      fetch("/api/agent/debug")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.messages)) {
            const history = data.messages.map((m: string, i: number) => ({
              role: i % 2 === 0 ? "user" : "assistant",
              content: m,
            }));
            setMessages(history);
          }
        });
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    localStorage.setItem(LOCAL_KEY, JSON.stringify(messages));
  }, [messages]);

  const send = async (isSearch = false) => {
    if (!input.trim()) return;

    const prompt = input.trim();
    setMessages((prev) => [
      ...prev,
      { role: "user", content: isSearch ? `🔎 Search: ${prompt}` : prompt },
    ]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/reasoned", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: prompt }),
      });

      const data = await res.json();
      const debugInfo = data.intent ? `\n\n🧭 Intent: ${data.intent}` : "";
      const node = data.final_node ? `\n🧩 Node: ${data.final_node}` : "";
      const context = data.context?.length
        ? `\n📂 Context:\n${data.context
            .map((c: any) => `- ${c.title || JSON.stringify(c)}`)
            .join("\n")}`
        : "";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `${data.response || "⚠️ No response"}${debugInfo}${node}${context}`,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Agent failed." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    await fetch("/api/agent/reset", { method: "POST" });
    setMessages([]);
    localStorage.removeItem(LOCAL_KEY);
  };

  return (
    <div className="h-full w-full flex flex-col items-center px-4 sm:px-6 pt-6">

      <Card className="flex flex-col w-full max-w-4xl h-[calc(90vh-120px)] bg-card border shadow-lg rounded-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="flex flex-col space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={clsx(
                  "rounded-2xl px-5 py-4 max-w-[85%] w-fit shadow-sm border whitespace-pre-wrap",
                  m.role === "user"
                    ? "self-end bg-blue-50 border-blue-200 text-black dark:bg-blue-600 dark:border-blue-500 dark:text-white"
                    : "self-start bg-green-50 border-green-200 text-black dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                )}
              >
                <div className="text-xs font-semibold text-muted-foreground mb-1">
                  {m.role === "user" ? "🧑 You" : "🤖 Agent"}
                </div>
                <div className="text-sm leading-relaxed tracking-wide">{m.content}</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        <Separator />

        <div className="bg-background border-t px-4 py-3 flex flex-col sm:flex-row items-end gap-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask anything..."
            className="flex-1 min-h-[48px] max-h-[120px] resize-none border bg-muted text-sm"
          />

          <div className="flex gap-2">
            <Button disabled={loading} onClick={() => send()} className="w-[80px]">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send"}
            </Button>

            <Button variant="outline" onClick={() => send(true)} disabled={loading}>
              <Search className="h-4 w-4 mr-1" /> Search
            </Button>

            <Button variant="ghost" onClick={reset} className="text-destructive">
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}