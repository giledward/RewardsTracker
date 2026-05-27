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

type DataClass = "Confirmed" | "Estimated" | "Projected";

type DemoSnapshot = {
  name: string;
  description: string;
  lockedBonk: number;
  confirmedRewards: number;
  rewardsPerHour: number;
  lastConfirmedLabel: string;
};

const demoProfiles: DemoSnapshot[] = [
  {
    name: "Starter lock",
    description: "Small wallet test profile",
    lockedBonk: 25_000_000,
    confirmedRewards: 7_850,
    rewardsPerHour: 155,
    lastConfirmedLabel: "Demo snapshot 14m ago"
  },
  {
    name: "Empire mode",
    description: "275M locked BONK style profile",
    lockedBonk: 275_000_000,
    confirmedRewards: 84_231,
    rewardsPerHour: 1_342,
    lastConfirmedLabel: "Demo snapshot 14m ago"
  },
  {
    name: "Whale mode",
    description: "Stress test huge numbers and chart scaling",
    lockedBonk: 1_000_000_000,
    confirmedRewards: 410_000,
    rewardsPerHour: 5_750,
    lastConfirmedLabel: "Demo snapshot 14m ago"
  }
];

function buildDailyRewards(rewardsPerHour: number) {
  const base = rewardsPerHour * 24;

  return [
    { day: "Mon", confirmed: Math.round(base * 0.84), estimated: Math.round(base * 0.88) },
    { day: "Tue", confirmed: Math.round(base * 0.92), estimated: Math.round(base * 0.95) },
    { day: "Wed", confirmed: Math.round(base * 0.9), estimated: Math.round(base * 0.94) },
    { day: "Thu", confirmed: Math.round(base * 0.96), estimated: Math.round(base * 0.99) },
    { day: "Fri", confirmed: Math.round(base), estimated: Math.round(base * 1.03) },
    { day: "Sat", confirmed: Math.round(base * 1.08), estimated: Math.round(base * 1.11) },
    { day: "Sun", confirmed: Math.round(base * 1.04), estimated: Math.round(base * 1.07) }
  ];
}

function formatBonk(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);
}

function formatChartTick(value: number) {
  if (value >= 1_000_000) return `${Number((value / 1_000_000).toFixed(1))}M`;
  if (value >= 1_000) return `${Number((value / 1_000).toFixed(1))}k`;
  return `${value}`;
}

