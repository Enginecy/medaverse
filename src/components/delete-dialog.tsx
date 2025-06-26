"use client";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Trash2 } from "lucide-react"; // Import Loader2 for loading spinner

export function DeleteDialog<TVars, TData>({
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
  const { mutate, isPending } = useMutation({
    mutationFn: onSubmit,
    onSuccess,
    onError,
  });
  return (
    <DialogContent
      className="w-85 rounded-2xl border-0 p-7 focus-visible:ring-0
        focus-visible:outline-none"
      showCloseButton={false}
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className="m-2 flex h-14 w-14 items-center justify-center rounded-full
            bg-red-50"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full
              bg-red-100"
          >
            <Trash2 className="h-6 w-6 text-red-500" />
          </div>
        </div>
        <DialogTitle className="text-center text-base font-semibold">
          {title}
        </DialogTitle>
        <p className="text-center text-sm font-light text-gray-600">
          {content}
        </p>
        <div className="flex w-full flex-row justify-around py-3">
          <Button className="w-30" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="w-30 bg-red-600"
            onClick={() => mutate (variables) }
            disabled={isPending} // Disable button when loading
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
