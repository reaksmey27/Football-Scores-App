
function MatchCard({ match }) {
  const statusStyle = {
    Live: "bg-red-100 text-red-700",
    Finished: "bg-slate-100 text-slate-600",
    Upcoming: "bg-emerald-100 text-emerald-700",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-sm text-slate-500">
          {match.league}
        </span>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            statusStyle[match.status] || statusStyle.Upcoming
          }`}
        >
          {match.status === "Live" && (
            <span className="mr-1 inline-block h-2 w-2 animate-pulse rounded-full bg-red-600" />
          )}
          {match.status === "Live" ? "LIVE" : match.status}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2 font-semibold">
          {match.homeLogo && (
            <img
              src={match.homeLogo}
              alt=""
              className="h-7 w-7 shrink-0 object-contain"
            />
          )}
          <span className="break-words">{match.homeTeam}</span>
        </div>

        <div
          className={`min-w-16 text-center text-lg font-bold ${
            match.status === "Live" ? "text-red-600" : "text-slate-900"
          }`}
        >
          {match.status === "Upcoming"
            ? match.time
            : `${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}`}
        </div>

        <div className="flex min-w-0 items-center justify-end gap-2 text-right font-semibold">
          <span className="break-words">{match.awayTeam}</span>
          {match.awayLogo && (
            <img
              src={match.awayLogo}
              alt=""
              className="h-7 w-7 shrink-0 object-contain"
            />
          )}
        </div>
      </div>

      {match.status !== "Upcoming" && (
        <p className="mt-4 text-center text-xs text-slate-400">
          {match.time}
        </p>
      )}
    </article>
  );
}

export default MatchCard;
