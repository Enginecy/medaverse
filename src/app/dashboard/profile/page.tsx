import * as React from "react";
import { StatesCard } from "@/components/states-card";
import { ProfilePersonalInfoCard } from "@/features/dashboard/profile/components/profile-personal-info-card";
import { AgentGoals } from "@/features/dashboard/profile/components/agent-goals";
import { RecentSales } from "@/features/dashboard/profile/components/recent-sales";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import type { Metadata } from "next";
import { getUser } from "@/lib/supabase/server";
export const metadata: Metadata = {
  title: "Profile",
  description:
    "View and manage your profile information, goals, and recent sales.",
};
export default async function Profile() {
  const user = await getUser();
  const states = await getUser().then((user) => user.profile?.states ?? []);
  const sales = await getSales(user.user.id).then((sales) => sales.slice(0, 5));

  return (
    <div className="flex h-auto w-full flex-col gap-4 md:gap-6">
      <div className="flex w-full flex-col gap-4 md:gap-6 lg:flex-row">
        <ProfilePersonalInfoCard />

        <div className="w-full">
          <StatesCard states={states} />
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:gap-6 xl:flex-row">
        <AgentGoals />

        <RecentSales sales={sales} />
      </div>
    </div>
  );
}
