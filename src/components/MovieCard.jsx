import { Link } from "react-router-dom";
import { Star, Heart, Calendar } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function MovieCard({ movie }) {
  const { isFavorite, addFavorite, removeFavorite } = useApp();
  const favorited = isFavorite(movie.imdbID);

  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigating to detail page
    e.stopPropagation();
    if (favorited) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  // Extract primary genres (up to 2)
  const genres = movie.Genre && movie.Genre !== "N/A" ? movie.Genre.split(", ").slice(0, 2) : [];

  return (
    <Link to={`/movie/${movie.imdbID}`} className="block group">
      <div className="relative glass-card flex flex-col h-full rounded-2xl overflow-hidden border border-white/5 shadow-xl transition-all duration-300">
        {/* Poster Image Container */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-900">
          {movie.Poster && movie.Poster !== "N/A" ? (
            <img
              src={movie.Poster}
              alt={movie.Title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full p-4 text-center bg-gradient-to-br from-zinc-800 to-zinc-950">
              <span className="text-zinc-600 text-sm font-semibold tracking-wider uppercase mb-2">
                No Poster Available
              </span>
              <span className="text-zinc-400 font-bold text-base px-2 line-clamp-2">{movie.Title}</span>
            </div>
          )}

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-xs font-semibold px-3 py-1.5 bg-primary rounded-lg text-white shadow-lg shadow-primary/30">
              View Details
            </span>
          </div>

          {/* Favorite Toggle Button (top right) */}
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all duration-300 shadow-md ${
              favorited
                ? "bg-pink-500/95 text-white border-pink-400 shadow-pink-500/20 scale-105"
                : "bg-black/40 text-zinc-300 border-white/10 hover:bg-black/60 hover:text-white hover:scale-105"
            }`}
            aria-label={favorited ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Heart className={`h-4.5 w-4.5 ${favorited ? "fill-current" : ""}`} />
          </button>

          {/* Rating Badge (top left, if available) */}
          {movie.imdbRating && movie.imdbRating !== "N/A" && (
            <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold text-amber-400">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>{movie.imdbRating}</span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="flex flex-col flex-grow p-4">
          {/* Year & Type */}
          <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {movie.Year}
            </span>
            <span>•</span>
            <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-300">{movie.Type}</span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-zinc-100 text-base line-clamp-1 group-hover:text-primary transition-colors duration-200 mb-2">
            {movie.Title}
          </h3>

          {/* Genre Tags */}
          {genres.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {genres.map((g, idx) => (
                <span
                  key={idx}
                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-300 border border-zinc-700/30"
                >
                  {g}
                </span>
              ))}
            </div>
          ) : (
            <div className="h-5 mt-auto" /> // spacer
          )}
        </div>
      </div>
    </Link>
  );
}
