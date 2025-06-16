import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import type { UseFormReturn } from "react-hook-form";

export function EmailField({ form }: { form: UseFormReturn<AddUserFormData> }) {
  return (
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="name@example.com" type="email" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
