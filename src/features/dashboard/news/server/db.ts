"use server";
import { createClient } from "@/lib/supabase/server";
import { fetchNewsDocuments } from "@/features/dashboard/news/server/news-documents-query";

export async function getNews() {
  const result = await fetchNewsDocuments();

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
