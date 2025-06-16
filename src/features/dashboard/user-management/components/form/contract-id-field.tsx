import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
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
                <SelectItem value="contract1">Contract 1</SelectItem>
                <SelectItem value="contract2">Contract 2</SelectItem>
                <SelectItem value="contract3">Contract 3</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

    
  
  );
}
