from .config import Scrape
from .config import Filter
import asyncio
import sys
import json
import os
from dotenv import load_dotenv
import logging

load_dotenv()
instructions = os.getenv("GROQ_INSTRUCTIONS")

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def convert_to_json(data):
    try:
        if isinstance(data, str):
            return json.loads(data)
        elif isinstance(data, (list, dict)):
            return data
    except json.JSONDecodeError:
        logger.error("Error decoding JSON")
    return []


def save_to_json(data, filename):
    with open(filename, "w") as f:
        json.dump(data, f, indent=2)
    logger.info(f"Data saved to {filename}")


async def scrape_site(s, url, semaphore):
    """Helper to scrape a single site with concurrency limit."""
    async with semaphore:
        try:
            return await s.scraper(url)
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return {}


async def scrape_multiple_sites(user_input, concurrency_limit=5):
    """
    Scrapes multiple e-commerce websites asynchronously with concurrency control.
    """
    urls = {
        "amazon": f"https://www.amazon.in/s?k={user_input}&s=price-dses-rank",
        "flipkart": f"https://www.flipkart.com/search?q={user_input}",
        "snapdeal": f"https://www.snapdeal.com/search?keyword={user_input}",
        "jiomart": f"https://www.jiomart.com/search/{user_input}",
        "meesho": f"https://www.meesho.com/search?q={user_input}",
        "myntra": f"https://www.myntra.com/{user_input}?rawQuery={user_input}",
    }

    semaphore = asyncio.Semaphore(concurrency_limit)
    s = Scrape.ScraperConfig(user_input, 5)

    tasks = [scrape_site(s, url, semaphore) for _, url in urls.items()]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    final_data = {}
    for (site, _), result in zip(urls.items(), results):
        if isinstance(result, Exception):
            logger.error(f"Error fetching {site}: {result}")
            final_data[site] = []
            continue

        filtered = Filter.filter_data(result, site, user_input)
        final_data[site] = convert_to_json(filtered)

    return final_data


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <search_query>")
        sys.exit(1)

    string = "+".join(sys.argv[1:])
    logger.info(f"Scraping for: {string}")

    asyncio.run(scrape_multiple_sites(string))
