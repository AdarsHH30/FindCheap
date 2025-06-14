import Scrape
import asyncio
import sys

import os

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
                You are a helpful data cleaner for Amazon product listings.
                convert the given data into DataFrame format with the following columns:
                - title: The product title
                - price: The product price
                - link: The product link
                - rating: The product rating
                - reviews: The number of reviews
                - image: The product image URL
                Data : {data}
                """,
            }
        ],
        model="llama-3.3-70b-versatile",
    )

    print(chat_completion.choices[0].message.content)


async def main(user_input):
    # Call scrape functions with the user input
    results = await Scrape.main(user_input)
    return results


def run_scrape(user_input):
    print("User input received:", user_input)
    results = asyncio.run(main(user_input))
    print("Scraping completed. Cleaning data...")
    print("Results:", results)
    # __Groq(results)
    # Print the first 5 items from results


if __name__ == "__main__":

    run_scrape(sys.argv[1])  # Get the user input from command line arguments
