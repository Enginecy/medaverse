"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import {
  rolePermissions,
  roles,
  userPermissionsEnhanced,
  userRoles,
} from "@/db/schema";
import type { RolesFormSchemaData } from "@/features/dashboard/admin-settings/schemas/roles";
import type { UserPermissionFormSchemaData } from "@/features/dashboard/admin-settings/schemas/user-permission";
import type { UserRoleFormSchemaData } from "@/features/dashboard/admin-settings/schemas/user-role";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function addRole({
  permissions,
  users,
  ...role
}: RolesFormSchemaData): Promise<ActionResult<typeof result>> {
  console.log({ permissions, users, role }, { depth: null });

  const db = await createDrizzleSupabaseClient();
  const result = await db.rls(async (tx) => {
    const [resultingRole] = await tx
      .insert(roles)
      .values(role)
      .returning({ id: roles.id });

    if (!resultingRole) {
      return {
        success: false,
        error: {
          message: "Something went wrong adding this role",
          statusCode: 400,
          details:
            "Something went wrong adding this role, please try again later.",
        },
      };
    }

    if (permissions.length > 0) {
      const payload = permissions.map((permission) => ({
        roleId: resultingRole.id,
        permissionId: permission.id,
      }));

      await tx.insert(rolePermissions).values(payload);
    }

    if (users.length > 0) {
      const {
        data: { user: currentUser },
      } = await (await createClient()).auth.getUser();

      if (!currentUser?.id) {
        return {
          success: false,
          error: {
            message: "Unauthorized",
            statusCode: 400,
            details: "You are not authorized to perform this action.",
          },
        };
      }

      const payload = users.map((user) => ({
        roleId: resultingRole.id,
        userId: user.id,
        assignedBy: currentUser.id,
      }));

      await tx.insert(userRoles).values(payload);
    }
    return {
      message: "Role created successfully",
      role: resultingRole,
    };
  });
  return { success: true, data: result };
}

export async function editRole({
  permissions,
  users,
  id,
  ...role
}: RolesFormSchemaData & { id: string }) {
  const db = await createDrizzleSupabaseClient();
  const result = await db.rls(async (tx) => {
    const [resultingRole] = await tx
      .update(roles)
      .set(role)
      .where(eq(roles.id, id))
      .returning({ id: roles.id });

    if (!resultingRole) {
      throw { message: "Failed to update role" };
    }

    if (permissions.length > 0) {
      const payload = permissions.map((permission) => ({
        roleId: resultingRole.id,
        permissionId: permission.id,
      }));

      await tx.delete(rolePermissions).where(eq(rolePermissions.roleId, id));
      await tx.insert(rolePermissions).values(payload);
    }

    if (users.length > 0) {
      const {
        data: { user: currentUser },
      } = await (await createClient()).auth.getUser();

      if (!currentUser?.id) {
        throw { message: "Unauthorized" };
      }

      const payload = users.map((user) => ({
        roleId: resultingRole.id,
        userId: user.id,
        assignedBy: currentUser.id,
      }));

      await tx.delete(userRoles).where(eq(userRoles.roleId, id));
      await tx.insert(userRoles).values(payload);
    }

    return {
      message: "Role updated successfully",
      role: resultingRole,
    };
  });

  return result;
}

export async function deleteRole({ id }: { id: string }) {
  const db = await createDrizzleSupabaseClient();
  const result = await db.rls(async (tx) => {
    await tx
      .update(roles)
      .set({
        status: "disabled",
      })
      .where(eq(roles.id, id));
    await tx
      .update(userRoles)
      .set({
        status: "disabled",
      })
      .where(eq(userRoles.roleId, id));
  });

  return result;
}

