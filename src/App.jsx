
import { useEffect, useState } from "react";
import MatchCard from "./components/MatchCard";
import { getFixtures } from "./services/footballApi";

function App() {
  const [matches, setMatches] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString("en-CA")
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
  }, [selectedDate]);

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

    return matchesLeague && matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-2xl bg-emerald-950 p-6 text-white sm:p-8">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-emerald-300">
            YOUR FOOTBALL HUB
          </p>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Football Scores
          </h1>
          <p className="mt-3 text-emerald-100">
            Real fixtures from football leagues around the world.
          </p>
        </header>

        <section>
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
          </div>

          {loading && (
            <p className="rounded-xl bg-white p-8 text-center text-slate-500">
              Loading football matches...
            </p>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
              <p className="font-semibold">Unable to load matches</p>
              <p className="mt-2 break-words text-sm">{error}</p>
              <button
                onClick={() => setSelectedDate(selectedDate)}
                className="mt-4 rounded-lg bg-red-700 px-4 py-2 text-white"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredMatches.length === 0 && (
            <p className="rounded-xl bg-white p-8 text-center text-slate-500">
              No matches found for this date, league, status, or team search.
            </p>
          )}

          {!loading && !error && filteredMatches.length > 0 && (
            <div className="grid gap-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
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
