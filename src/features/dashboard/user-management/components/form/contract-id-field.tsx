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
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import { roles } from "@/lib/data";
import type { UseFormReturn } from "react-hook-form";

export function ContractIdField({
  form,
}: {
  form: UseFormReturn<AddUserFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="contractId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contract ID</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="name@example.com" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {roles.map(({value , label}) => (
                <SelectItem key={value} value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
