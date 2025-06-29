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
    return <ErrorComponent onRetry={refetch} />;
  }

  return (
    <div className="flex flex-wrap gap-5">
      {carriers!.map((carrier) => (
        <CarrierContainer
          key={carrier.id}
          imageUrl={carrier.imageUrl}
          link={carrier.website}
        />
      ))}
    </div>
  );
}

function CarriersListSkeleton() {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 6 }).map((_, idx) => (
        <Card key={idx} className="flex h-32 w-40 items-center justify-center">
          <Skeleton className="mb-2 h-24 w-24 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </Card>
      ))}
    </div>
  );
}
