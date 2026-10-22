import { useEffect, useRef } from "react";

function MatchDetails({ match, onClose, darkMode = false }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
        if (event.key === "Tab") {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="match-details-title"
        className={`max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl p-6 shadow-xl ${
          darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 id="match-details-title" className="text-lg font-bold">
            Match Details
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close match details"
            className="rounded-lg px-3 py-1 text-xl hover:bg-slate-500/10"
          >
            ×
          </button>
        </div>

        <p className="mb-6 text-center text-sm text-slate-400">
          {match.league}
        </p>

        <div className="grid grid-cols-3 items-center gap-3 text-center">
          <div>
            {match.homeLogo && (
              <img
                src={match.homeLogo}
                alt=""
                className="mx-auto mb-3 h-12 w-12 object-contain"
              />
            )}
            <p className="break-words text-sm font-semibold">
              {match.homeTeam}
            </p>
          </div>

          <p className="text-xl font-extrabold">
            {match.status === "Upcoming"
              ? "VS"
              : `${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}`}
          </p>

          <div>
            {match.awayLogo && (
              <img
                src={match.awayLogo}
                alt=""
                className="mx-auto mb-3 h-12 w-12 object-contain"
              />
            )}
            <p className="break-words text-sm font-semibold">
              {match.awayTeam}
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-500/10 p-4 text-center">
          <p className="text-sm text-slate-400">Status</p>
          <p className="mt-1 font-semibold">{match.status}</p>
          <p className="mt-1 text-sm text-slate-400">{match.time}</p>
        </div>
      </div>
    </div>
  );
}

export default MatchDetails;
