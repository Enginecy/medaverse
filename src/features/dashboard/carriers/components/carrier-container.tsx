'use client';

import { Button } from "@/components/ui/button";
import { CarrierDrawer } from "@/features/dashboard/carriers/components/add-carrier-drawer";
import type { Carrier } from "@/features/dashboard/carriers/server/db/carriers";
import { useShowDrawer } from "@/lib/react-utils";
import { DeleteCarrierButton } from "@/features/dashboard/carriers/components/delete-carrier-button";
import { X } from "lucide-react";
import Image from "next/image";

export function CarrierContainer({ carrier}: {carrier: Carrier }) {
  const showDrawer = useShowDrawer();

  const handelClick = () => {

    showDrawer(
     (resolve) =>(
      <CarrierDrawer
      resolve={resolve}
      fieldValues={{
        carrierImage: carrier.imageUrl,
        companyName: carrier.name,
        phoneNumber:carrier.phoneNumber || "",
        email: "",
        website: carrier.website,
        code: carrier.code,
      }}
      >

      </CarrierDrawer>
     )
    );
    // window.open(link, "_blank")
  }
  return (
    <Button
      variant="outline"
      className="h-40 w-60 rounded-2xl border-4 border-gray-100
        hover:cursor-pointer bg-white"
        onClick={ handelClick}
    >
     <div className="relative w-full h-full max-w-[190px] max-h-[120px]">
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
