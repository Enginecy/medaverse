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

export function FullNameField({
  form,
}: {
  form: UseFormReturn<AddUserFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Full name</FormLabel>
            <FormControl>
            <Input placeholder="Enter full name" {...field} />
            </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
