"use client";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { LeaderAndFollowers } from "@/features/leaderboard/server/db/leaderboard"; // adjust path if needed

export default function LeaderList({
  data,
  title,
}: {
  data: LeaderAndFollowers[];
  title: string;
}) {
  return (
    <div
      className="space-y-4 rounded-3xl border border-neutral-800
        bg-neutral-900/80 p-4"
    >
      <div className="mb-4 text-center text-xl font-semibold text-white">
        {title}
      </div>
      {data.map((leader) => (
        <LeaderCard key={leader.id} leader={leader} />
      ))}
    </div>
  );
}

function LeaderCard({ leader }: { leader: LeaderAndFollowers }) {
  const [open, setOpen] = useState(false);
  function toggleExpand() {
    setOpen(!open);
  }
  return (
    <Collapsible open={open} onOpenChange={toggleExpand}>
      <CollapsibleTrigger asChild>
        <div
          className="flex cursor-pointer items-center justify-between rounded-xl
            border p-4 shadow-sm hover:bg-gray-600/30"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={leader.avatar_url} />
              <AvatarFallback>{leader.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{leader.name}</div>
              <div className="text-xs text-gray-500">
                Total Sales:{" "}
                <span className="font-semibold text-secondary-foreground/55">
                  ${leader.total_subordinates_sales}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Personal Sales:{" "}
                <span className="font-semibold text-primary-300">
                  ${Number(leader.total_leader_sales).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <span className="text-gray-400">{open ? "▲" : "▼"}</span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 ml-12 space-y-2">
          {leader.subordinates.map(
            (follower: LeaderAndFollowers["subordinates"][number]) => (
              <div
                key={follower.id}
                className="flex items-center justify-between rounded-md p-2
                  hover:bg-gray-600/30"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={follower.avatar_url} />
                    <AvatarFallback>{follower.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{follower.name}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Sales: ${follower.sales} ({follower.sales_count} Sales)
                </div>
              </div>
            ),
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
