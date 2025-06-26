"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import {
  permissions,
  profile,
  rolePermissions,
  roles,
  userPermissionsEnhanced,
  userRoles,
  users,
} from "@/db/schema";
import { resources } from "@/lib/data";
import { count, countDistinct, eq, inArray, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";

export async function getResources() {
  const db = await createDrizzleSupabaseClient();
  const data = await db.rls((tx) => {
    return tx
      .select({
        name: permissions.resource,
        permissionCount: count(permissions.resource),
      })
      .from(permissions)
      .where(
        inArray(
          permissions.resource,
          resources.map((r) => r.name),
        ),
      )
      .groupBy(permissions.resource);
  });
  // Map the data to include descriptions from the resources array
  const resourcesWithDescriptions = data.map((item) => {
    const resource = resources.find((r) => r.name === item.name);
    return {
      ...item,
      description: resource!.description,
    };
  });

  return resourcesWithDescriptions;
}

export async function getPermissions() {
  const db = await createDrizzleSupabaseClient();
  const data = await db.rls((tx) => {
    return tx
      .select({
        id: permissions.id,
        name: permissions.name,
        resource: permissions.resource,
        action: permissions.action,
        description: permissions.description,
        createdAt: permissions.createdAt,
      })
      .from(permissions);
  });
  return data;
}
export type Permission = Awaited<ReturnType<typeof getPermissions>>[number];

export async function getRoles() {
  const db = await createDrizzleSupabaseClient();
  const data = await db.rls((tx) => {
    return tx
      .select({
        id: roles.id,
        name: roles.name,
        code: roles.code,
        level: roles.level,
        status: roles.status,
        permissions: sql<
          Array<{
            id: string;
            name: string;
            resource: string;
            action: string;
          }>
        >`json_agg(
            DISTINCT jsonb_build_object(
              'id', ${rolePermissions.permissionId},
              'name', ${permissions.name},
              'resource', ${permissions.resource},
              'action', ${permissions.action}
            )
          ) FILTER (WHERE ${rolePermissions.permissionId} IS NOT NULL)`.as(
          "permissions",
        ),
        users: sql<
          Array<{
            id: string;
            name: string;
            email: string;
            avatar?: string;
          }>
        >`json_agg(
            DISTINCT jsonb_build_object(
              'id', ${userRoles.userId},
              'name', ${profile.name},
              'email', ${users.email},
              'avatar', ${profile.avatarUrl}
            )
          ) FILTER (WHERE ${userRoles.userId} IS NOT NULL)`.as("users"),
        permissionCount: countDistinct(rolePermissions.id),
        userCount: countDistinct(userRoles.id),
        description: roles.description,
        createdAt: roles.createdAt,
      })
      .from(roles)
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(userRoles, eq(roles.id, userRoles.roleId))
      .leftJoin(profile, eq(userRoles.userId, profile.userId))
      .leftJoin(users, eq(userRoles.userId, users.id))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .groupBy(roles.id);
  });
  console.dir(data, { depth: null });
  return data;
}
export type Role = Awaited<ReturnType<typeof getRoles>>[number];

export async function getUserRoles() {
  const db = await createDrizzleSupabaseClient();
  const data = await db.rls((tx) => {
    return tx
      .select({
        id: userRoles.id,
        user: {
          name: profile.name,
          email: users.email,
          avatar: profile.avatarUrl,
        },
        role: {
          name: roles.name,
          code: roles.code,
          level: roles.level,
        },
        assignedBy: {
          name: profile.name,
        },
        status: userRoles.status,
        assignedAt: userRoles.assignedAt,
        expiresAt: userRoles.expiresAt,
      })
      .from(userRoles)
      .innerJoin(profile, eq(userRoles.userId, profile.userId))
      .innerJoin(users, eq(userRoles.userId, users.id))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .orderBy(userRoles.assignedAt);
  });
  return data;
}
export type UserRole = Awaited<ReturnType<typeof getUserRoles>>[number];

export async function getUserPermissions() {
  const db = await createDrizzleSupabaseClient();
  const assignedByProfile = alias(profile, "assignedByProfile");

  const data = await db.rls((tx) => {
    return tx
      .select({
        id: userPermissionsEnhanced.id,
        user: {
          name: profile.name,
          email: users.email,
        },
        permission: {
          name: permissions.name,
          resource: permissions.resource,
          action: permissions.action,
        },
        assignedBy: {
          name: assignedByProfile.name,
        },
        source: sql<string>`('direct')`,
        assignedAt: userPermissionsEnhanced.grantedAt,
        expiresAt: userPermissionsEnhanced.expiresAt,
        status: userPermissionsEnhanced.status,
      })
      .from(userPermissionsEnhanced)
      .innerJoin(profile, eq(userPermissionsEnhanced.userId, profile.userId))
      .innerJoin(
        assignedByProfile,
        eq(userPermissionsEnhanced.grantedBy, assignedByProfile.userId),
      )
      .innerJoin(users, eq(userPermissionsEnhanced.userId, users.id))
      .innerJoin(
        permissions,
        eq(userPermissionsEnhanced.permissionId, permissions.id),
      )
      .orderBy(userPermissionsEnhanced.grantedAt);
  });
  return data;
}
export type UserPermission = Awaited<
  ReturnType<typeof getUserPermissions>
>[number];
