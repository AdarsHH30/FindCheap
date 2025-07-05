// TODO: Change to post requrest
export async function GET() {
  const url = "http://127.0.0.1:8000/";
  const response = await fetch(url);
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
