"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth";
import Image from "next/image";
import Link from "next/link";

function ProfileButtonSkeleton() {
  return (
    <Button variant="outline" className="py-6" asChild>
      <Link href="#">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-end">
            <Skeleton className="h-3 w-20 rounded-md bg-gray-300 animate-pulse" />
            <Skeleton className="h-2 w-28 rounded-md bg-gray-300 animate-pulse mt-1" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />
        </div>
      </Link>
    </Button>
  );
}

export function ProfileButton() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <ProfileButtonSkeleton />;
  }

  return (
    <Button variant="outline" className="py-6" asChild>
      <Link href="/dashboard/profile">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold">
              {user?.profile?.name || ""}
            </span>
            <span className="text-muted-foreground text-xs mt-1">
              {user?.user?.email || ""}
            </span>
          </div>
          {user?.profile?.avatar_url ? (
            <Image
              src={user.profile.avatar_url}
              alt="Profile"
              className="border-border h-10 w-10 rounded-full border object-cover shadow"
              width={40}
              height={40}
            />
          ) : (
            <Skeleton className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          )}
        </div>
      </Link>
    </Button>
  );
}
