"use client";
import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { deleteCarrier } from "@/features/dashboard/carriers/server/actions/carriers";
import { showSonnerToast, useShowDialog } from "@/lib/react-utils";
import {  useQueryClient } from "@tanstack/react-query";

export function DeleteCarrierButton({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const showDialog = useShowDialog();
  const handleDeleteCarrier = () => {
    showDialog((resolve) => {
      const onSuccess = () => {
        resolve(true);
        showSonnerToast({
          message: "Carrier deleted successfully.",
          type: "success",
        });
        queryClient.invalidateQueries({ queryKey: ["carriers"] });
      };

      const onError = () => {
        resolve(false);
        showSonnerToast({
          message: "An error occurred while deleting the carrier.",
          type: "error",
        });
      };

      return (
        <DeleteDialog
          title="Delete Carrier"
          content="Are you sure you want to delete this carrier?"
          onSubmit={deleteCarrier}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={() => resolve(false)}
          variables={id}
        />
      );
    });
  };
  return (
    <Button
      type="button"
      className="w-30 bg-red-500 hover:bg-red-400"
      onClick={() => {
        handleDeleteCarrier();
      }}
    >
      Delete Carrier
    </Button>
  );
}
