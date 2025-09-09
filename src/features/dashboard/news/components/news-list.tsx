import { NewsCard } from "@/features/dashboard/news/components/news-card";
import { NewsListEmptyState } from "@/features/dashboard/news/components/news-list-empty-state";
import { getNews } from "@/features/dashboard/news/server/db";

export async function NewsList() {
  const news = await getNews();

  if(news.length === 0) {
     return (
        <NewsListEmptyState /> 
     );   
    }
  return (
    
    <div
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6
        lg:grid-cols-3 xl:grid-cols-4"
    >
      {news.map((news) => (
        <NewsCard key={news.id} title={news.title} file={news.file_path!} />
      ))}
    </div>
  );
}
