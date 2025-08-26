import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import type { UseFormReturn } from "react-hook-form";

 export function OTPFormField({step , form}:{
    step: "email" | "pin",
    form: UseFormReturn<{email : string , code?: string, password?: string}>
  }) {
    if (step !== "pin") return null;

    return (
      <FormField
        control={form.control}
        name="code"
        render={({ field }) => (
          <FormItem className="w-full min-w-0">
            <FormLabel className="text-sm">One-Time Password</FormLabel>
            <FormControl className="w-full">
              <InputOTP maxLength={6} {...field} className="w-full">
                <InputOTPGroup className="w-full justify-between gap-1 sm:gap-1.5">
                  <InputOTPSlot
                    index={0}
                    className="flex-1 rounded-md border min-w-8 h-12"
                  />
                  <InputOTPSlot
                    index={1}
                    className="flex-1 rounded-md border min-w-8 h-12"
                  />
                  <InputOTPSlot
                    index={2}
                    className="flex-1 rounded-md border min-w-8 h-12"
                  />
                  <InputOTPSlot
                    index={3}
                    className="flex-1 rounded-md border min-w-8 h-12"
                  />
                  <InputOTPSlot
                    index={4}
                    className="flex-1 rounded-md border min-w-8 h-12"
                  />
                  <InputOTPSlot
                    index={5}
                    className="flex-1 rounded-md border min-w-8 h-12"
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