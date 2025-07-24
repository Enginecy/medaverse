import { GeneralDialog } from "@/components/general-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { UsersTemplateButton } from "@/features/dashboard/user-management/components/user-template-button";
import { showSonnerToast, useShowDialog } from "@/lib/react-utils";
import { readUsersFile } from "@/utils/importing-users";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { resolve } from "path";
import { useState } from "react";
import { toast } from "sonner";

export function UploadXLSXDialog() {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);

  const showAlertDialog = useShowDialog();
  const { mutate: uploadMutation, isPending: isUploadingUsers } = useMutation({
    mutationFn: readUsersFile,
    onError: async (error: Error) => {
      showAlertDialog((resolve) => {
        return (
          <GeneralDialog
            type="error"
            onClose={() => resolve(true)}
            title="Error Uploading File"
            description={error.message}
          />
        );
      });
    },
    onSuccess: () => {
      showSonnerToast({
        type: "success",
        message: "File uploaded successfully",
        description: "Users have been added successfully.",
      });
      setXlsxFile(null);
    },
  });

  return (
    <DialogContent
      className="w-140 rounded-2xl border-0 p-7 focus-visible:ring-0
        focus-visible:outline-none"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        <div
          className="m-2 flex h-14 w-14 items-center justify-center rounded-full
            bg-blue-50"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full
              bg-blue-100"
          >
            <Upload className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <DialogTitle className="text-center text-base font-semibold">
          Upload xlsx File
        </DialogTitle>
        <div className="flex w-full flex-row items-center justify-center px-0">
          <p className="text-center text-sm font-light text-gray-600">
            Please upload a xlsx file that matches with this template
          </p>
          <UsersTemplateButton />
        </div>
        {xlsxFile ? (
          <div className="flex flex-row items-center gap-3">
            <p>Selected file: {xlsxFile.name}</p>
            <Button variant="outline" onClick={() => setXlsxFile(null)}>
              X
            </Button>
          </div>
        ) : (
          <label
            className="flex h-20 w-85 cursor-pointer flex-col items-center
              justify-center border-2 border-dotted border-blue-400 bg-blue-50
              p-5 transition hover:bg-blue-100"
          >
            <span className="font-medium text-blue-700">Select Xlsx File</span>
            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={(event) => {
                setXlsxFile(event.target.files?.[0] || null);
              }}
            />
          </label>
        )}

        <div className="flex w-full flex-row justify-around py-3">
          <Button
            className="w-30"
            variant="outline"
            onClick={() => {
              resolve();
            }}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary-400 w-30"
            disabled={isUploadingUsers || xlsxFile === null}
            onClick={() => {
              uploadMutation(xlsxFile!);
            }}
          >
            <label>
              {isUploadingUsers ? (
                <>
                  Uploading...
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Upload Xlsx"
              )}
            </label>
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
