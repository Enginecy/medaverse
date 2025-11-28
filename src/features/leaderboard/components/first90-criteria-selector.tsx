"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

export function First90CriteriaSelector() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentCriteria =
    (searchParams.get("criteria") as
      | "submitted_av"
      | "time_efficiency"
      | "goal_remaining") || "submitted_av";

  const handleCriteriaChange = (
    newCriteria: "submitted_av" | "time_efficiency" | "goal_remaining",
  ) => {
    startTransition(() => {
      router.push(`/first90-leaderboard?criteria=${newCriteria}`);
    });
  };

  const isActive = (checkCriteria: string) => {
    return checkCriteria === currentCriteria;
  };

  const getLabel = (criteria: string) => {
    switch (criteria) {
      case "submitted_av":
        return "Submitted AV";
      case "time_efficiency":
        return "Time Efficiency";
      case "goal_remaining":
        return "Goal Remaining";
      default:
        return criteria;
    }
  };

  return (
    <div className="flex h-full w-full flex-col items-stretch justify-between rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
      <button
        onClick={() => handleCriteriaChange("submitted_av")}
        disabled={isPending}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 ${
          isActive("submitted_av")
            ? "bg-primary text-foreground font-medium"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        {isPending && currentCriteria !== "submitted_av" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {getLabel("submitted_av")}
      </button>
      <button
        onClick={() => handleCriteriaChange("time_efficiency")}
        disabled={isPending}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 ${
          isActive("time_efficiency")
            ? "bg-primary text-foreground font-medium"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        {isPending && currentCriteria !== "time_efficiency" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {getLabel("time_efficiency")}
      </button>
      <button
        onClick={() => handleCriteriaChange("goal_remaining")}
        disabled={isPending}
        className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md transition-colors disabled:opacity-50 ${
          isActive("goal_remaining")
            ? "bg-primary text-foreground font-medium"
            : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        {isPending && currentCriteria !== "goal_remaining" && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {getLabel("goal_remaining")}
      </button>
    </div>
  );
}

