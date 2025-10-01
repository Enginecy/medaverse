import Image from "next/image";
import logo from "public/meda_health_logo.png";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";
import Link from "next/link";
import { StockCard } from "@/features/leaderboard/components/stock-card";
import { TotalCard } from "@/features/leaderboard/components/price-card";
import {
  getTodaySalesAmount,
  getSalesAmountByPeriod,
  getLeadersAndSubordinates,
} from "@/features/leaderboard/server/db/leaderboard";
import { getLeaderboardDataByPeriod } from "@/app/leaderboard/server";
import { LeaderboardCard } from "@/features/leaderboard/components/leaderboard-card";
import LeaderList from "@/features/leaderboard/components/leaders-list";
import { LeaderboardTableEmptyState } from "@/features/leaderboard/components/leaderboard-table-empty-state";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const period =
    ((await searchParams).period as "week" | "month" | "all") || "week";

  const periodSales = await getSalesAmountByPeriod(period);
  const todaySales = await getTodaySalesAmount();
  const leaderboardData = await getLeaderboardDataByPeriod(period);
  const regionalData = await getLeadersAndSubordinates({
    roleId: "1f4783da-f957-4f41-8019-e0d66191aedf",
    period,
  });
  const divisionalData = await getLeadersAndSubordinates({
    roleId: "e49518bc-995f-4e03-a9a8-c57ad6ab6233",
    period,
  });
  const associateData = await getLeadersAndSubordinates({
    roleId: "4a1ba935-f500-4179-b0f1-053028523256",
    period,
  });
  const nationalData = await getLeadersAndSubordinates({
    roleId: "7123105a-26ba-4829-93f3-48924cd921b9",
    period,
  });

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
        <TotalCard
          week={period === "week"}
          amount={periodSales}
          period={period}
        />
        <TotalCard amount={todaySales} />

        <div
          className="flex h-full w-full flex-col items-stretch justify-between
            rounded-3xl border border-zinc-800 bg-zinc-900 p-4"
        >
          <Link
            href="/leaderboard?period=week"
            className={`flex min-h-[44px] items-center justify-center rounded-md
              transition-colors ${
              period === "week"
                  ? "bg-primary text-foreground font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
          >
            This week
          </Link>
          <Link
            href="/leaderboard?period=month"
            className={`flex min-h-[44px] items-center justify-center rounded-md
              transition-colors ${
              period === "month"
                  ? "bg-primary text-foreground font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
          >
            This month
          </Link>
          <Link
            href="/leaderboard?period=all"
            className={`flex min-h-[44px] items-center justify-center rounded-md
              transition-colors ${
              period === "all"
                  ? "bg-primary text-foreground font-medium"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
          >
            All time
          </Link>
        </div>
      </div>

      <StockCard />

      <div
        className="grid w-full grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2
          xl:grid-cols-4"
      >
        <div className="flex flex-col gap-4">
          {leaderboardData.length === 0 ? (
            <LeaderboardTableEmptyState />
          ) : (
            <>
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
                title="Personal Record"
                data={leaderboardData}
              />
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: associateData[0]?.leader_name ?? "",
              avatar: associateData[0]?.avatar_url ?? "",
              role: "Associate Director",
              annualizedVolume: associateData[0]?.full_total_sales ?? "",
              households: Number(associateData[0]?.full_total_sales_count ?? 0),
            }}
          />
          <LeaderList data={associateData ?? []} title="Associate Director" />
        </div>
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: divisionalData[0]?.leader_name ?? "",
              avatar: divisionalData[0]?.avatar_url ?? "",
              role: "Divisional Director",
              annualizedVolume: divisionalData[0]?.full_total_sales ?? "",
              households: Number(
                divisionalData[0]?.full_total_sales_count ?? 0,
              ),
            }}
          />
          <LeaderList data={divisionalData ?? []} title="Divisional Director" />
        </div>
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: regionalData[0]?.leader_name ?? "",
              avatar: regionalData[0]?.avatar_url ?? "",
              role: "Regional Director",
              annualizedVolume: regionalData[0]?.full_total_sales ?? "",
              households: Number(regionalData[0]?.full_total_sales_count ?? 0),
            }}
          />
          <LeaderList data={regionalData ?? []} title="Regional Director" />
        </div>
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: nationalData[0]?.leader_name ?? "",
              avatar: nationalData[0]?.avatar_url ?? "",
              role: "National Director",
              annualizedVolume: nationalData[0]?.full_total_sales ?? "",
              households: Number(nationalData[0]?.full_total_sales_count ?? 0),
            }}
          />
          <LeaderList data={nationalData ?? []} title="National Director" />
        </div>
        <div className="flex flex-col gap-4">
          <LeaderboardCard
            user={{
              name: nationalData[0]?.leader_name ?? "",
              avatar: nationalData[0]?.avatar_url ?? "",
              role: "National Director",
              annualizedVolume: nationalData[0]?.full_total_sales ?? "",
              households: Number(nationalData[0]?.full_total_sales_count ?? 0),
            }}
          />
          <LeaderList data={nationalData ?? []} title="National Director" />
        </div>
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
