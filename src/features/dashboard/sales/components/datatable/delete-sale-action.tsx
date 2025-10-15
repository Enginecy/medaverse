"use client";

import { Button } from "@/components/ui/button";
import { DeleteDialog } from "@/components/delete-dialog";
import { deleteSale } from "@/features/dashboard/sales/server/actions/sales";
import { useShowDialog } from "@/lib/react-utils";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteSaleAction({ saleId }: { saleId: string }) {
  const showDialog = useShowDialog();
  const router = useRouter();

  const handleDelete = async () => {
    await showDialog((resolve) => (
      <DeleteDialog
        title="Delete Sale"
        content="Are you sure you want to delete this sale? This action cannot be undone and will permanently delete the sale and all its items."
        onSubmit={deleteSale}
        onSuccess={() => {
          toast.success("Sale deleted successfully");
          router.refresh();
          resolve(true);
        }}
        onError={(error) => {
          toast.error(error.message || "Failed to delete sale");
          resolve(false);
        }}
        onCancel={() => resolve(false)}
        variables={saleId}
      />
    ));
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      className="text-destructive hover:text-destructive hover:bg-destructive/10"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

