"use client";

import { ExpandableTile } from "@/features/leaderboard/components/expandable_tile";
import { type SubordinateTeam } from "@/features/leaderboard/server/db/leaderboard";

export function ListOfExpandable({ data }: { data?: SubordinateTeam[] | null }){
  if (!data || data.length === 0) {
    return null; // nothing to show
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((item, index) => (
        <ExpandableTile key={index} userId={item.id as string} />
      ))}
    </div>
  );
}
