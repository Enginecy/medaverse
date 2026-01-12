import React from "react";
import { type UseFormReturn } from "react-hook-form";

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
import { type AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import type { Role } from "@/features/dashboard/admin-settings/server/db/admin-settings";

export function RoleField({
  form,
  roles,
  onChange,
}: {
  form: UseFormReturn<AddUserFormData>;
  roles: Role[];
  onChange: (value: string) => void;
}) {
  const sortedRoles = roles.sort((a, b) => a.level - b.level);
  return (
    <FormField
      control={form.control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contract ID</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              onChange(value);
            }}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {sortedRoles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
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
