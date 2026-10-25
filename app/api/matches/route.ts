import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ApiFixture = {
  fixture?: { id?: number; date?: string; status?: { short?: string; elapsed?: number | null } };
  league?: { name?: string; country?: string };
  teams?: { home?: { name?: string }; away?: { name?: string } };
  goals?: { home?: number | null; away?: number | null };
};

function normalize(item: ApiFixture) {
  const status = item.fixture?.status?.short ?? "NS";
  const live = ["1H", "HT", "2H", "ET", "P", "LIVE"].includes(status);
  const finished = ["FT", "AET", "PEN"].includes(status);
  return {
    id: item.fixture?.id ?? Math.random(),
    home: item.teams?.home?.name ?? "Home team",
    away: item.teams?.away?.name ?? "Away team",
    homeScore: item.goals?.home ?? null,
    awayScore: item.goals?.away ?? null,
    minute: item.fixture?.status?.elapsed != null ? String(item.fixture.status.elapsed) + "'" : status,
    status: live ? "LIVE" : finished ? "FINISHED" : "UPCOMING",
    league: item.league?.name ?? "Unknown league",
    country: item.league?.country ?? "",
    date: item.fixture?.date ?? null,
  };
}

export async function GET() {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY မထည့်ရသေးပါ။ Vercel Project Settings → Environment Variables မှာ API_FOOTBALL_KEY ထည့်ပါ။" },
      { status: 503 },
    );
  }

  const headers = { "x-apisports-key": key };
  try {
    const liveResponse = await fetch("https://v3.football.api-sports.io/fixtures?live=all", {
      headers, cache: "no-store",
    });
    if (!liveResponse.ok) {
      return NextResponse.json({ error: `Football API returned HTTP ${liveResponse.status}` }, { status: 502 });
    }
    const livePayload = await liveResponse.json();
    if (livePayload.errors && Object.keys(livePayload.errors).length) {
      return NextResponse.json({ error: "Football API က error ပြန်ပေးပါတယ်။ API key နဲ့ plan ကို စစ်ပါ။" }, { status: 502 });
    }

    let fixtures: ApiFixture[] = Array.isArray(livePayload.response) ? livePayload.response : [];
    if (fixtures.length === 0) {
      const date = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Yangon", year: "numeric", month: "2-digit", day: "2-digit",
      }).format(new Date());
      const todayResponse = await fetch(
        `https://v3.football.api-sports.io/fixtures?date=${date}&timezone=Asia/Yangon`,
        { headers, cache: "no-store" },
      );
      if (!todayResponse.ok) {
        return NextResponse.json({ error: `Football API returned HTTP ${todayResponse.status}` }, { status: 502 });
      }
      const todayPayload = await todayResponse.json();
      if (todayPayload.errors && Object.keys(todayPayload.errors).length) {
        return NextResponse.json({ error: "ပွဲစဉ်အချက်အလက် မရပါ။ API key, quota နဲ့ plan ကို စစ်ပါ။" }, { status: 502 });
      }
      fixtures = Array.isArray(todayPayload.response) ? todayPayload.response : [];
    }

    return NextResponse.json({ matches: fixtures.map(normalize), updatedAt: new Date().toISOString() }, {
      headers: { "Cache-Control": "no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "Football data server ကို ချိတ်ဆက်မရပါ။ Internet နဲ့ API service ကို စစ်ပါ။" }, { status: 502 });
  }
}
