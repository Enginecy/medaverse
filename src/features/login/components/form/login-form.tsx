import { EmailFormField } from "@/features/login/components/form/email-field";
import { OTPFormField } from "@/features/login/components/form/otp-field";
import { SubmitButton } from "@/features/login/components/submit-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import type { createFormSchema } from "@/features/login/schemas/login-form-schema";
import type z from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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
  if (process.env.NODE_ENV === "development") {
    step = "pin";
  }
  return (
    <div className="flex w-[45%] flex-col items-center gap-2">
      <p className="rounded-2xl border px-4 py-1">Login</p>
      <p className="text-text-heading-primary text-2xl font-semibold">
        Sign in to your account
      </p>
      <p className="text-text-body-secondary text-center text-[#6D6D6D]">
        {step === "email"
          ? "Please enter your email address below to receive an OTP code."
          : "Enter the OTP code sent to your email to complete login."}
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex w-full flex-col items-center gap-4"
        >
          {process.env.NODE_ENV === "development" && step == "pin" ? (
            <div className="flex flex-col">
              <div className="text-red-500">
                <p>Development Mode: OTP will be auto-filled.</p>
              </div>
              {/* s<p className="text-red-800">{step}</p> */}
              <EmailFormField step={step} form={form} />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your password"
                        {...field}
                        className={cn(
                          "w-full text-sm",
                          step === "pin" && "cursor-not-allowed bg-gray-100",
                        )}
                      />
                    </FormControl>
                    <FormMessage
                      className="text-[0.625rem]"
                      success={
                        step === "pin"
                          ? "Password is auto-filled in development mode."
                          : undefined
                      }
                    />
                  </FormItem>
                )}
              />
            </div>
          ) : (
            <div className="flex flex-col">
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
