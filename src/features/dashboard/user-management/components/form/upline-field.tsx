"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import type { UseFormReturn } from "react-hook-form";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import type { Superior } from "@/features/dashboard/user-management/server/db/user-management";

export function UpLineField({
  form,
  upLines,
}: {
  form: UseFormReturn<AddUserFormData>;
  upLines?: Superior[];
}) {
  const [open, setOpen] = useState(false);
  const roleField = form.watch("role");

  const isDisabled =
    roleField == null ||
    roleField === undefined ||
    !upLines ||
    upLines.length === 0;

  return (
    <FormField
      control={form.control}
      name="upLine"
      render={({ field }) => {
        const selectedUpline = upLines?.find(
          (upLine) => upLine.userId === field.value
        );

        return (
          <FormItem className="flex flex-col">
            <FormLabel>UpLine</FormLabel>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={isDisabled}
                    className={cn(
                      "w-full justify-between font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {selectedUpline?.name ??
                      (upLines?.length === 0
                        ? "No UpLines available"
                        : "Select UpLine")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder="Search upline..." />
                  <CommandList
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <CommandEmpty>No upline found.</CommandEmpty>
                    <CommandGroup>
                      {upLines?.map((upLine) => (
                        <CommandItem
                          key={upLine.userId}
                          value={upLine.name}
                          onSelect={() => {
                            field.onChange(upLine.userId);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === upLine.userId
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {upLine.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
