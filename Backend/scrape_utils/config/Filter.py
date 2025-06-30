from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import json
import logging

# Set up logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


def filter_data(data, e_commerce, search_query=None, top_n=10):
    """
    Filter and rank products based on relevance to search query or e-commerce site name.

    Args:
        data (dict): Dictionary with e-commerce site names as keys and lists of product dictionaries as values
        e_commerce (str): Name of the e-commerce site to filter by
        search_query (str, optional): Query to compare product titles against. If None, uses e-commerce name.
        top_n (int, optional): Number of top results to return. Defaults to 10.

    Returns:
        str: JSON string of the top filtered results
    """
    try:
        # Validate inputs
        if e_commerce not in data:
            logger.error(f"E-commerce site '{e_commerce}' not found in data")
            return json.dumps([])

        # Convert to DataFrame
        df = pd.DataFrame(data[e_commerce])

        if df.empty:
            logger.warning(f"No data found for {e_commerce}")
            return json.dumps([])

        # Use search query if provided, otherwise use e-commerce name
        query = [search_query if search_query else e_commerce]

        # Handle missing titles
        if df["title"].isnull().all():
            logger.error("All titles are null, cannot compute similarity.")
            return json.dumps([])

        # Calculate TF-IDF and similarity scores
        vectorizer = TfidfVectorizer(stop_words="english")
        title_matrix = vectorizer.fit_transform(df["title"].fillna(""))
        query_vector = vectorizer.transform(query)
        similarities = cosine_similarity(query_vector, title_matrix).flatten()

        # Add scores and sort
        df["similarity_score"] = similarities
        result_df = df.sort_values(by="similarity_score", ascending=False).head(top_n)

        # Convert to JSON
        filtered_data = result_df.to_json(orient="records", indent=2, force_ascii=False)

        return filtered_data

    except Exception as e:
        logger.error(f"Error in filter_data: {str(e)}")
        return json.dumps([])
