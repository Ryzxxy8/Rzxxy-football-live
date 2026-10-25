“use client”;

import { useState } from “react”;
import {
Activity,
CalendarDays,
CirclePlay,
Clock3,
House,
Menu,
Search,
Trophy,
Tv,
X,
} from “lucide-react”;

const matches = [
{
home: “Arsenal”,
away: “Chelsea”,
homeScore: 2,
awayScore: 1,
minute: “67’”,
league: “Premier League”,
status: “LIVE”,
},
{
home: “Real Madrid”,
away: “Barcelona”,
homeScore: 0,
awayScore: 0,
minute: “20:00”,
league: “La Liga”,
status: “UPCOMING”,
},
{
home: “Inter Milan”,
away: “AC Milan”,
homeScore: 1,
awayScore: 2,
minute: “FT”,
league: “Serie A”,
status: “FINISHED”,
},
];

export default function Home() {
const [active, setActive] = useState(“All Matches”);
const [search, setSearch] = useState(””);
const [selected, setSelected] = useState(””);
const [menuOpen, setMenuOpen] = useState(false);

const filtered = matches.filter((match) => {
const query = search.toLowerCase();

const matchesSearch =
  match.home.toLowerCase().includes(query) ||
  match.away.toLowerCase().includes(query) ||
  match.league.toLowerCase().includes(query);
const matchesFilter =
  active === "All Matches" ||
  (active === "LIVE" && match.status === "LIVE") ||
  (active === "Upcoming" && match.status === "UPCOMING") ||
  (active === "Finished" && match.status === "FINISHED");
return matchesSearch && matchesFilter;

});

return (
R
RZXXY LIVE
FOOTBALL CENTRAL
      <nav className="hidden items-center gap-7 text-sm text-gray-300 md:flex">
        <a href="#matches" className="hover:text-lime-400">Matches</a>
        <a href="#leagues" className="hover:text-lime-400">Leagues</a>
        <a href="#watch" className="hover:text-lime-400">Watch Live</a>
      </nav>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="rounded-lg border border-white/10 p-2 md:hidden"
        aria-label="Toggle menu"
      >
        {menuOpen ? <X /> : <Menu />}
      </button>
    </div>
    {menuOpen && (
      <nav className="flex flex-col gap-4 border-t border-white/10 px-5 py-4 text-sm md:hidden">
        <a href="#matches" onClick={() => setMenuOpen(false)}>Matches</a>
        <a href="#leagues" onClick={() => setMenuOpen(false)}>Leagues</a>
        <a href="#watch" onClick={() => setMenuOpen(false)}>Watch Live</a>
      </nav>
    )}
  </header>
  <section className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
    <div className="max-w-3xl">
      <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-xs font-semibold text-lime-300">
        <Activity size={15} />
        YOUR FOOTBALL, YOUR PLATFORM
      </div>
      <h2 className="text-4xl font-black leading-tight md:text-6xl">
        EVERY MATCH.
        <br />
        <span className="text-lime-400">EVERY MOMENT.</span>
      </h2>
      <p className="mt-5 max-w-xl leading-7 text-gray-400">
        Follow football matches, explore fixtures and discover
        authorized live streaming options in one place.
      </p>
      <a
        href="#matches"
        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3 font-bold text-black transition hover:bg-lime-300"
      >
        <CirclePlay size={19} />
        Explore Matches
      </a>
    </div>
  </section>
  <section id="matches" className="mx-auto max-w-7xl px-4 pb-12 md:px-8">
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 className="text-2xl font-bold">Match Centre</h2>
        <p className="mt-1 text-sm text-gray-500">
          Sample matches for design preview
        </p>
      </div>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Search size={18} className="text-gray-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search teams..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500 sm:w-48"
          aria-label="Search matches"
        />
      </div>
    </div>
    <div className="mb-6 flex flex-wrap gap-2">
      {["All Matches", "LIVE", "Upcoming", "Finished"].map((filter) => (
        <button
          key={filter}
          onClick={() => setActive(filter)}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            active === filter
              ? "bg-lime-400 text-black"
              : "border border-white/10 bg-white/5 text-gray-300 hover:border-lime-400/50"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
    <div className="grid gap-4 lg:grid-cols-2">
      {filtered.map((match) => (
        <article
          key={match.home}
          className="rounded-2xl border border-white/10 bg-[#10151d] p-5 transition hover:border-lime-400/40"
        >
          <div className="mb-5 flex items-center justify-between gap-2">
            <span className="text-xs text-gray-400">{match.league}</span>
            <span
              className={`rounded-md px-2 py-1 text-xs font-bold ${
                match.status === "LIVE"
                  ? "bg-red-500/15 text-red-400"
                  : "bg-white/5 text-gray-400"
              }`}
            >
              {match.status === "LIVE" ? "● LIVE" : match.status}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="truncate text-lg font-bold">{match.home}</div>
              <div className="mt-3 truncate text-lg font-bold">{match.away}</div>
            </div>
            <div className="text-right">
              {match.status === "UPCOMING" ? (
                <div className="text-sm font-semibold text-gray-300">
                  {match.minute}
                </div>
              ) : (
                <div className="text-2xl font-black">
                  {match.homeScore} - {match.awayScore}
                </div>
              )}
              <div className="mt-2 text-xs text-gray-500">
                {match.status === "LIVE"
                  ? match.minute
                  : match.status === "FINISHED"
                  ? "Full time"
                  : "Kick-off"}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelected(match.home + " vs " + match.away)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 py-3 text-sm font-semibold transition hover:border-lime-400/50 hover:text-lime-300"
          >
            <Tv size={17} />
            Match Details
          </button>
        </article>
      ))}
      {filtered.length === 0 && (
        <p className="rounded-xl border border-white/10 p-6 text-gray-400">
          No matching sample fixtures found.
        </p>
      )}
    </div>
  </section>
  <section id="leagues" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
    <h2 className="mb-5 text-2xl font-bold">Explore Leagues</h2>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {["Premier League", "La Liga", "Serie A", "Champions League"].map(
        (league) => (
          <button
            key={league}
            onClick={() => {
              setSearch(league);
              setActive("All Matches");
              document.getElementById("matches")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#10151d] p-4 text-left text-sm font-semibold transition hover:border-lime-400/40"
          >
            <Trophy size={19} className="shrink-0 text-lime-400" />
            {league}
          </button>
        ),
      )}
    </div>
  </section>
  <section id="watch" className="mx-auto max-w-7xl px-4 py-10 md:px-8">
    <div className="rounded-2xl border border-white/10 bg-[#10151d] p-6 md:p-8">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-lime-400/10 p-3 text-lime-400">
          <Tv size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold">Watch Football Live</h2>
          <p className="mt-2 text-sm leading-6 text-gray-400">
            Authorized streaming links will appear here when configured.
            No live video provider is connected yet.
          </p>
        </div>
      </div>
      <div className="mt-5 rounded-xl border border-dashed border-white/15 p-5 text-center text-sm text-gray-500">
        <CalendarDays className="mx-auto mb-3" size={25} />
        Streaming source unavailable
      </div>
    </div>
  </section>
  {selected && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={() => setSelected("")}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#10151d] p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-lime-400">MATCH DETAILS</p>
            <h3 className="mt-2 text-xl font-bold">{selected}</h3>
          </div>
          <button
            onClick={() => setSelected("")}
            className="rounded-lg p-2 text-gray-400 hover:bg-white/10"
            aria-label="Close match details"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-5 rounded-xl bg-black/20 p-4 text-sm leading-6 text-gray-400">
          This is sample match information. Live scores and authorized
          streaming links have not been connected yet.
        </div>
        <button
          onClick={() => setSelected("")}
          className="mt-5 w-full rounded-xl bg-lime-400 py-3 font-bold text-black"
        >
          Close
        </button>
      </div>
    </div>
  )}
  <footer className="mt-10 border-t border-white/10 px-4 py-8 text-center text-xs text-gray-500">
    <Clock3 className="mx-auto mb-3" size={18} />
    <p>RZXXY FOOTBALL LIVE</p>
    <p className="mt-2">Demo scores only · Not an official broadcaster</p>
  </footer>
</main>

);
}
