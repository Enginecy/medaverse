import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { Check, ChevronsUpDown, Command, X } from "lucide-react";
import { states } from "@/lib/data";
import type { UseFormReturn } from "react-hook-form";
import type { AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";

export function StatesField({
  form,
}: {
  form: UseFormReturn<AddUserFormData>;
}) {
  return (
    <FormField
      control={form.control}
      name="states"
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col">
            <FormLabel>States</FormLabel>
            <Popover modal>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-1/2 justify-between",
                      field.value?.length === 0 && "text-muted-foreground",
                    )}
                  >
                    {field.value?.length === 0
                      ? "Select states"
                      : field.value?.length === 1
                        ? `${field.value[0]?.name}`
                        : `${field.value?.length} states selected`}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search states..."
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No states found.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        key={"select-all"}
                        className="text-primary-600 hover:bg-primary-100"
                        onSelect={() => {
                          if (field.value?.length === states.length) {
                            form.setValue("states", []);
                          } else {
                            form.setValue("states", states);
                            form.trigger("states");
                          }
                        }}
                      >
                        {field.value?.length === states.length
                          ? "Deselect all "
                          : "Select all "}
                      </CommandItem>
                      {states.map((state) => (
                        <CommandItem
                          value={state.name}
                          key={state.code}
                          onSelect={() => {
                            if (
                              field.value?.some((s) => s.code === state.code)
                            ) {
                              form.setValue(
                                "states",
                                field.value?.filter(
                                  (s) => s.code !== state.code,
                                ),
                              );
                            } else {
                              form.setValue("states", [...(field.value ?? []), state]);
                            }
                            form.trigger("states");
                          }}
                        >
                          {state.name}
                          <Check
                            className={cn(
                              "ml-auto",
                              field.value?.some((s) => s.code === state.code)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription className="flex flex-wrap gap-2">
              {/* build chip for each state */}
              {field.value?.map((state) => (
                <div
                  key={state.code}
                  className="bg-primary-100 text-primary-600 flex items-start
                    justify-between rounded-md p-2"
                >
                  <div className="flex flex-col items-center">
                    <p className="text-sm font-semibold">{state.code}</p>
                    <p className="text-xs">{state.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        form.setValue(
                          "states",
                          field.value?.filter((s) => s.code !== state.code),
                        );
                      }}
                    >
                      <X className="text-destructive h-2 w-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
