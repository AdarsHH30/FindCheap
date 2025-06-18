from amazon import Scrape
import asyncio
import sys
import json
import os
import pandas as pd
from groq import Groq


def __Groq(data, user_input):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"""

                        You are a smart filtering agent. Your task is to return the 5 most relevant and cheapest items based on the user's search input.
                        Instructions:
                        Input Matching Priority:
                        First, return items that closely match the user's input ({user_input}) in title or keywords.
                        Second, among those matches, return the 5 items with the lowest non-zero prices.
                        If exact matches are fewer than 5, fill remaining slots with similar items (closely related keywords).
                        Data Handling:
                        Input data is provided in {data}.
                        Skip items that have missing, zero, or invalid prices.
                        Avoid duplicates based on title or link.
                        Output Format:
                        Return only the result — no extra text. Use this exact format:
                        item 1: {{title: "title", price: "price", link: "link"}}
                        item 2: {{title: "title", price: "price", link: "link"}}
                        item 3: {{title: "title", price: "price", link: "link"}}
                        item 4: {{title: "title", price: "price", link: "link"}}
                        item 5: {{title: "title", price: "price", link: "link"}}
                        Example of user intent:
                        {user_input} → "wireless earbuds with noise cancellation"

                        Now filter {data} based on these instructions.
                """,
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    print(chat_completion.choices[0].message.content)


def save_to_json(data, filename):
    # Create the directory if it doesn't exist
    # os.makedirs(os.path.dirname(filename), exist_ok=True)

    with open(filename, "w") as f:
        json.dump(data, f, indent=4)
    print(f"Data saved to {filename}")


# async def call_scraper(user_input, URL):
#     # Call scrape functions with the user input - Fixed the function call
#     results = await Scrape.scraper(user_input, URL)
#     return results


# async def run_scrape(user_input, URL):
#     print("User input received:", user_input)
#     # Fixed the URL formatting
#     results = await call_scraper(user_input, URL)
#     # convert data into DataFrame format


async def scrape_multiple_sites(user_input):
    """
    This function takes the user input and sends it to th
    e scraper with different URLs.
    """
    amazon_url = f"https://www.amazon.in/s?k={user_input}"
    flipkart_url = f"https://www.flipkart.com/search?q={user_input}"
    snapdeal_url = f"https://www.snapdeal.com/search?keyword={user_input}"

    s = Scrape.ScraperConfig(user_input, 5)

    # Get coroutine objects (DO NOT await here)
    flipkart_task = s.scraper(flipkart_url)
    amazon_task = s.scraper(amazon_url)
    snapdeal_task = s.scraper(snapdeal_url)

    # Run them concurrently
    flipkart_data, amazon_data, snapdeal_data = await asyncio.gather(
        flipkart_task,
        amazon_task,
        snapdeal_task,
        return_exceptions=True,
    )

    if isinstance(snapdeal_data, Exception):
        print(f"Snapdeal scraping failed: {snapdeal_data}")
        snapdeal_data = {"products": [], "error": str(snapdeal_data)}

    print("Raw Snapdeal data:")
    save_to_json(snapdeal_data, "snapdeal_data.json")

    if isinstance(flipkart_data, Exception):
        print(f"Flipkart scraping failed: {flipkart_data}")
        flipkart_data = {"products": [], "error": str(flipkart_data)}

    print("Raw Flipkart data:")
    save_to_json(flipkart_data, "flipkart_data.json")

    if isinstance(amazon_data, Exception):
        print(f"Amazon scraping failed: {amazon_data}")
        amazon_data = {"products": [], "error": str(amazon_data)}

    print("Raw Amazon data:")
    save_to_json(amazon_data, "amazon_data.json")

    return amazon_data


if __name__ == "__main__":
    input_args = sys.argv[1:]
    string = "+".join(input_args)
    print("Input arguments:", string)

    asyncio.run(scrape_multiple_sites(string))
