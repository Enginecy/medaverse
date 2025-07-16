import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";

export function AddressField({
  form,
}: {
  form: UseFormReturn<AddUserFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input placeholder="Enter Address" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
