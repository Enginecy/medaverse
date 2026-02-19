import Image from "next/image";
import logo from "public/meda_health_logo.png";
import { LeaderboardTable } from "@/features/leaderboard/components/leaderboard-table";
import Link from "next/link";
import { StockCard } from "@/features/leaderboard/components/stock-card";
import { TotalCard } from "@/features/leaderboard/components/price-card";
import {
  getIssuedTodaySalesAmount,
  getIssuedSalesAmountByPeriod,
  getIssuedLeadersAndSubordinates,
  getIssuedLeaderboardDataByPeriod,
} from "@/features/leaderboard/server/db/issued-leaderboard";
import { LeaderboardCard } from "@/features/leaderboard/components/leaderboard-card";
import LeaderList from "@/features/leaderboard/components/leaders-list";
import { LeaderboardTableEmptyState } from "@/features/leaderboard/components/leaderboard-table-empty-state";
import { DateRangeSelector } from "@/features/leaderboard/components/date-range-selector";
import { PeriodSelector } from "@/features/leaderboard/components/period-selector";

export default async function IssuedLeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string; from?: string; to?: string }>;
}) {
  const params = await searchParams;
  const period = (params.period as "week" | "month" | "all") || "week";
  const customDateRange =
    params.from && params.to
      ? { from: params.from, to: params.to }
      : undefined;

  const periodSales = await getIssuedSalesAmountByPeriod(period, customDateRange);
  const todaySales = await getIssuedTodaySalesAmount(customDateRange);
  const leaderboardData = await getIssuedLeaderboardDataByPeriod(
    period,
    customDateRange,
  );
  const regionalData = await getIssuedLeadersAndSubordinates({
    roleId: "1f4783da-f957-4f41-8019-e0d66191aedf",
    period,
    customDateRange,
  });
  const divisionalData = await getIssuedLeadersAndSubordinates({
    roleId: "e49518bc-995f-4e03-a9a8-c57ad6ab6233",
    period,
    customDateRange,
  });
  const associateData = await getIssuedLeadersAndSubordinates({
    roleId: "4a1ba935-f500-4179-b0f1-053028523256",
    period,
    customDateRange,
  });
  const nationalData = await getIssuedLeadersAndSubordinates({
    roleId: "7123105a-26ba-4829-93f3-48924cd921b9",
    period,
    customDateRange,
  });

  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center gap-4 p-2
        md:p-4 lg:p-6"
    >
      <div className="flex w-full items-end justify-end sm:flex-row sm:items-center">
        <DateRangeSelector />
      </div>

      <div
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6
          lg:grid-cols-4"
      >
        <LogoCard />
        <TotalCard
          week={period === "week"}
          amount={periodSales}
          period={customDateRange ? undefined : period}
          customRange={!!customDateRange}
        />
        <TotalCard amount={todaySales} customRange={!!customDateRange} />

        <PeriodSelector customDateRange={customDateRange} />
      </div>

      <StockCard issuedOnly />

      <div
        className="grid w-full grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2
          xl:grid-cols-5"
      >
        <div className="flex flex-col gap-4">
          {leaderboardData?.length === 0 ? (
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
                title="Personal Production (Issued)"
                data={leaderboardData}
              />
            </>
          )}
        </div>

        {associateData.length > 0 && (
          <div className="flex flex-col gap-4">
            <LeaderboardCard
              user={{
                name: associateData[0]?.leader_name ?? "",
                avatar: associateData[0]?.avatar_url ?? "",
                role: "Associate Director",
                annualizedVolume:
                  Math.ceil(
                    Number(associateData[0]?.full_total_sales) * 12,
                  ).toLocaleString() ?? "",
                households: associateData[0]?.full_total_sales_count ?? 0,
              }}
            />
            <LeaderList data={associateData ?? []} title="Associate Director" />
          </div>
        )}
        {divisionalData.length > 0 && (
          <div className="flex flex-col gap-4">
            <LeaderboardCard
              user={{
                name: divisionalData[0]?.leader_name ?? "",
                avatar: divisionalData[0]?.avatar_url ?? "",
                role: "Divisional Director",
                annualizedVolume:
                  Math.ceil(
                    Number(divisionalData[0]?.full_total_sales) * 12,
                  ).toLocaleString() ?? "",
                households: divisionalData[0]?.full_total_sales_count ?? 0,
              }}
            />
            <LeaderList
              data={divisionalData ?? []}
              title="Divisional Director"
            />
          </div>
        )}
        {regionalData.length > 0 && (
          <div className="flex flex-col gap-4">
            <LeaderboardCard
              user={{
                name: regionalData[0]?.leader_name ?? "",
                avatar: regionalData[0]?.avatar_url ?? "",
                role: "Regional Director",
                annualizedVolume:
                  Math.ceil(
                    Number(regionalData[0]?.full_total_sales) * 12,
                  ).toLocaleString() ?? "",
                households: regionalData[0]?.full_total_sales_count ?? 0,
              }}
            />
            <LeaderList data={regionalData ?? []} title="Regional Director" />
          </div>
        )}
        {nationalData.length > 0 && (
          <div className="flex flex-col gap-4">
            <LeaderboardCard
              user={{
                name: nationalData[0]?.leader_name ?? "",
                avatar: nationalData[0]?.avatar_url ?? "",
                role: "National Director",
                annualizedVolume:
                  Math.ceil(
                    Number(nationalData[0]?.full_total_sales) * 12,
                  ).toLocaleString() ?? "",
                households: nationalData[0]?.full_total_sales_count ?? 0,
              }}
            />
            <LeaderList data={nationalData ?? []} title="National Director" />
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
