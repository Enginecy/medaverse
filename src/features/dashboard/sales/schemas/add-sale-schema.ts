import { z } from "zod";

export const addSaleSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  date: z.date(),
  products: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        companyId: z.string().min(1, "Company is required"),
        premium: z.coerce
          .number({
            invalid_type_error: "Premium is required",
          })
          .min(1, "Premium is required"),
        policyNumber: z.string().min(1, "Policy number is required"),
      }),
    )
    .min(1, "Please add at least one product"),
});

export type AddSaleFormData = z.infer<typeof addSaleSchema>;
