"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { ActionResult } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

export function ConfirmDialog<TVars, TData>({
  title,
  content,
  icon,
  confirmText = "Confirm",
  confirmClassName = "bg-primary",
  onSubmit,
  onSuccess,
  onError,
  onCancel,
  variables,
}: {
  title: string;
  content: string;
  icon: ReactNode;
  confirmText?: string;
  confirmClassName?: string;
  onSubmit: (variables: TVars) => Promise<ActionResult<TData>>;
  onSuccess?: (result: TData) => void;
  onError?: (error: Error) => void;
  onCancel: () => void;
  variables: TVars;
}) {
  const { mutate, isPending } = useMutation({
    mutationFn: async (variables: TVars) => {
      const result = await onSubmit(variables);
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },
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
        {icon}
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
            className={`w-30 ${confirmClassName}`}
            onClick={() => mutate(variables)}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
