import { EmailFormField } from "@/features/login/components/form/email-field";
import { OTPFormField } from "@/features/login/components/form/otp-field";
import { SubmitButton } from "@/features/login/components/submit-button";
import { Form } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import type { createFormSchema } from "@/features/login/schemas/login-form-schema";
import type z from "zod";
import { env } from "@/env";
import { SegmentedButton } from "@/components/ui/segmented-button";
import { PasswordFormField } from "./password-field";
export function LoginForm({
  step,
  form,
  onSubmit,
  isLoading,
  onModeChange,
  mode,
}: {
  step: "email" | "pin" | "password";
  mode: "OTP" | "Password";
  onModeChange: (mode: "OTP" | "Password") => void;
  form: UseFormReturn<z.infer<ReturnType<typeof createFormSchema>>>;
  onSubmit: (values: z.infer<ReturnType<typeof createFormSchema>>) => void;
  isLoading: boolean;
}) {
  const isOtp = mode === "OTP";
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-2 px-4">
      <p className="rounded-2xl border px-4 py-1">Login</p>
      <p className="text-text-heading-primary text-xl md:text-2xl font-semibold text-center">
        Sign in to your account
      </p>
      <SegmentedButton
        className="w-full"
        options={["OTP", "Password"]}
        value={mode}
        onChange={(v) => onModeChange(v as "OTP" | "Password")}
      />
      <p className="text-center text-neutral-500 text-sm md:text-base px-2">
        {isOtp
          ? step === "email"
            ? "Please enter your email address below to receive an OTP code."
            : "Enter the OTP code sent to your email to complete login."
          : "Enter your email and password to continue."}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-4"
        >
          {env.NODE_ENV === "development" ? (
            <div className="flex w-full flex-col gap-4">
              <div className="text-destructive text-center">
                <p>Development Mode: Automatic login will be enabled.</p>
                <p>
                  <span className="text-xs text-neutral-500">
                    Please Refer to the README.md file for more information.
                  </span>
                </p>
              </div>
              <EmailFormField step={isOtp ? step : "password"} form={form} />
              {!isOtp && <PasswordFormField form={form} />}
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4">
              <EmailFormField step={isOtp ? step : "password"} form={form} />
              {isOtp ? (
                <OTPFormField step={step as "email" | "pin"} form={form} />
              ) : (
                <PasswordFormField form={form} />
              )}
            </div>
          )}
          <SubmitButton step={isOtp ? step : "password"} isLoading={isLoading} />
        </form>
      </Form>
    </div>
  );
}
