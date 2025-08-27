"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SheetContent, SheetFooter, SheetTitle } from "@/components/ui/sheet";
import { CarrierDropzoneImageFormField } from "@/features/dashboard/carriers/components/carrier-drop-zone";
import {
  addCarrierSchema,
  type AddCarrierFormData,
} from "@/features/dashboard/carriers/schema/carrier-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showSonnerToast } from "@/lib/react-utils";
import { PulseMultiple } from "react-svg-spinners";
import {
  createCarrier,
  updateCarrier,
} from "@/features/dashboard/carriers/server/actions/carriers";
import type { Carrier } from "@/features/dashboard/carriers/server/db/carriers";
import { DeleteCarrierButton } from "@/features/dashboard/carriers/components/delete-carrier-button";
import { usePermissions } from "@/lib/supabase/roles-component";

export function CarrierDrawer({
  resolve,
  fieldValues,
}: {
  resolve: (_: unknown) => void;
  fieldValues?: Carrier;
}) {
  const defaultValues =
    fieldValues != null
      ? {
          carrierImage: fieldValues.imageUrl,
          companyName: fieldValues.name,
          phoneNumber: fieldValues.phoneNumber ?? undefined,
          email: fieldValues.email ?? undefined,
          website: fieldValues.website,
          code: fieldValues.code ?? undefined,
        }
      : {
          carrierImage: new File([], ""),
          companyName: "",
          phoneNumber: "",
          email: "",
          website: "",
          code: "",
        };

  const isEditing = fieldValues != null;

  const form = useForm<AddCarrierFormData>({
    resolver: zodResolver(addCarrierSchema),
    defaultValues: defaultValues,
  });
  const removeImage = () => {
    form.setValue("carrierImage", new File([], ""));
  };

  const hasImage =
    (form.watch("carrierImage") as File).size > 0 ||
    (form.watch("carrierImage") as string).length > 0;

  const imageSrc =
    form.getValues("carrierImage") instanceof File
      ? URL.createObjectURL(form.getValues("carrierImage") as File)
      : (form.getValues("carrierImage") as string);

  const queryClient = useQueryClient();

  const { mutate: submitCarrierData, isPending: isLoading } = useMutation({
    mutationFn: async (data: AddCarrierFormData) => {
      if (isEditing) {
        const result = await updateCarrier(data, fieldValues!.id!);
        if (result.success) {
          return result.data;
        }
        throw result.error;
      } else {
        const result = await createCarrier(data);
        if (result.success) {
          return result.data;
        }
        throw result.error;
      }
    },
    onSuccess: () => {
      showSonnerToast({
        message: isEditing
          ? "Carrier updated successfully!"
          : "Carrier added successfully!",
        type: "success",
      });
      queryClient.invalidateQueries({ queryKey: ["carriers"] });
      form.reset();
      resolve({ success: false });
    },
    onError: (actionError) => {
      showSonnerToast({
        message: isEditing ? "Failed to update carrier" : actionError.message,
        type: "error",
        description: actionError.details,
      });
    },
  });
  const onSubmit = (data: AddCarrierFormData) => {
    submitCarrierData(data);
  };

  const {
    hasAllPermissions,
    isLoading: isLoadingPermissions,
  } = usePermissions();

  const canModifyCarrier = hasAllPermissions([
    "companies:create",
    "companies:update",
  ]);

  if (isLoadingPermissions) {
    return <div>Loading...</div>;
  }
  return (
    <SheetContent className="overflow-auto p-6">
      <SheetTitle className="text-2xl font-semibold">Add Carrier</SheetTitle>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Form {...form}>
          {hasImage ? (
            <div className="relative">
              <Image
                src={imageSrc!}
                alt="Profile preview"
                className="mx-auto h-48 w-69 rounded-lg object-cover"
                width={192}
                height={162}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeImage}
                disabled={!canModifyCarrier}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <CarrierDropzoneImageFormField
              form={form}
              disabled={!canModifyCarrier}
            ></CarrierDropzoneImageFormField>
          )}

          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Company Name" 
                    type="text" 
                    disabled={!canModifyCarrier}
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
                    placeholder="(xxx) 123-4567"
                    type="tel"
                    inputMode="tel"
                    disabled={!canModifyCarrier}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@domain.com"
                    type="text"
                    disabled={!canModifyCarrier}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="CIA" 
                    type="text" 
                    disabled={!canModifyCarrier}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company website</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="www.google.com" 
                    type="text" 
                    disabled={!canModifyCarrier}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SheetFooter
            className="justify-justify-end flex flex-row items-end p-0"
          >
            {isEditing ? <DeleteCarrierButton id={fieldValues.id} disabled={!canModifyCarrier} /> : null}
            <Button 
              className="ml-auto w-30" 
              type="submit"
              disabled={!canModifyCarrier || isLoading}
            >
              {isLoading ? (
                <PulseMultiple className="h-4 w-4 animate-spin" color="white" />
              ) : isEditing ? (
                "Update Carrier"
              ) : (
                "Create Carrier"
              )}
            </Button>
          </SheetFooter>
        </Form>
      </form>
    </SheetContent>
  );
}
