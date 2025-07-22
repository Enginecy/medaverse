"use client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useShowDialog } from "@/lib/react-utils";
import React  from "react";
import { UploadXLSXDialog } from "@/features/dashboard/user-management/components/upload-xlsx-dialog";
import { UsersTemplateButton } from "@/features/dashboard/user-management/components/user-template-button";

export function UploadXlsxButton() {
  const showDialog = useShowDialog();
  function handleUploading() {
    showDialog((resolve) => {
      return (
        <UploadXLSXDialog
          title={"Upload xlsx File"}
          content={"Please upload a xlsx file that matches with this template"}
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
        <span className="text-primary font-medium">Upload Xlsx file</span>
      </label>
    </Button>
  );
}
