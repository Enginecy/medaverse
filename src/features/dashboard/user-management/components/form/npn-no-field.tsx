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
import type { Superiors } from "@/features/dashboard/user-management/server/db/user-management";

export function NpnNumberForm({
  form,
  upLines: upLines,
}: {
  form: UseFormReturn<AddUserFormData>;
  upLines: Superiors[];
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <FormField
        control={form.control}
        name="upline"
        render={({ field }) => (
          <FormItem>
            <FormLabel>UpLine</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="name@example.com" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {upLines.map((upLine) => (
                  <SelectItem key={upLine.id} value={upLine.id}>
                    {upLine.name} ({upLine.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
    </div>
  );
}
