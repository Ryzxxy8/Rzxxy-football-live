"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, CirclePlay, Clock3, Menu, RefreshCw, Search, Trophy, Tv, X } from "lucide-react";

type Match = {
  id: number;
  home: string;
  away: string;
  homeScore: number | null;
  awayScore: number | null;
  minute: string;
  status: "LIVE" | "UPCOMING" | "FINISHED";
  league: string;
  country?: string;
  date?: string | null;
};

const filters = ["All Matches", "LIVE", "Upcoming", "Finished"] as const;

export default function Home() {
  const [active, setActive] = useState<string>("All Matches");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Match | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/matches", { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "ပွဲစဉ်အချက်အလက် မရနိုင်ပါ။");
      setMatches(Array.isArray(payload.matches) ? payload.matches : []);
      setUpdatedAt(payload.updatedAt || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "အချက်အလက်ရယူရာတွင် ပြဿနာဖြစ်နေပါတယ်။");
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadMatches(); }, [loadMatches]);

  const filtered = useMemo(() => matches.filter((match) => {
    const query = search.toLowerCase().trim();
    const matchesSearch = [match.home, match.away, match.league, match.country ?? ""]
      .some((value) => value.toLowerCase().includes(query));
    const matchesFilter = active === "All Matches" ||
      (active === "LIVE" && match.status === "LIVE") ||
      (active === "Upcoming" && match.status === "UPCOMING") ||
      (active === "Finished" && match.status === "FINISHED");
    return matchesSearch && matchesFilter;
  }), [matches, search, active]);

  const liveCount = matches.filter((match) => match.status === "LIVE").length;

  return (
    <main className="min-h-screen bg-[#080b10] text-white">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#080b10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400 text-xl font-black text-black">R</div>
            <div><h1 className="text-lg font-black tracking-tight">RZXXY <span className="text-lime-400">LIVE</span></h1><p className="text-xs text-gray-400">FOOTBALL CENTRAL</p></div>
          </a>
          <nav className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
            <a href="#matches" className="hover:text-lime-400">Matches</a><a href="#leagues" className="hover:text-lime-400">Leagues</a><a href="#watch" className="hover:text-lime-400">Watch Live</a>
          </nav>
          <button onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg border border-white/10 p-2 md:hidden" aria-label="Toggle menu">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        {menuOpen && <nav className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 text-sm md:hidden"><a href="#matches" onClick={() => setMenuOpen(false)}>Matches</a><a href="#leagues" onClick={() => setMenuOpen(false)}>Leagues</a><a href="#watch" onClick={() => setMenuOpen(false)}>Watch Live</a></nav>}
      </header>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-300"><Activity size={15} /> REAL-TIME FOOTBALL CENTRE</div>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">EVERY MATCH.<br /><span className="text-lime-400">EVERY MOMENT.</span></h2>
          <p className="mt-5 max-w-xl leading-7 text-gray-400">Follow live scores, today’s fixtures and recent results. Scores are loaded from the connected football data service.</p>
          <a href="#matches" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"><CirclePlay size={19} /> Explore Matches</a>
        </div>
      </section>

      <section id="matches" className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div><h2 className="text-2xl font-bold">Match Centre</h2><p className="mt-1 text-sm text-gray-500">{liveCount} live match{liveCount === 1 ? "" : "es"} · Today’s fixtures and results</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"><Search size={18} className="shrink-0 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search team or league..." className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500 sm:w-48" aria-label="Search matches" /></div>
            <button onClick={() => void loadMatches()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm hover:border-lime-400/50 disabled:opacity-50"><RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh</button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">{filters.map((filter) => <button key={filter} onClick={() => setActive(filter)} aria-pressed={active === filter} className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${active === filter ? "bg-lime-400 text-black" : "border border-white/10 bg-white/5 text-gray-300 hover:border-lime-400/50"}`}>{filter}</button>)}</div>

        {error && <div role="alert" className="mb-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100"><p className="font-bold">Live data is not connected yet</p><p className="mt-1">{error}</p><p className="mt-2 text-amber-200/80">After adding the API key in Vercel, redeploy the project and press Refresh.</p></div>}
        {loading && <div className="rounded-2xl border border-white/10 bg-[#10151d] p-8 text-center text-gray-400"><RefreshCw className="mx-auto mb-3 animate-spin" />Loading football fixtures…</div>}
        {!loading && !error && filtered.length === 0 && <div className="rounded-2xl border border-white/10 bg-[#10151d] p-8 text-center text-gray-400">{matches.length === 0 ? "ဒီနေ့အတွက် ပွဲစဉ်မတွေ့ပါ။" : "ရှာဖွေထားတဲ့ ပွဲစဉ် မတွေ့ပါ။"}</div>}

        {!loading && filtered.length > 0 && <div className="grid gap-4 lg:grid-cols-2">{filtered.map((match) => (
          <article key={match.id} className="rounded-2xl border border-white/10 bg-[#10151d] p-5 transition hover:border-lime-400/40">
            <div className="mb-5 flex items-center justify-between gap-2"><span className="text-xs text-gray-400">{match.league}{match.country ? ` · ${match.country}` : ""}</span><span className={`rounded-md px-2 py-1 text-xs font-bold ${match.status === "LIVE" ? "bg-red-500/15 text-red-400" : "bg-white/5 text-gray-400"}`}>{match.status === "LIVE" ? "● LIVE" : match.status}</span></div>
            <div className="flex items-center justify-between gap-3"><div className="min-w-0 flex-1"><div className="truncate text-lg font-bold">{match.home}</div><div className="mt-3 truncate text-lg font-bold">{match.away}</div></div><div className="text-right">{match.status === "UPCOMING" ? <div className="text-sm font-semibold text-gray-300">{match.date ? new Date(match.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Yangon" }) + " MMT" : "Scheduled"}</div> : <div className="text-2xl font-black">{match.homeScore ?? "–"} - {match.awayScore ?? "–"}</div>}<div className="mt-2 text-xs text-gray-500">{match.status === "LIVE" ? match.minute : match.status === "FINISHED" ? "Full time" : "Kick-off"}</div></div></div>
            <button onClick={() => setSelected(match)} className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-3 text-sm font-semibold transition hover:border-lime-400/50 hover:text-lime-300"><Tv size={17} /> Match Details</button>
          </article>
        ))}</div>}
        {updatedAt && <p className="mt-4 text-right text-xs text-gray-600">Last refreshed: {new Date(updatedAt).toLocaleString("en-GB", { timeZone: "Asia/Yangon" })} MMT</p>}
      </section>

      <section id="leagues" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <h2 className="mb-5 text-2xl font-bold">Explore Leagues</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{["Premier League", "La Liga", "Serie A", "UEFA Champions League"].map((league) => <button key={league} onClick={() => { setSearch(league); setActive("All Matches"); document.getElementById("matches")?.scrollIntoView({ behavior: "smooth" }); }} className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#10151d] p-4 text-left text-sm font-semibold transition hover:border-lime-400/40"><Trophy size={19} className="shrink-0 text-lime-400" />{league}</button>)}</div>
      </section>

      <section id="watch" className="mx-auto max-w-7xl px-4 py-10 md:px-8"><div className="rounded-2xl border border-white/10 bg-[#10151d] p-6 md:p-8"><div className="flex items-start gap-4"><div className="rounded-xl bg-lime-400/10 p-3 text-lime-400"><Tv size={24} /></div><div><h2 className="text-xl font-bold">Watch Football Live</h2><p className="mt-2 text-sm leading-6 text-gray-400">Official streaming links can be added here when a licensed provider is configured. Live video is not connected yet.</p></div></div><div className="mt-5 rounded-xl border border-dashed border-white/15 p-5 text-center text-sm text-gray-500"><CalendarDays className="mx-auto mb-3" size={25} />No streaming source configured</div></div></section>

      {selected && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4" onClick={() => setSelected(null)}><div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10151d] p-6" onClick={(event) => event.stopPropagation()}><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold text-lime-400">MATCH DETAILS</p><h3 className="mt-2 text-xl font-bold">{selected.home} vs {selected.away}</h3><p className="mt-1 text-sm text-gray-400">{selected.league}</p></div><button onClick={() => setSelected(null)} className="rounded-lg p-2 text-gray-400 hover:bg-white/10" aria-label="Close match details"><X size={20} /></button></div><div className="mt-5 rounded-xl bg-black/20 p-4 text-center"><p className="text-3xl font-black">{selected.homeScore ?? "–"} - {selected.awayScore ?? "–"}</p><p className="mt-2 text-sm text-gray-400">{selected.status === "LIVE" ? `LIVE · ${selected.minute}` : selected.status === "FINISHED" ? "Full time" : selected.date ? new Date(selected.date).toLocaleString("en-GB", { timeZone: "Asia/Yangon" }) + " MMT" : "Scheduled"}</p></div><button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl bg-lime-400 py-3 font-bold text-black">Close</button></div></div>}

      <footer className="mt-10 border-t border-white/10 px-4 py-8 text-center text-xs text-gray-500"><Clock3 className="mx-auto mb-3" size={18} /><p>RZXXY FOOTBALL LIVE</p><p className="mt-2">Scores supplied by a third-party football data service · Not an official broadcaster</p></footer>
    </main>
  );
}
