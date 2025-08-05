"use client";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PulseMultiple } from "react-svg-spinners";
import { renameFileAction } from "@/features/dashboard/docs/server/actions/docs";
import { Edit } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useShowDialog } from "@/lib/react-utils";

const renameFileSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name is too long"),
});

type RenameFileForm = z.infer<typeof renameFileSchema>;

interface RenameFileDialogProps {
  resolve: (value: boolean) => void;
  fileId: string;
  currentName: string;
}

export function RenameFileDialog({
  resolve,
  fileId,
  currentName,
}: RenameFileDialogProps) {
  const form = useForm<RenameFileForm>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: {
      name: currentName,
    },
  });

  const { mutate: renameFile, isPending } = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const result = await renameFileAction({ id, name });
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },
    onSuccess: () => {
      toast.success("File renamed successfully");
      resolve(true);
    },
    onError: (error) => {
      toast.error(error.message ?? "Failed to rename file");
    },
  });

  const onSubmit = (values: RenameFileForm) => {
    renameFile({ id: fileId, name: values.name });
  };

  return (
    <DialogContent className="w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Rename File</h3>
            <p className="text-muted-foreground text-sm">
              Enter a new name for your file.
            </p>
          </div>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>File Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter file name"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => resolve(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <PulseMultiple className="mr-2 h-4 w-4" />
                  Renaming...
                </>
              ) : (
                "Rename"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

export function RenameFileDialogTrigger({
  fileId,
  currentName,
  canUpdate,
}: {
  fileId: string;
  currentName: string;
  canUpdate: boolean;
}) {
  const showDialog = useShowDialog();

  const handleClick = () => {
    showDialog((resolve) => (
      <RenameFileDialog
        resolve={resolve}
        fileId={fileId}
        currentName={currentName}
      />
    ));
  };

  return (
    <DropdownMenuItem disabled={!canUpdate} onClick={handleClick}>
      <Edit className="mr-2 h-4 w-4" />
      Rename
    </DropdownMenuItem>
  );
}
