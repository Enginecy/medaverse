import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { ExportUsersButton } from "@/features/dashboard/user-management/components/users-exporting";

export function UsersActions() {
  return (
    <div className="flex gap-2">
      <ExportUsersButton />
      <AddUsersButton />
    </div>
  );
}

