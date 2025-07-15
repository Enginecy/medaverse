import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import type { Superior } from "@/features/dashboard/user-management/server/db/user-management";

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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="name@example.com" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="npn1">NPN-001</SelectItem>
                <SelectItem value="npn2">NPN-002</SelectItem>
                <SelectItem value="npn3">NPN-003</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
  );
}
