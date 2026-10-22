
import { useEffect, useState } from "react";
import MatchCard from "./components/MatchCard";
import MatchSkeleton from "./components/MatchSkeleton";
import FavoriteButton from "./components/FavoriteButton";
import { getFixtures } from "./services/footballApi";

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("darkMode") === "true";
    } catch {
      return false;
    }
  });
  const [refreshCount, setRefreshCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteTeams, setFavoriteTeams] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("favoriteTeams"));
      return Array.isArray(stored)
        ? stored.filter((team) => typeof team === "string")
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("favoriteTeams", JSON.stringify(favoriteTeams));
    } catch {
      // Keep favorites usable for this session if browser storage is unavailable.
    }
  }, [favoriteTeams]);

  useEffect(() => {
    try {
      localStorage.setItem("darkMode", String(darkMode));
    } catch {
      // Keep theme switching usable if browser storage is unavailable.
    }
  }, [darkMode]);

  function toggleFavorite(teamName) {
    setFavoriteTeams((current) =>
      current.includes(teamName)
        ? current.filter((team) => team !== teamName)
        : [...current, teamName]
    );
  }

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      setError("");

      try {
        const fixtures = await getFixtures(selectedDate);
        setMatches(fixtures);
      } catch (err) {
        setError(err.message || "Could not load matches.");
      } finally {
        setLoading(false);
      }
    }

    loadMatches();
  }, [selectedDate, refreshCount]);

  const leagues = [
    "All Leagues",
    ...new Set(matches.map((match) => match.league)),
  ];

  const filteredMatches = matches.filter((match) => {
    const matchesLeague =
      selectedLeague === "All Leagues" ||
      match.league === selectedLeague;

    const matchesStatus =
      selectedStatus === "All" ||
      match.status === selectedStatus;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      match.homeTeam.toLowerCase().includes(search) ||
      match.awayTeam.toLowerCase().includes(search);

    const matchesFavorite =
      !showFavoritesOnly ||
      favoriteTeams.includes(match.homeTeam) ||
      favoriteTeams.includes(match.awayTeam);

    return matchesLeague && matchesStatus && matchesSearch && matchesFavorite;
  });

  return (
    <main
      className={`min-h-screen px-4 py-8 transition-colors sm:px-8 ${
        darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 overflow-hidden rounded-2xl bg-emerald-950 text-white">
          <nav className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-8">
            <a href="#" className="text-xl font-extrabold tracking-tight">
              <span className="text-emerald-400">⚽</span> FootyScore
            </a>

            <a
              href="#matches"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
            >
              View Matches
            </a>
            <button
              type="button"
              onClick={() => setDarkMode((current) => !current)}
              aria-pressed={darkMode}
              aria-label="Dark mode"
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </nav>

          <div className="px-5 py-8 sm:px-8 sm:py-10">
            <p className="mb-3 text-xs font-bold tracking-[0.25em] text-emerald-300">
              YOUR FOOTBALL HUB
            </p>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Football Scores
            </h1>
            <p className="mt-3 max-w-lg text-emerald-100">
              Follow live scores, match results, and upcoming fixtures from leagues around the world.
            </p>
          </div>
        </header>

        <section id="matches">
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                label: "Total Matches",
                value: matches.length,
                color: "text-slate-900",
              },
              {
                label: "Live Now",
                value: matches.filter((match) => match.status === "Live").length,
                color: "text-red-600",
              },
              {
                label: "Finished",
                value: matches.filter((match) => match.status === "Finished").length,
                color: "text-emerald-700",
              },
              {
                label: "Upcoming",
                value: matches.filter((match) => match.status === "Upcoming").length,
                color: "text-blue-600",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Matches
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading fixtures..."
                  : `${filteredMatches.length} matches found`}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <input
                type="text"
                aria-label="Search teams"
                placeholder="Search teams..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 sm:w-56"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  setSelectedDate(event.target.value);
                  setSelectedLeague("All Leagues");
                }}
                className="rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm"
              />

              <select
                value={selectedLeague}
                onChange={(event) => setSelectedLeague(event.target.value)}
                disabled={loading || matches.length === 0}
                className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm disabled:opacity-50"
              >
                {leagues.map((league) => (
                  <option key={league} value={league}>
                    {league}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setRefreshCount((count) => count + 1)}
                disabled={loading}
                className="rounded-lg bg-emerald-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-50"
              >
                {loading ? "Loading..." : "↻ Refresh"}
              </button>
            </div>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {["All", "Live", "Finished", "Upcoming"].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                aria-pressed={selectedStatus === status}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  selectedStatus === status
                    ? "bg-emerald-700 text-white"
                    : "bg-white text-slate-600 hover:bg-emerald-50"
                }`}
              >
                {status}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((current) => !current)}
              aria-pressed={showFavoritesOnly}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                showFavoritesOnly
                  ? "bg-amber-500 text-white"
                  : "bg-white text-slate-600 hover:bg-amber-50"
              }`}
            >
              {showFavoritesOnly ? "★ Favorites On" : "☆ Favorites"}
            </button>
          </div>

          {loading && (
            <div className="grid gap-4" aria-label="Loading matches" role="status">
              {Array.from({ length: 4 }).map((_, index) => (
                <MatchSkeleton key={index} />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <p className="font-semibold">Unable to load matches</p>
              <p className="mt-2 break-words text-sm">{error}</p>
              <button
                onClick={() => setRefreshCount((count) => count + 1)}
                className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredMatches.length === 0 && (
            <p className="rounded-xl bg-white p-8 text-center text-slate-500">
              No matches found for the selected date and filters.
            </p>
          )}

          {!loading && !error && filteredMatches.length > 0 && (
            <div className="grid gap-4">
              {filteredMatches.map((match) => (
                <div key={match.id} className="relative">
                  <MatchCard match={match} darkMode={darkMode} />
                  <div className="absolute right-3 top-12 z-10 flex gap-1">
                    <FavoriteButton
                      teamName={match.homeTeam}
                      isFavorite={favoriteTeams.includes(match.homeTeam)}
                      onToggle={() => toggleFavorite(match.homeTeam)}
                    />
                    <FavoriteButton
                      teamName={match.awayTeam}
                      isFavorite={favoriteTeams.includes(match.awayTeam)}
                      onToggle={() => toggleFavorite(match.awayTeam)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className="mt-8 text-center text-sm text-slate-400">
          Football Scores · Powered by API-Football
        </footer>
      </div>
    </main>
  );
}

export default App;
