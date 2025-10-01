//! deprecated
/*
 * @deprecated this component is using a deprecated component
 * use a regular expandable list instead
 */

"use client";

import { ExpandableTile } from "@/features/leaderboard/components/deprecated/expandable-tile";
import { type LeaderAndFollowers } from "@/features/leaderboard/server/db/leaderboard";

export function ListOfExpandable({ data }: { data?: LeaderAndFollowers[] }) {
  if (!data || data.length === 0) {
    return null; // nothing to show
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      {data.map((item, _) => (
        <ExpandableTile key={item.id as string} userData={item} />
      ))}
    </div>
  );
}
