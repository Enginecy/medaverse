"use client";
import { Edit, Mails, MapPin, Phone, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoTile } from "@/features/dashboard/profile/components/info-tile";
import { useAuth } from "@/hooks/auth";

export function PersonalInfoCard() {
  const { isLoading, user } = useAuth();
  return (
    <Card className="w-1/3 rounded-2xl">
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
              <Image
                src={user?.profile?.avatar_url || ""}
                alt="profile"
                fill
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <p className="text-lg font-semibold">{user?.profile?.name}</p>
                <p className="text-md text-muted-foreground">
                  {user?.profile?.role}
                </p>
              </div>
            </div>
          </div>
        </div>
        <InfoTile icon={<User />} title="Username" content={user?.profile?.username} />
        <InfoTile icon={<Phone />} title="Phone" content={user?.user.phone} />
        <InfoTile
          icon={<MapPin />}
          title="Address"
          content={user?.profile?.address}
        />
        <InfoTile
          icon={<MapPin />}
          title="Address"
          content={user?.profile?.address}
        />
        <InfoTile icon={<Mails />} title="Email" content={user?.user.email} /> 
      </CardContent>
    </Card>
  );
}
