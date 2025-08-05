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
import type {  User } from "@/features/dashboard/user-management/server/db/user-management";


export function RegionalField ({form  , regionalDirs } : {form : UseFormReturn<AddUserFormData> , regionalDirs : User[]}) {


    return (  <FormField
        control={form.control}
        name="regional"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Regional</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value ?? ""}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Regional Director" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {regionalDirs.map((regional) => (
                  <SelectItem key={regional.id} value={regional.id}>
                    {regional.name} 
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />)
}