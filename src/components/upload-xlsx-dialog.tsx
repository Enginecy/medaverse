import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState } from "react";
import ExcelJS from "exceljs";
import { profile } from "@/db/schema";

export function UploadXLSXDialog<TVars, TData>({
  title,
  content,
  onSubmit,
  onSuccess,
  onError,
  onCancel,
  variables,
  templateButton,
}: {
  title: string;
  content: string;
  onSubmit: (variables: TVars) => Promise<TData>;
  onSuccess?: (result: TData) => void;
  onError?: (error: Error) => void;
  onCancel: () => void;
  variables: TVars;
  templateButton?: React.ReactNode;
}) {
  const [xlsxFile, setXlsxFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: TVars) => {
      return onSubmit(variables);
    },
    onSuccess: onSuccess,
    onError: onError,
  });

  function readXlsxFile(file: File) {
    // console.log("Reading xlsx file:", file.name);
    const user = {
      name: "",
      username: "",
      phoneNumber: "",
      email: "",
      role: "",
      address: "",
      npnNumber: "",
      dob: new Date("MM/DD/YYYY"),
    };
    const reader = new FileReader();

    reader.onload = async (event) => {
      const buffer = event.target?.result;
      if (!(buffer instanceof ArrayBuffer)) return;

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      const rows = worksheet?.getSheetValues();

      if (!rows || rows.length < 2) {
        alert("The file is empty or does not contain valid data.");
        return;
      }
      const headerRow = rows[1];
      console.log(headerRow, "<======== Header Row");

      if (!headerRow || !Array.isArray(headerRow)) {
        alert("The file does not contain enough columns.");
        return;
      }
      const headers = headerRow.slice(1).map((cell) => {
        const formattedCell = cell?.toString().trim();
        const formattedHeader =
          formattedCell!.charAt(0).toLowerCase() + formattedCell?.slice(1);

        return formattedHeader;
      });

      console.log(headers, "<======== Headers");
      Object.keys(user).forEach((key) => {
        if (!headers.includes(key)) {
          alert(`The file does not contain the required column: ${key}`);
          return;
        }
       
      });
      var users: {}[]  = [];
      for( const row of rows.slice(2)) {
        if (!Array.isArray(row) || row.length < headers.length + 1) continue;
        const userData: Record<string, string> = {};
        headers.forEach((header, index) => {
          userData[header] = row[index + 1]?.toString().trim() || "";
        });
        users.push(userData);
      }


      console.log(users, "<======== Users Data");

    };
    reader.readAsArrayBuffer(file);
  }
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
          {title}
        </DialogTitle>
        <div className="flex w-full flex-row items-center justify-center px-0">
          <p className="text-center text-sm font-light text-gray-600">
            {content}
          </p>
          {templateButton && templateButton}
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
          <Button className="w-30" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="bg-primary hover:bg-primary-400 w-30"
            disabled={isPending || xlsxFile === null}
            onClick={() => {
              readXlsxFile(xlsxFile!);
            }}
          >
            <label>
              {isPending ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
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
