"use client";

import { Button } from "@/components/ui/button";
import { CarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import type { Carrier } from "@/features/dashboard/carriers/server/db/carriers";
import { useShowDrawer } from "@/lib/react-utils";
import Image from "next/image";

export function CarrierContainer({ carrier }: { carrier: Carrier }) {
  const showDrawer = useShowDrawer();

  const handelClick = () => {
    showDrawer((resolve) => (
      <CarrierDrawer resolve={resolve} fieldValues={carrier}></CarrierDrawer>

    ));
    // window.open(link, "_blank")
  };
  return (
    <Button
      variant="outline"
      className="h-40 w-70 rounded-2xl border-4 border-gray-100 bg-white
        hover:cursor-pointer"
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
  );
}
