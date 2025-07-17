import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { generalExport } from "@/utils/exporting";

export async function ExportUsersButton() {
    const users = await getExportUsers();
  return (
    <Button variant="outline" onClick={() => generalExport(users, "Users")}>
      Download CSV
      <Download />
    </Button>
  );
}
