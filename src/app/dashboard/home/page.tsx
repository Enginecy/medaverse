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
import { AddGoalButton } from "@/features/dashboard/profile/components/modals/add-goal-drawer";
import { Target, TrendingUp, Calendar, DollarSign } from "lucide-react";
import type { Metadata } from "next";
import { DataTableSkeleton } from "@/components/data-table";
export const metadata: Metadata = {
  title: "Dashboard Home",
  description: "Welcome to the dashboard. Explore your data and insights.",
};
export default async function Home() {
  return (
    <div className="flex w-full flex-col items-start gap-4 md:gap-6">
      <div
        className="flex w-full flex-col gap-4 md:gap-6 lg:flex-row
          lg:items-stretch"
      >
        <PersonalInfoCard />

        <div
          className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-6
            lg:w-1/2"
        >
          <Suspense fallback={<PersonalGoalsGridSkeleton />}>
            <PersonalGoalsGrid />
          </Suspense>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:gap-6 xl:flex-row">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardAction>
              <Link href="/dashboard/sales">
                <Button variant="outline" size="sm" className="min-h-[44px]">
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

        <Card className="w-full xl:w-1/3 xl:flex-shrink-0">
          <CardHeader>
            <CardTitle>Upcoming Birthdays</CardTitle>
          </CardHeader>
          <CardContent className="px-4 md:px-6">
            <BirthdayTable />
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
    return (
      <div
        className="col-span-2 flex flex-col items-center justify-center px-8
          py-12"
      >
        <div className="relative mb-6">
          <div
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center
              rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
          >
            <Target className="h-8 w-8 text-white" />
          </div>
          <div
            className="absolute -top-1 -right-1 flex h-6 w-6 items-center
              justify-center rounded-full bg-green-500"
          >
            <TrendingUp className="h-3 w-3 text-white" />
          </div>
        </div>

        <h3 className="text-foreground mb-2 text-xl font-semibold">
          Start Your Success Journey
        </h3>

        <p
          className="text-muted-foreground mb-6 max-w-md text-center
            leading-relaxed"
        >
          Set your first goal and watch your progress soar! Whether it&apos;s
          sales targets or revenue milestones, tracking goals helps you achieve
          3x better results.
        </p>

        <div
          className="text-muted-foreground mb-8 flex items-center gap-6 text-sm"
        >
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <span>Track Revenue</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span>Set Deadlines</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>Monitor Progress</span>
          </div>
        </div>

        <AddGoalButton />
      </div>
    );
  }

  return (
    <>
      {goals.slice(0, 4).map((goal) => (
        <HomeGoalCard key={goal.id} goal={goal} />
      ))}
    </>
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
      className="flex h-auto w-full flex-col items-center justify-between gap-4
        rounded-2xl border border-[#E5ECF6] bg-white p-4 shadow-sm md:h-[180px]
        md:flex-row md:p-6"
    >
      <div className="flex w-full flex-1 flex-col items-start gap-1 md:w-auto">
        <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-center">
          <span className="md:text-md text-sm font-medium text-gray-500">
            {goal.label}
          </span>
          <Badge
            className={`self-start text-xs ${getGoalTypeColor(goal.goalType)}`}
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
      <div className="flex w-full items-center justify-center md:w-auto">
        <ChartRadialText title={`${percent}%`} value={percent} />
      </div>
    </div>
  );
}

function HomeGoalCardSkeleton() {
  return (
    <div
      className="flex h-auto w-full flex-col items-center justify-between gap-4
        rounded-2xl border border-[#E5ECF6] bg-white p-4 shadow-sm md:h-[180px]
        md:flex-row md:p-6"
    >
      <div className="flex w-full flex-1 flex-col items-start gap-1 md:w-auto">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
      <div className="flex w-full items-center justify-center md:w-auto">
        <Skeleton className="h-16 w-16 rounded-full" />
      </div>
    </div>
  );
}

function PersonalGoalsGridSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <HomeGoalCardSkeleton key={index} />
      ))}
    </>
  );
}
