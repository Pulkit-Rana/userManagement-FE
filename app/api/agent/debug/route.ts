import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://localhost:8000/chat/debug");
    const data = await res.json();

    if (!Array.isArray(data.history)) {
      throw new Error("Invalid debug response: history missing");
    }

    const messages = data.history.map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Debug fetch failed:", err);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}
