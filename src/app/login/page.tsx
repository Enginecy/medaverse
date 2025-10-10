"use client";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LoginForm } from "@/features/login/components/form/login-form";
import { LoginGraphics } from "@/features/login/components/login-graphics";
import { createFormSchema } from "@/features/login/schemas/login-form-schema";
import {
  sendEmailOTP,
  verifyEmailOtp,
  loginWithPassword,
} from "@/features/login/server/actions/login";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type z from "zod";
import { showSonnerToast } from "@/lib/react-utils";
import type { ActionError } from "@/lib/utils";
import { Info } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState<"email" | "pin" | "password">("email");
  // const [mode, setMode] = useState<"OTP" | "Password">("OTP");
  const mode = "Password" as const;
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

  const { mutate: passwordLogin, isPending: isPasswordLoggingIn } = useMutation(
    {
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
    },
  );

  // Unified form submission handler
  const onSubmit = (values: z.infer<ReturnType<typeof createFormSchema>>) => {
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
      className="relative flex min-h-screen w-full max-w-full items-center
        justify-center overflow-hidden p-4 md:justify-end"
    >
      <div className="absolute inset-0 z-0">
        <LoginGraphics />
      </div>
      <div
        className="relative z-10 flex h-auto w-full max-w-md flex-col
          items-center justify-center gap-4 overflow-y-auto rounded-3xl
          border-[12px] border-black bg-[#404552] p-4 backdrop-blur-sm md:h-2/3
          md:w-1/3 md:gap-6 md:rounded-4xl md:border-[16px] md:p-6"
      >
        <LoginForm
          form={form}
          isLoading={isSendingOtp || isVerifyingOtp || isPasswordLoggingIn}
          onSubmit={onSubmit}
          step={step}
          mode={mode}
        />
      </div>
      <Button
        variant={"default"}
        className="absolute top-0 right-0 z-10 m-4 w-30 rounded-3xl border-1
          border-blue-400 bg-transparent px-4"
        onClick={() => {
          window.open(
            "https://api.leadconnectorhq.com/widget/form/9iGj1DgBj0lIfXkEG8kQ",
            "_blank",
          );
        }}
      >
        <span className="text-white">Support</span>
        <Info className="ml-2 h-5 w-5 text-white" />
      </Button>
    </div>
  );
}
