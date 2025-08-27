import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { UploadXlsxButton } from "@/features/dashboard/user-management/components/upload-xlsx-button";
import { ExportUsersButton } from "@/features/dashboard/user-management/components/users-exporting";

export function UsersActions() {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <UploadXlsxButton />
      <ExportUsersButton />
      <AddUsersButton />
    </div>
  );
}
