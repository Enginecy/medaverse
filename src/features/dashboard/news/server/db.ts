"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { documents, profile, users } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";
import { sql, eq } from "drizzle-orm";

export async function getNews() {
  const db = await createDrizzleSupabaseClient();

  // call db function public.get_user_accessible_documents
  const result = await db.rls(async (tx) => {
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
      })
      .from(documents)
      .leftJoin(users, eq(documents.uploadedBy, users.id))
      .leftJoin(profile, eq(users.id, profile.userId))
      .where(
        sql`${documents.deletedAt} IS NULL AND ${documents.category} = 'news'`,
      )
      .limit(100)
      .offset(0);
  });

  // for each result, get the download link
  const downloadLinks = await Promise.all(
    result.map(async (news) => {
      return getDownloadLink(news.file_path);
    }),
  );

  return result.map((news, index) => ({
    ...news,
    file_path: downloadLinks[index],
  }));
}

export async function getDownloadLink(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(path, 60 * 60 * 24 * 30, {
      download: true,
    });

  if (error) {
    console.error(error, path);
    throw {
      message: "Failed to get download link",
    };
  }

  return data?.signedUrl;
}

export type NewsDocument = {
  id: string;
  file_path: string;
  title: string;
};
