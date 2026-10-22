
const API_URL = "https://v3.football.api-sports.io";

export async function getFixtures(date) {
  const apiKey = import.meta.env.VITE_FOOTBALL_API_KEY;

  if (!apiKey) {
    throw new Error("API key is missing. Check your .env file.");
  }

  const response = await fetch(
    `${API_URL}/fixtures?date=${date}`,
    {
      headers: {
        "x-apisports-key": apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (data.errors && Object.keys(data.errors).length > 0) {
    throw new Error(JSON.stringify(data.errors));
  }

  return data.response.map((item) => ({
    id: item.fixture.id,
    league: item.league.name,
    homeTeam: item.teams.home.name,
    awayTeam: item.teams.away.name,
    homeLogo: item.teams.home.logo,
    awayLogo: item.teams.away.logo,
    homeScore: item.goals.home,
    awayScore: item.goals.away,
    time: item.fixture.status.elapsed
      ? `${item.fixture.status.elapsed}'`
      : new Date(item.fixture.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
    status: getMatchStatus(item.fixture.status.short),
  }));
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