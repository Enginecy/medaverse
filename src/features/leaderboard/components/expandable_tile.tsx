"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ListOfExpandable } from "@/features/leaderboard/components/list_of_expandable";
import {
  getSubordinatesTeams,
  type SubordinateTeam,
} from "@/features/leaderboard/server/db/leaderboard";
import { Avatar } from "@radix-ui/react-avatar";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function ExpandableTile({ userId }: { userId: string }) {
  async function queryFunction() {
    return await getSubordinatesTeams({ userId: userId });
  }

  const { data: queryData, isLoading } = useQuery<SubordinateTeam[]>({
    queryKey: ["fetchFollowers", userId],
    queryFn: queryFunction,
    enabled: !!userId,
  });

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
              <AvatarImage src={""} /> //!!!!
              <AvatarFallback>{}</AvatarFallback> //!!
            </Avatar>
            <div>
              <div className="font-semibold">{}</div> // name
              <div className="text-xs text-gray-500">
                Total Sales:{" "}
                <span className="text-secondary-foreground/55 font-semibold">
                  {/* ${leader.total_subordinates_sales} */}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Personal Sales:{" "}
                <span className="text-primary-300 font-semibold">
                  {/* ${Number(leader.total_leader_sales).toLocaleString()} */}
                </span>
              </div>
            </div>
          </div>
          <span className="text-gray-400">{open ? "▲" : "▼"}</span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {isLoading ? (
        <LoadingList />
        ) : (
          <ListOfExpandable data={queryData  as SubordinateTeam[] }/>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}



function LoadingList () { 
  return (
      <div className="flex flex-col gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg bg-gray-300"
              />
            ))}
          </div>
  )
}