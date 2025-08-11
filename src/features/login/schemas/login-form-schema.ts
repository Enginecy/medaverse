import z from "zod";

export function createFormSchema(step: "email" | "pin" | "password") {
  return z.object({
    email: z.string().email(),
    code: step === "pin" ? z.string().min(6) : z.string().optional(),
    password: step === "password" ? z.string().min(6) : z.string().optional(),
  });
}

export const updatePasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
