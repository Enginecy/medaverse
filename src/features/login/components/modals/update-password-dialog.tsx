"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useMutation } from "@tanstack/react-query";
import { updatePasswordAndClearFlag } from "@/features/login/server/actions/login";
import { updatePasswordSchema } from "@/features/login/schemas/login-form-schema";
import type z from "zod";
import { useRouter } from "next/navigation";
import { showSonnerToast } from "@/lib/react-utils";
import type { ActionError } from "@/lib/utils";
import { useContext } from "react";
import { ModalContext } from "@/providers/modal";

export function UpdatePasswordDialog() {
  const router = useRouter();
  const { closeDialog } = useContext(ModalContext);
  const form = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: { newPassword: string }) => {
      const result = await updatePasswordAndClearFlag(data);
      if (!result.success) throw result.error;
      return result.data;
    },
    onSuccess: () => {
      showSonnerToast({ message: "Password updated", type: "success" });
      closeDialog();
      router.refresh();
    },
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof updatePasswordSchema>) => {
    mutate({ newPassword: values.newPassword });
  };

  return (
    <DialogContent className="w-1/3">
      <DialogHeader>
        <DialogTitle>Update your password</DialogTitle>
        <DialogDescription>
          Please enter your new password below. For security purposes, you are
          required to update your password.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              Save Password
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
