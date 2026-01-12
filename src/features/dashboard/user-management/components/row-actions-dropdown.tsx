"use client";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuContent,
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddUserDrawer } from "@/features/dashboard/user-management/components/form/add-user-drawer";
import { UpdateUserPasswordDialog } from "@/features/dashboard/user-management/components/form/update-password-dialog";
import {
  deleteAgent,
  reEnableAgent,
} from "@/features/dashboard/user-management/server/actions/user-mangement";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { useAuth } from "@/hooks/auth";
import {
  showSonnerToast,
  useShowDialog,
  useShowDrawer,
} from "@/lib/react-utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Copy,
  LockIcon,
  MoreHorizontal,
  RotateCcw,
  SquarePen,
  Trash2,
} from "lucide-react";

export function RowActionsDropdown({ user }: { user: User }) {
  const showDialog = useShowDialog();
  const showDrawer = useShowDrawer();
  const queryClient = useQueryClient(); // Initialize useQueryClient
  const { user: currentUser } = useAuth();

  const canUpdatePassword =
    currentUser?.user?.id == user.userId ||
    currentUser?.user?.user_metadata.is_admin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-2xl p-2">
        {canUpdatePassword && (
          <DropdownMenuItem
            onClick={() => {
              showDrawer(() => (
                <UpdateUserPasswordDialog userId={user.userId} />
              ));
            }}
          >
            <LockIcon className="text-black" />
            Update Password
          </DropdownMenuItem>
        )}
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

        {user.status === "active" ? (
          <DropdownMenuItem
            onClick={() => {
              showDialog((resolve) => (
                <ConfirmDialog
                  title="Disable User"
                  content="Are you sure you want to disable this user? They will no longer be able to log in."
                  icon={
                    <div className="m-2 flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                        <Trash2 className="h-6 w-6 text-red-500" />
                      </div>
                    </div>
                  }
                  confirmText="Disable"
                  confirmClassName="bg-red-600 hover:bg-red-700"
                  onSubmit={deleteAgent}
                  onError={(error) => {
                    showSonnerToast({
                      message: "Failed to disable agent.",
                      description: error.message,
                      type: "error",
                    });
                  }}
                  onSuccess={() => {
                    showSonnerToast({
                      message: "Disabled successfully",
                      description: "The agent has been disabled successfully.",
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
            <span className="text-destructive">Disable</span>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={() => {
              showDialog((resolve) => (
                <ConfirmDialog
                  title="Re-enable User"
                  content="Are you sure you want to re-enable this user? They will be able to log in again."
                  icon={
                    <div className="m-2 flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <RotateCcw className="h-6 w-6 text-green-500" />
                      </div>
                    </div>
                  }
                  confirmText="Re-enable"
                  confirmClassName="bg-green-600 hover:bg-green-700"
                  onSubmit={reEnableAgent}
                  onError={(error) => {
                    showSonnerToast({
                      message: "Failed to re-enable agent.",
                      description: error.message,
                      type: "error",
                    });
                  }}
                  onSuccess={() => {
                    showSonnerToast({
                      message: "Re-enabled successfully",
                      description: "The agent has been re-enabled successfully.",
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
            <RotateCcw className="text-green-600" />
            <span className="text-green-600">Re-enable</span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
