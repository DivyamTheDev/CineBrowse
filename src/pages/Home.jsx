import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, X, History, Film, ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react";
import { searchMovies } from "../services/movieApi";
import { useApp } from "../context/AppContext";
import MovieCard from "../components/MovieCard";
import SkeletonCard from "../components/SkeletonCard";
import Filters from "../components/Filters";

export default function Home() {
  const { searchHistory, addSearchQuery, clearSearchHistory } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  // Search & Results State
  const [searchInput, setSearchInput] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filters & Sorting State
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("relevance");
  const [showHistory, setShowHistory] = useState(false);

  // Recommendations for fast search
  const recommendedSearches = ["Batman", "Avengers", "Star Wars", "Harry Potter", "Interstellar", "Matrix"];

  const historyRef = useRef(null);

  // Close history dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (historyRef.current && !historyRef.current.contains(event.target)) {
        setShowHistory(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset search when location state has "reset" set
  useEffect(() => {
    if (location.state?.reset) {
      setSearchInput("");
      setActiveQuery("");
      setMovies([]);
      setTotalResults(0);
      setCurrentPage(1);
      setError("");
      setSelectedGenre("All");
      setSortBy("relevance");

      // Clear location state to prevent loop resets on browser navigation
      navigate("/", { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Fetch movies when query or page changes
  const executeSearch = async (query, pageNum) => {
    if (!query || query.trim() === "") return;
    setLoading(true);
    setError("");
    setSelectedGenre("All"); // Reset genre filter on new page/query

    const result = await searchMovies(query, pageNum);
    if (result.success) {
      setMovies(result.movies);
      setTotalResults(result.totalResults);
      setActiveQuery(query);
      addSearchQuery(query);
    } else {
      setMovies([]);
      setTotalResults(0);
      setError(result.error || "No results found.");
    }
    setLoading(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    executeSearch(searchInput, 1);
    setShowHistory(false);
  };

  const handleRecommendationClick = (rec) => {
    setSearchInput(rec);
    setCurrentPage(1);
    executeSearch(rec, 1);
    setShowHistory(false);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    executeSearch(activeQuery, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Extract unique genres from current movie list
  const availableGenres = (() => {
    const genresSet = new Set();
    movies.forEach((m) => {
      if (m.Genre && m.Genre !== "N/A") {
        m.Genre.split(", ").forEach((g) => genresSet.add(g));
      }
    });
    return Array.from(genresSet).sort();
  })();

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    if (selectedGenre === "All") return true;
    return movie.Genre && movie.Genre.toLowerCase().includes(selectedGenre.toLowerCase());
  });

  // Sort movies
  const sortedMovies = [...filteredMovies].sort((a, b) => {
    if (sortBy === "rating-desc") {
      const rA = parseFloat(a.imdbRating) || 0;
      const rB = parseFloat(b.imdbRating) || 0;
      return rB - rA;
    }
    if (sortBy === "rating-asc") {
      const rA = parseFloat(a.imdbRating) || 0;
      const rB = parseFloat(b.imdbRating) || 0;
      return rA - rB;
    }
    if (sortBy === "year-desc") {
      const yA = parseInt(a.Year) || 0;
      const yB = parseInt(b.Year) || 0;
      return yB - yA;
    }
    if (sortBy === "year-asc") {
      const yA = parseInt(a.Year) || 0;
      const yB = parseInt(b.Year) || 0;
      return yA - yB;
    }
    if (sortBy === "title-asc") {
      return a.Title.localeCompare(b.Title);
    }
    if (sortBy === "title-desc") {
      return b.Title.localeCompare(a.Title);
    }
    return 0; // relevance / original order
  });

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-[fadeIn_0.5s_ease-out]">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
          Discover Millions of Movies
        </h1>
        <p className="text-zinc-400 text-sm sm:text-base font-medium">
          Track ratings, filter by genres, and build your own ultimate watch list.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-2xl mx-auto relative" ref={historyRef}>
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <div className="absolute left-4 text-zinc-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            placeholder="Search movies by title (e.g. Batman)..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onFocus={() => setShowHistory(true)}
            className="w-full bg-zinc-900/80 border border-white/5 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-2xl py-4 pl-12 pr-12 text-zinc-100 text-base placeholder-zinc-500 outline-none transition-all shadow-xl backdrop-blur-md"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput("")}
              className="absolute right-4 p-1 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        {/* History Dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-white/5 rounded-2xl shadow-2xl z-40 overflow-hidden backdrop-blur-xl animate-[slideDown_0.2s_ease-out]">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-950/40">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-3.5 w-3.5" /> Recent Searches
              </span>
              <button
                type="button"
                onClick={clearSearchHistory}
                className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors cursor-pointer"
              >
                Clear History
              </button>
            </div>
            <ul className="divide-y divide-white/5 max-h-60 overflow-y-auto">
              {searchHistory.map((query, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput(query);
                      setCurrentPage(1);
                      executeSearch(query, 1);
                      setShowHistory(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800/40 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 text-zinc-500" />
                    {query}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Quick Recommendations */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <span className="text-xs font-semibold text-zinc-500 mr-1">Trending:</span>
          {recommendedSearches.map((rec) => (
            <button
              key={rec}
              type="button"
              onClick={() => handleRecommendationClick(rec)}
              className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 cursor-pointer transition-all duration-200"
            >
              {rec}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Loading State */}
        {loading && (
          <>
            <div className="h-14 w-full bg-zinc-900/40 animate-pulse rounded-2xl border border-white/5 mb-6" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))}
            </div>
          </>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="glass-panel border-rose-500/20 max-w-md mx-auto p-8 rounded-3xl flex flex-col items-center text-center space-y-4">
            <div className="p-4 bg-rose-500/10 rounded-full text-rose-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-zinc-100">Search Failed</h3>
            <p className="text-zinc-400 text-sm">{error}</p>
            <p className="text-xs text-zinc-500">
              Try searching with another term, or verify that the spelling is correct.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && movies.length === 0 && (
          <div className="glass-panel border-white/5 max-w-xl mx-auto p-12 rounded-3xl flex flex-col items-center text-center space-y-4 glow-primary">
            <div className="p-4 bg-primary/10 rounded-full text-primary">
              <Film className="h-10 w-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Welcome to CineBrowse</h3>
            <p className="text-zinc-400 text-sm max-w-sm">
              Use the search bar above to query films, series, and mini IMDb details. Select popular trending topics to start exploring!
            </p>
          </div>
        )}

        {/* Results State */}
        {!loading && !error && movies.length > 0 && (
          <>
            {/* Filters panel */}
            <Filters
              genres={availableGenres}
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              sortBy={sortBy}
              onSortChange={setSortBy}
              totalResults={movies.length}
              filteredCount={sortedMovies.length}
            />

            {/* Grid layout */}
            {sortedMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {sortedMovies.map((movie) => (
                  <MovieCard key={movie.imdbID} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 glass-panel border-white/5 rounded-2xl">
                <p className="text-zinc-400 text-sm">
                  No movies match the selected genre filter: <span className="text-primary font-bold">"{selectedGenre}"</span>
                </p>
                <button
                  onClick={() => setSelectedGenre("All")}
                  className="mt-4 text-xs font-bold text-primary hover:underline"
                >
                  Clear genre filter
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-8 border-t border-white/5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    currentPage === 1
                      ? "border-zinc-800/40 text-zinc-600 bg-transparent cursor-not-allowed"
                      : "border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  <ArrowLeft className="h-4 w-4" /> Prev
                </button>

                <span className="text-sm font-semibold text-zinc-400">
                  Page <span className="text-zinc-200">{currentPage}</span> of{" "}
                  <span className="text-zinc-200">{totalPages}</span>
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    currentPage === totalPages
                      ? "border-zinc-800/40 text-zinc-600 bg-transparent cursor-not-allowed"
                      : "border-white/5 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
