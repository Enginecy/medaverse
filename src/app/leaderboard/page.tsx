import Image from "next/image";
import logo from "public/meda_health_logo.png";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { LeaderboardTable } from "@/components/leaderboard-table";
import Link from "next/link";
import { StockCard } from "@/features/leaderboard/components/stock-card";
import { TotalCard } from "@/features/leaderboard/components/price-card";
import { getTotalSalesAmount } from "@/features/leaderboard/server/db/leaderboard";

export default async function LeaderboardPage() {
  const totalSales = await getTotalSalesAmount();
  return (
    <div className="bg-background flex min-h-screen flex-col items-center gap-4 p-2 md:p-4 lg:p-6">
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <LogoCard />
        <TotalCard week amount={totalSales} />
        <TotalCard amount={totalSales} />

        <Tabs defaultValue="option1" orientation="vertical">
          <TabsList
            className="flex h-full w-full flex-col items-stretch justify-between
              rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <TabsTrigger value="option1" className="min-h-[44px]">This week</TabsTrigger>
            <TabsTrigger value="option3" className="min-h-[44px]">This month</TabsTrigger>
            <TabsTrigger value="option5" className="min-h-[44px]">All time</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <StockCard />

      <div className="relative flex flex-col gap-4 md:gap-6 w-full">
        <div
          className="pointer-events-none grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6
            opacity-20"
        >
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4">
          <div
            className="border-primary-500 rounded-3xl border-2 bg-black/80 px-6 md:px-10
              py-4 md:py-6 text-xl md:text-3xl font-bold text-white shadow-lg text-center"
          >
            Waiting for data...
          </div>
        </div>
        <div className="pointer-events-none grid w-full grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6
            opacity-20"
        >
          <LeaderboardTable title="Personal Production" />
          <LeaderboardTable title="Associate Director" />
          <LeaderboardTable title="Divisional Director" />
          <LeaderboardTable title="Regional Director" />
        </div>
      </div>
    </div>
  );
}

function LeaderboardCard() {
  return (
    <div
      className="relative flex w-full flex-col gap-4 md:gap-8 overflow-hidden rounded-3xl
        bg-zinc-900 p-4 md:p-6 lg:p-10 outline outline-zinc-800"
    >
      <div
        className="absolute top-16 md:top-24 lg:top-[120px] left-16 md:left-24 lg:left-[120px] h-40 md:h-60 lg:h-80 w-full
          bg-gradient-to-br from-slate-700/40 via-blue-800/40 to-fuchsia-900/40
          blur-2xl"
      />

      <div className="flex w-full flex-col items-center justify-center gap-2 md:gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="placeholder"
          className="h-20 w-20 md:h-28 md:w-28 lg:h-36 lg:w-36 rounded-2xl md:rounded-3xl lg:rounded-4xl border"
          src="https://placehold.co/151x151"
        />

        <div className="flex flex-col items-center justify-center gap-1 md:gap-1.5">
          <div className="text-lg md:text-2xl lg:text-3xl font-semibold text-neutral-200 text-center">
            Austin Woodruff
          </div>
          <div className="text-sm md:text-lg lg:text-xl font-semibold text-neutral-400 text-center">
            Senior Associate
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <div
          className="flex flex-col items-center sm:items-start justify-center gap-1 md:gap-2 text-sm md:text-base
            font-medium text-neutral-400 text-center sm:text-left"
        >
          Annualized Volume
          <span className="text-primary-300 text-2xl md:text-3xl lg:text-4xl font-semibold">
            $48,500
          </span>
        </div>

        <div
          className="flex flex-col items-center sm:items-end justify-center gap-1 md:gap-2 text-sm md:text-base
            font-medium text-neutral-400 text-center sm:text-right"
        >
          Households
          <span className="text-primary-300 text-2xl md:text-3xl lg:text-4xl font-semibold">12</span>
        </div>
      </div>
    </div>
  );
}

function LogoCard() {
  return (
    <Link href="/dashboard/home">
      <div
        className="flex h-full w-full min-h-[120px] items-center justify-center rounded-3xl
          bg-zinc-900 p-4 md:p-6 outline outline-offset-[-1px] outline-zinc-800"
      >
        <Image alt="logo" src={logo} className="h-12 md:h-16 w-auto" />
      </div>
    </Link>
  );
}
