import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowLeft } from "lucide-react";
import { useApp } from "../context/AppContext";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
  const { favorites, removeFavorite } = useApp();

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all your favorites?")) {
      favorites.forEach((fav) => removeFavorite(fav.imdbID));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-zinc-100 flex items-center gap-2">
            <Heart className="h-7 w-7 text-pink-500 fill-pink-500" />
            <span>My Favorites</span>
          </h1>
          <p className="text-zinc-400 text-sm">
            You have saved {favorites.length} {favorites.length === 1 ? "movie" : "movies"} to watch.
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 text-pink-400 hover:bg-pink-500 hover:text-white rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer shadow-lg shadow-pink-500/5 hover:shadow-pink-500/10"
          >
            <Trash2 className="h-4 w-4" />
            <span>Clear Watchlist</span>
          </button>
        )}
      </div>

      {/* Grid List */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        /* Empty watchlist state */
        <div className="glass-panel border-white/5 max-w-xl mx-auto p-12 rounded-3xl flex flex-col items-center text-center space-y-6 glow-primary">
          <div className="p-4 bg-pink-500/10 rounded-full text-pink-400 animate-pulse">
            <Heart className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-zinc-100">No Favorites Saved</h3>
            <p className="text-zinc-400 text-sm max-w-xs mx-auto">
              Your watchlist is currently empty. Explore movies on the home page and click the heart icon to save them here.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white font-bold rounded-xl text-sm hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Movies</span>
          </Link>
        </div>
      )}
    </div>
  );
}
