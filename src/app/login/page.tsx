"use client";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PulseMultiple } from "react-svg-spinners";
import graphics from "public/login-graphics.png";
import logo from "public/meda_health_logo.png";
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
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const pinSchema = z.object({
  code: z.string().min(6),
});
const emailSchema = z.object({
  email: z.string().email(),
});

export default function Home() {
  const params = useSearchParams();
  const [step, setStep] = useState<"email" | "pin">("email");
  const router = useRouter();

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  const pinForm = useForm<z.infer<typeof pinSchema>>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      code: "",
    },
  });

  const { mutate: sendOtp, isPending: isSendingOtp } = useMutation({
    mutationFn: sendEmailOTP,
    onSuccess: () => {
      toast.success("OTP sent to email");
      setStep("pin");
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

  function OTPForm() {
    return (
      <Form {...pinForm}>
        <form
          onSubmit={pinForm.handleSubmit((values) =>
            verifyOtp({
              email: emailForm.getValues("email"),
              code: values.code,
            }),
          )}
          className="flex flex-col items-center gap-4"
        >
          <FormField
            control={pinForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>One-Time Password</FormLabel>
                <FormControl>
                  <InputOTP maxLength={6} {...field}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isVerifyingOtp}>
            {isVerifyingOtp ? <PulseMultiple color="white" /> : "Submit"}
          </Button>
        </form>
      </Form>
    );
  }

  function EmailForm() {
    return (
      <Form {...emailForm}>
        <form
          onSubmit={emailForm.handleSubmit((values) => sendOtp(values.email))}
          className="flex flex-col items-center gap-4"
        >
          <input name="flow" type="hidden" value={"signIn"} />
          <FormField
            control={emailForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">Username</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} className="text-sm" />
                </FormControl>
                <FormMessage className="text-[0.625rem]" />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSendingOtp}>
            {isSendingOtp ? <PulseMultiple color="white" /> : "Submit"}
          </Button>
        </form>
      </Form>
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
        <div className="flex w-[40%] flex-col items-center gap-2">
          <p className="rounded-2xl border px-4 py-1">Login</p>
          <p className="text-text-heading-primary text-2xl font-semibold">
            Sign in to your account
          </p>
          <p className="text-text-body-secondary text-center">
            Please enter your email address below to receive an OTP code. Use
            this code to log in.
          </p>
          <EmailForm />
        </div>
      </div>

      {/* {step === "pin" ? <OTPForm /> : <EmailForm />} */}
    </div>
  );
}

function LoginGraphics() {
  return (
    <div className="bg-primary relative h-full w-1/2 rounded-lg">
      <div
        className="absolute z-10 flex h-full flex-col items-start
          justify-between p-8"
      >
        <Image
          src={logo}
          alt="logo"
          className="brightness-0 invert"
          width={200}
          height={200}
        />
        <p
          className="text-light-blue-500 text-5xl"
          style={{ fontFamily: "Druk Wide Bold Bold" }}
        >
          Your Universe of Medical Insurance Solutions.
        </p>
      </div>
      <div className="relative h-full w-full">
        <Image
          src={graphics}
          alt="login-graphics"
          fill
          className="rounded-lg object-cover object-top"
        />
      </div>
    </div>
  );
}
