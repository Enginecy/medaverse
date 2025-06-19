import z, { ZodString } from "zod";

export function createFormSchema(step: "email" | "pin") {
  return z.object({
    email: z.string().email(),
    code:
      process.env.NODE_ENV === "development" && step === "pin"
        ? z.string().default("123456")
        : step === "pin"
          ? z.string().min(6)
          : z.string().optional(),
  });
}
