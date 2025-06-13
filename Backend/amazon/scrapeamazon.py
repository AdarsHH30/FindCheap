from crawl4ai import (
    AsyncWebCrawler,
    BrowserConfig,
    LLMConfig,
    LLMContentFilter,
    DefaultMarkdownGenerator,
    CrawlerRunConfig,
    CacheMode,
    CrawlerRunConfig,
)
from crawl4ai.extraction_strategy import JsonCssExtractionStrategy

from bs4 import BeautifulSoup
import asyncio
from dotenv import load_dotenv
import os

load_dotenv()


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


async def main(userInput: str):
    browser_conf = BrowserConfig(
        browser_type="chromium", headless=False, text_mode=True
    )

    # Schema for extracting product information
    schema = {
        "name": "AmazonProducts",
        "baseSelector": "div.s-card-container",  # each product container
        "fields": [
            {"name": "title", "selector": "a h2 span", "type": "text"},
            # {"name": "title", "selector": "h2 span", "type": "text"},
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
    }

    extraction = JsonCssExtractionStrategy(schema)
    gemini_config = LLMConfig(
        provider="gemini/gemini-2.0-flash",
        api_token=GEMINI_API_KEY,  # Ensure you have set this in your .env file
    )
    filter = LLMContentFilter(
        llm_config=gemini_config,  # or your preferred provider
        instruction="""
Your task is to extract detailed product information from Amazon search result listings. Focus on capturing the following data points for each product:

- **Product Title**: The full name of the product as listed.
- **Price**: The current price shown, including any currency symbols. If a deal or discount is applied, include the final price.
- **Offer/Discount**: If available, extract any promotional offer (e.g., percentage off, “Deal of the Day”, “Limited Time Deal”).
- **Delivery Information**: Extract estimated delivery dates, shipping methods (e.g., "Free Delivery", "Prime"), and any delivery charges.
- **Description**: A brief product description or key bullet points that highlight features, material, use case, or specifications.
- **Rating**: Star rating (e.g., "4.3 out of 5 stars").
- **Review Count**: Number of customer reviews.
- **Product Link**: A direct link to the product detail page (append the domain if relative).
- **Image URL**: High-quality image source link.

Make sure the extracted data:
- Is **clean** and **human-readable** (strip unnecessary whitespace or HTML).
- Preserves **relevant formatting** for Markdown or JSON output.
- Only includes **valid products** (filter out ads, sponsored content, and empty listings).
""",
        chunk_token_threshold=500,  # Adjust based on your needs
        verbose=False,  # Set to True for debugging
    )
    md_generator = DefaultMarkdownGenerator(
        content_filter=filter, options={"ignore_links": True}
    )
    # 4) Crawler run config: skip cache, use extraction
    run_conf = CrawlerRunConfig(
        markdown_generator=md_generator,
        extraction_strategy=extraction,
        cache_mode=CacheMode.BYPASS,
    )

    async with AsyncWebCrawler(config=browser_conf) as crawler:
        # 4) Execute the crawl
        result = await crawler.arun(
            url=f"https://www.amazon.in/s?k={userInput}&s=price-asc-rank",
            config=run_conf,
        )

        if result.success:
            print("Extracted content:", result.extracted_content)
        else:
            print("Error:", result.error_message)

    # async with AsyncWebCrawler(config=browser_conf) as crawler:
    #     result = await crawler.arun(
    #         "https://www.amazon.in/s?k=plainwhitetshirt&s=price-asc-rank"
    #     )

    #     # Parse the HTML using BeautifulSoup
    #     soup = BeautifulSoup(result.html, "html.parser")

    #     # This is the full class string you mentioned
    #     target_class = "puis-card-container s-card-container s-overflow-hidden aok-relative puis-expand-height puis-include-content-margin puis puis-vjdmqzxhf46b2evap03elme96 s-latency-cf-section puis-card-border"

    #     # Split the class string into a list
    #     target_classes = target_class.split()

    #     # Find all elements that have ALL of these classes
    #     items = soup.find_all(
    #         "div",
    #         class_=lambda c: c and all(cls in c.split() for cls in target_classes),
    #     )

    #     print(f"Found {len(items)} items\n")

    #     markdown_output = ""

    #     for idx, item in enumerate(items, 1):
    #         text = item.get_text(separator="\n", strip=True)
    #         markdown_output += f"### Product {idx}\n{text}\n\n"

    #     # Output or save markdown
    #     print(markdown_output[:2000])  # Print only first 2000 chars to avoid overload

    #     # Optionally save to file
    #     with open("amazon_products.md", "w", encoding="utf-8") as f:
    #         f.write(markdown_output)


if __name__ == "__main__":
    user_input = input("Enter search term: ")
    asyncio.run(main(user_input))  # Run the main function with user input
