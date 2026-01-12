"use client";
import { Button } from "@/components/ui/button";
import { AddSaleDrawer } from "@/features/dashboard/sales/components/add-sale-drawer";
import { ImportIssuedSalesDialog } from "@/features/dashboard/sales/components/import-issued-sales-dialog";
import { UnmatchedRecordsDialog } from "@/features/dashboard/sales/components/unmatched-records-dialog";
import { useShowDialog, useShowDrawer } from "@/lib/react-utils";
import { Download, Plus, Upload } from "lucide-react";

export function SalesActions() {
  const showDrawer = useShowDrawer();
  const showDialog = useShowDialog();

  const openAddNewSaleModal = () => {
    showDrawer((resolve) => {
      return <AddSaleDrawer closeDrawer={resolve} />;
    });
  };

  const openImportDialog = () => {
    showDialog((resolve) => {
      return (
        <ImportIssuedSalesDialog
          onSuccess={(result) => {
            // If there are unmatched records, show the unmatched records dialog
            if (result.unmatchedRecords.length > 0) {
              resolve(undefined);
              // Show unmatched records dialog after a brief delay
              setTimeout(() => {
                showDialog((resolveUnmatched) => {
                  return (
                    <UnmatchedRecordsDialog
                      records={result.unmatchedRecords}
                      onClose={() => resolveUnmatched(undefined)}
                    />
                  );
                });
              }, 100);
            } else {
              resolve(undefined);
            }
          }}
          onClose={() => resolve(undefined)}
        />
      );
    });
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        variant="outline"
        className="text-primary cursor-pointer rounded-full border-0 bg-white
          p-1 shadow-none hover:bg-gray-100"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download Xlsx</span>
        <span className="sm:hidden">Download</span>
      </Button>
      <Button
        variant="outline"
        onClick={openImportDialog}
        className="text-primary cursor-pointer rounded-full border-0 bg-white
          p-1 shadow-none hover:bg-gray-100"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Import Issued Sales</span>
        <span className="sm:hidden">Import</span>
      </Button>
      <Button
        variant="default"
        onClick={openAddNewSaleModal}
        className="bg-primary cursor-pointer rounded-full border-0 p-1
          shadow-none "
      >
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add New</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </div>
  );
}
