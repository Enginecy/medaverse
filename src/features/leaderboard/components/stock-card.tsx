"use client";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import { getLastSale } from "@/features/leaderboard/server/db/leaderboard";
import { useSupabase } from "@/lib/supabase/provider";
import { useQuery } from "@tanstack/react-query";
import { ChartSplineIcon, ClockIcon } from "lucide-react";
import { useState, useEffect } from "react";

export function StockCard() {
  const supabase = useSupabase();

  const {
    data: lastSale,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["last-sale"],
    queryFn: getLastSale,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const subscription = supabase
      .channel("sales-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sales" },
        () => {
          refetch();
        },  
      )
      .subscribe();
    console.log("sub:", subscription);
    return () => {
      void subscription.unsubscribe();
      void supabase.removeAllChannels();
    };
  }, [supabase, refetch]);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (lastSale) {
      setAnimate(true);
      const timeout = setTimeout(() => setAnimate(false), 700);
      return () => clearTimeout(timeout);
    }
  }, [lastSale]);

  if (isPending) {
    return null;
  }

  if (isError) {
    return <div></div>;
  }

  return (
    <div
      className="relative flex w-full items-center justify-between
        overflow-hidden rounded-3xl bg-zinc-900 p-10 outline
        outline-offset-[-1px] outline-zinc-800"
    >
      <div className="flex items-center justify-center gap-4 px-4 py-2">
        <div
          className="h-4 w-4 animate-pulse rounded-full bg-emerald-500 outline-8
            outline-emerald-500/30"
        />
        <div className="justify-start text-base font-semibold text-emerald-500">
          LIVE SALES
        </div>
      </div>

      <div
        className={`flex items-center justify-start gap-9
          ${animate ? "animate-bottom-to-top" : ""}`}
      >
        <div
          className="rounded-4xl bg-gray-900 px-4 py-2 outline
            outline-offset-[-1px] outline-violet-500/20"
        >
          <div
            className="flex items-center justify-center gap-2.5 text-base
              font-semibold text-violet-500"
          >
            <ChartSplineIcon className="h-4 w-4" />
            <span>NEW SALE</span>
          </div>
        </div>

        <UserChip
          size="lg"
          user={{
            name: lastSale.user.name,
            email: lastSale.user.role,
            avatar: lastSale.user.avatar,
          }}
        />

        <div
          className="flex items-center justify-center gap-2.5 rounded-4xl
            bg-slate-800 px-6 py-2 outline outline-offset-[-1px]"
        >
          <div className="justify-start text-3xl font-semibold text-blue-400">
            ${lastSale.amount}
          </div>
        </div>

        {/* <div
          className="flex items-center justify-center gap-2.5 rounded-4xl
            bg-zinc-800 px-4 py-2 outline outline-offset-[-1px]
            outline-neutral-600"
        >
          <div className="justify-start text-base font-semibold text-zinc-500">
            Dental Insurance
          </div>
        </div> */}
      </div>

      <div
        className="rounded-4xl bg-zinc-800 px-4 py-2 text-sm font-semibold
          text-zinc-500 outline outline-offset-[-1px] outline-zinc-800"
      >
        <div className="flex items-center justify-center gap-2.5">
          <ClockIcon className="h-5 w-5" />
          <span>{lastSale.createdAt.toLocaleString()}</span>
        </div>
      </div>
      <div
        className="animate-fill-bar absolute bottom-0 left-0 h-1 w-full
          bg-gradient-to-r from-green-600 via-cyan-500 to-purple-500"
      />
    </div>
  );
}
