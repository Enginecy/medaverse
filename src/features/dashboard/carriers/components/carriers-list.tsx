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
        icon={<CircleAlert />}
      ></NoItems>
    );
  }
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5
        lg:grid-cols-4 xl:grid-cols-5"
    >
      {carriers!.map((carrier) => (
        <CarrierContainer key={carrier.id} carrier={carrier} />
      ))}
    </div>
  );
}

function CarriersListSkeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-5
        lg:grid-cols-4 xl:grid-cols-5"
    >
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="flex h-32 w-full items-center justify-center rounded-2xl
            border-4 border-gray-100 bg-white md:h-40"
        >
          <Skeleton className="h-full w-full rounded-md bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
