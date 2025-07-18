import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useState } from "react";

export function UploadCSVDialog<TVars, TData>({
  title,
  content,
  onSubmit,
  onSuccess,
  onError,
  onCancel,
  variables,
}: {
  title: string;
  content: string;
  onSubmit: (variables: TVars) => Promise<TData>;
  onSuccess?: (result: TData) => void;
  onError?: (error: Error) => void;
  onCancel: () => void;
  variables: TVars;
}) {
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: TVars) => {
      return onSubmit(variables);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
  return (
    <DialogContent
      className="w-110 rounded-2xl border-0 p-7 focus-visible:ring-0
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
        <p className="text-center text-sm font-light text-gray-600">
          {content}
        </p>
        {csvFile ? (
          <div className="flex flex-row items-center gap-3">
            <p>Selected file: {csvFile.name}</p>
            <Button variant="outline" onClick={() => setCsvFile(null)}>
              X
            </Button>
          </div>
        ) : (
          <label
            className="flex h-20 w-85 cursor-pointer flex-col items-center
              justify-center border-2 border-dotted border-blue-400 bg-blue-50
              p-5 transition hover:bg-blue-100"
          >
            <span className="font-medium text-blue-700">Select CSV File</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(event) => {
                setCsvFile(event.target.files?.[0] || null);
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
            disabled={isPending || csvFile === null}
          >
            <label>
              {isPending ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload CSV"
              )}
            </label>
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

export function readCSVFile(file: File) {
  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result;
    if(typeof text !== "string") return;
    const lines = text.trim().split("\n");
    const headers = lines[0]?.trim().split(",");
    const rows = lines.slice(1); 

    for( const row of rows ){
      
    }

    

  };
}
