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
  loginWithPassword,
} from "@/features/login/server/actions/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type z from "zod";
import { env } from "@/env";
import { showSonnerToast } from "@/lib/react-utils";
import type { ActionError } from "@/lib/utils";

export default function Home() {
  const [step, setStep] = useState<"email" | "pin" | "password">("email");
  const [mode, setMode] = useState<"OTP" | "Password">("OTP");
  const router = useRouter();

  const schema = useMemo(() => createFormSchema(step), [step]);

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      code: "",
      password: "",
    },
  });

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: async (data: string) => {
      const result = await sendEmailOTP(data);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: () => {
      toast.success("OTP sent to email");
      setStep("pin");
      form.trigger();
    },
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useMutation({
    mutationFn: async (data: { email: string; code: string }) => {
      const result = await verifyEmailOtp(data);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: router.refresh,
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  const { mutate: debugLogin, isPending: isLoggingIn } = useMutation({
    mutationFn: async (data: { email: string }) => {
      const result = await debugLoginWithPassword(data);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: router.refresh,
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  const { mutate: passwordLogin, isPending: isPasswordLoggingIn } = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const result = await loginWithPassword(data);
      if (!result.success) {
        throw result.error;
      }
      return result.data;
    },
    onSuccess: router.refresh,
    onError: (error: ActionError) => {
      showSonnerToast({
        message: error.message,
        description: error.details,
        type: "error",
      });
    },
  });

  // Unified form submission handler
  const onSubmit = (values: z.infer<ReturnType<typeof createFormSchema>>) => {
    if (env.NODE_ENV === "development") {
      debugLogin({ email: values.email });
      return;
    }

    if (mode === "Password") {
      setStep("password");
      passwordLogin({ email: values.email, password: values.password! });
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
        className="flex h-full w-full md:w-1/2 flex-col items-center justify-center gap-4 md:gap-6
          bg-white px-4 md:px-0"
      >
        <LoginForm
          form={form}
          isLoading={isSendingOtp || isVerifyingOtp || isLoggingIn || isPasswordLoggingIn}
          onSubmit={onSubmit}
          step={step}
          mode={mode}
          onModeChange={(next) => {
            setMode(next);
            if (next === "Password") {
              setStep("password");
            } else {
              setStep("email");
            }
            form.clearErrors();
          }}
        />
        {step === "pin" && mode === "OTP" && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setStep("email");
              form.setValue("code", "");
              form.trigger();
            }}
            className="text-sm text-gray-600 min-h-[44px] px-4"
          >
            Back to email
          </Button>
        )}
      </div>
    </div>
  );
}
