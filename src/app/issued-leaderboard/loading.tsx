import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div
      className="bg-background flex min-h-screen flex-col items-center gap-4 p-2
        md:p-4 lg:p-6"
    >
      <div
        className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6
          lg:grid-cols-4"
      >
        <div
          className="flex h-full min-h-[120px] w-full items-center justify-center
            rounded-3xl bg-zinc-900 p-4 outline outline-offset-[-1px]
            outline-zinc-800 md:p-6"
        >
          <Skeleton className="h-12 w-32 md:h-16" />
        </div>

        <MetricCardSkeleton />
        <MetricCardSkeleton />

        <div
          className="flex h-full w-full flex-col gap-3 rounded-3xl border
            border-zinc-800 bg-zinc-900 p-4"
        >
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div
        className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/80
          p-4"
      >
        <Skeleton className="h-[180px] w-full" />
      </div>

      <div
        className="pointer-events-none grid w-full grid-cols-1 gap-4 md:gap-6
          lg:grid-cols-2 xl:grid-cols-5"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <ProfileCardSkeleton />
            <TableSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-28 md:h-9 md:w-36" />
        </div>
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div
      className="relative flex w-full flex-col gap-4 overflow-hidden rounded-3xl
        bg-zinc-900 p-4 outline outline-zinc-800 md:gap-8 md:p-6 lg:p-10"
    >
      <div
        className="absolute top-16 left-16 h-40 w-full bg-gradient-to-br
          from-slate-700/40 via-blue-800/40 to-fuchsia-900/40 blur-2xl md:top-24
          md:left-24 md:h-60 lg:top-[120px] lg:left-[120px] lg:h-80"
      />

      <div className="flex w-full flex-col items-center justify-center gap-3">
        <Skeleton className="h-20 w-20 rounded-2xl md:h-28 md:w-28 lg:h-36 lg:w-36" />
        <div className="flex flex-col items-center justify-center gap-2">
          <Skeleton className="h-5 w-40 md:h-6 md:w-48 lg:h-7 lg:w-56" />
          <Skeleton className="h-4 w-32 md:w-40" />
        </div>
      </div>

      <div
        className="flex w-full flex-col items-center justify-between gap-4
          sm:flex-row sm:gap-0"
      >
        <div className="flex flex-col items-center gap-2 text-center sm:items-start">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-7 w-20" />
        </div>
        <div className="flex flex-col items-center gap-2 text-center sm:items-end">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div
      className="w-full rounded-3xl border border-neutral-800 bg-neutral-900/80
        p-4"
    >
      <div className="mb-4">
        <Skeleton className="h-6 w-40" />
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-4 gap-3">
          <Skeleton className="h-4 w-10" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24 justify-self-end" />
          <Skeleton className="h-4 w-16 justify-self-end" />
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 items-center gap-3">
            <Skeleton className="h-5 w-10" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-5 w-24 justify-self-end" />
            <Skeleton className="h-5 w-16 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}
