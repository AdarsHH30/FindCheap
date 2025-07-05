export async function POST(request: Request) {
  const url = "http://127.0.0.1:8000/search/";

  // Parse JSON body from the incoming request
  const requestBody = await request.json();

  // Forward it as JSON to your external API
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
