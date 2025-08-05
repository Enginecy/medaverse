"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";
import { format } from "date-fns";
import {
  userPermissionFormSchema,
  type UserPermissionFormSchemaData,
} from "@/features/dashboard/admin-settings/schemas/user-permission";
import { getUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { getPermissions } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import { getActionColor } from "@/features/dashboard/admin-settings/components/utils";
import { showSonnerToast } from "@/lib/react-utils";
import {
  assignPermission,
  updateAssignedPermission,
} from "@/features/dashboard/admin-settings/server/actions/admin-settings";
import { PulseMultiple } from "react-svg-spinners";

export function UserPermissionFormDialog<T>({
  resolve,
  data,
}: {
  resolve: (value: T) => void;
  data?: UserPermissionFormSchemaData;
}) {
  const defaultValues: DefaultValues<UserPermissionFormSchemaData> = data ?? {
    user: {
      id: "",
      name: "",
      email: "",
    },
    permission: {
      id: "",
      name: "",
      resource: "",
      action: "",
    },
  };

  const isEditing = !!data;

  const { mutate: mutatePermission, isPending: isAssigning } = useMutation({
    mutationFn: async (data: UserPermissionFormSchemaData) => {
      const result = await assignPermission(data);
      if (result.success) {
        return result.data;
      }
      throw result.error;
    },
    onError: (error) => {
      showSonnerToast({
        message: "Error assigning permission",
        description: error.message,
        type: "error",
      });
    },
    onSuccess: () => {
      showSonnerToast({
        message: "Permission assigned successfully",
        type: "success",
      });
      form.reset();
      resolve(null as T);
    },
  });

  const { mutate: mutateAssignedPermission, isPending: isUpdating } =
    useMutation({
      mutationFn: async (data: UserPermissionFormSchemaData & { id: string }) => { 
        const result = await updateAssignedPermission(data);
        if (result.success) {
          return result.data;
        }
        throw result.error;
      },
      onError: (error) => {
        showSonnerToast({
          message: "Error assigning permission",
          description: error.message,
          type: "error",
        });
      },
      onSuccess: () => {
        showSonnerToast({
          message: "Permission assigned successfully",
          type: "success",
        });
        form.reset();
        resolve(null as T);
      },
    });

  const form = useForm<UserPermissionFormSchemaData>({
    resolver: zodResolver(userPermissionFormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (formData: UserPermissionFormSchemaData) => {
    if (isEditing) {
      mutateAssignedPermission({
        ...formData,
        id: data.id!,
      });
    } else {
      mutatePermission(formData);
    }
  };

  const { data: users, isLoading: usersLoading } = useQuery({
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

  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: () => getPermissions(),
  });

  return (
    <DialogContent className="w-[45%]">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit User Permission" : "Assign User Permission"}
        </DialogTitle>
        <DialogDescription>
          Assign a permission to a user with an optional expiration date.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {/* User Selection */}
            {usersLoading ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">User</p>
                <p className="text-muted-foreground text-sm">
                  Loading users...
                </p>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>User</FormLabel>
                      <Popover modal>
                        <PopoverTrigger asChild>
                          <FormControl className="w-full">
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value?.id && "text-muted-foreground",
                              )}
                            >
                              {field.value?.id ? (
                                <UserChip user={field.value} />
                              ) : (
                                "Select user"
                              )}
                              <ChevronsUpDown
                                className="ml-2 h-4 w-4 shrink-0 opacity-50"
                              />
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
                                {users?.map((user) => (
                                  <CommandItem
                                    value={user.name}
                                    key={user.id}
                                    onSelect={() => {
                                      form.setValue("user", user);
                                      form.trigger("user");
                                    }}
                                  >
                                    <UserChip user={user} />
                                    <Check
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value?.id === user.id
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
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            )}

            {/* Permission Selection */}
            {permissionsLoading ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Permission</p>
                <p className="text-muted-foreground text-sm">
                  Loading permissions...
                </p>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="permission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permission</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedPermission = permissions?.find(
                          (permission) => permission.id === value,
                        );
                        if (selectedPermission) {
                          form.setValue("permission", {
                            id: selectedPermission.id,
                            name: selectedPermission.name,
                            resource: selectedPermission.resource,
                            action: selectedPermission.action,
                          });
                        }
                      }}
                      value={field.value?.id}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a permission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {permissions?.map((permission) => (
                          <SelectItem key={permission.id} value={permission.id}>
                            <div className="flex items-center gap-2">
                              <code
                                className="bg-muted rounded px-2 py-1 text-sm"
                              >
                                {permission.name}
                              </code>
                              <Badge variant="outline">
                                {permission.resource}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={getActionColor(permission.action)}
                              >
                                {permission.action}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Expires At Date Picker */}
          <FormField
            control={form.control}
            name="expiresAt"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Expires At (Optional)</FormLabel>
                <Popover modal>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
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
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  When this permission assignment expires. Leave empty for
                  permanent assignment.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => resolve(null as T)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-22">
              {isEditing ? (
                isUpdating ? (
                  <PulseMultiple color="white" />
                ) : (
                  "Update"
                )
              ) : isAssigning ? (
                <PulseMultiple color="white" />
              ) : (
                "Assign"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
