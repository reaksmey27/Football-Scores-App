
import { matches } from "./data/matches";
import MatchCard from "./components/MatchCard";

function App() {
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
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              Matches
            </h2>

            <span className="text-sm text-slate-500">
              {matches.length} matches
            </span>
          </div>

          <div className="grid gap-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </section>

        <footer className="mt-8 text-center text-sm text-slate-400">
          Football Scores · Sample data
        </footer>
      </div>
    </main>
  );
}

export default App;
