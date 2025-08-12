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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  PlusIcon,
  TrashIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useForm } from "react-hook-form";
import {
  addSaleSchema,
  type AddSaleFormData,
} from "@/features/dashboard/sales/schemas/add-sale-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useReducer } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductsAndCompanies } from "@/features/dashboard/sales/server/db/sales";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addSale } from "@/features/dashboard/sales/server/actions/sales";
import { useAuth } from "@/hooks/auth";
import { toast } from "sonner";
import { PulseMultiple } from "react-svg-spinners";

export function AddSaleDrawer({
  closeDrawer,
}: {
  closeDrawer: (_: unknown) => void;
}) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useForm<AddSaleFormData>({
    resolver: zodResolver(addSaleSchema),
    defaultValues: {
      clientName: "",
      date: new Date(),
      products: [],
    },
  });

  const { data: productsAndCompanies } = useQuery({
    queryKey: ["products-and-companies"],
    queryFn: getProductsAndCompanies,
  });

  const addProduct = () => {
    form.setValue("products", [
      ...form.getValues("products"),
      {
        productId: "",
        companyId: "",
        premium: undefined as unknown as number,
        policyNumber: "",
      },
    ]);
    form.clearErrors("products");
    forceUpdate();
  };
  const removeProduct = (index: number) => {
    const products = form.getValues("products");
    form.setValue(
      "products",
      products.filter((_, i) => i !== index),
    );
    if (form.getValues("products").length === 0) {
      form.setError("products", {
        message: "At least one product is required",
      });
    }
    forceUpdate();
  };

  const { user } = useAuth();

  const { mutate: submitNewSale, isPending } = useMutation({
    mutationFn: async (data: AddSaleFormData) => {
      const result = await addSale(user!.user.id, data);
        if(result.success) {
          return result.data;
        }
        throw result.error;
    },
    onSuccess: () => {
      toast.success("Sale added successfully");
      closeDrawer(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data: AddSaleFormData) => {
    submitNewSale(data);
  };
  return (
    <SheetContent className="w-1/3 overflow-y-scroll p-6">
      <SheetHeader>
        <SheetTitle>Add New Sale</SheetTitle>
      </SheetHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="clientName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="Chris Martin" type="text" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Effective Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
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
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          {form.getValues("products").map((_, index) => (
            <Card key={index} className="bg-transparent shadow-none">
              <CardHeader>
                <CardTitle
                  className="flex justify-between text-lg font-semibold"
                >
                  <p>Product {index + 1}</p>

                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="border-destructive/30 text-destructive border"
                    onClick={() => removeProduct(index)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`products.${index}.productId`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Product</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? productsAndCompanies?.products.find(
                                        (product) => product.id === field.value,
                                      )?.name
                                    : "Select product"}
                                  <ChevronsUpDown
                                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search product..." />
                                <CommandList>
                                  <CommandEmpty>No product found.</CommandEmpty>
                                  <CommandGroup>
                                    {productsAndCompanies?.products.map(
                                      (product) => (
                                        <CommandItem
                                          value={product.name}
                                          key={product.id}
                                          onSelect={() => {
                                            form.setValue(
                                              `products.${index}.productId`,
                                              product.id,
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              product.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {product.name}
                                        </CommandItem>
                                      ),
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="col-span-6">
                    <FormField
                      control={form.control}
                      name={`products.${index}.companyId`}
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Company</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value
                                    ? productsAndCompanies?.companies.find(
                                        (company) => company.id === field.value,
                                      )?.name
                                    : "Select company"}
                                  <ChevronsUpDown
                                    className="ml-2 h-4 w-4 shrink-0 opacity-50"
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0">
                              <Command>
                                <CommandInput placeholder="Search company..." />
                                <CommandList>
                                  <CommandEmpty>No company found.</CommandEmpty>
                                  <CommandGroup>
                                    {productsAndCompanies?.companies.map(
                                      (company) => (
                                        <CommandItem
                                          value={company.name}
                                          key={company.id}
                                          onSelect={() => {
                                            form.setValue(
                                              `products.${index}.companyId`,
                                              company.id,
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              company.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0",
                                            )}
                                          />
                                          {company.name}
                                        </CommandItem>
                                      ),
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={`products.${index}.premium`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Premium</FormLabel>
                      <FormControl>
                        <Input placeholder="1500$" type="number" {...field} />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`products.${index}.policyNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="141-2520-XXX"
                          type="text"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}

          <FormField
            control={form.control}
            name="products"
            render={() => (
              <FormItem>
                <Button
                  variant="default"
                  type="button"
                  disabled={isPending}
                  onClick={addProduct}
                  className="bg-light-blue-300 text-primary border-accent
                    hover:text-primary-foreground h-12 w-full border
                    border-dashed"
                >
                  Add Product
                </Button>
                <FormMessage />
              </FormItem>
            )}
          />

          <footer className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <PulseMultiple color="white" />
              ) : (
                <>
                  <PlusIcon className="h-4 w-4" />
                  Add Sale
                </>
              )}
            </Button>
          </footer>
        </form>
      </Form>
    </SheetContent>
  );
}
