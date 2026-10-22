function MatchCard({ match, darkMode = false }) {
  const isLive = match.status === "Live";
  const isUpcoming = match.status === "Upcoming";

  return (
    <article
      className={`rounded-xl border p-4 shadow-sm transition hover:shadow-md sm:p-5 ${
        darkMode
          ? "border-slate-700 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <span
          className={`rounded-md px-3 py-1 text-xs font-semibold ${
            darkMode
              ? "bg-slate-800 text-slate-300"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {match.league}
        </span>

        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isLive
              ? "bg-red-100 text-red-700"
              : match.status === "Finished"
                ? "bg-slate-100 text-slate-600"
                : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isLive && (
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-600" />
          )}
          {isLive ? "LIVE" : match.status}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          {match.homeLogo && (
            <img
              src={match.homeLogo}
              alt=""
              className="h-10 w-10 object-contain"
            />
          )}
          <span className="break-words text-sm font-semibold sm:text-base">
            {match.homeTeam}
          </span>
        </div>

        <div className="min-w-20 text-center">
          <p
            className={`text-xl font-extrabold sm:text-2xl ${
              isLive ? "text-red-600" : ""
            }`}
          >
            {isUpcoming
              ? match.time
              : `${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}`}
          </p>

          {!isUpcoming && (
            <p className="mt-1 text-xs text-slate-400">{match.time}</p>
          )}
        </div>

        <div className="flex min-w-0 flex-col items-center gap-2 text-center">
          {match.awayLogo && (
            <img
              src={match.awayLogo}
              alt=""
              className="h-10 w-10 object-contain"
            />
          )}
          <span className="break-words text-sm font-semibold sm:text-base">
            {match.awayTeam}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MatchCard;
