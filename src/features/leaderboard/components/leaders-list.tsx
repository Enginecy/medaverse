"use client";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { LeadersAndSubordinates } from "@/features/leaderboard/server/db/leaderboard"; // adjust path if needed

export default function LeaderList({
  data,
  title,
}: {
  data: LeadersAndSubordinates[];
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
        <LeaderCard key={leader.leader_id} leader={leader} />
      ))}
    </div>
  );
}

function LeaderCard({ leader }: { leader: LeadersAndSubordinates }) {
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
              <AvatarFallback>{leader.leader_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{leader.leader_name}</div>
              <div className="text-xs text-gray-500">
                Total Sales:{" "}
                <span className="text-secondary-foreground/55 font-semibold">
                  ${(Number(leader.full_total_sales) * 12).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Personal Sales:{" "}
                <span className="text-primary-300 font-semibold">
                  ${(Number(leader.total_sales_amount) * 12).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          {leader.subordinates.length > 0 && (
            <span className="text-gray-400">{open ? "▲" : "▼"}</span>
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 ml-12 space-y-2">
          {leader.subordinates.map(
            (follower: LeadersAndSubordinates["subordinates"][number]) => (
              <div
                key={follower.id}
                className="flex items-center justify-between rounded-md p-2
                  hover:bg-gray-600/30"
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="ring-primary/20 h-8 w-8 ring-2">
                      <AvatarImage src={follower.avatar_url} />
                      <AvatarFallback
                        className="from-primary/20 to-primary/10 text-primary
                          bg-gradient-to-br font-semibold"
                      >
                        {follower.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-foreground text-sm font-semibold">
                        {follower.name}
                      </span>
                      <span
                        className="text-muted-foreground bg-secondary/50
                          rounded-full px-2 py-0.5 text-xs font-medium"
                      >
                        {follower.role}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-primary text-sm font-bold">
                      $
                      {(
                        Number(follower.total_sales_amount) * 12
                      ).toLocaleString()}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {follower.total_sales_count} sales
                    </div>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
