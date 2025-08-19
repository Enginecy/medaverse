import z from "zod";

export const addCarrierSchema = z.object({
  carrierImage: z.union([z.instanceof(File), z.string().url("Please upload a valid image")]),
  companyName: z.string(),
  phoneNumber: z.string(),
  email: z.string().email("Please enter a valid email address"),
  code : z.string(),
  website: z.string().url("Please enter a valid URL"),
});

export type AddCarrierFormData = z.infer<typeof addCarrierSchema>;
