import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

//TODO: onhover text should be white
function ProfileButtonSkeleton() {
  return (
    <Button variant="outline" className="min-h-[44px] py-3 md:py-6" asChild>
      <Link href="#">
        <div className="flex flex-row items-center gap-2">
          <div className="hidden flex-col items-end sm:flex">
            <Skeleton className="h-3 w-20 animate-pulse rounded-md bg-gray-300" />
            <Skeleton
              className="mt-1 h-2 w-28 animate-pulse rounded-md bg-gray-300"
            />
          </div>
          <Skeleton
            className="h-8 w-8 animate-pulse rounded-full bg-gray-300 md:h-10
              md:w-10"
          />
        </div>
      </Link>
    </Button>
  );
}

export async function ProfileButton() {
  const user = await getUser();

  return (
    <Suspense fallback={<ProfileButtonSkeleton />}>
      <Button
        variant="default"
        className="group hover:bg-primary min-h-[49px] rounded-full bg-white
          px-6 py-6 text-gray-400 group-hover:text-white hover:cursor-pointer
          md:min-h-auto md:py-6"
      >
        <Link href="/dashboard/profile">
          <div className="flex flex-row items-center gap-2">
            <div className="hidden flex-col items-end sm:flex">
              <span
                className="text-sm font-bold text-black group-hover:text-white"
              >
                {user!.profile!.name}
              </span>
              <span className="mt-1 text-xs group-hover:text-white">
                {user!.user!.email}
              </span>
            </div>
            <Image
              src={user!.profile!.avatarUrl!}
              alt="Profile"
              className="border-border h-full w-8 rounded-full object-cover p-3
                md:h-full md:w-13"
              width={40}
              height={40}
            />
          </div>
        </Link>
      </Button>
    </Suspense>
  );
}
