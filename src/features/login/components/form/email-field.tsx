import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import Input from "@mui/material/Input";
import type { UseFormReturn } from "react-hook-form";

export function EmailFormField({
  step,
  form,
}: {
  step: "email" | "pin";
  form: UseFormReturn<{ email: string; code?: string }>;
}) {
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
