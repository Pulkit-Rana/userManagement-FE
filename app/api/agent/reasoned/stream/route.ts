import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { input, session_id } = await req.json();

    const res = await fetch("http://localhost:8000/chat/reasoned/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input, session_id }),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          // Here you could parse SSE lines if needed or just forward raw chunks
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Stream proxy error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
