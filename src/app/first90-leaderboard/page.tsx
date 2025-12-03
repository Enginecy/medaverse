import Image from "next/image";
import logo from "public/meda_health_logo.png";
import Link from "next/link";
import { getFirst90LeaderboardData } from "@/app/first90-leaderboard/server";
import { First90LeaderboardTable } from "@/features/leaderboard/components/first90-leaderboard-table";
import { First90LeaderboardTableEmptyState } from "@/features/leaderboard/components/first90-leaderboard-table-empty-state";
import { First90LeaderboardCard } from "@/features/leaderboard/components/first90-leaderboard-card";
import { getFirst90Stats } from "@/features/leaderboard/server/db/first90-leaderboard";
import { First90StatsCard } from "@/features/leaderboard/components/first90-stats-card";

export default async function First90LeaderboardPage() {
  const [submittedAvData, timeEfficiencyData, goalRemainingData] =
    await Promise.all([
      getFirst90LeaderboardData("submitted_av"),
      getFirst90LeaderboardData("time_efficiency"),
      getFirst90LeaderboardData("goal_remaining"),
    ]);

  const stats = await getFirst90Stats();

  return (
    <div
      className="flex min-h-screen flex-col items-center gap-4 bg-gradient-to-br
        from-slate-950 via-blue-950/30 to-cyan-950/20 p-2 md:p-4 lg:p-6"
    >
      <div
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6
          lg:grid-cols-4"
      >
        <LogoCard />
        <First90StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          color="blue"
        />
        <First90StatsCard
          title="Avg AV"
          value={`$${Math.ceil(stats.avgAv).toLocaleString()}`}
          color="emerald"
        />
        <First90StatsCard
          title="Users At Goal"
          value={stats.usersAtGoal.toString()}
          color="purple"
        />
      </div>

      <div
        className="grid w-full grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3"
      >
        {submittedAvData?.length === 0 ? (
          <div className="lg:col-span-3">
            <First90LeaderboardTableEmptyState />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              <First90LeaderboardCard
                user={{
                  name: submittedAvData[0]!.name,
                  avatar: submittedAvData[0]!.avatarUrl,
                  submittedAv: submittedAvData[0]!.submittedAv,
                  goalRemaining: submittedAvData[0]!.goalRemaining,
                  weeksLeft: submittedAvData[0]!.weeksLeft,
                  goalProgress: submittedAvData[0]!.goalProgress,
                  timeEfficiency: submittedAvData[0]!.timeEfficiency,
                }}
                criteria="submitted_av"
              />
              <First90LeaderboardTable
                title="Submitted AV"
                data={submittedAvData}
                criteria="submitted_av"
              />
            </div>
            <div className="flex flex-col gap-4">
              <First90LeaderboardCard
                user={{
                  name: timeEfficiencyData[0]!.name,
                  avatar: timeEfficiencyData[0]!.avatarUrl,
                  submittedAv: timeEfficiencyData[0]!.submittedAv,
                  goalRemaining: timeEfficiencyData[0]!.goalRemaining,
                  weeksLeft: timeEfficiencyData[0]!.weeksLeft,
                  goalProgress: timeEfficiencyData[0]!.goalProgress,
                  timeEfficiency: timeEfficiencyData[0]!.timeEfficiency,
                }}
                criteria="time_efficiency"
              />
              <First90LeaderboardTable
                title="Average Weekly AV"
                data={timeEfficiencyData}
                criteria="time_efficiency"
              />
            </div>
            <div className="flex flex-col gap-4">
              {goalRemainingData.length > 0 ? (
                <>
                  <First90LeaderboardCard
                    user={{
                      name: goalRemainingData[0]!.name,
                      avatar: goalRemainingData[0]!.avatarUrl,
                      submittedAv: goalRemainingData[0]!.submittedAv,
                      goalRemaining: goalRemainingData[0]!.goalRemaining,
                      weeksLeft: goalRemainingData[0]!.weeksLeft,
                      goalProgress: goalRemainingData[0]!.goalProgress,
                      timeEfficiency: goalRemainingData[0]!.timeEfficiency,
                    }}
                    criteria="goal_remaining"
                  />
                  <First90LeaderboardTable
                    title="First 90 Champions"
                    data={goalRemainingData}
                    criteria="goal_remaining"
                  />
                </>
              ) : (
                <First90LeaderboardTable
                  title="First 90 Champions"
                  data={[]}
                  criteria="goal_remaining"
                />
              )}
            </div>
          </>
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
          rounded-3xl bg-gradient-to-br from-slate-900/90 via-blue-900/40
          to-cyan-900/40 p-4 outline outline-offset-[-1px] outline-cyan-500/20
          backdrop-blur-sm md:p-6 transition-all hover:outline-cyan-400/40
          hover:shadow-lg hover:shadow-cyan-500/20"
      >
        <Image alt="logo" src={logo} className="h-12 w-auto md:h-16" />
      </div>
    </Link>
  );
}

