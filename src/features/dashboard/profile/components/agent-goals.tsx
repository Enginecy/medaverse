import { ChartRadialText } from "@/components/radial-chart";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserGoalsAction } from "../server/actions/goals";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Goal } from "../server/db/goals";
import { format } from "date-fns";
import { Suspense } from "react";
import { AddGoalButton } from "@/features/dashboard/home/components/add-goal-button";

export function AgentGoals() {
  return (
    <Card className="w-full rounded-3xl shadow-none border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Agent Goals
        </CardTitle>
        <CardAction>
          <AddGoalButton />
        </CardAction>
      </CardHeader>
      <CardContent className="grid w-full grid-cols-1 gap-6 md:grid-cols-2">
        <Suspense fallback={<GoalsLoadingSkeleton />}>
          <GoalsList />
        </Suspense>
      </CardContent>
    </Card>
  );
}

async function GoalsList() {
  const result = await getUserGoalsAction();

  if (!result.success) {
    return (
      <div
        className="col-span-full flex flex-col items-center justify-center py-8"
      >
        <p className="text-destructive text-sm">
          {result.error ?? "Failed to fetch goals"}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Please refresh the page to try again
        </p>
      </div>
    );
  }

  const goals = result.data ?? [];

  if (goals.length === 0) {
    return (
      <div
        className="col-span-full flex flex-col items-center justify-center py-8"
      >
        <p className="text-muted-foreground text-sm">No goals found</p>
        <p className="text-muted-foreground mt-1 text-xs">
          Create your first goal to start tracking progress
        </p>
      </div>
    );
  }

  return (
    <>
      {goals.map((goal) => (
        <GoalCard key={goal.id} goal={goal} />
      ))}
    </>
  );
}

function GoalsLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <GoalCardSkeleton key={index} />
      ))}
    </>
  );
}

function GoalCardSkeleton() {
  return (
    <div
      className="flex min-h-[150px] w-full min-w-[260px] flex-col items-center
        justify-between gap-4 rounded-2xl border border-[#E5ECF6] bg-white p-6
        shadow-sm md:flex-row"
    >
      <div className="flex flex-1 flex-col items-start gap-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex items-center justify-center">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
}

function GoalCard({ goal }: { goal: Goal }) {
  const target = parseFloat(goal.target ?? "0");
  const achieved = parseFloat(goal.achieved ?? "0");
  const percent = target > 0 ? Math.round((achieved / target) * 100) : 0;

  const getGoalPeriod = () => {
    if (goal.endDate) {
      return `Ends ${format(new Date(goal.endDate), "MMM d, yyyy")}`;
    }
    if (goal.recurringDuration) {
      return `${goal.recurringDuration.charAt(0).toUpperCase() + goal.recurringDuration.slice(1)} Goal`;
    }
    return "One-time Goal";
  };

  const getGoalTypeColor = (type: string | null) => {
    switch (type) {
      case "sales":
        return "bg-blue-100 text-blue-800";
      case "revenue":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className="flex min-h-[150px] w-full min-w-[260px] flex-col items-center
        justify-between gap-4 rounded-2xl border border-[#E5ECF6] bg-white p-6
        shadow-sm md:flex-row"
    >
      <div className="flex flex-1 flex-col items-start gap-1">
        <div className="mb-1 flex items-center gap-2">
          <span className="text-md font-medium text-gray-500">
            {goal.label}
          </span>
          <Badge className={`text-xs ${getGoalTypeColor(goal.goalType)}`}>
            {goal.goalType?.toUpperCase()}
          </Badge>
        </div>
        <span className="text-3xl font-bold text-gray-900">
          {achieved.toLocaleString()}
        </span>
        <span className="text-sm font-normal text-gray-700">
          of target ${target.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">{getGoalPeriod()}</span>
      </div>
      <div className="flex items-center justify-center">
        <ChartRadialText title={`${percent}%`} value={percent} />
      </div>
    </div>
  );
}
