import * as React from "react";
import { StatesCard } from "@/components/states-card";
import { ProfilePersonalInfoCard } from "@/features/dashboard/profile/components/profile-personal-info-card";
import { AgentGoals } from "@/features/dashboard/profile/components/agent-goals";
import { RecentSales } from "@/features/dashboard/profile/components/recent-sales";
import { getSales } from "@/features/dashboard/sales/server/db/sales";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your profile information, goals, and recent sales.",
};
export default async function Profile() {
  const sales = await getSales().then((sales) => sales.slice(0, 5));

  return (
    <div className="flex h-auto w-full flex-col gap-4 p-4">
      <div className="flex gap-2">
        <ProfilePersonalInfoCard />
        <StatesCard />
      </div>
      <div className="flex gap-4">
        <AgentGoals />
        <RecentSales sales={sales} />
      </div>
    </div>
  );
}
