"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserDrawer } from "@/features/dashboard/user-management/components/form/add-user-drawer";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { useShowDrawer } from "@/lib/react-utils";
import { Copy, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";

export function RowActionsDropdown({ user }: { user: User }) {
  const showDrawer = useShowDrawer();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl p-2">
        <DropdownMenuItem
          onClick={() => {
            showDrawer((resolve) => (
              <AddUserDrawer closeDrawer={resolve} user={user} />
            ));
          }}
        >
          <SquarePen className="text-black" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Copy className="text-black" />
          Copy Data
        </DropdownMenuItem>

        <DropdownMenuItem>
          <Trash2 className="text-destructive" />

          <span className="text-destructive">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
