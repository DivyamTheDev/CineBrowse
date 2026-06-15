import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Favorites from "./pages/Favorites";

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-primary/30 selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          {/* visual footer */}
          <footer className="w-full py-8 text-center text-xs text-zinc-600 border-t border-white/5 bg-zinc-950/40 backdrop-blur-sm">
            <p>&copy; {new Date().getFullYear()} CineBrowse. All rights reserved.</p>
            <p className="mt-1 text-zinc-700">Powered by OMDb API. Crafted for movie enthusiasts.</p>
          </footer>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
