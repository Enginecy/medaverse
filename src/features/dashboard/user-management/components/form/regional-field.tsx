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


export function RegionalField ({form } : {form : UseFormReturn<AddUserFormData>}) {


    return (  <FormField
        control={form.control}
        name="regional"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Regional</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="name@example.com" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="north">North</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="east">East</SelectItem>
                <SelectItem value="west">West</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />)
}