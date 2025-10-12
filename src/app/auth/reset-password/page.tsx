"use client";

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
import { resetPassword } from "@/features/login/server/actions/login";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/features/login/schemas/reset-password-schema";
import { showSonnerToast } from "@/lib/react-utils";
import type { ActionError } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [passwordReset, setPasswordReset] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate: updatePassword, isPending } = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      const result = await resetPassword(data.password);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => {
      setPasswordReset(true);
      showSonnerToast({
        message: "Password reset successful",
        description: "You can now log in with your new password",
        type: "success",
      });
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    },
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    updatePassword(data);
  };

  if (passwordReset) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-gradient-to-br
          from-blue-50 via-white to-blue-50 p-4"
      >
        <div
          className="w-full max-w-md rounded-3xl border border-gray-200 bg-white
            p-8 shadow-lg"
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full
                bg-green-50"
            >
              <div
                className="flex h-12 w-12 items-center justify-center
                  rounded-full bg-green-100"
              >
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-center text-2xl font-bold text-gray-900">
              Password Reset Successfully
            </h1>
            <p className="text-center text-sm text-gray-600">
              Your password has been updated. Redirecting you to the login
              page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-gradient-to-br
        from-blue-50 via-white to-blue-50 p-4"
    >
      <div
        className="w-full max-w-md rounded-3xl border border-gray-200 bg-white
          p-8 shadow-lg"
      >
        <div className="mb-8 flex flex-col items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full
              bg-blue-50"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full
                bg-blue-100"
            >
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Change Your Password
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your new password below
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter new password"
                      type="password"
                      autoComplete="new-password"
                      disabled={isPending}
                      {...field}
                    />
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
                    <Input
                      placeholder="Confirm new password"
                      type="password"
                      autoComplete="new-password"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              size="lg"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <Button
            variant="link"
            onClick={() => router.push("/login")}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

