export async function POST(request: Request) {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_API_URL
      : "http://127.0.0.1:8000";
  const url = `${baseUrl}/search/`;

  const requestBody = await request.json();

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(360000), // 6 minutes
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in find-products API route:", error);
    
    if (error instanceof Error) {
      if (error.name === 'TimeoutError') {
        return new Response(
          JSON.stringify({ 
            error: "Request timeout - scraping took too long",
            details: "The scraping operation timed out. Please try again." 
          }), 
          { 
            status: 504,
            headers: { "Content-Type": "application/json" }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to fetch data",
          details: error.message 
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: "Unknown error occurred",
        details: "An unexpected error occurred while processing your request." 
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
