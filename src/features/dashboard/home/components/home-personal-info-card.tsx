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
import { cn } from "@/lib/utils";
import { Edit } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";

export async function PersonalInfoCard() {
  const { profile } = await getUser();

  if (!profile) {
    console.error("No profile found");
    redirect("/login");
  }

  return (
    <div
      className="w-full rounded-3xl border-1 border-gray-300 bg-[#F1F1F1] p-10 lg:w-1/2 lg:justify-between"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Personal info</p>
        <Button  className="text-black bg-white rounded-full hover:text-white cursor-pointer  ">
          <span>Edit Profile</span>
          <Edit />
        </Button>
      </div>
      {/* <CardHeader>
        <CardTitle className="flex items-center justify-between">
          
        </CardTitle>
      </CardHeader> */}
      <div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative h-[150px] w-[150px] rounded-lg">
              <Suspense
                fallback={
                  <Skeleton
                    className="relative h-[150px] w-[150px] rounded-lg
                      bg-gray-300"
                  />
                }
              >
                <div className="relative h-32 w-32">
                  <Image
                    src={profile.avatarUrl!}
                    alt="profile"
                    fill
                    sizes="128px" 
                    style={{ objectFit: "contain" }}
                    className="rounded-lg object-cover object-top"
                  />
                </div>
              </Suspense>
            </div>
            <div className="flex grow flex-col gap-6">
              <div className="flex flex-col items-start">
                <Suspense
                  fallback={
                    <div className="flex flex-col gap-3">
                      <Skeleton className="h-4 w-25 rounded-2xl bg-gray-300" />
                      <Skeleton className="h-4 w-30 rounded-2xl bg-gray-300" />
                    </div>
                  }
                >
                  <div className="flex flex-col gap-3">
                    <p className="text-lg font-semibold">{profile?.name}</p>
                    <p className="text-md text-muted-foreground">
                      {/* {profile?.role} 
                      
                      //TODO: Add user role when available
                      */}
                    </p>
                  </div>
                </Suspense>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <Suspense
                    fallback={
                      <div className="flex w-full flex-col gap-1">
                        <Skeleton className="h-4 w-20 rounded-2xl bg-gray-300" />
                        <Skeleton className="h-3 w-full rounded-2xl bg-gray-300" />
                      </div>
                    }
                  >
                    <div className="flex w-full flex-col justify-between gap-1">
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
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
          <Suspense
            fallback={
              <div className="flex flex-row gap-3">
                <Skeleton className="h-55 w-full rounded-2xl bg-gray-300" />
                <Skeleton className="h-55 w-full rounded-2xl bg-gray-300" />
              </div>
            }
          >
            <div className="flex w-full flex-col gap-2 md:flex-row items-center">
              <CommissionCard
                title="Commission"
                range={{ min: 4200, max: 12000 }}
                className="flex h-50 w-full flex-col gap-0"
              />

              <SalesCard className="flex h-50 w-full flex-col gap-0" />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
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
      <CardContent className="grow">
        <ChartRadialText title={`${value}%`} value={value} />
      </CardContent>
      <CardFooter>
        <CardTitle className="text-secondary-foreground">{title}</CardTitle>
      </CardFooter>
    </Card>
  );
}
