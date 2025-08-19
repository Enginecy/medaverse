"use client";

import { Button } from "@/components/ui/button";
import { CarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import type { Carrier } from "@/features/dashboard/carriers/server/db/carriers";
import { useShowDrawer } from "@/lib/react-utils";
import Image from "next/image";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CarrierContainer({ carrier }: { carrier: Carrier }) {
  const showDrawer = useShowDrawer();

  const handelClick = () => {
    showDrawer((resolve) => (
      <CarrierDrawer resolve={resolve} fieldValues={carrier}></CarrierDrawer>
    ));
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="h-40 w-70 rounded-2xl border-4 border-gray-100 bg-white
              hover:cursor-pointer hover:bg-blue-100"
            onClick={handelClick}
          >
            <div className="relative h-full max-h-[120px] w-full max-w-[190px]">
              <Image
                src={carrier.imageUrl}
                alt="Carrier"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </Button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="rounded-xl border border-gray-200 bg-blue-50 px-3 py-2
            text-sm font-semibold text-gray-800 shadow-md"
        >
          ✨ Click to view <span className="text-blue-600">{carrier.name}</span>{" "}
          details
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
