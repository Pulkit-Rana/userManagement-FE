import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    const res = await fetch("http://localhost:8000/chat/reasoned", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("LangGraph UI error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

