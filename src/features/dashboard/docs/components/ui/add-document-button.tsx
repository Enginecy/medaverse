"use client";

import { Button } from "@/components/ui/button";
import { UploadFileDialog } from "@/features/dashboard/docs/components/modals/upload-file-dialog";
import { useShowDialog } from "@/lib/react-utils";
import { Plus } from "lucide-react";

export function AddDocumentButton() {
  const showDialog = useShowDialog();
  const handleClick = () => {
    showDialog((resolve) => <UploadFileDialog resolve={resolve} />);
  };
  return (
    <Button variant="default" onClick={handleClick}>
      <Plus className="h-4 w-4" />
      Add Document
    </Button>
  );
}
