import { NextResponse } from "next/server";

export async function POST() {
  try {
    const res = await fetch("http://localhost:8000/chat/reset", {
      method: "POST",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Reset error:", err);
    return NextResponse.json({ error: "Reset failed" }, { status: 500 });
  }
}