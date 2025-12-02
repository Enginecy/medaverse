import Image from "next/image";

export function First90LeaderboardCard({
  user,
  criteria,
}: {
  user: {
    name: string;
    avatar: string;
    submittedAv: number;
    goalRemaining: number;
    weeksLeft: number;
    goalProgress: number;
    timeEfficiency: number;
  };
  criteria: "submitted_av" | "time_efficiency" | "goal_remaining";
}) {
  const getPrimaryMetric = () => {
    switch (criteria) {
      case "submitted_av":
        return {
          label: "Submitted AV",
          value: `$${Math.ceil(user.submittedAv).toLocaleString()}`,
        };
      case "time_efficiency":
        return {
          label: "AV per Week",
          value: `$${Math.ceil(user.timeEfficiency).toLocaleString()}`,
        };
      case "goal_remaining":
        const remaining = user.goalRemaining;
        const isNegative = remaining < 0;
        return {
          label: "Goal Surpassed",
          value: `$${Math.ceil(Math.abs(remaining)).toLocaleString()}${
            isNegative ? " +" : ""
          }`,
        };
    }
  };

  const primaryMetric = getPrimaryMetric();
  const goalProgressPercent = Math.min(100, Math.max(0, user.goalProgress));

  return (
    <div
      className="relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl
        bg-gradient-to-br from-slate-900/95 via-blue-900/40 to-cyan-900/40 p-4
        outline outline-cyan-500/30 outline-offset-[-1px] backdrop-blur-sm
        md:gap-8 md:p-6 lg:p-10 transition-all hover:outline-cyan-400/50
        hover:shadow-2xl hover:shadow-cyan-500/20"
    >
      <div
        className="absolute top-16 left-16 h-40 w-full bg-gradient-to-br
          from-cyan-500/30 via-blue-500/30 to-cyan-600/30 blur-3xl md:top-24
          md:left-24 md:h-60 lg:top-[120px] lg:left-[120px] lg:h-80 animate-pulse"
      />

      <div
        className="flex w-full flex-col items-center justify-center gap-2
          md:gap-4"
      >
        <div className="relative h-20 w-20 md:h-28 md:w-28 lg:h-36 lg:w-36">
          <Image
            src={user.avatar}
            alt={user.name}
            fill
            className="rounded-2xl border object-cover md:rounded-3xl
              lg:rounded-4xl"
          />
        </div>

        <div
          className="flex flex-col items-center justify-center gap-1 md:gap-1.5"
        >
          <div
            className="text-center text-lg font-semibold text-cyan-100
              md:text-2xl lg:text-3xl drop-shadow-lg"
          >
            {user.name}
          </div>
          <div
            className="text-center text-sm font-semibold bg-gradient-to-r
              from-cyan-400 via-blue-400 to-cyan-500 bg-clip-text text-transparent
              md:text-lg lg:text-xl"
          >
            First 90 Leader
          </div>
        </div>
      </div>

      <div
        className="flex w-full flex-col items-center justify-between gap-4
          sm:flex-row sm:gap-0"
      >
        <div
          className="flex flex-col items-center justify-center gap-1 text-center
            text-sm font-medium text-cyan-300/80 sm:items-start sm:text-left
            md:gap-2 md:text-base"
        >
          {primaryMetric.label}
          <span
            className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text
              text-2xl font-semibold text-transparent md:text-3xl lg:text-4xl
              drop-shadow-lg"
          >
            {primaryMetric.value}
          </span>
        </div>

        <div
          className="flex flex-col items-center justify-center gap-1 text-center
            text-sm font-medium text-blue-300/80 sm:items-end sm:text-right
            md:gap-2 md:text-base"
        >
          Goal Progress
          <span
            className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text
              text-2xl font-semibold text-transparent md:text-3xl lg:text-4xl
              drop-shadow-lg"
          >
            {goalProgressPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-2 w-full">
        <div className="mb-1 flex justify-between text-xs text-cyan-300/70">
          <span>Progress to $150k goal</span>
          <span>{goalProgressPercent.toFixed(1)}%</span>
        </div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800/50 backdrop-blur-sm">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-blue-500
              to-cyan-600 transition-all shadow-lg shadow-cyan-500/50"
            style={{ width: `${goalProgressPercent}%` }}
          />
        </div>
      </div>

      {user.weeksLeft >= 0 && (
        <div className="text-center text-sm text-blue-300/70">
          {user.weeksLeft.toFixed(1)} weeks remaining
        </div>
      )}
    </div>
  );
}

