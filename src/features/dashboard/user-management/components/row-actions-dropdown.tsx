"use client";

import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserDrawer } from "@/features/dashboard/user-management/components/form/add-user-drawer";
import { deleteAgent } from "@/features/dashboard/user-management/server/actions/user-mangement";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import {
  showSonnerToast,
  useShowDialog,
  useShowDrawer,
} from "@/lib/react-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import { Copy, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";

export function RowActionsDropdown({ user }: { user: User }) {
  const showDialog = useShowDialog();
  const showDrawer = useShowDrawer();
  const queryClient = useQueryClient(); // Initialize useQueryClient

  const { mutate: deleteUser, isPending: isDeleting } = useMutation({
    mutationFn: deleteAgent,
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
    },
    onError: (error: Error) => {},
  });

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

        <DropdownMenuItem
          onClick={() => {
            showDialog((resolve) => (
              <DeleteDialog
                title="Delete User"
                content="Are you sure you want to delete this User? This action cannot be undone."
                onSubmit={deleteAgent}
                onError={(error) => {
                  showSonnerToast({
                    message: "Failed to delete agent.",
                    description: error.message,
                    type: "error",
                  });
                }}
                onSuccess={() => {
                  showSonnerToast({
                    message: "Deleted successfully",
                    description: "The agent has been deleted successfully.",
                    type: "success",
                  });
                  queryClient.invalidateQueries({ queryKey: ["users"] });
                  resolve(true);
                }}
                onCancel={() => {
                  resolve(false);
                }}
                variables={user.id}
              />
            ));
          }}
        >
          <Trash2 className="text-destructive" />
          <span className="text-destructive">Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
