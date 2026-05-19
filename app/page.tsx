"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const BONK_MINT = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";

const startingSnapshot = {
  lockedBonk: 275_000_000,
  confirmedRewards: 84_231,
  rewardsPerHour: 1_342,
  lastConfirmedAt: Date.now()
};

const dailyRewards = [
  { day: "Mon", rewards: 74200 },
  { day: "Tue", rewards: 81100 },
  { day: "Wed", rewards: 79800 },
  { day: "Thu", rewards: 83600 },
  { day: "Fri", rewards: 86400 },
  { day: "Sat", rewards: 90200 },
  { day: "Sun", rewards: 88400 }
];

function formatBonk(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-zinc-500">{helper}</p>
    </div>
  );
}

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const liveEstimatedRewards = useMemo(() => {
    const hoursSinceSnapshot = (now - startingSnapshot.lastConfirmedAt) / 1000 / 60 / 60;
    return startingSnapshot.confirmedRewards + hoursSinceSnapshot * startingSnapshot.rewardsPerHour;
  }, [now]);

  const projectedMonth = startingSnapshot.rewardsPerHour * 24 * 30;
  const todayEstimate = startingSnapshot.rewardsPerHour * 24;
  const estimatedDifference = liveEstimatedRewards - startingSnapshot.confirmedRewards;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#361708_0%,#09090b_40%,#030303_100%)] px-6 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-orange-300/10 bg-black/30 p-6 shadow-2xl shadow-orange-950/20 backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">BONK Engine</p>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">Rewards Tracker</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                A live dashboard for BONK lockers. Confirmed rewards stay honest. Estimated rewards make the lock feel alive.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">BONK mint</p>
              <p className="mt-2 max-w-[18rem] truncate font-mono text-sm text-orange-200">{BONK_MINT}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <input
              value={wallet}
              onChange={(event) => setWallet(event.target.value)}
              placeholder="Paste Solana wallet address"
              className="rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none ring-orange-400/40 transition placeholder:text-zinc-600 focus:ring-4"
            />
            <button className="rounded-2xl bg-orange-400 px-6 py-4 font-bold text-black transition hover:bg-orange-300">
              Track wallet
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Locked BONK" value={formatBonk(startingSnapshot.lockedBonk)} helper="Mocked until lock adapter is connected" />
            <StatCard label="Confirmed rewards" value={formatBonk(startingSnapshot.confirmedRewards)} helper="Last confirmed on-chain snapshot" />
            <StatCard label="Live estimate" value={formatBonk(liveEstimatedRewards)} helper={`+${formatBonk(estimatedDifference)} since snapshot`} />
            <StatCard label="Reward speed" value={`${formatBonk(startingSnapshot.rewardsPerHour)}/hr`} helper={`${formatBonk(todayEstimate)} BONK/day`} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Daily rewards</h2>
                  <p className="text-sm text-zinc-500">Confirmed + estimated reward flow</p>
                </div>
                <p className="rounded-full bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-200">Live mode</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRewards} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" />
                    <YAxis stroke="rgba(255,255,255,0.45)" tickFormatter={(value) => `${Number(value) / 1000}k`} />
                    <Tooltip contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px" }} />
                    <Area type="monotone" dataKey="rewards" stroke="#fb923c" fill="#fb923c" fillOpacity={0.18} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-xl font-bold">Projection</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                The product promise: make BONK locks easier to understand without pretending estimates are confirmed rewards.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">30-day projected rewards</p>
                  <p className="mt-2 text-2xl font-black text-orange-200">{formatBonk(projectedMonth)} BONK</p>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">Data labels</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Confirmed = chain. Estimated = live counter. Projected = future rate math.
                  </p>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">Next build target</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Replace mock snapshot with Solana wallet reads and BONK transfer history.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
