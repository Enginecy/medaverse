"use server";

import ExcelJS from "exceljs"; 
import { createDrizzleSupabaseClient } from "@/db/db";
import { profile, roles, userRoles, users } from "@/db/schema";
import type { Role } from "@/features/dashboard/admin-settings/server/db/admin-settings";
import { NpnNumberForm } from "@/features/dashboard/user-management/components/form/npn-no-field";
import { createClient } from "@/lib/supabase/server";
import { desc, getTableColumns, eq, gt, sql } from "drizzle-orm";

export async function getUsers() {
  const db = await createDrizzleSupabaseClient();

  const profiles = await db.rls((tx) => {
    return tx
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles,
        
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .orderBy(desc(profile.createdAt));
  });

  return profiles;
}

export type User = Awaited<ReturnType<typeof getUsers>>[number];

export async function getAboveSuperiors(selectedRole: Role) {
  try {
    const supabase = createClient();
    const user = (await supabase).auth.getUser();

    if (!user) {
      throw { message: "You are not authenticated`" };
    }

    const db = await createDrizzleSupabaseClient();

    const superiors = await db.admin

      .select({
        ...getTableColumns(profile),
        role: roles,
      })
      .from(profile)
      .innerJoin(userRoles, eq(userRoles.userId, profile.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(gt(roles.level, selectedRole.level));

    return superiors;
  } catch (e) {
    console.error("Error fetching superiors:", e);
    throw {
      message: `Failed to get superiors`,
    };
  }
}

export type Superior = Awaited<ReturnType<typeof getAboveSuperiors>>[number];

export async function getRegionalDirectors() {
  try {
    const db = await createDrizzleSupabaseClient();

    const regionalDirectors = await db.admin
      .select({
        ...getTableColumns(profile),
        email: users.email,
        role: roles,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .innerJoin(userRoles, eq(userRoles.userId, profile.userId))
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(roles.code, "regional_director"));

    return regionalDirectors;
  } catch (e) {
    throw {
      message:
        "Failed to get regional directors" 
    };
  }
}


export async function getExportUsers() {
   const db = await createDrizzleSupabaseClient();

  const exportUsers = await db.rls((tx) => {
    return tx
      .select({
      name: profile.name,
      username: profile.username,
      phoneNumber: profile.phoneNumber,
      email: users.email,
      role: roles.name,
      status: profile.status,
      address: profile.address,
      dob: sql`TO_CHAR(${profile.dob}, 'YYYY-MM-DD')`.as("dob"),
      NpnNumber: profile.npnNumber,
      })
      .from(profile)
      .leftJoin(users, eq(profile.userId, users.id))
      .leftJoin(userRoles, eq(userRoles.userId, profile.userId))
      .leftJoin(roles, eq(userRoles.roleId, roles.id))
      .orderBy(desc(profile.createdAt));
  });

  return exportUsers;
}


export type ExportedUsers = Awaited<ReturnType<typeof getExportUsers>> [number]


export function readXlsxFile(file: File) {
    const user = {
      name: "",
      username: "",
      phoneNumber: "",
      email: "",
      role: "",
      address: "",
      npnNumber: "",
      dob: new Date("MM/DD/YYYY"),
    };
    const reader = new FileReader();

    reader.onload = async (event) => {
      const buffer = event.target?.result;
      if (!(buffer instanceof ArrayBuffer)) return;

      const workbook = new ExcelJS.Workbook();

      await workbook.xlsx.load(buffer);

      const worksheet = workbook.worksheets[0];

      const rows = worksheet?.getSheetValues();

      if (!rows || rows.length < 2) {
        alert("The file is empty or does not contain valid data.");
        return;
      }
      const headerRow = rows[1];
      console.log(headerRow, "<======== Header Row");

      if (!headerRow || !Array.isArray(headerRow)) {
        alert("The file does not contain enough columns.");
        return;
      }
      const headers = headerRow.slice(1).map((cell) => {
        const formattedCell = cell?.toString().trim();
        const formattedHeader =
          formattedCell!.charAt(0).toLowerCase() + formattedCell?.slice(1);

        return formattedHeader;
      });

      console.log(headers, "<======== Headers");
      Object.keys(user).forEach((key) => {
        if (!headers.includes(key)) {
          alert(`The file does not contain the required column: ${key}`);
          return;
        }
       
      });
      var users: {}[]  = [];
      for( const row of rows.slice(2)) {
        if (!Array.isArray(row) || row.length < headers.length + 1) continue;
        const userData: Record<string, string> = {};
        headers.forEach((header, index) => {
          userData[header] = row[index + 1]?.toString().trim() || "";
        });
        users.push(userData);
      }


      console.log(users, "<======== Users Data");

    };
    reader.readAsArrayBuffer(file);
  }