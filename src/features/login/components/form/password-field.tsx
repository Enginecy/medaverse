import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

export function PasswordFormField({
  form,
}: {
  form: UseFormReturn<{ email: string; code?: string; password?: string }>;
}) {
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem className="w-full min-w-0">
          <FormLabel className="text-sm">Password</FormLabel>
          <FormControl>
            <Input type="password" placeholder="••••••••" {...field} className="w-full min-w-0" />
          </FormControl>
          <FormMessage className="text-[0.625rem]" />
        </FormItem>
      )}
    />
  );
} 