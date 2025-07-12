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


export function ContractIdField ({form , roles  } : {form : UseFormReturn<AddUserFormData> , roles : Role[]}) {


    return (  <FormField
        control={form.control}
        name="regional"
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
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
                
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />)
}