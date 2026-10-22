
function MatchCard({ match }) {
  const isUpcoming = match.status === "Upcoming";

  const statusStyle = {
    Live: "bg-red-100 text-red-600",
    Finished: "bg-slate-100 text-slate-600",
    Upcoming: "bg-green-100 text-green-700",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm text-slate-500">
          {match.league}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle[match.status]}`}
        >
          {match.status}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-2xl">{match.homeLogo}</span>
          <span>{match.homeTeam}</span>
        </div>

        <div className="text-center text-lg font-bold">
          {isUpcoming
            ? match.time
            : `${match.homeScore} - ${match.awayScore}`}
        </div>

        <div className="flex items-center justify-end gap-2 text-right font-semibold">
          <span>{match.awayTeam}</span>
          <span className="text-2xl">{match.awayLogo}</span>
        </div>
      </div>

      {!isUpcoming && (
        <p className="mt-4 text-center text-xs text-slate-400">
          {match.time}
        </p>
      )}
    </article>
  );
}

export default MatchCard;
