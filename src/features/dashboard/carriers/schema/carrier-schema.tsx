import z from "zod";

export const addCarrierSchema = z.object({
  carrierImage: z.union([z.instanceof(File), z.string().url("Please upload a valid image")]),
  companyName: z.string().min(1, "Company name is required"),
  phoneNumber: z.string(),
  email: z.string(),
  code : z.string(),
  website: z.string().url("Please enter a valid URL"),
});

export type AddCarrierFormData = z.infer<typeof addCarrierSchema>;
