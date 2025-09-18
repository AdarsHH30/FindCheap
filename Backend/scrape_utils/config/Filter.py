import logging
import json
import pandas as pd
from rapidfuzz import fuzz, process

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
logger.setLevel(logging.CRITICAL)


def filter_data(data, e_commerce, search_query=None, top_n=8):
    """
    Filter and rank products based on relevance to search query or e-commerce site name
    using fuzzy string matching.

    Args:
        data (dict): Dictionary with e-commerce site names as keys and lists of product dictionaries as values
        e_commerce (str): Name of the e-commerce site to filter by
        search_query (str, optional): Query to compare product titles against. If None, uses e-commerce name.
        top_n (int, optional): Number of top results to return. Defaults to 50.

    Returns:
        str: JSON string of the top filtered results
    """
    try:
        if e_commerce not in data:
            logger.error(f"E-commerce site '{e_commerce}' not found in data ")
            return json.dumps([])

        df = pd.DataFrame(data[e_commerce])

        if df.empty:
            logger.warning(f"No data found for {e_commerce}")
            return json.dumps([])

        query = search_query if search_query else e_commerce

        df["similarity_score"] = (
            df["title"]
            .fillna("")
            .apply(lambda x: fuzz.partial_ratio(query.lower(), x.lower()))
        )

        result_df = df.sort_values(by="similarity_score", ascending=False).head(top_n)

        filtered_data = result_df.to_json(orient="records", indent=2, force_ascii=False)

        if e_commerce == "jiomart" or e_commerce == "meesho":
            print(f"Raw data for {e_commerce}: {data[e_commerce]}\n\n\n")
            print(f"Filtered data for {e_commerce}: {filtered_data}\n\n\n")

        return filtered_data

    except Exception as e:
        return json.dumps([{"error": "An error occurred while filtering data "}])
