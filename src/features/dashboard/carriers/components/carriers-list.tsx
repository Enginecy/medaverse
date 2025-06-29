'use client';

import { Card } from "@/components/ui/card";
import { CarrierContainer } from "@/features/dashboard/carriers/components/carrier-container";
import { getCarriers } from "@/features/dashboard/carriers/server/db/carriers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function CarriersList() {
  const {
    data: carriers,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["carriers"],
    queryFn: getCarriers
  });
  if(isLoading){
    return <CarriersListSkeleton />;
  }
  if(isError){
    return <p>Error loading carriers: {error.message}</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
      <CarrierContainer imageUrl={""} link={""} />
    </div>
  );
}

function CarriersListSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="w-40 h-32 flex items-center justify-center">
          <Skeleton className="w-24 h-24 rounded-full mb-2" />
          <Skeleton className="w-20 h-4" />
        </Card>
      ))}
    </div>
  );
}