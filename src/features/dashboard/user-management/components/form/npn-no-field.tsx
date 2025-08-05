import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import { Input } from "@/components/ui/input";

export function NpnNumberForm({
  form,
}: {
  form: UseFormReturn<AddUserFormData>;
}) {
  return (
      <FormField
        control={form.control}
        name="npnNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>NPN Number</FormLabel>
            <Input placeholder="Enter NPN Number" {...field} value={field.value ?? ""} />
            <FormMessage />
          </FormItem>
        )}
      />
  );
}
