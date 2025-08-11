from .config import Scrape
from .config import Filter
import asyncio
import sys
import json
import os

# from groq import Groq
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
    meesho_url = f"https://www.meesho.com/search?q={user_input}"
    myntra_url = f"https://www.myntra.com/{user_input}?rawQuery={user_input}"

    s = Scrape.ScraperConfig(user_input, 5)

    flipkart_task = s.scraper(flipkart_url)
    amazon_task = s.scraper(amazon_url)
    snapdeal_task = s.scraper(snapdeal_url)
    jiomart_task = s.scraper(jiomart_url)
    meesho_task = s.scraper(meesho_url)
    myntra_task = s.scraper(myntra_url)

    (
        flipkart_data,
        amazon_data,
        snapdeal_data,
        jiomart_data,
        meesho_data,
        myntra_data,
    ) = await asyncio.gather(
        flipkart_task,
        amazon_task,
        snapdeal_task,
        jiomart_task,
        meesho_task,
        myntra_task,
        return_exceptions=True,
    )
    print("Jiomart data:", jiomart_data)
    flipkart = Filter.filter_data(flipkart_data, "flipkart", user_input)
    amazon = Filter.filter_data(amazon_data, "amazon", user_input)
    snapdeal = Filter.filter_data(snapdeal_data, "snapdeal", user_input)
    jiomart = Filter.filter_data(jiomart_data, "jiomart", user_input)
    meesho = Filter.filter_data(meesho_data, "meesho", user_input)
    myntra = Filter.filter_data(myntra_data, "myntra", user_input)

    # Convert to JSON
    flipkart_json = convert_to_json(flipkart)
    amazon_json = convert_to_json(amazon)
    snapdeal_json = convert_to_json(snapdeal)
    jiomart_json = convert_to_json(jiomart)
    meesho_json = convert_to_json(meesho)
    myntra_json = convert_to_json(myntra)
    print("Jiomart JSON:", jiomart_json)

    print("meeshoo JSON:", meesho_json)

    return {
        "flipkart": flipkart_json,
        "amazon": amazon_json,
        "snapdeal": snapdeal_json,
        "jiomart": jiomart_json,
        "meesho": meesho_json,
        "myntra": myntra_json,
    }


if __name__ == "__main__":
    input_args = sys.argv[1:]
    string = "+".join(input_args)
    print("Input arguments:", string)

    asyncio.run(scrape_multiple_sites(string))
