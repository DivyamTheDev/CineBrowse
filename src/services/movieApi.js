const API_KEY = "thewdb";
const BASE_URL = "https://www.omdbapi.com/";

/**
 * Fetch a list of movies by search term and page.
 * Fetches detailed info for each movie in parallel to support filtering, sorting,
 * and high-fidelity movie card rendering.
 *
 * @param {string} query - The search query (e.g., "Batman").
 * @param {number} page - Page number (1-indexed).
 * @returns {Promise<{movies: Array, totalResults: number, success: boolean, error?: string}>}
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`);
    const data = await response.json();

    if (data.Response === "True") {
      // Fetch details for each movie in parallel to get genre, rating, and runtime info
      const detailPromises = data.Search.map(async (movie) => {
        const details = await fetchMovieDetails(movie.imdbID);
        // Fall back to original movie object if details fetch fails
        return details || movie;
      });

      const detailedMovies = await Promise.all(detailPromises);
      return {
        movies: detailedMovies,
        totalResults: parseInt(data.totalResults, 10),
        success: true,
      };
    } else {
      return {
        movies: [],
        totalResults: 0,
        success: false,
        error: data.Error || "No movies found.",
      };
    }
  } catch (error) {
    console.error("Error in searchMovies:", error);
    return {
      movies: [],
      totalResults: 0,
      success: false,
      error: "Failed to load movies. Please check your internet connection.",
    };
  }
};

/**
 * Fetch detailed information for a single movie by its IMDb ID.
 *
 * @param {string} imdbId - The IMDb ID of the movie (e.g., "tt0372784").
 * @returns {Promise<Object|null>} Detailed movie info or null if failed.
 */
export const fetchMovieDetails = async (imdbId) => {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`);
    const data = await response.json();
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error(`Error fetching details for ${imdbId}:`, error);
    return null;
  }
};
