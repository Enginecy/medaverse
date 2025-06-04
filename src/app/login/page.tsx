"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
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
} from "~/components/ui/form";
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

const pinSchema = z.object({
  code: z.string().min(6),
});
const emailSchema = z.object({
  email: z.string().email(),
});

export default function Home() {
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
                <FormMessage className="text-[10px]" />
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
    <div className="flex h-screen w-full items-center justify-center bg-blue-500">
      <div className="flex h-1/3 w-1/4 flex-col items-center justify-center gap-4 rounded-2xl bg-white px-3 py-40 text-black shadow-2xl shadow-blue-950">
        <p className="font-bold capitalize">sign in</p>

        {step === "pin" ? <OTPForm /> : <EmailForm />}
      </div>
    </div>
  );
}
