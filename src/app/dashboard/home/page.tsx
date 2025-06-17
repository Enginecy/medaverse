export const dynamic = "force-dynamic";

import { Edit } from "lucide-react";
import Image from "next/image";
import profile from "public/profile.jpg";
import { ChartHalfRadialText } from "@/components/half-radial-chart";
import { ChartRadialText } from "@/components/radial-chart";
import Spotlight from "@/components/spotlight";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { birthdays } from "@/features/dashboard/home/data/birthday-data";
import { BirthdayTable } from "@/features/dashboard/home/components/birthday-table";
import { columns } from "@/features/dashboard/home/components/columns";
import { sales as data } from "@/features/dashboard/home/data/data";
import { DataTable } from "@/features/dashboard/home/components/data-table";
import { SalesCard } from "@/features/dashboard/home/components/sales-card";
import { birthdayColumns } from "@/features/dashboard/home/components/birthday-columns";

export default function Home() {
  return (
    <div className="flex w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full items-stretch gap-6">
        <PersonalInfoCard />
        <PersonalGoalsGrid />
      </div>
      <div className="flex w-full gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardAction>
              <Button variant="outline">View All</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="px-6">
            <DataTable columns={columns} data={data.slice(0, 5)} />
          </CardContent>
        </Card>

        <Card className="w-1/3 flex-shrink-0">
          <CardHeader>
            <CardTitle>Upcoming Birthdays</CardTitle>
          </CardHeader>
          <CardContent className="px-6">
            <BirthdayTable columns={birthdayColumns} data={birthdays} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoalCard({
  title,
  range,
}: {
  title: string;
  range: {
    min: number;
    max: number;
  };
}) {
  const value = Math.round((range.min / range.max) * 100);
  return (
    <Card className="flex min-h-0 w-full flex-col gap-0 overflow-hidden">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="mx-auto text-center text-lg font-semibold">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 py-6">
        <ChartHalfRadialText title={`${value}%`} value={value} />
      </CardContent>
      <CardFooter className="flex-shrink-0">
        <CardTitle className="mx-auto text-center">
          <p className="text-md text-chart-3 font-semibold">
            ${range.min}
            <span className="text-muted-foreground text-sm font-normal">
              {" out off $" + range.max}
            </span>
          </p>
        </CardTitle>
      </CardFooter>
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

function PersonalInfoCard() {
  return (
    <Card className="w-1/2 flex-shrink-0">
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
              <Image
                src={profile}
                alt="profile"
                fill
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="flex grow flex-col gap-6">
              <div className="flex flex-col items-start">
                <p className="text-lg font-semibold">John Doe</p>
                <p className="text-md text-muted-foreground">
                  Senior Associate
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className="text-md font-semibold">
                    $7,350
                    <span className="text-muted-foreground text-sm font-normal">
                      {" of target $15,000"}
                    </span>
                  </p>
                  <p className="text-md font-semibold">{"49%"}</p>
                </div>
                <Progress value={49} />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <CommissionCard
              title="Commission"
              range={{ min: 4200, max: 12000 }}
              className="flex aspect-square w-full flex-col gap-0"
            />

            <SalesCard className="flex aspect-square w-full flex-col gap-0" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PersonalGoalsGrid() {
  return (
    <div className="grid min-h-0 w-1/2 flex-shrink-0 grid-cols-2 gap-6">
      <GoalCard title="Weekly Goal" range={{ min: 850, max: 2500 }} />
      <GoalCard title="Monthly Goal" range={{ min: 6200, max: 18000 }} />
      <GoalCard title="Quarterly Goal" range={{ min: 15400, max: 45000 }} />
      <GoalCard title="Yearly Goal" range={{ min: 78000, max: 150000 }} />
    </div>
  );
}
