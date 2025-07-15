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

export function UpLineField({
  form,
  upLines,
}: {
  form: UseFormReturn<AddUserFormData>;
  upLines: Superior[];
}) {
  const roleField = form.watch("role");
  return (
    <FormField
      control={form.control}
      name="upLine"
      render={({ field }) => (
        <FormItem>
          <FormLabel>UpLine</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={roleField == null || roleField == undefined}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="James Doe" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {upLines.map((upLine) => (
                <SelectItem key={upLine.id} value={upLine.id}>
                  {upLine.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
