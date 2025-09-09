export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { BirthdayTable } from "@/features/dashboard/home/components/birthday-table";
import { RecentSalesDataTable } from "@/features/dashboard/home/components/data-table";
import { PersonalInfoCard } from "@/features/dashboard/home/components/home-personal-info-card";
import { getUserGoalsAction } from "@/features/dashboard/profile/server/actions/goals";
import { format } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";
import { ChartRadialText } from "@/components/radial-chart";
import { Badge } from "@/components/ui/badge";
import type { Goal } from "@/features/dashboard/profile/server/db/goals";
import { Skeleton } from "@/components/ui/skeleton";
import { Cake } from "lucide-react";
import type { Metadata } from "next";
import { DataTableSkeleton } from "@/components/data-table";
import { GoalsCardEmptyState } from "@/components/empty-states/gaols-card-empty-state";
import { EmptyGoalsState } from "@/components/empty-states/empty-goals-state";
export const metadata: Metadata = {
  title: "Dashboard Home",
  description: "Welcome to the dashboard. Explore your data and insights.",
};
export default async function Home() {
  return (
    <div className="flex w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full flex-col gap-4 md:gap-6 lg:flex-row">
        <Suspense
          fallback={
            <Skeleton
              className="h-115 w-full rounded-3xl border-1 border-gray-200 bg-blue-200
                p-7 md:w-2/3 lg:justify-between"
            />
          }
        >
          <PersonalInfoCard />
        </Suspense>
        <Suspense fallback={<PersonalGoalsGridSkeleton />}>
          <PersonalGoalsGrid />
        </Suspense>
      </div>
      <div className="flex w-full flex-col gap-4 md:gap-6 xl:flex-row">
        <Card className="flex-1 rounded-3xl border-0 shadow-none">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardAction>
              <Link href="/dashboard/sales">
                <Button
                  variant="default"
                  size="sm"
                  className="min-h-[44px] rounded-full border-0 bg-[#F5F5F5]
                    text-black shadow-none hover:text-white"
                >
                  View All
                </Button>
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <Suspense fallback={<DataTableSkeleton />}>
              <RecentSalesDataTable />
            </Suspense>
          </CardContent>
        </Card>

        <Card
          className="w-full rounded-3xl border-0 shadow-none xl:w-1/3
            xl:flex-shrink-0"
        >
          <CardHeader>
            <CardTitle className="flex flex-row justify-between">
              <span> Upcoming Birthdays</span>
              <Cake className="text-primary h-5 w-5" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            {/* <BirthdayTable /> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function PersonalGoalsGrid() {
  const result = await getUserGoalsAction();

  if (!result.success) {
    return (
      <div className="col-span-2 flex flex-col items-center justify-center py-8">
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
      {goals.length < 4
        ? goals
            .map((goal) => <HomeGoalCard key={goal.id} goal={goal} />)
            .concat(
              Array.from({ length: 4 - goals.length }).map((_, index) => (
                <GoalsCardEmptyState key={index} />
              )),
            )
        : goals
            .slice(0, 4)
            .map((goal) => <HomeGoalCard key={goal.id} goal={goal} />)}
    </div>
  );
}

function HomeGoalCard({ goal }: { goal: Goal }) {
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
      className="flex h-full min-h-50 w-full flex-row items-center rounded-3xl
        bg-white p-4"
    >
      <div className="flex w-full flex-1 flex-col items-start gap-1">
        <div className="flex w-full flex-row gap-x-2.5">
          <span className="lg:text-md text-sm font-medium text-gray-500">
            {goal.label}
          </span>
          <Badge
            className={`max-h-6 w-min text-xs
              ${getGoalTypeColor(goal.goalType)}`}
          >
            {goal.goalType?.toUpperCase()}
          </Badge>
        </div>
        <span className="text-2xl font-bold text-gray-900 md:text-3xl">
          {achieved.toLocaleString()}
        </span>
        <span className="text-xs font-normal text-gray-700 md:text-sm">
          of target ${target.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">{getGoalPeriod()}</span>
      </div>
      <div className="flex items-center justify-center md:w-25">
        <ChartRadialText title={`${percent}%`} value={percent} />
      </div>
    </div>
  );
}
function PersonalGoalsGridSkeleton() {
  return (
    <div
      className="grid w-full auto-rows-fr grid-cols-1 gap-5 lg:w-1/2
        lg:grid-cols-2"
    >
      {Array.from({ length: 4 }).map((_, index) => (
        <HomeGoalCardSkeleton key={index} />
      ))}
    </div>
  );
}

function HomeGoalCardSkeleton() {
  return (
    <div
      className="flex h-full w-full flex-col items-center rounded-3xl bg-white
        p-4 md:flex-row md:justify-between"
    >
      <div className="flex w-full flex-1 flex-col items-start gap-2 md:w-auto">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Skeleton className="h-4 w-24 rounded-md" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-3 w-28 rounded-md" />
        <Skeleton className="h-3 w-24 rounded-md" />
      </div>
      <div className="mt-4 flex items-center justify-center md:mt-0 md:w-auto">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
}