function DataBadge({ type }: { type: DataClass }) {
  const styles = {
    Confirmed: "border-emerald-300/30 bg-emerald-400/10 text-emerald-200",
    Estimated: "border-orange-300/30 bg-orange-400/10 text-orange-200",
    Projected: "border-sky-300/30 bg-sky-400/10 text-sky-200"
  } satisfies Record<DataClass, string>;

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.2em] ${styles[type]}`}>
      {type}
    </span>
  );
}

function RewardCard({
  type,
  label,
  value,
  helper
}: {
  type: DataClass;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-zinc-400">{label}</p>
        <DataBadge type={type} />
      </div>
      <p className="mt-4 text-3xl font-black tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm leading-6 text-zinc-500">{helper}</p>
    </div>
  );
}

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [now, setNow] = useState(Date.now());
  const [snapshotStartedAt, setSnapshotStartedAt] = useState(Date.now());
  const [selectedProfileName, setSelectedProfileName] = useState(demoProfiles[1].name);
  const [rewardsPerHour, setRewardsPerHour] = useState(demoProfiles[1].rewardsPerHour);

  const selectedProfile = useMemo(
    () => demoProfiles.find((profile) => profile.name === selectedProfileName) ?? demoProfiles[1],
    [selectedProfileName]
  );

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  function loadProfile(profile: DemoSnapshot) {
    setSelectedProfileName(profile.name);
    setRewardsPerHour(profile.rewardsPerHour);
    setSnapshotStartedAt(Date.now());
  }

  function resetDemoClock() {
    setSnapshotStartedAt(Date.now());
    setNow(Date.now());
  }

  const liveEstimatedRewards = useMemo(() => {
    const hoursSinceSnapshot = (now - snapshotStartedAt) / 1000 / 60 / 60;
    return selectedProfile.confirmedRewards + hoursSinceSnapshot * rewardsPerHour;
  }, [now, rewardsPerHour, selectedProfile.confirmedRewards, snapshotStartedAt]);

  const dailyRewards = useMemo(() => buildDailyRewards(rewardsPerHour), [rewardsPerHour]);
  const projectedDay = rewardsPerHour * 24;
  const projectedWeek = projectedDay * 7;
  const projectedMonth = projectedDay * 30;
  const estimatedDifference = liveEstimatedRewards - selectedProfile.confirmedRewards;
  const secondsRunning = Math.floor((now - snapshotStartedAt) / 1000);
  const walletStatus = wallet.trim() ? "Wallet adapter not connected yet — address saved locally for the demo." : "Demo mode active. Paste a wallet later when the adapter is live.";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#361708_0%,#09090b_42%,#030303_100%)] px-6 py-8 text-white">
      <section className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 rounded-[2rem] border border-orange-300/10 bg-black/30 p-6 shadow-2xl shadow-orange-950/20 backdrop-blur md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orange-300">BonkXSol</p>
                <p className="rounded-full border border-orange-300/20 bg-orange-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-200">
                  MVP demo
                </p>
              </div>
              <h1 className="mt-3 text-4xl font-black tracking-tight md:text-6xl">BONK Rewards Command Center</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300 md:text-lg">
                A locker dashboard that separates what is confirmed on-chain, what is estimated in real time, and what is projected forward. The interface is ready for wallet data without pretending mock data is live chain truth.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">BONK mint</p>
              <p className="mt-2 max-w-[18rem] truncate font-mono text-sm text-orange-200">{BONK_MINT}</p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <div>
              <input
                value={wallet}
                onChange={(event) => setWallet(event.target.value)}
                placeholder="Paste Solana wallet address. Demo works without it."
                className="w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-4 text-white outline-none ring-orange-400/40 transition placeholder:text-zinc-600 focus:ring-4"
              />
              <p className="mt-2 text-xs text-zinc-500">{walletStatus}</p>
            </div>
            <button className="rounded-2xl bg-orange-400 px-6 py-4 font-bold text-black transition hover:bg-orange-300">
              Track wallet soon
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-emerald-300/20 bg-emerald-400/10 p-5">
              <DataBadge type="Confirmed" />
              <h2 className="mt-4 text-xl font-black">Confirmed snapshot</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Data that should come from the wallet, lock contract, or reward transaction history once the Solana adapter is wired in.
              </p>
            </div>
            <div className="rounded-3xl border border-orange-300/20 bg-orange-400/10 p-5">
              <DataBadge type="Estimated" />
              <h2 className="mt-4 text-xl font-black">Live counter</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                The moving number between confirmed updates. Useful for feel, but always labeled as an estimate.
              </p>
            </div>
            <div className="rounded-3xl border border-sky-300/20 bg-sky-400/10 p-5">
              <DataBadge type="Projected" />
              <h2 className="mt-4 text-xl font-black">Forward math</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Daily, weekly, and monthly reward projections based on the selected reward speed, not guaranteed future rewards.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-bold">Demo controls</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Test the app without a wallet. Current profile: {selectedProfile.name} — {selectedProfile.description}.
                </p>
              </div>
              <button
                onClick={resetDemoClock}
                className="rounded-2xl border border-white/10 px-4 py-3 text-sm font-bold text-zinc-200 transition hover:bg-white/10"
              >
                Reset live counter
              </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {demoProfiles.map((profile) => (
                <button
                  key={profile.name}
                  onClick={() => loadProfile(profile)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    selectedProfile.name === profile.name
                      ? "border-orange-300/60 bg-orange-400/10"
                      : "border-white/10 bg-black/20 hover:bg-white/10"
                  }`}
                >
                  <p className="font-bold text-white">{profile.name}</p>
                  <p className="mt-1 text-sm text-zinc-500">{profile.description}</p>
                  <p className="mt-3 text-sm font-semibold text-orange-200">{formatBonk(profile.lockedBonk)} locked</p>
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-black/30 p-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <label htmlFor="reward-speed" className="text-sm font-semibold text-zinc-300">
                  Reward speed: {formatBonk(rewardsPerHour)} BONK/hour
                </label>
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-600">runtime {secondsRunning}s</p>
              </div>
              <input
                id="reward-speed"
                type="range"
                min="50"
                max="12000"
                step="50"
                value={rewardsPerHour}
                onChange={(event) => setRewardsPerHour(Number(event.target.value))}
                className="mt-4 w-full accent-orange-400"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <RewardCard
              type="Confirmed"
              label="Locked BONK"
              value={formatBonk(selectedProfile.lockedBonk)}
              helper="Demo profile until the lock adapter is connected."
            />
            <RewardCard
              type="Confirmed"
              label="Confirmed rewards"
              value={formatBonk(selectedProfile.confirmedRewards)}
              helper={selectedProfile.lastConfirmedLabel}
            />
            <RewardCard
              type="Estimated"
              label="Live estimate"
              value={formatBonk(liveEstimatedRewards)}
              helper={`+${formatBonk(estimatedDifference)} BONK since the confirmed snapshot.`}
            />
            <RewardCard
              type="Projected"
              label="Projected daily rewards"
              value={formatBonk(projectedDay)}
              helper={`${formatBonk(rewardsPerHour)} BONK/hour × 24 hours.`}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-xl font-bold">Reward flow</h2>
                  <p className="text-sm text-zinc-500">Confirmed history with an estimated overlay.</p>
                </div>
                <p className="rounded-full bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-200">Live demo</p>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyRewards} margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.45)" />
                    <YAxis stroke="rgba(255,255,255,0.45)" tickFormatter={(value) => formatChartTick(Number(value))} />
                    <Tooltip
                      contentStyle={{ background: "#111", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "16px" }}
                      formatter={(value, name) => [`${formatBonk(Number(value))} BONK`, name === "confirmed" ? "Confirmed" : "Estimated"]}
                    />
                    <Area type="monotone" dataKey="confirmed" stroke="#34d399" fill="#34d399" fillOpacity={0.12} />
                    <Area type="monotone" dataKey="estimated" stroke="#fb923c" fill="#fb923c" fillOpacity={0.18} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <h2 className="text-xl font-bold">Projection panel</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Projections are rate math only. They should update when confirmed reward behavior changes.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">24-hour projection</p>
                  <p className="mt-2 text-2xl font-black text-orange-200">{formatBonk(projectedDay)} BONK</p>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">7-day projection</p>
                  <p className="mt-2 text-2xl font-black text-orange-200">{formatBonk(projectedWeek)} BONK</p>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">30-day projection</p>
                  <p className="mt-2 text-2xl font-black text-orange-200">{formatBonk(projectedMonth)} BONK</p>
                </div>
                <div className="rounded-2xl bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">Next build target</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-300">
                    Replace demo profiles with Solana wallet reads, BONK token accounts, and reward transaction parsing.
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
