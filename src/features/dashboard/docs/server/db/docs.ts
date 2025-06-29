"use server";
import { createDrizzleSupabaseClient } from "@/db/db";
import { createClient } from "@/lib/supabase/server";
import { sql } from "drizzle-orm";

export async function getNews() {
  const db = await createDrizzleSupabaseClient();

  // call db function public.get_user_accessible_documents
  return db.rls(async (tx) => {
    return tx.execute<NewsDocument>(
      sql`SELECT * FROM public.get_user_accessible_documents(
        p_category => 'news',
        p_limit => 100,
        p_offset => 0
      )`,
    );
  });
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
  file_name: string;
  original_file_name: string;
  file_type: string;
  file_size: string;
  file_path: string;
  category: string;
  title: string;
  uploaded_by: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  created_at: string;
  updated_at: string;
  can_update: boolean;
  can_delete: boolean;
};
