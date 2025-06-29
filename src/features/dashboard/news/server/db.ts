"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { createClient } from "@/lib/supabase/server";
import { sql } from "drizzle-orm";

export async function getNews() {
  const db = await createDrizzleSupabaseClient();

  // call db function public.get_user_accessible_documents
  const result = await db.rls(async (tx) => {
    return tx.execute<NewsDocument>(
      sql`SELECT * FROM public.get_user_accessible_documents(
          p_category => 'news',
          p_limit => 100,
          p_offset => 0
        )`,
    );
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
