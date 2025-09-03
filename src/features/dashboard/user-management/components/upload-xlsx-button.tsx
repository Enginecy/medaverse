"use client";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useShowDialog } from "@/lib/react-utils";
import React from "react";
import { UploadXLSXDialog } from "@/features/dashboard/user-management/components/upload-xlsx-dialog";

export function UploadXlsxButton() {
  const showDialog = useShowDialog();
  function handleUploading() {
    showDialog(() => {
      return <UploadXLSXDialog />;
    });
  }
  return (
    <Button
      className="w-35 cursor-pointer rounded-full bg-[#E5ECF6] shadow-none
        hover:bg-[#E5ECF6]/50"
      variant="default"
      onClick={handleUploading}
    >
      <Upload className="text-primary h-5 w-5" />
      <span className="text-primary font-medium">Upload Xlsx file</span>
    </Button>
  );
}
