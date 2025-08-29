'use client';
import { SheetContent } from "@/components/ui/sheet";
import { getRoles } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import type { UserProfile } from "@/features/dashboard/home/server/db/home";
import { addUserSchema, type AddUserFormData } from "@/features/dashboard/user-management/schemas/add-user-schema";
import { createAgent, updateAgent } from "@/features/dashboard/user-management/server/actions/user-mangement";
import { getAboveSuperiors } from "@/features/dashboard/user-management/server/db/user-management";
import { showSonnerToast } from "@/lib/react-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, type DefaultValues } from "react-hook-form";

export function EditProfileDrawer(
    { resolve, user }: { resolve: (_: unknown) => void  , user: UserProfile}
) {
  const isEditing = !!user;
  
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
    const queryClient = useQueryClient();
  
    const form = useForm<AddUserFormData>({
      resolver: zodResolver(addUserSchema),
      defaultValues,
    });
  
    const { data: roles, isPending: isLoadingRoles } = useQuery({
      queryKey: ["roles"],
      queryFn: getRoles,
    });
    const selectedRole = roles?.find((role) => role.id === form.watch("role"));
    const getSuperiorsQueryOptions = queryOptions({
      queryKey: ["superiors", selectedRole?.id],
      queryFn: () => getAboveSuperiors(selectedRole!),
      enabled: !!selectedRole,
      refetchOnWindowFocus: false,
    });
    const { data: aboveSuperiors, isLoading: isLoadingSuperiors } = useQuery(
      getSuperiorsQueryOptions,
    );
    
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
        closeDrawer();
        queryClient.invalidateQueries({
          queryKey: ["users"],
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
  
    const isPending =  isUpdating;
  return (
    <SheetContent> 
        
    </SheetContent>
  )
}

function closeDrawer() {
  throw new Error("Function not implemented.");
}
