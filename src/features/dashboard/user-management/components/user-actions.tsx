import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { UploadCSVButton } from "@/features/dashboard/user-management/components/upload-csv-button";
import { ExportUsersButton } from "@/features/dashboard/user-management/components/users-exporting";

export function UsersActions() {
  return (
    <div className="flex gap-2">
       <UploadCSVButton />
      <ExportUsersButton />
      <AddUsersButton />
    </div>
  );
}

