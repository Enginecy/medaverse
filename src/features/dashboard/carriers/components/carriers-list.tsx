'use client';

import { Card } from "@/components/ui/card";
import { CarrierContainer } from "@/features/dashboard/carriers/components/carrier-container";
import { useQuery } from "@tanstack/react-query";

export function CarriersList() {
  useQuery({
    queryKey: ["carriers"],
    queryFn: getCarriers
  });
  return (
    <div className="flex flex-wrap gap-2">
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      
    </div>
    //   <div className="flex flex-wrap gap-6 w-full bg-white rounded-2xl border-2 p-6">
    // <CarrierContainer />

    //   </div>
  );
}
