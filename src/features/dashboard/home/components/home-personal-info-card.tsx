import Image from "next/image";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getUser } from "@/lib/supabase/server";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { EditProfileButton } from "@/features/dashboard/home/components/edit-profile-button";
import { getUserProfile } from "@/features/dashboard/home/server/db/home";
import { CommissionAndSalesCards } from "@/features/dashboard/home/components/commission-and-sales-cards";

export async function PersonalInfoCard() {
  const { profile } = await getUser();
  const userProfile = await getUserProfile();
  if (!profile) {
    console.error("No profile found");
    redirect("/login");
  }

  return (
    <div
      className="w-full rounded-3xl border-3 border-white bg-[#D4DAE2] p-7
        lg:justify-between md:w-2/3"
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Personal info</p>
        <EditProfileButton profile={userProfile} />
      </div>
      <div>
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative h-[150px] w-[150px] rounded-lg">
              <div className="relative h-32 w-32">
                <Image
                  src={profile.avatarUrl!}
                  alt="profile"
                  fill
                  sizes="128px"
                  style={{ objectFit: "contain" }}
                  className="rounded-lg object-cover object-top"
                />
              </div>
            </div>
            
              <div className="flex w-full flex-col gap-2">
                <span> 
                  {profile.name}
                </span>
                <span> 
                  {userProfile?.role?.name}
                </span>
                <div className="flex flex-row justify-between">
                  <p className="text-md font-semibold">
                    $7,350
                    <span className="text-sm text-gray-400">
                      {" of target $15,000"}
                    </span>
                  </p>
                  <p className="text-md font-semibold">{"49%"}</p>
                </div>
                <Progress value={49} />
              </div>
            
          </div>
          <Suspense
            fallback={
              <div className="flex flex-row gap-3">
                <Skeleton className="h-55 w-full rounded-2xl bg-blue-300" />
                <Skeleton className="h-55 w-full rounded-2xl bg-blue-300" />
              </div>
            }
          >
            <CommissionAndSalesCards />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
