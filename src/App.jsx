
import { useState } from "react";
import { matches } from "./data/matches";
import MatchCard from "./components/MatchCard";

function App() {
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");

  const leagues = [
    "All Leagues",
    ...new Set(matches.map((match) => match.league)),
  ];

  const filteredMatches =
    selectedLeague === "All Leagues"
      ? matches
      : matches.filter((match) => match.league === selectedLeague);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 rounded-2xl bg-emerald-950 p-8 text-white">
          <p className="mb-3 text-xs font-bold tracking-[0.25em] text-emerald-300">
            YOUR FOOTBALL HUB
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Football Scores
          </h1>

          <p className="mt-3 text-emerald-100">
            Follow the action, match by match.
          </p>
        </header>

        <section>
          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Matches
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Showing {filteredMatches.length} matches
              </p>
            </div>

            <select
              value={selectedLeague}
              onChange={(event) => setSelectedLeague(event.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            >
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </div>

          {filteredMatches.length > 0 ? (
            <div className="grid gap-4">
              {filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-white p-8 text-center text-slate-500">
              No matches found for this league.
            </p>
          )}
        </section>

        <footer className="mt-8 text-center text-sm text-slate-400">
          Football Scores · Sample data
        </footer>
      </div>
    </main>
  );
}

export default App;
