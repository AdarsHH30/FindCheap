from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    LLMConfig,
    LLMContentFilter,
    DefaultMarkdownGenerator,
    CrawlerRunConfig,
    CacheMode,
)
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

import asyncio
import json
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


async def scraper(userInput: str, WEBSITE: str, max_products: int = 5):

    browser_conf = BrowserConfig(
        browser_type="chromium", headless=False, text_mode=True
    )

    # Schema for extracting product information
    # Adjust the baseSelector and field selectors based on the actual HTML structure of the page

    # Determine the schema based on the website URL
    if "amazon" in WEBSITE.lower():
        # Amazon schema
        schema = {
            "name": "AmazonProducts",
            "baseSelector": "div.s-card-container",  # each product container
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
    elif "flipkart" in WEBSITE.lower():
        # Flipkart schema - updated selectors for search results page
        schema = {
            "name": "FlipkartProducts",
            "baseSelector": "[data-id]",  # Products have data-id attribute
            "fields": [
                {
                    "name": "title",
                    "selector": "a[title], .s1Q9rs, ._4rR01T",
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
                    "selector": "span._2_R_DZ, .Wphh3N",
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
    else:
        raise ValueError(f"Unsupported website: {WEBSITE}")

    extraction = JsonCssExtractionStrategy(schema)

    gemini_config = LLMConfig(
        provider="gemini/gemini-2.0-flash",
        api_token=GEMINI_API_KEY,
    )

    filter = LLMContentFilter(
        llm_config=gemini_config,
        instruction=f"""
            Extract exactly {max_products} products from search results and return ONLY valid JSON format.

            Return this exact JSON structure:
            {{
                "products": [
                    {{
                        "product_id": "Product 1",
                        "title": "Product title",
                        "price": "₹999",
                        "offer_discount": "20% off",
                        "delivery_info": "Free delivery by tomorrow",
                        "description": "Brief product description",
                        "rating": "4.3 out of 5 stars",
                        "review_count": "1,234",
                        "product_link": "{WEBSITE}/product-link",
                        "image_url": "https://image-url.jpg"
                    }}
                ]
            }}

            IMPORTANT:
            - Return ONLY the JSON object, no additional text
            - Ensure the product matches the search query "{userInput}"
            - if the product price is zero or not available, skip that product
            - Maximum {max_products} products in the array
            - Use null for missing data, not empty strings
            - Make all URLs absolute (add base URL if relative)
            - Ensure valid JSON syntax
        """,
        chunk_token_threshold=600,
        verbose=False,
    )

    md_generator = DefaultMarkdownGenerator(
        content_filter=filter, options={"ignore_links": True}
    )

    run_conf = CrawlerRunConfig(
        markdown_generator=md_generator,
        extraction_strategy=extraction,
        cache_mode=CacheMode.BYPASS,
    )

    async with AsyncWebCrawler(config=browser_conf) as crawler:
        result = await crawler.arun(
            url=WEBSITE,
            config=run_conf,
        )

        # print(f"Scraping {WEBSITE}")
        # print(f"Success: {result.success}")

        if result.success:
            # print(f"Extracted content type: {type(result.extracted_content)}")
            # print(f"Extracted content: {result.extracted_content}")

            try:
                # Try to parse the extracted content as JSON
                if result.extracted_content:
                    # If it's already a dict/list, return as is
                    if isinstance(result.extracted_content, (dict, list)):
                        return result.extracted_content

                    # If it's a string, try to parse it as JSON
                    elif isinstance(result.extracted_content, str):
                        # Clean the string if needed (remove any markdown formatting)
                        cleaned_content = result.extracted_content.strip()
                        if cleaned_content.startswith("```json"):
                            cleaned_content = (
                                cleaned_content.replace("```json", "")
                                .replace("```", "")
                                .strip()
                            )

                        return json.loads(cleaned_content)

                # Fallback: try to get data from the CSS extraction
                elif hasattr(result, "extracted_data") and result.extracted_data:
                    print(f"Using extracted_data: {result.extracted_data}")
                    return result.extracted_data

                else:
                    print("No data extracted from any source")
                    return {"error": "No data extracted", "products": []}

            except json.JSONDecodeError as e:
                print(f"JSON parsing error: {e}")
                print(f"Raw content: {result.extracted_content}")
                return {
                    "error": f"JSON parsing failed: {str(e)}",
                    "raw_content": result.extracted_content,
                    "products": [],
                }
        else:
            print(f"Scraping failed: {result.error_message}")
            return {"error": result.error_message, "products": []}
