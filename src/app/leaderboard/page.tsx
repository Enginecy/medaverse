"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import logo from "public/meda_health_logo.png";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { ChartSplineIcon, ClockIcon } from "lucide-react";
import { UserChip } from "@/features/dashboard/admin-settings/components/ui/user-chip";
import { LeaderboardTable } from "@/components/leaderboard-table";
import Link from "next/link";

export default function LeaderboardPage() {
  return (
    <>
      <div
        className="bg-background flex h-screen flex-col items-center gap-4 p-6"
      >
        <div className="grid w-full grid-cols-4 gap-6">
          <LogoCard />
          <TotalCard week />
          <TotalCard />

          <Tabs defaultValue="option1" orientation="vertical">
            <TabsList
              className="flex h-full w-full flex-col items-stretch
                justify-between rounded-3xl border border-zinc-800 bg-zinc-900
                p-4"
            >
              <TabsTrigger value="option1">This week</TabsTrigger>
              <TabsTrigger value="option3">This month</TabsTrigger>
              <TabsTrigger value="option5">All time</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <StockCard />

        <div className="grid w-full grid-cols-4 gap-6">
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
          <LeaderboardCard />
        </div>

        <div className="grid w-full grid-cols-4 gap-6">
          <LeaderboardTable title="Personal Production" />
          <LeaderboardTable title="Associate Director" />
          <LeaderboardTable title="Divisional Director" />
          <LeaderboardTable title="Regional Director" />
        </div>
      </div>
    </>
  );
}

function LeaderboardCard() {
  return (
    <div
      className="relative flex w-full flex-col gap-8 overflow-hidden rounded-3xl
        bg-zinc-900 p-10 outline outline-zinc-800"
    >
      <div
        className="absolute top-[120px] left-[120px] h-80 w-full
          bg-gradient-to-br from-slate-700/40 via-blue-800/40 to-fuchsia-900/40
          blur-2xl"
      />

      <div className="flex w-full flex-col items-center justify-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="placeholder"
          className="h-36 w-36 rounded-4xl border"
          src="https://placehold.co/151x151"
        />

        <div className="flex flex-col items-center justify-center gap-1.5">
          <div className="text-3xl font-semibold text-neutral-200">
            Austin Woodruff
          </div>
          <div className="text-xl font-semibold text-neutral-400">
            Senior Associate
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between">
        <div
          className="flex flex-col items-start justify-center gap-2 text-base
            font-medium text-neutral-400"
        >
          Annualized Volume
          <span className="text-primary-300 text-4xl font-semibold">
            $48,500
          </span>
        </div>

        <div
          className="flex flex-col items-end justify-center gap-2 text-base
            font-medium text-neutral-400"
        >
          Households
          <span className="text-primary-300 text-4xl font-semibold">12</span>
        </div>
      </div>
    </div>
  );
}

function LogoCard() {
  return (
    <Link href="/dashboard/home">
      <div
        className="flex h-full w-full items-center justify-center rounded-3xl
          bg-zinc-900 p-6 outline outline-offset-[-1px] outline-zinc-800"
      >
        <Image alt="logo" src={logo} className="h-16 w-auto" />
      </div>
    </Link>
  );
}

function TotalCard({ week }: { week?: boolean }) {
  const title = week ? "This Week" : "Today";
  const color = week ? "bg-sky-600/20" : "bg-emerald-500/20";
  const textColor = week ? "text-blue-500" : "text-emerald-500";
  const backgroundColor = week ? "bg-sky-600/20" : "bg-emerald-500/20";
  return (
    <div
      className="flex flex-col items-center justify-between gap-3.5 rounded-3xl
        bg-zinc-900 p-6 outline outline-offset-[-1px] outline-zinc-800"
    >
      <div
        className={`flex items-center justify-center gap-1.5 rounded-4xl px-4
          ${backgroundColor} py-2`}
      >
        <div className={`h-2.5 w-2.5 rounded-full ${color}`} />
        <div className={`justify-start text-base font-semibold ${textColor}`}>
          {title}
        </div>
      </div>
      <div className={`text-center text-5xl font-bold ${textColor}`}>
        $1,185,199
      </div>
    </div>
  );
}

function StockCard() {
  const [animate, setAnimate] = useState(false);
  const prevValues = useRef({
    user: {
      name: "Austin Woodruff",
      email: "Senior Associate",
      avatar: "https://placehold.co/52x52",
    },
    amount: "$50,000",
    insurance: "Dental Insurance",
  });

  const user = useMemo(
    () => ({
      name: "Austin Woodruff",
      email: "Senior Associate",
      avatar: "https://placehold.co/52x52",
    }),
    [],
  );
  const amount = "$50,000";
  const insurance = "Dental Insurance";

  useEffect(() => {
    if (
      prevValues.current.user.name !== user.name ||
      prevValues.current.user.email !== user.email ||
      prevValues.current.user.avatar !== user.avatar ||
      prevValues.current.amount !== amount ||
      prevValues.current.insurance !== insurance
    ) {
      setAnimate(true);
      prevValues.current = { user, amount, insurance };
      const timeout = setTimeout(() => setAnimate(false), 700);
      return () => clearTimeout(timeout);
    }

    // change value after 4 seconds
    setTimeout(() => {
      setAnimate(true);
      prevValues.current = { user, amount, insurance };
      const timeout = setTimeout(() => setAnimate(false), 700);
      return () => clearTimeout(timeout);
    }, 4000);
  }, [user, amount, insurance]);

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
            name: "Austin Woodruff",
            email: "Senior Associate",
            avatar: "https://placehold.co/52x52",
          }}
        />

        <div
          className="flex items-center justify-center gap-2.5 rounded-4xl
            bg-slate-800 px-6 py-2 outline outline-offset-[-1px]"
        >
          <div className="justify-start text-3xl font-semibold text-blue-400">
            $50,000
          </div>
        </div>

        <div
          className="flex items-center justify-center gap-2.5 rounded-4xl
            bg-zinc-800 px-4 py-2 outline outline-offset-[-1px]
            outline-neutral-600"
        >
          <div className="justify-start text-base font-semibold text-zinc-500">
            Dental Insurance
          </div>
        </div>
      </div>

      <div
        className="rounded-4xl bg-zinc-800 px-4 py-2 text-sm font-semibold
          text-zinc-500 outline outline-offset-[-1px] outline-zinc-800"
      >
        <div className="flex items-center justify-center gap-2.5">
          <ClockIcon className="h-5 w-5" />
          <span>Just Now</span>
        </div>
      </div>
      <div
        className="animate-fill-bar absolute bottom-0 left-0 h-1 w-full
          bg-gradient-to-r from-green-600 via-cyan-500 to-purple-500"
      />
    </div>
  );
}
