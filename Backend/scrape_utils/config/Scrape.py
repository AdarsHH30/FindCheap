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

    async def scraper(self, url: str):
        # proxies = ProxyConfig.from_env()
        # if not proxies:
        #     print("No proxies found in environment. Set PROXIES env variable!")
        #     return
        # proxy_strategy = RoundRobinProxyStrategy(proxies=proxies)

        # TODO : Implement proxy rotation logic

        browser_conf = BrowserConfig(
            browser_type="chromium",
            headless=True,
            extra_args=[
                "--disable-blink-features=AutomationControlled",
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
                "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "--disable-features=VizDisplayCompositor",
                "--disable-ipc-flooding-protection",
            ],
        )

        run_conf = CrawlerRunConfig(
            extraction_strategy=self.schema_setup(url),
            cache_mode=CacheMode.BYPASS,
            # proxy_rotation_strategy=proxy_strategy,
        )

        async with AsyncWebCrawler(config=browser_conf) as crawler:
            result = await crawler.arun(url=url, config=run_conf)
            # check what e-commnerce site is being scraped
            e_commerce = ""
            if "amazon" in url.lower():
                e_commerce = "amazon"
            elif "flipkart" in url.lower():
                e_commerce = "flipkart"
            elif "snapdeal" in url.lower():
                e_commerce = "snapdeal"
            elif "jiomart" in url.lower():
                e_commerce = "jiomart"
            elif "meesho" in url.lower():
                e_commerce = "meesho"
            elif "myntra" in url.lower():
                e_commerce = "myntra"

            if result.success:
                print(f"Extraction successful for {url}")
                if result.extracted_content:
                    try:
                        extracted_data = json.loads(result.extracted_content)
                        return {
                            f"{e_commerce}": (
                                extracted_data
                                if isinstance(extracted_data, list)
                                else [extracted_data]
                            )
                        }
                    except json.JSONDecodeError as e:
                        print(f"Failed to parse extracted content: {str(e)}")
                        return {
                            "products": [],
                            "error": f"Failed to parse extracted content: {str(e)}",
                        }
                else:
                    print("No content extracted")
                    return {"products": [], "message": "No content extracted"}
            else:
                return {"error": result.error_message, "products": []}


# async def main():
#     user_input = "laptop"
#     website = "https://www.flipkart.com/search?q=iphone%2016%20pro"
#     max_products = 5

#     # Create scraper instance and run
#     config = ScraperConfig(user_input, website, max_products)
#     products = await config.scraper()
#     print("Results:", products)


# if __name__ == "__main__":
#     asyncio.run(main())
