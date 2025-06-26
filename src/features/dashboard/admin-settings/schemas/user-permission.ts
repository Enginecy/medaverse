import { z } from "zod";

export const userPermissionFormSchema = z.object({
  id: z.string().optional(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    avatar: z.string().optional(),
  }),
  permission: z.object({
    id: z.string(),
    name: z.string(),
    resource: z.string(),
    action: z.string(),
  }),
  expiresAt: z.date().optional(),
});

export type UserPermissionFormSchemaData = z.infer<
  typeof userPermissionFormSchema
>;
