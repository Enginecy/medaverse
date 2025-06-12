"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PulseMultiple } from "react-svg-spinners";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendEmailOTP, verifyEmailOtp } from "./actions";
import { useRouter } from "next/navigation";
import { LoginGraphics } from "@/app/login/ui/login-graphics";
import { cn } from "@/lib/utils";

// Create a unified schema that conditionally validates based on step
const createFormSchema = (step: "email" | "pin") =>
  z.object({
    email: z.string().email(),
    code: step === "pin" ? z.string().min(6) : z.string().optional(),
  });

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
  const onSubmit = (values: { email: string; code?: string }) => {
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

  function EmailFormField() {
    return (
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel className="text-sm">Email</FormLabel>
            <FormControl>
              <Input
                placeholder="email"
                {...field}
                className={cn(
                  "w-full text-sm",
                  step === "pin" && "cursor-not-allowed bg-gray-100",
                )}
                disabled={step === "pin"}
              />
            </FormControl>
            <FormMessage
              className="text-[0.625rem]"
              success={
                step === "pin" ? "An OTP code sent to your Email" : undefined
              }
            />
          </FormItem>
        )}
      />
    );
  }

  function OTPFormField() {
    if (step !== "pin") return null;

    return (
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="w-full">
            <FormLabel>One-Time Password</FormLabel>
            <FormControl className="w-full">
              <InputOTP maxLength={6} {...field} className="w-full">
                <InputOTPGroup className="w-full justify-between gap-1.5">
                  <InputOTPSlot
                    index={0}
                    className="flex-1 rounded-md border"
                  />
                  <InputOTPSlot
                    index={1}
                    className="flex-1 rounded-md border"
                  />
                  <InputOTPSlot
                    index={2}
                    className="flex-1 rounded-md border"
                  />
                  <InputOTPSlot
                    index={3}
                    className="flex-1 rounded-md border"
                  />
                  <InputOTPSlot
                    index={4}
                    className="flex-1 rounded-md border"
                  />
                  <InputOTPSlot
                    index={5}
                    className="flex-1 rounded-md border"
                  />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  function SubmitButton() {
    const isLoading = isSendingOtp || isVerifyingOtp;
    const label = step === "email" ? "Send OTP" : "Verify";
    return (
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#07406F]"
      >
        {isLoading ? <PulseMultiple color="white" /> : label}
      </Button>
    );
  }

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
              <EmailFormField />
              <OTPFormField />
              <SubmitButton />

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
