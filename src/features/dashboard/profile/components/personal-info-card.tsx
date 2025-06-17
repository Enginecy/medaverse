import { Edit } from "lucide-react";
import Image from "next/image";
import profile from "public/profile.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PersonalInfoCard() {
  return (
    <Card className="w-1/3 rounded-4xl">
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
                src={profile}
                alt="profile"
                fill
                className="rounded-lg object-cover object-top"
              />
            </div>
            <div className="flex grow flex-col gap-6">
              <div className="flex flex-col items-start">
                <p className="text-lg font-semibold">John Doe</p>
                <p className="text-md text-muted-foreground">
                  Senior Associate
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
