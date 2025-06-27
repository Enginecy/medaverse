export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { birthdays } from "@/features/dashboard/home/data/birthday-data";
import { BirthdayTable } from "@/features/dashboard/home/components/birthday-table";
import { columns } from "@/features/dashboard/home/components/columns";
import { sales as data } from "@/features/dashboard/home/data/data";
import { DataTable } from "@/features/dashboard/home/components/data-table";
import { birthdayColumns } from "@/features/dashboard/home/components/birthday-columns";
import { PersonalInfoCard } from "@/features/dashboard/home/components/home-personal-info-card";
import { GoalCard } from "@/features/dashboard/home/components/goal-card";

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
            <BirthdayTable  />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PersonalGoalsGrid() {
  return (
    <div className="grid h-126 w-1/2 grid-cols-2 gap-6">
      <GoalCard title="Weekly Goal" range={{ min: 850, max: 2500 }} />
      <GoalCard title="Monthly Goal" range={{ min: 6200, max: 18000 }} />
      <GoalCard title="Quarterly Goal" range={{ min: 15400, max: 45000 }} />
      <GoalCard title="Yearly Goal" range={{ min: 78000, max: 150000 }} />
    </div>
  );
}
