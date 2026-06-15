import { NavLink, useNavigate } from "react-router-dom";
import { Film, Heart, Home } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const { favorites } = useApp();
  const navigate = useNavigate();

  const handleHomeClick = (e) => {
    e.preventDefault();
    navigate("/", { state: { reset: Date.now() } });
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-white/5 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" onClick={handleHomeClick} className="flex items-center gap-2 group">
          <div className="p-2 bg-primary/20 rounded-xl group-hover:bg-primary/30 transition-colors">
            <Film className="h-6 w-6 text-primary" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
            CineBrowse
          </span>
        </NavLink>

        {/* Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-6">
          <NavLink
            to="/"
            end
            onClick={handleHomeClick}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                isActive
                  ? "bg-primary/25 text-violet-300 border border-primary/30"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
              }`
            }
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative ${
                isActive
                  ? "bg-pink-500/20 text-pink-300 border border-pink-500/30"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40"
              }`
            }
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Favorites</span>
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-[10px] font-bold text-white shadow-lg shadow-pink-500/30 animate-pulse">
                {favorites.length}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
