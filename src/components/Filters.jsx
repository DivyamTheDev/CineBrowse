import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

export default function Filters({
  genres,
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  totalResults,
  filteredCount,
}) {
  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "rating-desc", label: "Rating: High to Low" },
    { value: "rating-asc", label: "Rating: Low to High" },
    { value: "year-desc", label: "Year: Newest First" },
    { value: "year-asc", label: "Year: Oldest First" },
    { value: "title-asc", label: "Title: A to Z" },
    { value: "title-desc", label: "Title: Z to A" },
  ];

  return (
    <div className="glass-panel rounded-2xl p-5 border border-white/5 shadow-lg space-y-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Controls Title */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold uppercase tracking-wider text-zinc-300">
            Refine Search
          </span>
          <span className="text-xs text-zinc-500">
            ({filteredCount !== totalResults ? `Showing ${filteredCount} of ` : ""}{totalResults} results)
          </span>
        </div>

        {/* Right Side: Sorting Option */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <ArrowUpDown className="h-4 w-4 text-zinc-400" />
          <label htmlFor="sort-select" className="text-xs font-semibold text-zinc-400">
            Sort by:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-xs font-bold bg-zinc-900 border border-zinc-800 hover:border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-3 py-1.5 text-zinc-200 cursor-pointer outline-none transition-all"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Genre Pills Row */}
      {genres.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-zinc-400 block uppercase tracking-wider">
            Genres
          </span>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
            <button
              onClick={() => onGenreChange("All")}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                selectedGenre === "All"
                  ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                  : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
              }`}
            >
              All Genres
            </button>
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => onGenreChange(genre)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer border ${
                  selectedGenre === genre
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                    : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
