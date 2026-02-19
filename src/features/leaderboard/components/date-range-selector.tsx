"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Loader2 } from "lucide-react";

export function DateRangeSelector({
  basePath,
}: {
  basePath?: string;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const path = basePath ?? (pathname?.startsWith("/issued-leaderboard") ? "/issued-leaderboard" : "/leaderboard");

  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");
  const hasCustomRange = fromParam && toParam;

  const initialFrom = fromParam
    ? new Date(fromParam)
    : new Date(new Date().setDate(new Date().getDate() - 7));
  const initialTo = toParam ? new Date(toParam) : new Date();

  const handleUpdate = useCallback(
    (range: { from: Date; to: Date | undefined }) => {
      const params = new URLSearchParams();

      if (range.from) {
        params.set("from", range.from.toISOString().split("T")[0]!);
      }

      if (range.to) {
        params.set("to", range.to.toISOString().split("T")[0]!);
      }

      params.delete("period");

      startTransition(() => {
        router.push(`${path}?${params.toString()}`);
      });
    },
    [router, path],
  );

  const handleClear = useCallback(() => {
    startTransition(() => {
      router.push(`${path}?period=week`);
    });
  }, [router, path]);

  return (
    <div className="flex items-center gap-2">
      {isPending && (
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">Loading...</span>
        </div>
      )}
      {hasCustomRange && !isPending && (
        <button
          onClick={handleClear}
          className="text-sm text-zinc-400 transition-colors hover:text-white"
          title="Clear custom date range"
        >
          Clear
        </button>
      )}
      <DateRangePicker
        initialDateFrom={initialFrom}
        initialDateTo={initialTo}
        onUpdate={handleUpdate}
        align="end"
      />
    </div>
  );
}

