from .config import Scrape
from .config import Filter
import asyncio
import sys
import json
import os
from dotenv import load_dotenv
import logging
from .browser_pool import (
    shutdown_global_browser_pool,
    get_global_browser_pool,
    reset_global_browser_pool,
)

load_dotenv()
instructions = os.getenv("GROQ_INSTRUCTIONS")

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.CRITICAL)


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
            logger.info(f"Starting to scrape: {url}")
            result = await s.scraper(url)
            logger.info(f"Completed scraping: {url}")
            return result
        except Exception as e:
            logger.error(f"Error scraping {url}: {e}")
            return {}


async def scrape_multiple_sites(
    user_input, concurrency_limit=4, pool_size=4, max_retries=2
):
    """
    Scrapes multiple e-commerce websites asynchronously with browser pool.

    Args:
        user_input: Search query
        concurrency_limit: Max concurrent scraping tasks (should match pool_size)
        pool_size: Number of browsers in the pool
        max_retries: Number of times to retry if scraping fails
    """
    urls = {
        "amazon": f"https://www.amazon.in/s?k={user_input}&s=price-dses-rank",
        "flipkart": f"https://www.flipkart.com/search?q={user_input}",
        "snapdeal": f"https://www.snapdeal.com/search?keyword={user_input}",
        "jiomart": f"https://www.jiomart.com/search/{user_input}",
        "meesho": f"https://www.meesho.com/search?q={user_input}&searchType=manual&searchIdentifier=text_search",
        "myntra": f"https://www.myntra.com/{user_input}?rawQuery={user_input}",
    }

    logger.info(f"Generated URLs for scraping: {list(urls.values())}")

    for attempt in range(max_retries + 1):
        try:
            if attempt > 0:
                logger.warning(
                    f"Retrying scraping attempt {attempt + 1}/{max_retries + 1}"
                )
                # Reset browser pool on retry
                browser_pool = await reset_global_browser_pool(pool_size)
            else:
                # Initialize browser pool first
                logger.info(f"Initializing browser pool with {pool_size} browsers...")
                browser_pool = await get_global_browser_pool(pool_size)

            # Print pool stats
            stats = await browser_pool.get_pool_stats()
            logger.info(
                f"Browser pool ready - Available: {stats['available']}, Total: {stats['total_browsers']}"
            )

            # Use semaphore to match pool size
            semaphore = asyncio.Semaphore(concurrency_limit)
            s = Scrape.ScraperConfig(user_input, max_products=5, pool_size=pool_size)

            # Set a timeout for the entire scraping operation
            tasks = [scrape_site(s, url, semaphore) for _, url in urls.items()]

            # Wait for all tasks with a global timeout
            results = await asyncio.wait_for(
                asyncio.gather(*tasks, return_exceptions=True),
                timeout=300.0,  # 5 minute total timeout
            )

            final_data = {}
            success_count = 0

            for (site, _), result in zip(urls.items(), results):
                if isinstance(result, Exception):
                    logger.error(f"Error fetching {site}: {result}")
                    final_data[site] = []
                    continue

                filtered = Filter.filter_data(result, site, user_input)
                final_data[site] = convert_to_json(filtered)

                if final_data[site]:  # If we got data
                    success_count += 1

            # Print final pool stats
            final_stats = await browser_pool.get_pool_stats()
            logger.info(f"Scraping complete - Pool stats: {final_stats}")

            # If we got at least some results, return them
            if success_count > 0:
                logger.info(f"Successfully scraped {success_count}/{len(urls)} sites")
                return final_data
            elif attempt < max_retries:
                logger.warning(
                    f"No successful scrapes on attempt {attempt + 1}, retrying..."
                )
                continue
            else:
                logger.error("All scraping attempts failed")
                return final_data

        except asyncio.TimeoutError:
            logger.error(f"Global timeout on scraping attempt {attempt + 1}")
            if attempt < max_retries:
                continue
            else:
                return {site: [] for site in urls.keys()}
        except Exception as e:
            logger.error(f"Error during scraping attempt {attempt + 1}: {e}")
            if attempt < max_retries:
                continue
            else:
                raise

    # This should not be reached, but just in case
    return {site: [] for site in urls.keys()}


async def cleanup_on_shutdown():
    """Call this when your application is shutting down"""
    logger.info("Shutting down browser pool...")
    await shutdown_global_browser_pool()


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <search_query>")
        sys.exit(1)

    string = "+".join(sys.argv[1:])
    logger.info(f"Scraping for: {string}")

    try:
        # Run the scraping
        result = asyncio.run(scrape_multiple_sites(string))
        print(json.dumps(result, indent=2))

    except KeyboardInterrupt:
        logger.info("Received interrupt signal")
    except Exception as e:
        logger.error(f"Scraping failed: {e}")
    finally:
        # Cleanup browser pool on exit
        logger.info("Cleaning up...")
        asyncio.run(cleanup_on_shutdown())
