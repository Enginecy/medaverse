"use client";

import { ChartRadialText } from "@/components/radial-chart";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesCard } from "@/features/dashboard/home/components/sales-card";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";

export function PersonalInfoCard() {
  const { isLoading, user } = useAuth();
  return (
    <Card className="w-1/2 flex-shrink-0 h-1/3   ">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-lg font-semibold">Personal info</p>
          <Button variant="outline" className="text-primary">
            <span>Edit Profile</span>
            <Edit />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative h-[150px] w-[150px] rounded-lg">
              {isLoading ? (
                <Skeleton
                  className="relative h-[150px] w-[150px] rounded-lg
                    bg-gray-300"
                />
              ) : (
                <div>
                  <Image
                    src={user?.profile?.avatar_url ?? ""}
                    alt="profile"
                    fill
                    className="rounded-lg object-cover object-top"
                  />
                </div>
              )}
            </div>
            <div className="flex grow flex-col gap-6">
              <div className="flex flex-col items-start">
                {isLoading ? (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-4 w-25 rounded-2xl bg-gray-300" />
                    <Skeleton className="h-4 w-30 rounded-2xl bg-gray-300" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-lg font-semibold">John Doe</p>
                    <p className="text-md text-muted-foreground">
                      {user?.profile?.role || ""}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  {isLoading ? (
                    <div className="flex w-full flex-col gap-1">
                      <Skeleton className="h-4 w-20 rounded-2xl bg-gray-300" />
                      <Skeleton className="h-3 w-full rounded-2xl bg-gray-300" />
                    </div>
                  ) : (
                    //TODO: Make the actual data  || delete it
                    <div className="flex flex-col w-full justify-between gap-1">
                      <div className="flex flex-row justify-between">
                        <p className="text-md font-semibold">
                          $7,350
                          <span
                            className="text-muted-foreground text-sm
                              font-normal"
                          >
                            {" of target $15,000"}
                          </span>
                        </p>
                        <p className="text-md font-semibold">{"49%"}</p>
                      </div>
                      <Progress value={49} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

         
            {isLoading ? (
              <div className="flex flex-row gap-3">
                <Skeleton className="h-55 w-full rounded-2xl bg-gray-300" />
                <Skeleton className="h-55 w-full rounded-2xl bg-gray-300" />
              </div>
            ) : (
              <div className="flex flex-row gap-2">
                <CommissionCard
                  title="Commission"
                  range={{ min: 4200, max: 12000 }}
                  className="flex aspect-square w-full flex-col gap-0"
                />

                <SalesCard className="flex aspect-square w-full flex-col gap-0" />
              </div>
            )}
         
        </div>
      </CardContent>
    </Card>
  );
}
function CommissionCard({
  title,
  range,
  className,
}: {
  title: string;

  range: {
    min: number;
    max: number;
  };
  className?: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
  const value = Math.round((range.min / range.max) * 100);
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>
          <p className="text-md font-semibold">
            ${range.min}
            <span className="text-muted-foreground text-sm font-normal">
              {" of target $" + range.max}
            </span>
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grow py-6">
        <ChartRadialText title={`${value}%`} value={value} />
      </CardContent>
      <CardFooter>
        <CardTitle className="text-secondary-foreground">{title}</CardTitle>
      </CardFooter>
    </Card>
  );
}
