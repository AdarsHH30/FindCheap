export interface Product {
  title: string;
  price: string;
  link: string;
  rating?: string;
  reviews?: string;
  image: string;
  similarity_score: number;
}

export interface SearchResults {
  [platform: string]: Product[];
}