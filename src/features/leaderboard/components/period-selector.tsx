"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export function PeriodSelector({
  customDateRange,
}: {
  customDateRange?: { from: string; to: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentPeriod = searchParams.get("period") ?? "week";

  const handlePeriodChange = (newPeriod: "week" | "month" | "all") => {
    startTransition(() => {
      router.push(`/leaderboard?period=${newPeriod}`);
    });
  };

  const isActive = (checkPeriod: string) => {
    return checkPeriod === currentPeriod && !customDateRange;
  };

  return (
    <div className="flex h-full w-full flex-col items-stretch justify-between rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
      <button
        onClick={() => handlePeriodChange("week")}
        disabled={isPending}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 ${
          isActive("week")
            ? "bg-primary text-foreground font-medium"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        {isPending && currentPeriod !== "week" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        This week
      </button>
      <button
        onClick={() => handlePeriodChange("month")}
        disabled={isPending}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 ${
          isActive("month")
            ? "bg-primary text-foreground font-medium"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        {isPending && currentPeriod !== "month" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        This month
      </button>
      <button
        onClick={() => handlePeriodChange("all")}
        disabled={isPending}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 ${
          isActive("all")
            ? "bg-primary text-foreground font-medium"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        {isPending && currentPeriod !== "all" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        All time
      </button>
      {customDateRange && (
        <div className="bg-primary text-foreground flex min-h-[44px] items-center justify-center rounded-md font-medium">
          Custom Range
        </div>
      )}
    </div>
  );
}