export async function assignRole({
  role,
  user,
  expiresAt,
}: UserRoleFormSchemaData) {
  const db = await createDrizzleSupabaseClient();
  const {
    data: { user: currentUser },
  } = await (await createClient()).auth.getUser();

  if (!currentUser?.id) {
    throw { message: "Unauthorized" };
  }
  const result = await db.rls(async (tx) => {
    const [resultingUserRole] = await tx
      .insert(userRoles)
      .values({
        roleId: role.id,
        userId: user.id,
        expiresAt,
        assignedBy: currentUser.id,
      })
      .returning({ id: userRoles.id });

    if (!resultingUserRole) {
      throw { message: "Failed to assign role" };
    }

    return {
      message: "Role assigned successfully",
      userRole: resultingUserRole,
    };
  });

  return result;
}
export async function updateAssignedRole({
  role,
  user,
  expiresAt,
  id,
}: UserRoleFormSchemaData & { id: string }) {
  const db = await createDrizzleSupabaseClient();
  const {
    data: { user: currentUser },
  } = await (await createClient()).auth.getUser();

  if (!currentUser?.id) {
    throw { message: "Unauthorized" };
  }
  const result = await db.rls(async (tx) => {
    const [resultingUserRole] = await tx
      .update(userRoles)
      .set({
        roleId: role.id,
        userId: user.id,
        expiresAt,
        assignedAt: new Date(),
        assignedBy: currentUser.id,
      })
      .where(eq(userRoles.id, id))
      .returning({ id: userRoles.id });

    if (!resultingUserRole) {
      throw { message: "Failed to update role" };
    }

    return {
      message: "Role updated successfully",
      userRole: resultingUserRole,
    };
  });

  return result;
}

export async function deleteUserRole({ id }: { id: string }) {
  const db = await createDrizzleSupabaseClient();
  const result = await db.rls(async (tx) => {
    await tx
      .update(userRoles)
      .set({
        status: "disabled",
      })
      .where(eq(userRoles.id, id));
  });

  return result;
}
export async function assignPermission({
  permission,
  user,
  expiresAt,
}: UserPermissionFormSchemaData) {
  const db = await createDrizzleSupabaseClient();
  const {
    data: { user: currentUser },
  } = await (await createClient()).auth.getUser();

  if (!currentUser?.id) {
    throw { message: "Unauthorized" };
  }

  const result = await db.rls(async (tx) => {
    const [resultingUserPermission] = await tx
      .insert(userPermissionsEnhanced)
      .values({
        permissionId: permission.id,
        userId: user.id,
        expiresAt,
        grantedBy: currentUser.id,
      })
      .returning({ id: userPermissionsEnhanced.id });

    if (!resultingUserPermission) {
      throw { message: "Failed to assign permission" };
    }

    return {
      message: "Permission assigned successfully",
      userPermission: resultingUserPermission,
    };
  });

  return result;
}

export async function updateAssignedPermission({
  permission,
  user,
  expiresAt,
  id,
}: UserPermissionFormSchemaData & { id: string }) {
  const db = await createDrizzleSupabaseClient();
  const {
    data: { user: currentUser },
  } = await (await createClient()).auth.getUser();

  if (!currentUser?.id) {
    throw { message: "Unauthorized" };
  }
  const result = await db.rls(async (tx) => {
    const [resultingUserPermission] = await tx
      .update(userPermissionsEnhanced)
      .set({
        permissionId: permission.id,
        userId: user.id,
        expiresAt,
        grantedAt: new Date(),
        grantedBy: currentUser.id,
      })
      .where(eq(userPermissionsEnhanced.id, id))
      .returning({ id: userPermissionsEnhanced.id });

    if (!resultingUserPermission) {
      throw { message: "Failed to update permission" };
    }

    return {
      message: "Permission updated successfully",
      userPermission: resultingUserPermission,
    };
  });

  return result;
}

export async function deleteUserPermission({ id }: { id: string }) {
  const db = await createDrizzleSupabaseClient();
  const result = await db.rls(async (tx) => {
    await tx
      .update(userPermissionsEnhanced)
      .set({
        status: "disabled",
      })
      .where(eq(userPermissionsEnhanced.id, id));
  });

  return result;
}
