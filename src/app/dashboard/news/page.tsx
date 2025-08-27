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
    <div className="flex h-full w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full justify-between">
        <h1 className="text-xl md:text-2xl font-semibold">Meda News</h1>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {news.map((news) => (
          <NewsCard key={news.id} title={news.title} file={news.file_path!} />
        ))}
      </div>
    </div>
  );
}
