export function NewsListSkeleton() {
  return (
    <div
      className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6
        lg:grid-cols-3 xl:grid-cols-4"
    >
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-40 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"
        />
      ))}
    </div>
  );
}