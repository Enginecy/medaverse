"use server";

import { createDrizzleSupabaseClient } from "@/db/db";
import { documents, profile, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

/** Rows aligned with public.get_user_accessible_documents (query via Drizzle to avoid RPC drift). */
export async function fetchNewsDocuments() {
  const db = await createDrizzleSupabaseClient();

  return db.rls(async (tx) => {
    return tx
      .select({
        id: documents.id,
        file_name: documents.fileName,
        original_file_name: documents.originalFileName,
        file_type: documents.fileType,
        file_size: documents.fileSize,
        file_path: documents.filePath,
        category: documents.category,
        title: documents.title,
        uploaded_by: sql`jsonb_build_object(
          'id', ${documents.uploadedBy},
          'email', ${users.email},
          'name', ${profile.name},
          'avatar', ${profile.avatarUrl}
        )`,
        created_at: documents.createdAt,
        updated_at: documents.updatedAt,
        can_update: sql<boolean>`public.can_manage_document(${documents.id}, 'documents:update')`,
        can_delete: sql<boolean>`public.can_manage_document(${documents.id}, 'documents:delete')`,
      })
      .from(documents)
      .leftJoin(users, eq(documents.uploadedBy, users.id))
      .leftJoin(profile, eq(users.id, profile.userId))
      .where(
        sql`${documents.deletedAt} IS NULL AND ${documents.category} = 'news'`,
      );
  });
}
