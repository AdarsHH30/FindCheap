from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd


# Function to filter data based on e-commerce site
# and return the top 10 most similar products based on title
# using TF-IDF and cosine similarity
# This function assumes that the data is a dictionary with e-commerce site names as keys
# and each value is a list of dictionaries containing product information.
def filter_data(data, e_commerce):
    data = pd.DataFrame(data[e_commerce])

    TF = TfidfVectorizer(stop_words="english")
    tfmatrix = TF.fit_transform(data["title"])

    query = [e_commerce]
    query_vector = TF.transform(query)

    similarities = cosine_similarity(query_vector, tfmatrix).flatten()

    data["similarity_score"] = similarities

    df = data.sort_values(by="similarity_score", ascending=False).head(10)

    filter_data = df.to_json(orient="records", indent=2, force_ascii=False)

    return filter_data
