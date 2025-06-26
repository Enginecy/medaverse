import type { RolesFormSchemaData } from "@/features/dashboard/admin-settings/schemas/roles";
import type { UserRoleFormSchemaData } from "@/features/dashboard/admin-settings/schemas/user-role";

export async function addRole(data: RolesFormSchemaData) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

export async function editRole(data: RolesFormSchemaData) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}

export async function assignRole(data: UserRoleFormSchemaData) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
export async function updateAssignedRole(data: UserRoleFormSchemaData) {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
