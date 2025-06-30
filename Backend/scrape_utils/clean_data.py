from .config import Scrape
from .config import Filter
import asyncio
import sys
import json
import os
import pandas as pd
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
instructions = os.getenv("GROQ_INSTRUCTIONS")


# def __Groq(data, user_input):
#     client = Groq(
#         api_key=os.environ.get("GROQ_API_KEY"),
#     )
#     chat_completion = client.chat.completions.create(
#         messages=[
#             {
#                 "role": "user",
#                 "content": f" Just return the JSON data not any other extra data.{instructions}",
#             },
#             {
#                 "role": "user",
#                 "content": f"{user_input}{data}",
#             },
#         ],
#         model="llama-3.3-70b-versatile",
#     )
#     print("Chat completion response:", chat_completion)
#     return convert_to_json(chat_completion.choices[0].message.content)


def convert_to_json(data):
    if isinstance(data, str):
        try:
            return json.loads(data)
        except json.JSONDecodeError:
            print("Error decoding JSON from string")
            return []
    elif isinstance(data, list):
        return data
    elif isinstance(data, dict):
        return [data]
    else:
        print("Unsupported data type for conversion to JSON")
        return []


def save_to_json(data, filename):
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    print(f"Data saved to {filename}")


async def scrape_multiple_sites(user_input):
    """
    This function takes the user input and sends it to th
    e scraper with different URLs.

    """

    amazon_url = f"https://www.amazon.in/s?k={user_input}"
    flipkart_url = f"https://www.flipkart.com/search?q={user_input}"
    snapdeal_url = f"https://www.snapdeal.com/search?keyword={user_input}"
    jiomart_url = f"https://www.jiomart.com/search/{user_input}"

    s = Scrape.ScraperConfig(user_input, 5)

    # Get coroutine objects (DO NOT await here)
    flipkart_task = s.scraper(flipkart_url)
    amazon_task = s.scraper(amazon_url)
    snapdeal_task = s.scraper(snapdeal_url)
    jiomart_task = s.scraper(jiomart_url)
    print(jiomart_task)

    # Run them concurrently
    flipkart_data, amazon_data, snapdeal_data, jiomart_data = await asyncio.gather(
        flipkart_task,
        amazon_task,
        snapdeal_task,
        jiomart_task,
        return_exceptions=True,
    )
    flipkart = Filter.filter_data(flipkart_data, "flipkart")
    amazon = Filter.filter_data(amazon_data, "amazon")
    snapdeal = Filter.filter_data(snapdeal_data, "snapdeal")
    jiomart = Filter.filter_data(jiomart_data, "jiomart")

    # Convert to JSON
    flipkart_json = convert_to_json(flipkart)
    amazon_json = convert_to_json(amazon)
    snapdeal_json = convert_to_json(snapdeal)
    jiomart_json = convert_to_json(jiomart)

    return {
        "flipkart": flipkart_json,
        "amazon": amazon_json,
        "snapdeal": snapdeal_json,
        "jiomart": jiomart_json,
    }


if __name__ == "__main__":
    input_args = sys.argv[1:]
    string = "+".join(input_args)
    print("Input arguments:", string)

    asyncio.run(scrape_multiple_sites(string))
