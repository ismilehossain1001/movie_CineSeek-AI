export interface Movie {
  title: string;
  year: number;
  director: string;
  genre: string[];
  rating: number; // 0 to 10
  summary: string;
  cast: string[];
  runtime: string;
  tagline: string;
}

export interface SearchState {
  query: string;
  results: Movie[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
}