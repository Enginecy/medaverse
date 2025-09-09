import { Edit, Mails, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTile } from "@/features/dashboard/profile/components/info-tile";
import { getUser } from "@/lib/supabase/server";
import { Skeleton } from "@/components/ui/skeleton";
import { EditProfileButton } from "@/features/dashboard/home/components/edit-profile-button";
import { getUserProfile } from "@/features/dashboard/home/server/db/home";

export async function ProfilePersonalInfoCard() {
  const user = await getUser();
  const userProfile = await getUserProfile();

  return (
    <Card
      className="w-full rounded-3xl border-1 border-gray-200 shadow-none
        md:w-1/2"
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-lg font-semibold">Personal info</p>
          <EditProfileButton profile={userProfile} />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center h-full">
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative h-[150px] w-[150px] rounded-lg">
              <Image
                src={user!.profile!.avatarUrl!}
                alt="profile"
                fill
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <div>
                  <p className="text-lg font-semibold">{user?.profile?.name}</p>
                  <p className="text-md text-muted-foreground">
                    {userProfile?.role?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            {user?.profile?.username && (
              <InfoTile
                icon={<User />}
                title="Username"
                content={user?.profile?.username}
              />
            )}
            {user?.user.phone && (
              <InfoTile
                icon={<Phone />}
                title="Phone"
                content={user?.user.phone}
              />
            )}
            {user?.profile?.office && (
              <InfoTile
                icon={<MapPin />}
                title="Office"
                content={user?.profile?.office}
              />
            )}
            {user?.user.email && (
              <InfoTile
                icon={<Mails />}
                title="Email"
                content={user?.user.email}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProfilePersonalInfoCardSkeleton() {
  return (
    <Card className="w-full rounded-3xl border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <p className="text-lg font-semibold">Personal info</p>
          <Button variant="outline" className="text-primary">
            <span>Edit Profile</span>
            <Edit />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="relative h-[150px] w-[150px] rounded-lg">
              <Skeleton
                className="relative h-[150px] w-[150px] rounded-lg bg-gray-300"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-4 w-25 rounded-2xl bg-gray-300" />
                  <Skeleton className="h-4 w-30 rounded-2xl bg-gray-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <TileSkelton />
        </div>
      </CardContent>
    </Card>
  );
}

function TileSkelton() {
  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex h-10 w-55 flex-row items-center p-2">
        <Skeleton
          className="bg-primary-100 h-9 w-9 items-center justify-center
            rounded-xl"
        />
        <div className="flex flex-col gap-0.5">
          <Skeleton className="h-4 w-20 rounded-2xl bg-gray-200" />
          <Skeleton className="h-4 w-15 rounded-2xl bg-gray-200" />
        </div>
      </div>
      <div className="flex h-10 w-55 flex-row items-center p-2">
        <Skeleton
          className="bg-primary-100 h-9 w-9 items-center justify-center
            rounded-xl"
        />
        <div className="flex flex-col gap-0.5">
          <Skeleton className="h-4 w-25 rounded-2xl bg-gray-200" />
          <Skeleton className="h-4 w-30 rounded-2xl bg-gray-200" />
        </div>
      </div>
      <div className="flex h-10 w-55 flex-row items-center p-2">
        <Skeleton
          className="bg-primary-100 h-9 w-9 items-center justify-center
            rounded-xl"
        />
        <div className="flex flex-col gap-0.5">
          <Skeleton className="h-4 w-25 rounded-2xl bg-gray-200" />
          <Skeleton className="h-4 w-40 rounded-2xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
