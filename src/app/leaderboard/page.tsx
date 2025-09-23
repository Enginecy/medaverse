import Image from "next/image";
import logo from "public/meda_health_logo.png";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";
import Link from "next/link";
import { StockCard } from "@/features/leaderboard/components/stock-card";
import { TotalCard } from "@/features/leaderboard/components/price-card";
import { getWeeklySalesAmount, getTodaySalesAmount, getLeadersAndFollowers } from "@/features/leaderboard/server/db/leaderboard";
import {
  getLeaderboardData,
  getLeaderboardDataByRole,
} from "@/app/leaderboard/server";
import { LeaderboardCard } from "@/features/leaderboard/components/leaderboard-card";

export default async function LeaderboardPage() {
  const weeklySales = await getWeeklySalesAmount();
  const todaySales = await getTodaySalesAmount();
  const leaderboardData = await getLeaderboardData();
  const leadersWithFollowers = await getLeadersAndFollowers();
  const associateDirectorData =
    await getLeaderboardDataByRole("associate_director");
  const divisionalDirectorData = await getLeaderboardDataByRole(
    "divisional_director",
  );
  const regionalDirectorData =
    await getLeaderboardDataByRole("regional_director");

  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center gap-4 p-2
        md:p-4 lg:p-6"
    >
      <div
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6
          lg:grid-cols-4"
      >
        <LogoCard />
        <TotalCard week amount={weeklySales} />
        <TotalCard amount={todaySales} />

        <Tabs defaultValue="option1" orientation="vertical">
          <TabsList
            className="flex h-full w-full flex-col items-stretch justify-between
              rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
          >
            <TabsTrigger value="option1" className="min-h-[44px]">
              This week
            </TabsTrigger>
            <TabsTrigger value="option3" className="min-h-[44px]">
              This month
            </TabsTrigger>
            <TabsTrigger value="option5" className="min-h-[44px]">
              All time
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <StockCard />

      <div
        className="pointer-events-none grid w-full grid-cols-1 gap-4 md:gap-6
          lg:grid-cols-2 xl:grid-cols-4"
      >
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: leaderboardData[0]!.name,
              avatar: leaderboardData[0]!.avatarUrl,
              role: leaderboardData[0]!.role!,
              annualizedVolume: leaderboardData[0]!.totalSalesAmount,
              households: leaderboardData[0]!.salesCount,
            }}
          />
          <LeaderboardTable
            title="Personal Production"
            data={leaderboardData}
          />
        </div>
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: associateDirectorData[0]!.name,
              avatar: associateDirectorData[0]!.avatarUrl,
              role: associateDirectorData[0]!.role!,
              annualizedVolume: associateDirectorData[0]!.totalSalesAmount,
              households: associateDirectorData[0]!.salesCount,
            }}
          />
          <LeaderboardTable
            title="Associate Director"
            data={associateDirectorData}
          />
        </div>
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: divisionalDirectorData[0]!.name,
              avatar: divisionalDirectorData[0]!.avatarUrl,
              role: divisionalDirectorData[0]!.role!,
              annualizedVolume: divisionalDirectorData[0]!.totalSalesAmount,
              households: divisionalDirectorData[0]!.salesCount,
            }}
          />
          <LeaderboardTable
            title="Divisional Director"
            data={divisionalDirectorData}
          />
        </div>
        {regionalDirectorData.length > 0 && (
          <div className="flex flex-col gap-4">
            <LeaderboardCard
              user={{
                name: regionalDirectorData[0]!.name,
                avatar: regionalDirectorData[0]!.avatarUrl,
                role: regionalDirectorData[0]!.role!,
                annualizedVolume: regionalDirectorData[0]!.totalSalesAmount,
                households: regionalDirectorData[0]!.salesCount,
              }}
            />
            <LeaderboardTable
              title="Regional Director"
              data={regionalDirectorData}
            />
          </div>
        )}
      </div>
    </div>
  );
}


function LogoCard() {
  return (
    <Link href="/dashboard/home">
      <div
        className="flex h-full min-h-[120px] w-full items-center justify-center
          rounded-3xl bg-zinc-900 p-4 outline outline-offset-[-1px]
          outline-zinc-800 md:p-6"
      >
        <Image alt="logo" src={logo} className="h-12 w-auto md:h-16" />
      </div>
    </Link>
  );
}
