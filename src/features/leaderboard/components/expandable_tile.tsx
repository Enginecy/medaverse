"use client";

import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ListOfExpandable } from "@/features/leaderboard/components/list_of_expandable";
import {
  getSubordinatesTeams,
  type LeaderAndFollowers,
} from "@/features/leaderboard/server/db/leaderboard";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function ExpandableTile({ userData }: { userData: LeaderAndFollowers }) {
  async function queryFunction() {
    return await getSubordinatesTeams({ userId: userData.id as string });
  }

  
  const [open, setOpen] = useState(false);
  function toggleExpand() {
    setOpen(!open);
  }
  const { data: queryData, isLoading } = useQuery<LeaderAndFollowers[]>({
    queryKey: ["fetchFollowers", userData.id],
    queryFn: queryFunction as () => Promise<LeaderAndFollowers[]>,
    enabled: open,
  });
  
  return (
    <Collapsible open={open} onOpenChange={toggleExpand} >
      <CollapsibleTrigger asChild className={`${open? "bg-primary-600/30" : ""}`}>
        <div
          className="flex cursor-pointer items-center justify-between rounded-xl
            border p-4 shadow-sm hover:bg-gray-600/30"
        >
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={userData.avatar_url} />
              <AvatarFallback>{userData.name}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">{userData.name}</div>
              <div className="text-xs text-gray-500">
                Total Sales:{" "}
                <span className="text-secondary-foreground/55 font-semibold">
                  ${userData.total_subordinates_sales}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Personal Sales:
                <span className="text-primary-300 font-semibold">
                  ${Number(userData.total_leader_sales).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <span className="text-gray-400">{open ? "▲" : "▼"}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isLoading ? <LoadingList /> : <ListOfExpandable data={queryData} />}
      </CollapsibleContent>
    </Collapsible>
  );
}

function LoadingList() {
  return (
    <div className="flex flex-col gap-2 py-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-300/20" />
      ))}
    </div>
  );
}
