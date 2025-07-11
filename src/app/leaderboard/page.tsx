import Image from "next/image";
import logo from "public/meda_health_logo.png";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { LeaderboardTable } from "@/components/leaderboard-table";
import Link from "next/link";
import { StockCard } from "@/features/leaderboard/components/stock-card";

export default function LeaderboardPage() {
  return (
    <div className="bg-background flex h-screen flex-col items-center gap-4 p-6">
      <div className="grid w-full grid-cols-4 gap-6">
        <LogoCard />
        <TotalCard week />
        <TotalCard />

        <Tabs defaultValue="option1" orientation="vertical">
          <TabsList
            className="flex h-full w-full flex-col items-stretch justify-between
              rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <TabsTrigger value="option1">This week</TabsTrigger>
            <TabsTrigger value="option3">This month</TabsTrigger>
            <TabsTrigger value="option5">All time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <StockCard />

      <div className="grid w-full grid-cols-4 gap-6">
        <LeaderboardCard />
        <LeaderboardCard />
        <LeaderboardCard />
        <LeaderboardCard />
      </div>

      <div className="grid w-full grid-cols-4 gap-6">
        <LeaderboardTable title="Personal Production" />
        <LeaderboardTable title="Associate Director" />
        <LeaderboardTable title="Divisional Director" />
        <LeaderboardTable title="Regional Director" />
      </div>
    </div>
  );
}

function LeaderboardCard() {
  return (
    <div
      className="relative flex w-full flex-col gap-8 overflow-hidden rounded-3xl
        bg-zinc-900 p-10 outline outline-zinc-800"
    >
      <div
        className="absolute top-[120px] left-[120px] h-80 w-full
          bg-gradient-to-br from-slate-700/40 via-blue-800/40 to-fuchsia-900/40
          blur-2xl"
      />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="placeholder"
          className="h-36 w-36 rounded-4xl border"
          src="https://placehold.co/151x151"
        />

        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="text-3xl font-semibold text-neutral-200">
            Austin Woodruff
          </div>
          <div className="text-xl font-semibold text-neutral-400">
            Senior Associate
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div
          className="flex flex-col items-start justify-center gap-2 text-base
            font-medium text-neutral-400"
        >
          Annualized Volume
          <span className="text-primary-300 text-4xl font-semibold">
            $48,500
          </span>
        </div>

        <div
          className="flex flex-col items-end justify-center gap-2 text-base
            font-medium text-neutral-400"
        >
          Households
          <span className="text-primary-300 text-4xl font-semibold">12</span>
        </div>
      </div>
    </div>
  );
}

function LogoCard() {
  return (
    <Link href="/dashboard/home">
      <div
        className="flex h-full w-full items-center justify-center rounded-3xl
          bg-zinc-900 p-6 outline outline-offset-[-1px] outline-zinc-800"
      >
        <Image alt="logo" src={logo} className="h-16 w-auto" />
      </div>
    </Link>
  );
}

function TotalCard({ week }: { week?: boolean }) {
  const title = week ? "This Week" : "Today";
  const color = week ? "bg-sky-600/20" : "bg-emerald-500/20";
  const textColor = week ? "text-blue-500" : "text-emerald-500";
  const backgroundColor = week ? "bg-sky-600/20" : "bg-emerald-500/20";
  return (
    <div
      className="flex flex-col items-center justify-between gap-3.5 rounded-3xl
        bg-zinc-900 p-6 outline outline-offset-[-1px] outline-zinc-800"
    >
      <div
        className={`flex items-center justify-center gap-1.5 rounded-4xl px-4
          ${backgroundColor} py-2`}
      >
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <div className={`justify-start text-base font-semibold ${textColor}`}>
          {title}
        </div>
      </div>
      <div className={`text-center text-5xl font-bold ${textColor}`}>
        $1,185,199
      </div>
    </div>
  );
}

