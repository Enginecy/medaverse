"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  ChevronsUpDown,
  X,
} from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  addUserSchema,
  type AddUserFormData,
} from "@/features/dashboard/user-management/schemas/add-user-schema";
import { DropzoneImageFormField } from "@/features/dashboard/user-management/components/form/dropzone-image-form-field";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createAgent } from "@/features/dashboard/user-management/server/actions/user-mangement";
import { PulseMultiple } from "react-svg-spinners";
import { showSonnerToast } from "@/lib/react-utils";
import { states } from "@/lib/data";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export function AddUserDrawer({
  closeDrawer,
}: {
  closeDrawer: (value?: unknown) => void;
}) {
  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      address: "",
      contractId: "",
      regional: "",
      upline: "",
      npnNumber: "",
      states: [],
      profileImage: new File([], ""),
      dateOfBirth: new Date(),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      showSonnerToast({
        message: "New agent added successfully",
        description:
          "An email will be sent to the agent with their login instructions",
        type: "success",
      });
      closeDrawer();
    },
    onError: (error: Error) => {
      showSonnerToast({
        message: "Failed to add agent.",
        description: error.message,
        type: "error",
      });
    },
  });
  const onSubmit = (data: AddUserFormData) => {
    mutate(data);
  };

  const removeImage = () => {
    form.setValue("profileImage", new File([], ""));
  };

  return (
    <SheetContent className="w-140 overflow-auto px-6 py-5">
      <SheetHeader>
        <SheetTitle>Add New Agent</SheetTitle>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {form.watch("profileImage").size ? (
              <div className="relative">
                <Image
                  src={URL.createObjectURL(form.watch("profileImage"))}
                  alt="Profile preview"
                  className="mx-auto h-48 w-48 rounded-lg object-cover"
                  width={182}
                  height={162}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                  onClick={removeImage}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <DropzoneImageFormField form={form} />
            )}
            {/* Full Name and Username */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email and Phone Number */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="tel"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Address and Date of Birth */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>{" "}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Contract ID and Regional */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="contractId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract ID</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            <FormField
              control={form.control}
              name="regional"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Regional</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
            />
          </div>

          {/* Upline and NPN Number */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="upline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upline</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="name@example.com" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="upline1">Upline 1</SelectItem>
                      <SelectItem value="upline2">Upline 2</SelectItem>
                      <SelectItem value="upline3">Upline 3</SelectItem>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

          {/* States */}
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
                            field.value.length === 0 && "text-muted-foreground",
                          )}
                        >
                          {field.value.length === 0
                            ? "Select states"
                            : field.value.length === 1
                              ? `${field.value[0]?.name}`
                              : `${field.value.length} states selected`}
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
                                if (field.value.length === states.length) {
                                  form.setValue("states", []);
                                } else {
                                  form.setValue("states", states);
                                  form.trigger("states");
                                }
                              }}
                            >
                              {field.value.length === states.length
                                ? "Deselect all "
                                : "Select all "}
                            </CommandItem>
                            {states.map((state) => (
                              <CommandItem
                                value={state.name}
                                key={state.code}
                                onSelect={() => {
                                  if (
                                    field.value.some(
                                      (s) => s.code === state.code,
                                    )
                                  ) {
                                    form.setValue(
                                      "states",
                                      field.value.filter(
                                        (s) => s.code !== state.code,
                                      ),
                                    );
                                  } else {
                                    form.setValue("states", [
                                      ...field.value,
                                      state,
                                    ]);
                                  }
                                  form.trigger("states");
                                }}
                              >
                                {state.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value.some(
                                      (s) => s.code === state.code,
                                    )
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
                    {field.value.map((state) => (
                      <div
                        key={state.code}
                        className="bg-primary-100 text-primary-600 flex
                          items-start justify-between rounded-md p-2"
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
                                field.value.filter(
                                  (s) => s.code !== state.code,
                                ),
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

          <SheetFooter className="w-auto p-0">
            <Button
              variant={"default"}
              type="submit"
              disabled={isPending}
              className="bg-primary-600 w-full text-white"
            >
              {isPending ? <PulseMultiple color="white" /> : "Add Agent"}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
}
