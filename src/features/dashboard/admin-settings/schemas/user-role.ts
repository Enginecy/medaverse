import { z } from "zod";

export const userRoleFormSchema = z.object({
  id: z.string().optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
  }),
  role: z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
  }),
  expiresAt: z.date().optional(),
});

export type UserRoleFormSchemaData = z.infer<typeof userRoleFormSchema>;
