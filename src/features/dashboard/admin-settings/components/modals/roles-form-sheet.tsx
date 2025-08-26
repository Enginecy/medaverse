"use client";
import { Button } from "@/components/ui/button";
import {
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetHeader,
} from "@/components/ui/sheet";
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  rolesFormSchema,
  type RolesFormSchemaData,
} from "@/features/dashboard/admin-settings/schemas/roles";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { getActionColor } from "@/features/dashboard/admin-settings/components/utils";
import { getUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import { showSonnerToast } from "@/lib/react-utils";
import { PulseMultiple } from "react-svg-spinners";
import {
  addRole,
  editRole,
} from "@/features/dashboard/admin-settings/server/actions/admin-settings";

export function RolesFormSheet<T>({
  resolve,
  data,
}: {
  resolve: (value: T) => void;
  data?: RolesFormSchemaData;
}) {
  const defaultValues: DefaultValues<RolesFormSchemaData> = data ?? {
    permissions: [],
    users: [],
    status: "active" as const,
  };

  const isEditing = !!data;

  const form = useForm<RolesFormSchemaData>({
    resolver: zodResolver(rolesFormSchema),
    defaultValues: defaultValues,
  });
  const { mutate: edit, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      formData,
    }: {
      formData: RolesFormSchemaData & { id: string };
    }) => {
      const result = await editRole(formData);
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },

    onSuccess: () => {
      showSonnerToast({
        message: "Role updated successfully.",
        description: "You can now assign this role to users.",
        type: "success",
      });
      resolve({ ...form.getValues(), id: data?.id } as T);
      form.reset();
    },
    onError: (error) => {
      showSonnerToast({
        message: "An error occurred while updating the role.",

        type: "error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const { mutate: add, isPending: isAdding } = useMutation({
    mutationFn: async (formData: RolesFormSchemaData) => {
      const result = await addRole(formData);
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },

    onSuccess: () => {
      showSonnerToast({
        message: "Role added successfully.",
        description: "You can now assign this role to users.",
        type: "success",
      });
      resolve({ ...form.getValues(), id: data?.id } as T);
      form.reset();
    },
    onError: (error) => {
      showSonnerToast({
        message: "An error occurred while saving the role.",
        type: "error",
        description: error instanceof Error ? error.message : "Unknown error",
      });
    },
  });

  const onSubmit = (formData: RolesFormSchemaData) => {
    if (isEditing) {
      edit({
        formData: {
          ...formData,
          id: data?.id ?? "",
        },
      });
    } else {
      add(formData);
    }
  };
  const { data: permissions } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissions(),
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      getUsers().then((users) =>
        users.map((user) => ({
          id: user.userId,
          name: user.name,
          email: user.email!,
          avatar: user.avatarUrl,
        })),
      ),
  });

  return (
    <SheetContent className="overflow-y-auto p-6">
      <SheetHeader className="px-0">
        <SheetTitle>Roles</SheetTitle>
        <SheetDescription>
          Roles are used to group permissions and control access to resources.
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sales Manager"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The name is the name of the role.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="sales_manager"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The code is the code of the role. It is used to identify the
                    role in the system. It should be unique and
                    lower_snake_case.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value.toString()}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from({ length: 11 }, (_, i) => i).map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The level is the role of the user. 0 is the lowest level and
                    10 is the highest level. The level is used to determine the
                    hierarchy of the user.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {["active", "disabled"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The status whether the role is active or disabled.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 items-start gap-4">
            {!permissions ? (
              <div className="flex flex-col gap-2">
                <p>Loading permissions...</p>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="permissions"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Permissions</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                field.value?.length === 0 &&
                                  "text-muted-foreground",
                              )}
                            >
                              {(field.value?.length ?? 0) === 0
                                ? "Select permissions"
                                : field.value?.length === 1
                                  ? `${field.value?.[0]?.name}`
                                  : `${field.value?.length} permissions selected`}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search permissions..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No permissions found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  key={"select-all"}
                                  className="text-primary-600
                                    hover:bg-primary-100"
                                  onSelect={() => {
                                    if (
                                      field.value.length === permissions!.length
                                    ) {
                                      form.setValue("permissions", []);
                                    } else {
                                      form.setValue(
                                        "permissions",
                                        permissions!,
                                      );
                                      form.trigger("permissions");
                                    }
                                  }}
                                >
                                  {field.value?.length === permissions!.length
                                    ? "Deselect all "
                                    : "Select all "}
                                </CommandItem>
                                {permissions!.map((permission) => (
                                  <CommandItem
                                    value={permission.name}
                                    key={permission.id}
                                    onSelect={() => {
                                      if (
                                        field.value.some(
                                          (s) => s.id === permission.id,
                                        )
                                      ) {
                                        form.setValue(
                                          "permissions",
                                          field.value.filter(
                                            (s) => s.id !== permission.id,
                                          ),
                                        );
                                      } else {
                                        form.setValue("permissions", [
                                          ...field.value,
                                          permission,
                                        ]);
                                      }
                                      form.trigger("permissions");
                                    }}
                                  >
                                    {permission.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value?.some(
                                          (s) => s.id === permission.id,
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
                        {field.value.map((permission) => (
                          <div
                            key={permission.id}
                            className={cn(
                              `bg-primary-100 text-primary-600 flex items-start
                                justify-between rounded-md p-2`,
                              getActionColor(permission.action!),
                            )}
                          >
                            <div className="flex flex-col items-center">
                              <p className="text-sm font-semibold">
                                {permission.resource}
                              </p>
                              <p className="text-xs">{permission.action}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  form.setValue(
                                    "permissions",
                                    field.value.filter(
                                      (s) => s.id !== permission.id,
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
            )}

            {!users ? (
              <div className="flex flex-col gap-2">
                <p>Loading users...</p>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="users"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Users</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-full justify-between",
                                field.value?.length === 0 &&
                                  "text-muted-foreground",
                              )}
                            >
                              {(field.value?.length ?? 0) === 0
                                ? "Select users"
                                : field.value?.length === 1
                                  ? `${field.value?.[0]?.name}`
                                  : `${field.value?.length} users selected`}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search users..."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No users found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  key={"select-all"}
                                  className="text-primary-600
                                    hover:bg-primary-100"
                                  onSelect={() => {
                                    if (field.value.length === users!.length) {
                                      form.setValue("users", []);
                                    } else {
                                      form.setValue("users", users!);
                                      form.trigger("users");
                                    }
                                  }}
                                >
                                  {field.value?.length === users!.length
                                    ? "Deselect all "
                                    : "Select all "}
                                </CommandItem>
                                {users!.map((user) => (
                                  <CommandItem
                                    value={user.name}
                                    key={user.id}
                                    onSelect={() => {
                                      if (
                                        field.value.some(
                                          (s) => s.id === user.id,
                                        )
                                      ) {
                                        form.setValue(
                                          "users",
                                          field.value.filter(
                                            (s) => s.id !== user.id,
                                          ),
                                        );
                                      } else {
                                        form.setValue("users", [
                                          ...field.value,
                                          user,
                                        ]);
                                      }
                                      form.trigger("users");
                                    }}
                                  >
                                    <UserChip user={user} />
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        field.value?.some(
                                          (s) => s.id === user.id,
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
                        {field.value?.map((user) => (
                          <div
                            key={user.id}
                            className={cn(
                              `bg-primary-100 text-primary-600 flex items-start
                                justify-between rounded-md p-2`,
                            )}
                          >
                            <UserChip user={user} />
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  form.setValue(
                                    "users",
                                    field.value.filter((s) => s.id !== user.id),
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
            )}
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description of the role"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isUpdating || isAdding}>
            <>
              {isUpdating || isAdding ? (
                <PulseMultiple color="white" />
              ) : isEditing ? (
                "Update"
              ) : (
                "Save"
              )}
            </>
          </Button>
        </form>
      </Form>
    </SheetContent>
  );
}
