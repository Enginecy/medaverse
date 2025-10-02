import { EmailFormField } from "@/features/login/components/form/email-field";
import { OTPFormField } from "@/features/login/components/form/otp-field";
import { SubmitButton } from "@/features/login/components/submit-button";
import { Form } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import type { createFormSchema } from "@/features/login/schemas/login-form-schema";
import type z from "zod";
import { env } from "@/env";
import { PasswordFormField } from "./password-field";
export function LoginForm({
  step,
  form,
  onSubmit,
  isLoading,
  mode,
}: {
  step: "email" | "pin" | "password";
  mode: "OTP" | "Password";
  form: UseFormReturn<z.infer<ReturnType<typeof createFormSchema>>>;
  onSubmit: (values: z.infer<ReturnType<typeof createFormSchema>>) => void;
  isLoading: boolean;
}) {
  const isOtp = mode === "OTP";
  return (
    <div
      className="flex w-full max-w-sm flex-col items-center gap-2 px-2
        sm:max-w-md sm:px-4"
    >
      <p
        className="rounded-2xl border border-gray-600 bg-gray-800 px-3 py-1
          text-sm text-gray-200 sm:px-4"
      >
        Login
      </p>
      <p
        className="text-center text-lg font-semibold text-white sm:text-xl
          md:text-2xl"
      >
        Sign in to your account
      </p>
      <p
        className="px-2 text-center text-xs leading-relaxed whitespace-pre-line
          text-gray-400 sm:text-sm md:text-base"
      >
        {isOtp
          ? step === "email"
            ? "Please enter your email address below\nto receive an OTP code."
            : "Enter the OTP code sent to your email to complete login."
          : "Enter your email and password to continue."}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full min-w-0 flex-col items-center gap-3 sm:gap-4"
        >
          {env.NODE_ENV === "development" ? (
            <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4">
              <div className="px-2 text-center text-red-400">
                <p className="text-sm">
                  Development Mode: Automatic login will be enabled.
                </p>
                <p>
                  <span className="text-xs text-gray-500">
                    Please Refer to the README.md file for more information.
                  </span>
                </p>
              </div>
              <EmailFormField step={isOtp ? step : "password"} form={form} />
              {!isOtp && <PasswordFormField form={form} />}
            </div>
          ) : (
            <div className="flex w-full min-w-0 flex-col gap-3 sm:gap-4">
              <EmailFormField step={isOtp ? step : "password"} form={form} />
              {isOtp ? (
                <OTPFormField step={step as "email" | "pin"} form={form} />
              ) : (
                <PasswordFormField form={form} />
              )}
            </div>
          )}
          <SubmitButton
            step={isOtp ? step : "password"}
            isLoading={isLoading}
          />
        </form>
      </Form>
    </div>
  );
}
