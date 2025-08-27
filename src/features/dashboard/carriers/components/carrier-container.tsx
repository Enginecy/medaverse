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
import { usePermissions } from "@/lib/supabase/roles-component";

export function CarrierContainer({ carrier }: { carrier: Carrier }) {
  const showDrawer = useShowDrawer();
  const { hasAllPermissions } = usePermissions();
  const canModifyCarrier = hasAllPermissions([
    "companies:create",
    "companies:update",
  ]);
  const handelClick = () => {
    if (!canModifyCarrier) {
      window.open(carrier.website, "_blank");
      return;
    }
    openDrawer();
  };

  const openDrawer = () => {
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
            className="h-32 min-h-[128px] w-full rounded-2xl border-4
              border-gray-100 bg-white hover:cursor-pointer hover:bg-blue-100
              md:h-40 md:min-h-[160px]"
            onClick={handelClick}
          >
            <div
              className="relative h-full max-h-[80px] w-full max-w-[120px]
                md:max-h-[120px] md:max-w-[190px]"
            >
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
          ✨ Click to view{" "}
          <span onClick={openDrawer} className="text-blue-600 cursor-pointer">
            {carrier.name}
          </span>{" "}
          details
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
