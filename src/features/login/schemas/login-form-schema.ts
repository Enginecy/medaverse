import z from "zod";

export function createFormSchema(step: "email" | "pin") {
  return z.object({
    email: z.string().email(),
    code: step === "pin" ? z.string().min(6) : z.string().optional(),
  });
}
