import type { State } from "@/lib/data";
import z from "zod";

// Form validation schema
export const addUserSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  dateOfBirth: z
    .date({
      required_error: "Date of birth is required",
    })
    .refine((date) => date <= new Date(), {
      message: "Date of birth cannot be in the future",
    }),
  role: z.string().min(1, "Please select a role"),
  regional: z.string().min(1, "Please select a regional"),
  upLine: z.string(),
  npnNumber: z.string().min(1, "Please select an NPN number"),
  states: z
    .array(
      z.object({
        name: z.string(),
        code: z.string(),
      }) as z.ZodType<State>,
    )
    .min(1, "Please select at least one state"),
  profileImage: z.union([z.instanceof(File), z.string().url()]),
});

export type AddUserFormData = z.infer<typeof addUserSchema>;
