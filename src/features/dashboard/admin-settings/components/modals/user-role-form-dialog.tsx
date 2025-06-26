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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, CalendarIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type DefaultValues } from "react-hook-form";
import { format } from "date-fns";
import {
  userRoleFormSchema,
  type UserRoleFormSchemaData,
} from "@/features/dashboard/admin-settings/schemas/user-role";
import { getUsers } from "@/features/dashboard/user-management/server/db/user-management";
import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import {
  assignRole,
  updateAssignedRole,
} from "@/features/dashboard/admin-settings/server/actions/admin-settings";
import { showSonnerToast } from "@/lib/react-utils";
import { PulseMultiple } from "react-svg-spinners";

export function UserRoleFormDialog<T>({
  resolve,
  data,
}: {
  resolve: (value: T) => void;
  data?: UserRoleFormSchemaData;
}) {
  const defaultValues: DefaultValues<UserRoleFormSchemaData> = data ?? {
    user: {
      id: "",
      name: "",
      email: "",
    },
    role: {
      id: "",
      name: "",
      code: "",
    },
  };

  const isEditing = !!data;

  const { mutate: mutateRole, isPending: isAssigning } = useMutation({
    mutationFn: assignRole,
    onError: (error) => {
      showSonnerToast({
        message: "Error assigning role",
        description: error.message,
        type: "error",
      });
    },
    onSuccess: () => {
      showSonnerToast({
        message: "Role assigned successfully",
        type: "success",
      });
      form.reset();
      resolve(null as T);
    },
  });

  const { mutate: mutateAssignedRole, isPending: isUpdating } = useMutation({
    mutationFn: updateAssignedRole,
    onError: (error) => {
      showSonnerToast({
        message: "Error assigning role",
        description: error.message,
        type: "error",
      });
    },
    onSuccess: () => {
      showSonnerToast({
        message: "Role assigned successfully",
        type: "success",
      });
      resolve(null as T);
    },
  });

  const form = useForm<UserRoleFormSchemaData>({
    resolver: zodResolver(userRoleFormSchema),
    defaultValues: defaultValues,
  });

  const onSubmit = (data: UserRoleFormSchemaData) => {
    if (isEditing) {
      mutateAssignedRole(data);
    } else {
      mutateRole(data);
    }
    
  };

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      getUsers().then((users) =>
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email!,
          avatar: user.avatarUrl,
        })),
      ),
  });
  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getRoles(),
  });

  return (
    <DialogContent className="w-1/3">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit User Role" : "Assign User Role"}
        </DialogTitle>
        <DialogDescription>
          Assign a role to a user with an optional expiration date.
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

            {/* Role Selection */}
            {rolesLoading ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-medium">Role</p>
                <p className="text-muted-foreground text-sm">
                  Loading roles...
                </p>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        const selectedRole = roles?.find(
                          (role) => role.id === value,
                        );
                        if (selectedRole) {
                          form.setValue("role", {
                            id: selectedRole.id,
                            name: selectedRole.name,
                            code: selectedRole.code,
                          });
                        }
                      }}
                      value={field.value?.id}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{role.name}</span>
                              <span className="text-muted-foreground text-xs">
                                {role.code}
                              </span>
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
                  When this role assignment expires. Leave empty for permanent
                  assignment.
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
