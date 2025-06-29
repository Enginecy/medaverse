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
import {
  addCarrierSchema,
  type AddCarrierFormData,
} from "@/features/dashboard/carriers/schema/carrier-schema";
import { DropzoneImageFormField } from "@/features/dashboard/user-management/components/form/dropzone-image-form-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export function AddCarrierDrawer({
  resolve,
}: {
  resolve: (_: unknown) => void;
}) {
  const form = useForm<AddCarrierFormData>({
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
    <SheetContent className="w-1/3 p-6">
      <SheetTitle className="text-2xl font-semibold">Add Carrier</SheetTitle>
      <Form {...form}>
        <DropzoneImageFormField form={form}></DropzoneImageFormField>
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <FormControl>
                <Input placeholder="Company Name" type="text" {...field} />
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
                <Input placeholder="www.google.com" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <SheetFooter className="flex items-end">
          <Button className="w-30">Add Carrier</Button>
        </SheetFooter>
      </Form>
    </SheetContent>
  );
}
