from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy
from . import Proxy_rotator
import asyncio
import json
import random


class ScraperConfig:
    def __init__(self, user_input: str, max_products: int = 5):
        self.user_input = user_input
        self.max_products = max_products

    def schema_setup(self, URL: str):
        link = URL.lower()
        max_products = self.max_products

        if "amazon" in link:
            schema = {
                "name": "AmazonProducts",
                "baseSelector": "div.s-card-container",
                "fields": [
                    {"name": "title", "selector": "a h2 span", "type": "text"},
                    {
                        "name": "price",
                        "selector": "span.a-price > span.a-offscreen",
                        "type": "text",
                    },
                    {
                        "name": "link",
                        "selector": "a.a-link-normal.s-no-outline",
                        "type": "attribute",
                        "attribute": "href",
                    },
                    {"name": "rating", "selector": "span.a-icon-alt", "type": "text"},
                    {
                        "name": "reviews",
                        "selector": "span.a-size-base.s-underline-text",
                        "type": "text",
                    },
                    {
                        "name": "image",
                        "selector": "img.s-image",
                        "type": "attribute",
                        "attribute": "src",
                    },
                ],
                "limit": max_products,
            }

        elif "flipkart" in link:
            schema = {
                "name": "FlipkartProducts",
                "baseSelector": "[data-id]",
                "fields": [
                    {
                        "name": "title",
                        "selector": "a.wjcEIp, a[title], ._4rR01T, .s1Q9rs, .B_NuCI",
                        "type": "text",
                    },
                    {
                        "name": "price",
                        "selector": "._30jeq3, ._1_WHN1, .Nx9bqj",
                        "type": "text",
                    },
                    {
                        "name": "link",
                        "selector": "a",
                        "type": "attribute",
                        "attribute": "href",
                    },
                    {
                        "name": "rating",
                        "selector": "._3LWZlK, .XQDdHH",
                        "type": "text",
                    },
                    {
                        "name": "reviews",
                        "selector": "span._2_R_DZ, .review-count",
                        "type": "text",
                    },
                    {
                        "name": "image",
                        "selector": "img",
                        "type": "attribute",
                        "attribute": "src",
                    },
                ],
                "limit": max_products,
            }
        elif "snapdeal" in link:
            schema = {
                "name": "SnapdealProducts",
                "baseSelector": ".product-tuple-listing",
                "fields": [
                    {"name": "title", "selector": ".product-title", "type": "text"},
                    {
                        "name": "price",
                        "selector": ".lfloat.product-price",
                        "type": "text",
                    },
                    {
                        "name": "link",
                        "selector": ".dp-widget-link",
                        "type": "attribute",
                        "attribute": "href",
                    },
                    {"name": "rating", "selector": ".filled-star", "type": "text"},
                    {
                        "name": "reviews",
                        "selector": ".product-rating-count",
                        "type": "text",
                    },
                    {
                        "name": "image",
                        "selector": ".product-image img",
                        "type": "attribute",
                        "attribute": "src",
                    },
                ],
                "limit": max_products,
            }
            # TODO:fix the jio mart schema
        elif "jiomart" in link:
            schema = {
                "name": "JioMartProducts",
                "baseSelector": ".plp-card-container",
                "fields": [
                    {
                        "name": "title",
                        "selector": ".plp-card-details-name",
                        "type": "text",
                    },
                    {
                        "name": "price",
                        "selector": ".plp-card-details-price span.jm-heading-xxs",
                        "type": "text",
                    },
                    {
                        "name": "original_price",
                        "selector": ".plp-card-details-price .line-through",
                        "type": "text",
                    },
                    {
                        "name": "discount",
                        "selector": ".plp-card-details-discount .jm-badge",
                        "type": "text",
                    },
                    {
                        "name": "image",
                        "selector": ".plp-card-image img",
                        "type": "attribute",
                        "attribute": "src",
                    },
                    {
                        "name": "bank_offer",
                        "selector": ".payment_tag .jm-badge-offer",
                        "type": "text",
                    },
                    {
                        "name": "exchange_offer",
                        "selector": ".plp-exchange-offer .jm-badge-offer",
                        "type": "text",
                    },
                    {
                        "name": "limited_deal",
                        "selector": ".deal_of_day",
                        "type": "text",
                    },
                ],
                "limit": max_products,
            }

        else:
            raise ValueError(f"Unsupported website: {URL}")

        return JsonCssExtractionStrategy(schema)

    async def scraper(self, url: str):
        PM = Proxy_rotator.ProxyManager()
        p = PM.get_proxy()
        print(f"Using proxy: {p}")
        print(p)

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
            # proxy="http://103.180.198.164:3128",
        )

        run_conf = CrawlerRunConfig(
            extraction_strategy=self.schema_setup(url),
            cache_mode=CacheMode.BYPASS,
            word_count_threshold=10,
            delay_before_return_html=3,
        )  # Fixed missing closing parenthesis

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
