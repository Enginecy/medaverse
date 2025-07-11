import { z } from "zod";

export const rolesFormSchema = z.object({
  id: z.string().optional(),
  name: z.string(),
  code: z.string(),
  level: z.number().min(0).max(10),
  description: z.string().optional(),
  permissions: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      resource: z.string().optional(), // used for styling
      action: z.string().optional(), // used for styling
    }),
  ),
  status: z.enum(["active", "disabled"]),
  users: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      avatar: z.string().optional(),
    }),
  ),
});

export type RolesFormSchemaData = z.infer<typeof rolesFormSchema>;
