"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
 
} from "@/components/ui/form";
import { toast } from "sonner";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LoginGraphics } from "@/features/login/components/login-graphics";
import {
  sendEmailOTP,
  verifyEmailOtp,
} from "@/features/login/server/actions/login";
import { EmailFormField } from "@/features/login/components/form/email-field";
import { createFormSchema } from "@/features/login/schemas/login-form-schema";
import type z from "zod";
import { OTPFormField } from "@/features/login/components/form/otp-field";
import { SubmitButton } from "@/features/login/components/submit-button";

export default function Home() {
  const [step, setStep] = useState<"email" | "pin">("email");
  const router = useRouter();

  // Single form that handles both email and OTP
  const form = useForm<{
    email: string;
    code?: string;
  }>({
    resolver: zodResolver(createFormSchema(step)),
    defaultValues: {
      email: "",
      code: "",
    },
  });

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: sendEmailOTP,
    onSuccess: () => {
      toast.success("OTP sent to email");
      setStep("pin");
      form.trigger();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: verifyEmailOtp,
    onSuccess: router.refresh,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Unified form submission handler
  const onSubmit = (values: z.infer<ReturnType<typeof createFormSchema>>) => {
    if (step === "email") {
      // Send OTP
      sendOtp(values.email);
    } else {
      // Verify OTP
      verifyOtp({
        email: values.email,
        code: values.code!,
      });
    }
  };

  //TODO: Move to feature components


  

  return (
    <div
      className="fixed inset-0 flex h-screen w-full items-center justify-center
        bg-white p-4"
    >
      <LoginGraphics />
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
              <SubmitButton step = {step} isSendingOtp= {isSendingOtp} isVerifyingOtp={isVerifyingOtp}   />

              {step === "pin" && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setStep("email");
                    form.setValue("code", "");
                    form.trigger();
                  }}
                  className="text-sm text-gray-600"
                >
                  Back to email
                </Button>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
