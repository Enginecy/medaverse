"use client";

import { CarrierContainer } from "@/features/dashboard/carriers/components/carrier-container";
import { getCarriers } from "@/features/dashboard/carriers/server/db/carriers";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorComponent } from "@/components/ui/error-component";
import { NoItems } from "@/components/no-items";
import { CircleAlert } from "lucide-react";

export function CarriersList() {
  const {
    data: carriers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["carriers"],
    queryFn: getCarriers,
  });
  if (isLoading) {
    return <CarriersListSkeleton />;
  }
  if (isError) {
    return (
      <ErrorComponent
        onRetry={refetch}
        message="Something went wrong, please try again."
      />
    );
  }
  if (!carriers || carriers.length === 0) {
    return (
<NoItems
      message="There are no carriers to display."
      description="You can add a new carrier by clicking the button above."
      icon={<CircleAlert/>}
></NoItems>
    );
  }
  return (
    <div className="flex flex-wrap gap-5">
      {carriers!.map((carrier) => (
        <CarrierContainer key={carrier.id} carrier={carrier} />
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
          className="flex h-40 w-60 items-center justify-center rounded-2xl
            border-4 border-gray-100 bg-white p-2"
        >
          <Skeleton className="h-[120px] w-[190px] rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
