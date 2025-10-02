import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserGoalsAction } from "../server/actions/goals";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { AddGoalButton } from "@/features/dashboard/home/components/add-goal-button";
import { HomeGoalCard } from "@/app/dashboard/home/page";
import { GoalsCardEmptyState } from "@/components/empty-states/gaols-card-empty-state";
import { EmptyGoalsState } from "@/components/empty-states/empty-goals-state";

export function AgentGoals() {
  return (
    <Card className="w-full rounded-3xl border-1 border-gray-200 shadow-none md:w-3/5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900">
          Agent Goals
        </CardTitle>
        <CardAction>
          <AddGoalButton />
        </CardAction>
      </CardHeader>
      <CardContent className="w-full">
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
    return <EmptyGoalsState />;
  }

  return (
    <div className="grid w-full auto-rows-fr grid-cols-1 gap-5 lg:grid-cols-2">
      {goals
        .map((goal) => (
          <HomeGoalCard
            className="border-1 border-gray-200"
            key={goal.id}
            goal={goal}
          />
        ))
        .concat(
          Array.from({ length: 4 - goals.length }).map((_, index) => (
            <GoalsCardEmptyState key={index} />
          )),
        )}
    </div>
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
