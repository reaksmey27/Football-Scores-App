
const API_URL = "https://v3.football.api-sports.io";

export const MAJOR_LEAGUES = [
  { id: 39, name: "Premier League" },
  { id: 140, name: "La Liga" },
  { id: 135, name: "Serie A" },
  { id: 78, name: "Bundesliga" },
  { id: 61, name: "Ligue 1" },
  { id: 2, name: "UEFA Champions League" },
  { id: 3, name: "UEFA Europa League" },
  { id: 253, name: "MLS" },
];

const leagueNames = new Map(MAJOR_LEAGUES.map(({ id, name }) => [id, name]));
const pendingRequests = new Map();
let retryAfter = 0;

export function getFixtures(date) {
  if (pendingRequests.has(date)) return pendingRequests.get(date);
  if (Date.now() < retryAfter) {
    return Promise.reject(new Error("Too many requests. Please wait one minute before trying again."));
  }
  const request = fetchFixtures(date).finally(() => pendingRequests.delete(date));
  pendingRequests.set(date, request);
  return request;
}

async function fetchFixtures(date) {
  const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing. Check your .env file.");
  }

      const url = new URL(`${API_URL}/fixtures`);

      url.searchParams.set("date", date);

      const response = await fetch(url, {
        headers: { "x-apisports-key": apiKey },
      });

      if (response.status === 429) {
        retryAfter = Date.now() + 60000;
        throw new Error("Too many requests. Please wait one minute before trying again.");
      }
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.errors?.rateLimit) {
        retryAfter = Date.now() + 60000;
        throw new Error("Too many requests. Please wait one minute before trying again.");
      }
      if (data.errors && Object.keys(data.errors).length > 0) {
        throw new Error(JSON.stringify(data.errors));
      }

      return data.response.filter((item) => leagueNames.has(item.league.id)).map((item) => ({
        id: item.fixture.id,
        league: leagueNames.get(item.league.id),
        homeTeam: item.teams.home.name,
        awayTeam: item.teams.away.name,
        homeLogo: item.teams.home.logo,
        awayLogo: item.teams.away.logo,
        homeScore: item.goals.home,
        awayScore: item.goals.away,
        date: item.fixture.date,
        time: item.fixture.status.elapsed
          ? `${item.fixture.status.elapsed}'`
          : new Date(item.fixture.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        status: getMatchStatus(item.fixture.status.short),
      })).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

function getMatchStatus(status) {
  if (["1H", "2H", "HT", "ET", "P", "LIVE"].includes(status)) {
    return "Live";
  }

  if (["FT", "AET", "PEN"].includes(status)) {
    return "Finished";
  }

  if (["PST", "CANC", "ABD", "AWD", "WO"].includes(status)) {
    return "Finished";
  }

  return "Upcoming";
}
