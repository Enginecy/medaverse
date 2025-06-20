import { EmailFormField } from "@/features/login/components/form/email-field";
import { OTPFormField } from "@/features/login/components/form/otp-field";
import { SubmitButton } from "@/features/login/components/submit-button";
import { Form } from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import type { createFormSchema } from "@/features/login/schemas/login-form-schema";
import type z from "zod";
import { env } from "@/env";
export function LoginForm({
  step,
  form,
  onSubmit,
  isLoading,
}: {
  step: "email" | "pin";
  form: UseFormReturn<z.infer<ReturnType<typeof createFormSchema>>>;
  onSubmit: (values: z.infer<ReturnType<typeof createFormSchema>>) => void;
  isLoading: boolean;
}) {
  return (
    <div className="flex w-[45%] flex-col items-center gap-2">
      <p className="rounded-2xl border px-4 py-1">Login</p>
      <p className="text-text-heading-primary text-2xl font-semibold">
        Sign in to your account
      </p>
      <p className="text-center text-neutral-500">
        {step === "email"
          ? "Please enter your email address below to receive an OTP code."
          : "Enter the OTP code sent to your email to complete login."}
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
              <EmailFormField step={step} form={form} />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4">
              <EmailFormField step={step} form={form} />
              <OTPFormField step={step} form={form} />
            </div>
          )}
          <SubmitButton step={step} isLoading={isLoading} />
        </form>
      </Form>
    </div>
  );
}
