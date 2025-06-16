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

export function PhoneField({ form }: { form: UseFormReturn<AddUserFormData> }) {
  return (
    <FormField
      control={form.control}
      name="phoneNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Phone Number</FormLabel>
          <FormControl>
            <Input placeholder="name@example.com" type="tel" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
