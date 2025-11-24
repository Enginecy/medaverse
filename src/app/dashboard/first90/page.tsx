import { First90DataTable } from "@/features/dashboard/first90/components/first90-data-table";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table";
import { isCurrentUserNationalDirector } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "First 90",
  description: "Track first 90 days performance for new users.",
};

export default async function First90() {
  const isNationalDirector = await isCurrentUserNationalDirector();
  
  if (!isNationalDirector) {
    redirect("/dashboard/home");
  }

  return (
    <div className="flex h-full w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">First 90</h1>
      </div>
      <div className="w-full">
        <div className="mb-4 rounded-3xl border border-gray-300 bg-white p-2 md:p-4 lg:p-6">
          <Suspense fallback={<DataTableSkeleton />}>
            <First90DataTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

