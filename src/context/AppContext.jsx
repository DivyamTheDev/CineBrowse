import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Favorites State
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("cinebrowse_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Search History State (limit to last 8 unique entries)
  const [searchHistory, setSearchHistory] = useState(() => {
    const saved = localStorage.getItem("cinebrowse_history");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync favorites with localStorage
  useEffect(() => {
    localStorage.setItem("cinebrowse_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Sync search history with localStorage
  useEffect(() => {
    localStorage.setItem("cinebrowse_history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Add to Favorites
  const addFavorite = (movie) => {
    if (!favorites.some((fav) => fav.imdbID === movie.imdbID)) {
      // Keep only required keys to minimize local storage usage
      const minimalMovie = {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Poster: movie.Poster,
        Genre: movie.Genre,
        imdbRating: movie.imdbRating,
        Type: movie.Type,
      };
      setFavorites((prev) => [minimalMovie, ...prev]);
    }
  };

  // Remove from Favorites
  const removeFavorite = (imdbID) => {
    setFavorites((prev) => prev.filter((fav) => fav.imdbID !== imdbID));
  };

  // Check if a movie is favorited
  const isFavorite = (imdbID) => {
    return favorites.some((fav) => fav.imdbID === imdbID);
  };

  // Add search query to history
  const addSearchQuery = (query) => {
    if (!query || query.trim() === "") return;
    const trimmed = query.trim();
    setSearchHistory((prev) => {
      // Filter out existing occurrence, prepend new query, limit to 8
      const filtered = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...filtered].slice(0, 8);
    });
  };

  // Clear search history
  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        searchHistory,
        addFavorite,
        removeFavorite,
        isFavorite,
        addSearchQuery,
        clearSearchHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
