import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Movie } from "../types";

// Initialize the client
// The API key is guaranteed to be in process.env.API_KEY per environment setup.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const movieSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The official title of the movie." },
    year: { type: Type.INTEGER, description: "Release year." },
    director: { type: Type.STRING, description: "Main director's name." },
    genre: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of genres (e.g. Sci-Fi, Drama)."
    },
    rating: { type: Type.NUMBER, description: "IMDb or general rating out of 10." },
    summary: { type: Type.STRING, description: "A concise, engaging plot summary." },
    cast: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Top 3-5 main actors."
    },
    runtime: { type: Type.STRING, description: "Runtime in format 'Xh Ym'." },
    tagline: { type: Type.STRING, description: "A catchy tagline for the movie." }
  },
  required: ["title", "year", "director", "genre", "rating", "summary", "cast", "runtime"],
};

export const searchMoviesWithGemini = async (query: string): Promise<Movie[]> => {
  try {
    const model = "gemini-2.5-flash";
    
    // We want a list of movies
    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: movieSchema,
      description: "A list of movies matching the search criteria."
    };

    const prompt = `
      User is searching for movies with the query: "${query}".
      
      If the query is specific (e.g., "The Matrix"), return details for that specific movie and 2-3 similar recommendations.
      If the query is vague (e.g., "90s action", "sad movies"), return a curated list of 6-8 top-tier recommendations that fit the description.
      
      Ensure the summary is engaging. 
      Ensure ratings are realistic.
    `;

    const result = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7, // Slight creativity for recommendations
      },
    });

    const text = result.text;
    if (!text) return [];

    const movies = JSON.parse(text) as Movie[];
    return movies;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch movie recommendations. Please try again.");
  }
};