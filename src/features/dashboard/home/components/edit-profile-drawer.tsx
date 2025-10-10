"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown, X } from "lucide-react";
import React from "react";
import { useForm, type DefaultValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { updateAgent } from "@/features/dashboard/user-management/server/actions/user-mangement";
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
import { NpnNumberForm } from "@/features/dashboard/user-management/components/form/npn-no-field";
import { AddressField } from "@/features/dashboard/user-management/components/form/address-field";
import { DobField } from "@/features/dashboard/user-management/components/form/dob-field";
import { EmailField } from "@/features/dashboard/user-management/components/form/email-field";
import { PhoneField } from "@/features/dashboard/user-management/components/form/phone-field";
import { UsernameField } from "@/features/dashboard/user-management/components/form/username-field";
import { FullNameField } from "@/features/dashboard/user-management/components/form/full-name-field";
import type { UserProfile } from "@/features/dashboard/home/server/db/home";

export function EditProfileDrawer({
  resolve,
  user,
}: {
  resolve: (_: unknown) => void;
  user: UserProfile;
}) {
  const isEditing = !!user;
  console.log(user?.npnNumber);

  const defaultValues: DefaultValues<AddUserFormData> = isEditing
    ? {
        fullName: user!.name!,
        username: user!.username!,
        email: user!.email!,
        phoneNumber: user!.phoneNumber!,
        office: user!.office!,
        npnNumber: user!.npnNumber!,
        states: user!.states ?? [],
        role: user!.role?.id ?? "",
        profileImage: user!.avatarUrl!,
        dateOfBirth: new Date(user!.dob!),
      }
    : {
        fullName: "",
        username: "",
        email: "",
        phoneNumber: "",
        office: null,
        npnNumber: "",
        role: "",
        states: [],
        profileImage: new File([], ""),
        dateOfBirth: new Date(),
      };

  const form = useForm<AddUserFormData>({
    resolver: zodResolver(addUserSchema),
    defaultValues,
  });

  const { mutate: submitUpdateAgent, isPending: isUpdating } = useMutation({
    mutationFn: async (data: AddUserFormData) => {
      const result = await updateAgent(data, user!.id!);
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },
    onSuccess: () => {
      showSonnerToast({
        message: "Agent updated successfully",
        type: "success",
      });
      form.reset();
      window.location.reload();
      resolve(true);
    },
    onError: (error) => {
      showSonnerToast({
        message: "Error updating agent",
        description: error.message,
        type: "error",
      });
    },
  });

  const onSubmit = (data: AddUserFormData) => {
    if (isEditing) {
      submitUpdateAgent(data);
    } else {
      submitUpdateAgent(data);
    }
  };

  const removeImage = () => {
    form.setValue("profileImage", new File([], ""));
  };

  const hasImage =
    (form.watch("profileImage") as File).size > 0 ||
    (form.watch("profileImage") as string).length > 0;

  const imageSrc =
    form.getValues("profileImage") instanceof File
      ? URL.createObjectURL(form.getValues("profileImage") as File)
      : (form.getValues("profileImage") as string);

  const isPending = isUpdating;
  return (
    <SheetContent className="overflow-auto px-6 py-5">
      <SheetHeader>
        <SheetTitle>Update your profile</SheetTitle>
      </SheetHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Image Upload */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {hasImage ? (
              <div className="relative">
                <Image
                  src={imageSrc}
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
            <FullNameField form={form} />
          </div>

          {/* Email and Phone Number */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <UsernameField form={form} />
            <EmailField form={form} />
          </div>

          {/* Address and Date of Birth */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <PhoneField form={form} />
            <AddressField form={form} />
          </div>

          {/* Role and Regional */}
          <DobField form={form} />

          <NpnNumberForm form={form} />
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
                            field.value?.length === 0 &&
                              "text-muted-foreground",
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
                          placeholder="Select States..."
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
                                    field.value?.some(
                                      (s) => s.code === state.code,
                                    )
                                  ) {
                                    form.setValue(
                                      "states",
                                      field.value?.filter(
                                        (s) => s.code !== state.code,
                                      ),
                                    );
                                  } else {
                                    form.setValue("states", [
                                      ...(field.value ?? []),
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
                                    field.value?.some(
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
                    {field.value?.map((state) => (
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
                                field.value?.filter(
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
              {isPending ? (
                <PulseMultiple color="white" />
              ) : isEditing ? (
                "Update Agent"
              ) : (
                "Add Agent"
              )}
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </SheetContent>
  );
}
