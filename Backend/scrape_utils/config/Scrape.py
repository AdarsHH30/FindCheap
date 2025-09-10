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

load_dotenv()


class ScraperConfig:
    def __init__(self, user_input: str, max_products: int = 5):
        self.user_input = user_input
        self.max_products = max_products
        self.user_data_dir = self._create_user_data_dir()

    def _create_user_data_dir(self):
        """Create a temporary directory for browser user data"""
        base_dir = Path(tempfile.gettempdir()) / "findcheap_sessions"
        base_dir.mkdir(exist_ok=True)
        session_dir = base_dir / f"session_{random.randint(1000, 9999)}"
        session_dir.mkdir(exist_ok=True)
        return str(session_dir)

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

    def get_random_user_agent(self):
        """Get a random user agent to avoid detection"""
        user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            # Add more user agents for better rotation
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:120.0) Gecko/20100101 Firefox/120.0",
        ]
        return random.choice(user_agents)

    def _get_site_specific_config(self, url: str):
        """Get site-specific configurations for better success rates"""
        url_lower = url.lower()

        # Base configuration
        config = {
            "delay_before_return_html": 3.0,
            "wait_for_images": True,
            "extra_args": [],
        }

        # Site-specific optimizations
        if "amazon" in url_lower:
            config["delay_before_return_html"] = 5.0  # Amazon needs more time
            config["extra_args"].extend(
                [
                    "--disable-blink-features=AutomationControlled",
                    "--exclude-switches=enable-automation",
                    "--disable-extensions-file-access-check",
                    "--disable-plugins-discovery",
                ]
            )
        elif "meesho" in url_lower or "jiomart" in url_lower:
            config["delay_before_return_html"] = 4.0  # These sites can be slow
            config["extra_args"].extend(
                [
                    "--disable-web-security",
                    "--disable-features=VizDisplayCompositor",
                    "--disable-background-timer-throttling",
                ]
            )
        elif "flipkart" in url_lower:
            config["delay_before_return_html"] = 3.5
            config["extra_args"].extend(
                [
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                ]
            )

        return config

    async def initialize_session(self, url: str):
        """Initialize a session by visiting the homepage first"""
        try:
            from urllib.parse import urlparse

            parsed = urlparse(url)
            homepage_url = f"{parsed.scheme}://{parsed.netloc}"

            browser_conf = BrowserConfig(
                browser_type="chromium",
                headless=True,
                user_data_dir=self.user_data_dir,
                extra_args=[
                    "--disable-blink-features=AutomationControlled",
                    "--no-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu",
                    f"--user-agent={self.get_random_user_agent()}",
                    "--window-size=1920,1080",
                    "--disable-infobars",
                ],
            )

            async with AsyncWebCrawler(config=browser_conf) as crawler:
                await crawler.arun(
                    url=homepage_url,
                    config=CrawlerRunConfig(
                        cache_mode=CacheMode.BYPASS,
                        delay_before_return_html=2.0,
                    ),
                )
                print(f"Session initialized for {parsed.netloc}")

        except Exception as e:
            print(f"Failed to initialize session: {str(e)}")

    async def scraper(self, url: str, max_retries: int = 3):
        """Enhanced scraper with better site-specific handling"""

        site_config = self._get_site_specific_config(url)

        await self.initialize_session(url)

        for attempt in range(max_retries):
            try:
                if attempt > 0:
                    delay = random.uniform(2**attempt, 2 ** (attempt + 1))
                    print(f"Retry attempt {attempt + 1} after {delay:.2f}s delay")
                    await asyncio.sleep(delay)

                browser_conf = BrowserConfig(
                    browser_type="chromium",
                    headless=True,
                    user_data_dir=self.user_data_dir,
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
                        f"--user-agent={self.get_random_user_agent()}",
                        "--disable-features=VizDisplayCompositor",
                        "--disable-ipc-flooding-protection",
                        "--window-size=1920,1080",
                        "--disable-logging",
                        "--disable-dev-tools",
                        "--no-first-run",
                        "--disable-default-apps",
                        # Add site-specific args
                        *site_config["extra_args"],
                    ],
                )

                run_conf = CrawlerRunConfig(
                    extraction_strategy=self.schema_setup(url),
                    cache_mode=CacheMode.BYPASS,
                    wait_for_images=site_config["wait_for_images"],
                    delay_before_return_html=site_config["delay_before_return_html"],
                )

                async with AsyncWebCrawler(config=browser_conf) as crawler:
                    result = await crawler.arun(url=url, config=run_conf)
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
                                        # On last attempt, try with different settings
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

            except Exception as e:
                print(f"Exception during scraping attempt {attempt + 1}: {str(e)}")
                if "Target closed" in str(e) or "Connection refused" in str(e):
                    await asyncio.sleep(5)
                continue

        self._cleanup_session()

        return {
            "products": [],
            "error": f"Failed to scrape {url} after {max_retries} attempts",
            "platform": self._get_ecommerce_platform(url),
        }

    def _cleanup_session(self):
        """Clean up temporary session data"""
        try:
            import shutil

            if os.path.exists(self.user_data_dir):
                shutil.rmtree(self.user_data_dir)
                print("Session data cleaned up")
        except Exception as e:
            print(f"Failed to cleanup session data: {str(e)}")

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
