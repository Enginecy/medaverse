import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import type { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Offices } from "@/lib/data";

export function AddressField({
  form,
}: {
  form: UseFormReturn<AddUserFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="office"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value ?? undefined}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Office" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Offices.map((office) => (
                  <SelectItem key={office} value={office}>
                    {office}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
