"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoginForm } from "@/features/login/components/form/login-form";
import { LoginGraphics } from "@/features/login/components/login-graphics";
import { createFormSchema } from "@/features/login/schemas/login-form-schema";
import {
  debugLoginWithPassword,
  sendEmailOTP,
  verifyEmailOtp,
} from "@/features/login/server/actions/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type z from "zod";
import { env } from "@/env";

export default function Home() {
  const [step, setStep] = useState<"email" | "pin">("email");
  const router = useRouter();

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
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

  const { mutate: debugLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: debugLoginWithPassword,
    onSuccess: router.refresh,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Unified form submission handler
  const onSubmit = (values: z.infer<ReturnType<typeof createFormSchema>>) => {
    if (env.NODE_ENV === "development") {
      debugLogin({ email: values.email });
      return;
    }
    if (step === "email") {
      sendOtp(values.email);
    } else {
      verifyOtp({
        email: values.email,
        code: values.code!,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 flex h-screen w-full items-center justify-center
        bg-white p-4"
    >
      <LoginGraphics />
      <div
        className="flex h-full w-1/2 flex-col items-center justify-center gap-6
          bg-white"
      >
        <LoginForm
          form={form}
          isLoading={isSendingOtp || isVerifyingOtp || isLoggingIn}
          onSubmit={onSubmit}
          step={step}
        />
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
      </div>
    </div>
  );
}
