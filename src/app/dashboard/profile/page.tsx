import * as React from "react";
import Box from "@mui/material/Box";
import { StatesCard } from "@/components/states-card";
import { ProfilePersonalInfoCard } from "@/features/dashboard/profile/components/profile-personal-info-card";
import { AgentGoals } from "@/features/dashboard/profile/components/agent-goals";
import { RecentSales } from "@/features/dashboard/profile/components/recent-sales";

export default function Profile() {
  return (
    <div className="flex h-auto w-full p-4">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",

          justifyContent: "flex-start",
          gap: 2,
        }}
      >
        <ProfilePersonalInfoCard />
        <StatesCard />
        <div className="flex flex-row gap-4">
          <AgentGoals size={100} color="" />
          <RecentSales sales={salesData} />
        </div>
      </Box>
    </div>
  );
}
const salesData = {
  today: [
    {
      clientName: "Alice Johnson",
      description: "Life Insurance, Term Life, Rider A",
      amount: 4806,
    },
    {
      clientName: "Bob Williams",
      description: "Health Insurance, PPO Plan, Dental Add-on",
      amount: 3500,
    },
    {
      clientName: "Charlie Brown",
      description: "Auto Insurance, Full Coverage, Collision",
      amount: 1250,
    },
    {
      clientName: "Diana Miller",
      description: "Home Insurance, Basic Policy, Flood Endorsement",
      amount: 2100,
    },
    {
      clientName: "Eve Davis",
      description: "Accident, Critical Illness, Fixed Index Annuity",
      amount: 5100,
    },
  ],
};
