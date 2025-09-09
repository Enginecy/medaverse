import { NewsList } from "@/features/dashboard/news/components/news-list";
import { NewsListSkeleton } from "@/features/dashboard/news/components/news-list-skeleton";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Meda News - Dashboard",
  description: "Stay updated with the latest news and announcements from Meda.",
};

export default function NewsPage() {
  return (
    <div className="flex h-full w-full flex-col items-start gap-4 md:gap-6">
      <div className="flex w-full justify-between">
        <h1 className="text-xl font-semibold md:text-2xl">Meda News</h1>
      </div>
      <div className="rounded-3xl bg-white w-full h-full  border-1 border-gray-300 p-3"> 

      <Suspense fallback={<NewsListSkeleton />}>
        <NewsList />
      </Suspense>
      </div>
    </div>
  );
}
