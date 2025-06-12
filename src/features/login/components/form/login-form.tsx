import { EmailFormField } from "@/features/login/components/form/email-field";
import { OTPFormField } from "@/features/login/components/form/otp-field";
import { SubmitButton } from "@/features/login/components/submit-button";
import { Form, type UseFormReturn } from "react-hook-form";

export function LoginForm(
    {step , form , onSubmit , isLoading , }:{
        step : "email" | "pin"
        form: UseFormReturn<{email: string, code? : string }>
        onSubmit :  (values: { email: string; code?: string } ) => void;
        isLoading: boolean;

    }
){
    return (
         <div
        className="flex h-full w-1/2 flex-col items-center justify-center
          bg-white"
      >
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
              <EmailFormField step={step} form={form} />
              <OTPFormField step={step} form={form} />
              <SubmitButton step = {step}isLoading={isLoading } />
           
            </form>
          </Form>
        </div>
      </div>
    );
}