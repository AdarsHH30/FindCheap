import Scrape
import asyncio
import sys
import json
import os
import pandas as pd
from groq import Groq


def __Groq(data):
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": f"""
                        You are a filtering agent that takes the data and returns only 5 items with the less price .
                        just return the item not extra text.
                        Here is the data: {data}
                        return data should be :
                        item 1: {{title: "title", price: "price", link: "link"}}
                        item 2: {{title: "title", price: "price", link: "link"}}
                        item 3: {{title: "title", price: "price", link: "link"}}
                        item 4: {{title: "title", price: "price", link: "link"}}
                        item 5: {{title: "title", price: "price", link: "link"}}
                """,
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    print(chat_completion.choices[0].message.content)


# def save_to_json(data, filename="results.json"):
#     with open(filename, "w") as f:
#         json.dump(data, f, indent=4)
#     print(f"Data saved to {filename}")


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
    This function takes the user input and sends it to the scraper with different URLs.
    """
    amazon_url = f"https://www.amazon.in/s?k={user_input}&s=price-asc-rank"
    flipkart_url = f"https://www.flipkart.com/search?q={user_input}&sort=price_asc"

    # Run multiple scrapers concurrently
    (flipkart_data, amazon_data) = await asyncio.gather(
        Scrape.scraper(user_input, flipkart_url),
        Scrape.scraper(user_input, amazon_url),
        return_exceptions=True,
    )

    print("Raw Flipkart data:")
    data = pd.DataFrame(flipkart_data)
    data = __Groq(data)
    print(data)
    print("Raw Amazon data:")
    data = pd.DataFrame(amazon_data)
    data = __Groq(data)
    print(data)

    # # Process the data correctly
    # if isinstance(flipkart_data, dict) and "products" in flipkart_data:
    #     flipkart_df = pd.DataFrame(flipkart_data["products"])
    #     print("\n\nFlipkart data \n")
    #     print(flipkart_df)
    # elif isinstance(flipkart_data, Exception):
    #     print(f"Flipkart scraping failed: {flipkart_data}")
    # else:
    #     print("Flipkart data format issue:", type(flipkart_data))

    # if isinstance(amazon_data, dict) and "products" in amazon_data:
    #     amazon_df = pd.DataFrame(amazon_data["products"])
    #     print("\nAmazon data \n")
    #     print(amazon_df)
    # elif isinstance(amazon_data, Exception):
    #     print(f"Amazon scraping failed: {amazon_data}")
    # else:
    #     print("Amazon data format issue:", type(amazon_data))


if __name__ == "__main__":
    asyncio.run(scrape_multiple_sites(sys.argv[1]))
