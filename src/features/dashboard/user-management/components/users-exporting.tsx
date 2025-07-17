import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generalExport } from "@/utils/exporting";
import { getExportUsers } from "@/features/dashboard/user-management/server/db/user-management";

export async function ExportUsersButton() {
    const users = await getExportUsers();
  return (
    <Button variant="outline" onClick={() => generalExport(users, "Users")}>
      Download CSV
      <Download />
    </Button>
  );
}
