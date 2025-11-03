export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";

  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://127.0.0.1:8000";

  try {
    const upstream = await fetch(
      `${baseUrl}/search/stream/?q=${encodeURIComponent(q)}`,
      {
        headers: { Accept: "text/event-stream" },
        cache: "no-store",
      }
    );

    // If upstream fails, forward status
    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      return new Response(text || "Upstream error", { status: upstream.status });
    }

    // Pipe through the response body to keep the stream intact
    return new Response(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("SSE proxy error:", err);
    return new Response("Failed to open stream", { status: 502 });
  }
}
