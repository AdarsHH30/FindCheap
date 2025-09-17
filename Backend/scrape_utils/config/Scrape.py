import asyncio
import random
import tempfile
import os
from pathlib import Path
from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    CrawlerRunConfig,
    CacheMode,
)
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
import json
from dotenv import load_dotenv
from scrape_utils.utils import schema_setup
from ..browser_pool import get_global_browser_pool

load_dotenv()


class ScraperConfig:
    def __init__(self, user_input: str, max_products: int = 5, pool_size: int = 4):
        self.user_input = user_input
        self.max_products = max_products
        self.pool_size = pool_size
        self.browser_pool = None

    async def get_browser_pool(self):
        """Get or initialize the browser pool"""
        if self.browser_pool is None:
            self.browser_pool = await get_global_browser_pool(self.pool_size)
        return self.browser_pool

    def schema_setup(self, URL: str):
        link = URL.lower()
        max_products = self.max_products

        if "amazon" in link:
            schema = schema_setup.choose_schema("amazon", max_products)
        elif "flipkart" in link:
            schema = schema_setup.choose_schema("flipkart", max_products)
        elif "snapdeal" in link:
            schema = schema_setup.choose_schema("snapdeal", max_products)
        elif "jiomart" in link:
            schema = schema_setup.choose_schema("jiomart", max_products)
        elif "meesho" in link:
            schema = schema_setup.choose_schema("meesho", max_products)
        elif "myntra" in link:
            schema = schema_setup.choose_schema("myntra", max_products)
        else:
            raise ValueError(f"Unsupported website: {URL}")

        return JsonCssExtractionStrategy(schema)

    def _get_site_specific_config(self, url: str):
        """Get site-specific configurations for better success rates"""
        url_lower = url.lower()

        # Base configuration
        config = {
            "delay_before_return_html": 3.0,
            "wait_for_images": True,
        }

        if "amazon" in url_lower:
            config["delay_before_return_html"] = 5.0
        elif "meesho" in url_lower or "jiomart" in url_lower:
            config["delay_before_return_html"] = 4.0
        elif "flipkart" in url_lower:
            config["delay_before_return_html"] = 3.5

        return config

    async def scraper(self, url: str, max_retries: int = 3):
        """Enhanced scraper using browser pool"""

        site_config = self._get_site_specific_config(url)
        browser_pool = await self.get_browser_pool()

        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    delay = random.uniform(2**attempt, 2 ** (attempt + 1))
                    print(f"Retry attempt {attempt + 1} after {delay:.2f}s delay")
                    await asyncio.sleep(delay)

                try:

                    async def scrape_with_browser():
                        async with browser_pool.get_browser() as crawler:
                            run_conf = CrawlerRunConfig(
                                extraction_strategy=self.schema_setup(url),
                                cache_mode=CacheMode.BYPASS,
                                wait_for_images=site_config["wait_for_images"],
                                delay_before_return_html=site_config[
                                    "delay_before_return_html"
                                ],
                            )

                            result = await asyncio.wait_for(
                                crawler.arun(url=url, config=run_conf),
                                timeout=45.0,
                            )
                            return result

                    result = await asyncio.wait_for(scrape_with_browser(), timeout=60.0)
                    e_commerce = self._get_ecommerce_platform(url)

                    if result.success:
                        if result.extracted_content:
                            try:
                                extracted_data = json.loads(result.extracted_content)

                                if self._validate_extracted_data(
                                    extracted_data, e_commerce
                                ):
                                    print(
                                        f"Successfully scraped {e_commerce} on attempt {attempt + 1}"
                                    )
                                    return {
                                        f"{e_commerce}": (
                                            extracted_data
                                            if isinstance(extracted_data, list)
                                            else [extracted_data]
                                        )
                                    }
                                else:
                                    print(
                                        f"Invalid data from {e_commerce} on attempt {attempt + 1}"
                                    )
                                    if attempt == max_retries - 1:
                                        print(
                                            "Last attempt - trying with extended delay"
                                        )
                                        await asyncio.sleep(2)
                                        continue

                            except json.JSONDecodeError as e:
                                print(
                                    f"JSON parse error for {url} on attempt {attempt + 1}: {str(e)}"
                                )
                                continue
                        else:
                            print(
                                f"No content extracted for {url} on attempt {attempt + 1}"
                            )
                            continue
                    else:
                        print(
                            f"Scraping failed for {url} on attempt {attempt + 1}: {result.error_message}"
                        )
                        continue

                except asyncio.TimeoutError:
                    print(f"Timeout during scraping attempt {attempt + 1} for {url}")
                    continue
                except Exception as inner_e:
                    print(
                        f"Inner exception during scraping attempt {attempt + 1}: {str(inner_e)}"
                    )
                    continue

            except Exception as e:
                print(f"Exception during scraping attempt {attempt + 1}: {str(e)}")
                if "Target closed" in str(e) or "Connection refused" in str(e):
                    await asyncio.sleep(5)
                continue

        return {
            "products": [],
            "error": f"Failed to scrape {url} after {max_retries} attempts",
            "platform": self._get_ecommerce_platform(url),
        }

    def _get_ecommerce_platform(self, url: str) -> str:
        """Extract e-commerce platform from URL"""
        url_lower = url.lower()
        platforms = {
            "amazon": "amazon",
            "flipkart": "flipkart",
            "snapdeal": "snapdeal",
            "jiomart": "jiomart",
            "meesho": "meesho",
            "myntra": "myntra",
        }

        for platform, name in platforms.items():
            if platform in url_lower:
                return name
        return "unknown"

    def _validate_extracted_data(self, data, platform: str) -> bool:
        """Enhanced validation with platform-specific checks"""
        if not data:
            return False

        if isinstance(data, list):
            if not data:
                return False

            valid_items = 0
            for item in data[:3]:
                if isinstance(item, dict):
                    if platform == "amazon":
                        required_fields = ["title", "price"]
                    elif platform in ["meesho", "jiomart"]:
                        required_fields = ["title"]
                    else:
                        required_fields = ["title", "price"]

                    if any(field in item and item[field] for field in required_fields):
                        valid_items += 1

            return valid_items > 0

        elif isinstance(data, dict):
            return len(data) > 0 and any(v for v in data.values() if v)

        return True
