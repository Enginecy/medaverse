import { DeleteDialog } from "@/components/delete-dialog";
import { Button } from "@/components/ui/button";
import { showSonnerToast, useShowDialog } from "@/lib/react-utils";
import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";

export function DeleteCarrierButton() {
    
  const showDialog = useShowDialog();
  const handleDeleteCarrier = () => {
    showDialog((resolve) => {
      const onSuccess = () => {
        resolve(true);
        showSonnerToast({
          message: "Carrier deleted successfully.",
          type: "success",
        });
      };

      const onError = (error: Error) => {
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
          onSubmit={() => Promise.resolve()}
          onSuccess={onSuccess}
          onError={onError}
          onCancel={() => resolve(false)}
          variables={{}}
        />
      );
    });
  };
  return (
    <Button
      className="absolute top-0 right-0 z-20 cursor-pointer rounded-full
        bg-transparent hover:bg-red-200"
      onClick={(e) => {
        handleDeleteCarrier();
        2;
      }}
    >
      <X color="black" />
    </Button>
  );
}
