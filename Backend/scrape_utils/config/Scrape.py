import asyncio
import random
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


load_dotenv()


class ScraperConfig:
    def __init__(self, user_input: str, max_products: int = 5):
        self.user_input = user_input
        self.max_products = max_products

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

    def _get_random_user_agent(self):
        """Get a random user agent string"""
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
        ]
        return random.choice(user_agents)

    def _create_browser_config(self) -> BrowserConfig:
        """Create browser configuration"""
        return BrowserConfig(
            browser_type="chromium",
            headless=True,
            extra_args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-popups",
                "--disable-infobars",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-setuid-sandbox",
                "--disable-web-security",
                "--allow-running-insecure-content",
                "--ignore-certificate-errors",
                "--disable-extensions",
                "--disable-popup-blocking",
                "--disable-background-networking",
                "--disable-sync",
                "--disable-translate",
                f"--user-agent={self._get_random_user_agent()}",
                "--disable-features=VizDisplayCompositor",
                "--disable-ipc-flooding-protection",
                "--window-size=1920,1080",
                "--disable-logging",
                "--disable-dev-tools",
                "--no-first-run",
                "--disable-default-apps",
                "--disable-background-timer-throttling",
                "--disable-renderer-backgrounding",
                "--disable-backgrounding-occluded-windows",
                "--disable-field-trial-config",
            ],
        )

    async def scraper(self, url: str, max_retries: int = 1):
        """Simplified scraper using direct AsyncWebCrawler"""

        site_config = self._get_site_specific_config(url)

        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    delay = random.uniform(2**attempt, 2 ** (attempt + 1))
                    print(f"Retry attempt {attempt + 1} after {delay:.2f}s delay")
                    await asyncio.sleep(delay)

                try:
                    browser_config = self._create_browser_config()

                    async with AsyncWebCrawler(config=browser_config) as crawler:
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
