"use client";

import { Button } from "@/components/ui/button";
import { AddUsersButton } from "@/features/dashboard/user-management/components/add-users-button";
import { Download } from "lucide-react";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { generalExport } from "@/utils/exporting";

export function UsersActions({ users }: { users: User[] }) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => generalExport(users, "Users")}>
        Download CSV
        <Download />
      </Button>
      <AddUsersButton />
    </div>
  );
}

