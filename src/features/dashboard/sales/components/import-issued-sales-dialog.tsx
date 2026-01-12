"use client";

import { GeneralDialog } from "@/components/general-dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { showSonnerToast, useShowDialog } from "@/lib/react-utils";
import {
  importIssuedSales,
  type ImportIssuedSalesResult,
} from "@/features/dashboard/sales/server/actions/sales";
import { readIssuedSalesFile } from "@/utils/extract-issued-sales";
import { useMutation } from "@tanstack/react-query";
import { FileUp, Upload } from "lucide-react";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { PulseMultiple } from "react-svg-spinners";

interface ImportIssuedSalesDialogProps {
  onSuccess?: (result: ImportIssuedSalesResult) => void;
  onClose: () => void;
}

export function ImportIssuedSalesDialog({
  onSuccess,
  onClose,
}: ImportIssuedSalesDialogProps) {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);
  const [recordCount, setRecordCount] = useState<number | null>(null);
  const [isParsing, setIsParsing] = useState(false);

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0] ?? null;
      setXlsxFile(file);
      setRecordCount(null);
      
      // Parse file to get record count
      if (file) {
        setIsParsing(true);
        readIssuedSalesFile(file)
          .then((records) => {
            setRecordCount(records.length);
          })
          .catch((error) => {
            // If parsing fails, we'll let the server handle the error
            console.error("Error parsing file:", error);
          })
          .finally(() => {
            setIsParsing(false);
          });
      }
    },
    noClick: true,
  });

  // Handle file input change
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setXlsxFile(file);
    setRecordCount(null);
    
    if (file) {
      setIsParsing(true);
      try {
        const records = await readIssuedSalesFile(file);
        setRecordCount(records.length);
      } catch (error) {
        console.error("Error parsing file:", error);
      } finally {
        setIsParsing(false);
      }
    }
  };

  const showAlertDialog = useShowDialog();
  const { mutate: uploadMutation, isPending: isUploading } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      return importIssuedSales(formData);
    },
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
    onSuccess: (result) => {
      if (result.success && result.data) {
        showSonnerToast({
          type: "success",
          message: "File uploaded successfully",
          description: `${result.data.matchedCount} sales marked as issued.`,
        });
        setXlsxFile(null);
        onSuccess?.(result.data);
        onClose();
      } else {
        showAlertDialog((resolve) => {
          return (
            <GeneralDialog
              type="error"
              onClose={() => resolve(true)}
              title="Error Uploading File"
              description={
                result.success
                  ? "Failed to import issued sales"
                  : result.error?.message
              }
            />
          );
        });
      }
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
          Import Issued Sales
        </DialogTitle>
        <div className="flex w-full flex-row items-center justify-center px-0">
          <p className="text-center text-sm font-light text-gray-600">
            Upload an Excel file containing issued sales data. Records will be
            matched by Policy Number.
          </p>
        </div>
        {xlsxFile ? (
          <div className="flex w-full flex-col gap-3">
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Selected file: {xlsxFile.name}</p>
                {isParsing && (
                  <p className="text-xs text-gray-500">Parsing file...</p>
                )}
                {recordCount !== null && !isParsing && (
                  <p className="text-xs text-gray-500">
                    Found {recordCount} record{recordCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
              <Button variant="outline" onClick={() => {
                setXlsxFile(null);
                setRecordCount(null);
              }}>
                X
              </Button>
            </div>
            {isUploading && (
              <div className="flex w-full flex-col gap-2">
                <div className="flex flex-row items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {recordCount !== null
                      ? `Processing ${recordCount} record${recordCount !== 1 ? "s" : ""}...`
                      : "Processing file..."}
                  </span>
                  {isUploading && (
                    <PulseMultiple className="h-4 w-4 animate-spin text-blue-500" />
                  )}
                </div>
                <Progress value={undefined} className="h-2" />
              </div>
            )}
          </div>
        ) : (
          <label
            {...getRootProps()}
            className={
              `flex h-20 w-85 cursor-pointer flex-col items-center
                justify-center rounded-2xl border-2 border-dashed
                border-blue-400 bg-blue-50 p-5 transition hover:bg-blue-100` +
              (isDragActive ? " bg-blue-200" : "")
            }
          >
            <span className="font-medium text-blue-700">
              {isDragActive ? (
                <FileUp className="h-6 w-6 text-blue-500" />
              ) : (
                "Drag and drop or click to select a file"
              )}
            </span>
            <input
              type="file"
              accept=".xlsx"
              className="hidden"
              onChange={handleFileChange}
              {...getInputProps()}
            />
          </label>
        )}

        <div className="flex w-full flex-row justify-around py-3">
          <Button
            className="w-30"
            variant="outline"
            onClick={onClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary-400 w-30"
            disabled={isUploading || xlsxFile === null || isParsing}
            onClick={() => {
              uploadMutation(xlsxFile!);
            }}
          >
            {isUploading ? (
              <>
                <PulseMultiple
                  className="h-5 w-5 animate-spin bg-white mr-2"
                  color="white"
                />
                Importing...
              </>
            ) : isParsing ? (
              "Parsing..."
            ) : (
              "Import Issued Sales"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
