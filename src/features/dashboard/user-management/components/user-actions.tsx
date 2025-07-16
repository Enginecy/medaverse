import { Button } from "@/components/ui/button";
import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { Download } from "lucide-react";

export function UsersActions() {
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
