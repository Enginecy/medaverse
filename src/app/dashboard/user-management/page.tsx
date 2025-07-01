import { UserManagementTable } from "@/features/dashboard/user-management/components/data-table";
import { Button } from "@/components/ui/button";
import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { Download } from "lucide-react";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "User Management ",
  description: "Manage users within your application.",
};
export default function UserManagement() {
  return (
    <div className="flex w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <UsersActions />
      </div>
      <UserManagementTable />
    </div>
  );
}

function UsersActions() {
  return (
    <div className="flex gap-2">
      <Button variant="outline">
        Download CSV
        <Download />
      </Button>
      <AddUsersButton />
    </div>
  );
}
