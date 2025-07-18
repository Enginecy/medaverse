"use client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useShowDialog } from "@/lib/react-utils";
import React  from "react";
import { UploadCSVDialog } from "@/components/upload-csv-dialog";

export function UploadCSVButton() {
  const showDialog = useShowDialog();
  function handleUploading() {
    showDialog((resolve) => {
      return (
        <UploadCSVDialog
          title={"Upload CSV File"}
          content={"Please upload a CSV file to import Users data."}
          onSubmit={function (variables: unknown): Promise<unknown> {
            throw new Error("Function not implemented.");
          }}
          onCancel={function (): void {
            throw new Error("Function not implemented.");
          }}
          variables={undefined}
        />
      );
    });
  }
  return (
    <Button className="w-35" variant="outline" onClick={handleUploading}>
      <label
        className="hover:bg-accent flex cursor-pointer items-center gap-2
          rounded-md px-3 py-2 transition-colors"
      >
        <Upload className="text-primary h-5 w-5" />
        <span className="text-primary font-medium">Upload CSV</span>
      </label>
    </Button>
  );
}
