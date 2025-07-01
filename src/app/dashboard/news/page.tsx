import { NewsCard } from "@/features/dashboard/news/components/news-card";
import { getNews } from "@/features/dashboard/news/server/db";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Meda News - Dashboard",
  description: "Stay updated with the latest news and announcements from Meda.",
};
export default async function NewsPage() {
  const news = await getNews();

  return (
    <div className="flex h-full w-full flex-col items-start gap-6 p-6">
      <div className="flex w-full justify-between">
        <h1 className="text-2xl font-semibold">Meda News</h1>
      </div>
      <div className="flex w-full flex-wrap">
        {news.map((news) => (
          <NewsCard key={news.id} title={news.title} file={news.file_path!} />
        ))}
      </div>
    </div>
  );
}
