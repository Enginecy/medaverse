"use client";

import { Card } from "@/components/ui/card";
import { CarrierContainer } from "@/features/dashboard/carriers/components/carrier-container";
import { getCarriers } from "@/features/dashboard/carriers/server/db/carriers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/ui/error-component";

export function CarriersList() {
  const {
    data: carriers,
    isLoading,
    isError,
    refetch,
    error,
  } = useQuery({
    queryKey: ["carriers"],
    queryFn: getCarriers,
  });
  if (isLoading) {
    return <CarriersListSkeleton />;
  }
  if (isError) {
    return <ErrorComponent onRetry={refetch} message="Something went wrong, please try again." />;
  }
 
  return (
    <div className="flex flex-wrap gap-5">
      {carriers!.map((carrier) => (
        <CarrierContainer
          key={carrier.id}
          id={carrier.id}
          imageUrl={carrier.imageUrl}
          link={carrier.website}
        />
      ))}
    </div>
  );
}

function CarriersListSkeleton() {
  return (
    <div className="flex flex-wrap gap-5">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="h-40 w-60 rounded-2xl border-4 border-gray-100 bg-white p-2 flex items-center justify-center"
        >
          <Skeleton className="h-[120px] w-[190px] rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
