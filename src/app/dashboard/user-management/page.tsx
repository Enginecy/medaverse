import { UserManagementTable } from "@/features/dashboard/user-management/components/user-mangement-data-table";
import type { Metadata } from "next";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/data-table";
export const metadata: Metadata = {
  title: "User Management ",
  description: "Manage users within your application.",
};
export default function UserManagement() {
  return (
    <div className="flex h-full w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
      </div>
      <div className="w-full">
        <div className="mb-4 rounded-2xl border border-gray-300 bg-white p-6">
          <Suspense fallback={<DataTableSkeleton />}>
            <UserManagementTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

