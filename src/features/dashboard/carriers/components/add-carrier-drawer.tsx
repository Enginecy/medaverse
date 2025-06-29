import { Form } from "@/components/ui/form";
import { SheetContent, SheetTitle } from "@/components/ui/sheet";
import { addCarrierSchema, type addCarrierFormData } from "@/features/dashboard/carriers/schema/carrier-schema";
import { DropzoneImageFormField } from "@/features/dashboard/user-management/components/form/dropzone-image-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function AddCarrierDrawer({
  resolve,
}: {
  resolve: (_: unknown) => void;
}) {
    const form = useForm<addCarrierFormData>({
        resolver: zodResolver(addCarrierSchema),
        defaultValues: {
            image: "",
            companyName: "",
            phoneNumber: "",
            email: "",
            website: "",
        },
      });
  return (
    <SheetContent  className="p-6">
      <SheetTitle className="text-2xl font-semibold">Add Carrier</SheetTitle>
      <Form {...form} >

      <DropzoneImageFormField form={form}> </DropzoneImageFormField>
      </Form>
    </SheetContent>
  );
}
