import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Heart, Calendar, Clock, DollarSign, Award, Users } from "lucide-react";
import { fetchMovieDetails } from "../services/movieApi";
import { useApp } from "../context/AppContext";

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, addFavorite, removeFavorite } = useApp();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const favorited = movie ? isFavorite(movie.imdbID) : false;

  useEffect(() => {
    async function loadDetails() {
      setLoading(true);
      setError("");
      const details = await fetchMovieDetails(id);
      if (details) {
        setMovie(details);
      } else {
        setError("Failed to fetch movie details. The movie might not exist or the API failed.");
      }
      setLoading(false);
    }
    loadDetails();
  }, [id]);

  const handleFavoriteToggle = () => {
    if (!movie) return;
    if (favorited) {
      removeFavorite(movie.imdbID);
    } else {
      addFavorite(movie);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Back button skeleton */}
        <div className="h-6 w-24 bg-zinc-800 rounded-md" />

        {/* Details skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 aspect-[2/3] bg-zinc-800 rounded-3xl" />
          <div className="md:col-span-2 space-y-6">
            <div className="h-10 w-3/4 bg-zinc-800 rounded-md" />
            <div className="h-6 w-1/2 bg-zinc-800 rounded-md" />
            <div className="h-32 w-full bg-zinc-800 rounded-md" />
            <div className="h-10 w-44 bg-zinc-800 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <div className="text-rose-500 font-bold text-lg">Error</div>
        <p className="text-zinc-400">{error || "Movie not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-zinc-900 border border-white/5 text-zinc-300 rounded-xl hover:bg-zinc-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden min-h-[calc(100vh-80px)] py-12 animate-[fadeIn_0.4s_ease-out]">
      {/* Blurred background image overlay */}
      {movie.Poster && movie.Poster !== "N/A" && (
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-3xl scale-110 pointer-events-none"
          style={{ backgroundImage: `url(${movie.Poster})` }}
        />
      )}

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 font-semibold cursor-pointer group transition-colors"
        >
          <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Search</span>
        </button>

        {/* Main Details Panel */}
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-6 sm:p-8 md:p-10 flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Movie Poster column */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-900 shadow-2xl border border-white/5 group">
              {movie.Poster && movie.Poster !== "N/A" ? (
                <img src={movie.Poster} alt={movie.Title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full w-full bg-zinc-950 p-6 text-center text-zinc-500">
                  No Poster Available
                </div>
              )}
            </div>
          </div>

          {/* Details Content column */}
          <div className="flex-grow space-y-6">
            {/* Title, Year & Rating */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {movie.Year}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {movie.Runtime}
                </span>
                <span>•</span>
                <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-200 border border-zinc-700/30">
                  {movie.Rated}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-100 tracking-tight leading-tight">
                {movie.Title}
              </h1>

              {/* Genre Pills */}
              {movie.Genre && movie.Genre !== "N/A" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {movie.Genre.split(", ").map((g, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 bg-zinc-800/80 text-zinc-300 border border-zinc-700/20 rounded-lg"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Ratings row */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-white/5">
              {/* IMDb Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 bg-amber-400/10 border border-amber-400/20 rounded-xl text-amber-400">
                  <Star className="h-5 w-5 fill-current" />
                </div>
                <div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    IMDb Rating
                  </div>
                  <div className="text-base font-extrabold text-zinc-100">
                    {movie.imdbRating !== "N/A" ? `${movie.imdbRating}/10` : "N/A"}
                  </div>
                </div>
              </div>

              {/* Ratings from other sources (Rotten Tomatoes, Metacritic) */}
              {movie.Ratings &&
                movie.Ratings.map((rating, idx) => {
                  let logoColor = "bg-zinc-800 text-zinc-400";
                  if (rating.Source === "Rotten Tomatoes") {
                    logoColor = "bg-rose-500/10 text-rose-400 border border-rose-500/20";
                  } else if (rating.Source === "Metacritic") {
                    logoColor = "bg-sky-500/10 text-sky-400 border border-sky-500/20";
                  }
                  return (
                    <div className="flex items-center gap-3" key={idx}>
                      <div className={`flex items-center justify-center h-10 w-10 rounded-xl text-xs font-black ${logoColor}`}>
                        {rating.Source === "Rotten Tomatoes" ? "RT" : rating.Source === "Metacritic" ? "MC" : "R"}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider line-clamp-1">
                          {rating.Source}
                        </div>
                        <div className="text-base font-extrabold text-zinc-100">{rating.Value}</div>
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Favorite CTA Button */}
            <button
              onClick={handleFavoriteToggle}
              className={`flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-xl cursor-pointer ${
                favorited
                  ? "bg-pink-500 text-white hover:bg-pink-600 shadow-pink-500/15"
                  : "bg-primary text-white hover:bg-primary-dark hover:scale-[1.02] shadow-primary/20 glow-primary"
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${favorited ? "fill-current" : ""}`} />
              <span>{favorited ? "Remove from Favorites" : "Add to Favorites"}</span>
            </button>

            {/* Plot */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">Plot</h3>
              <p className="text-zinc-300 text-sm leading-relaxed">{movie.Plot}</p>
            </div>

            {/* Info Grid (Director, Writer, Box Office) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 pt-4 border-t border-white/5 text-sm">
              <div className="flex items-start gap-2.5">
                <Users className="h-4.5 w-4.5 text-zinc-500 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-400 mr-1.5">Director:</span>
                  <span className="text-zinc-300">{movie.Director}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Award className="h-4.5 w-4.5 text-zinc-500 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-400 mr-1.5">Writer:</span>
                  <span className="text-zinc-300">{movie.Writer}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="h-4.5 w-4.5 text-zinc-500 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-400 mr-1.5">Cast:</span>
                  <span className="text-zinc-300">{movie.Actors}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <DollarSign className="h-4.5 w-4.5 text-zinc-500 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-400 mr-1.5">Box Office:</span>
                  <span className="text-zinc-300">{movie.BoxOffice || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
