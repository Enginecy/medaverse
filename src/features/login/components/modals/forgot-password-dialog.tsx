"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { sendPasswordResetEmail } from "@/features/login/server/actions/login";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/features/login/schemas/reset-password-schema";
import { showSonnerToast } from "@/lib/react-utils";
import type { ActionError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ForgotPasswordDialogProps {
  resolve: (value: boolean) => void;
}

export function ForgotPasswordDialog({ resolve }: ForgotPasswordDialogProps) {
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate: sendResetEmail, isPending } = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const result = await sendPasswordResetEmail(data.email);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => {
      setEmailSent(true);
      showSonnerToast({
        message: "Reset link sent",
        description: "Check your email for the password reset link",
        type: "success",
      });
    },
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    sendResetEmail(data);
  };

  if (emailSent) {
    return (
      <DialogContent
        className="lg:w-1/2 rounded-2xl border-0 p-7
          focus-visible:outline-none focus-visible:ring-0"
        showCloseButton={true}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full
              bg-green-50"
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full
                bg-green-100"
            >
              <Mail className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Check Your Email
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-gray-600">
            We&apos;ve sent a password reset link to{" "}
            <span className="font-medium">{form.getValues("email")}</span>.
            Click the link in the email to reset your password.
          </DialogDescription>
          <Button
            className="mt-4 w-full"
            onClick={() => resolve(true)}
            type="button"
          >
            Got it
          </Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent
      className="lg:w-1/2 rounded-2xl border-0 p-7
        focus-visible:outline-none focus-visible:ring-0"
      showCloseButton={true}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-xl font-semibold">
            Forgot Password?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </DialogDescription>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      autoComplete="email"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => resolve(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DialogContent>
  );
}

