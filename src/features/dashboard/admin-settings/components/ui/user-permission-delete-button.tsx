"use client";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteUserPermission } from "@/features/dashboard/admin-settings/server/actions/admin-settings";
import { showSonnerToast, useShowDialog } from "@/lib/react-utils";
import { X } from "lucide-react";

export function UserPermissionDeleteButton({ id }: { id: string }) {
  const showDialog = useShowDialog();

  const handleShowDialog = () => {
    showDialog((resolve) => {
      const onSuccess = () => {
        resolve(true);
        showSonnerToast({
          message: "User permission is revoked successfully.",
          type: "success",
        });
      };

      const onError = (error: Error) => {
        resolve(false);
        showSonnerToast({
          message: "An error occurred while revoking the user permission.",
          description: error.message,
          type: "error",
        });
      };

      return (
        <DeleteDialog
          title="Revoke User Permission"
          content="Are you sure you want to revoke this user permission?"
          onSubmit={deleteUserPermission}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={() => resolve(false)}
          variables={{ id }}
        />
      );
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-red-600 hover:text-red-700"
      onClick={handleShowDialog}
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
