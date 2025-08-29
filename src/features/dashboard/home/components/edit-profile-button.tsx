'use client';

import { Button } from "@/components/ui/button";
import { EditProfileDrawer } from "@/features/dashboard/home/components/edit-profile-drawer";
import type { UserProfile } from "@/features/dashboard/home/server/db/home";
import { useShowDrawer } from "@/lib/react-utils";
import { Edit } from "lucide-react";

export function EditProfileButton(
  {profile} : { profile : UserProfile  }
) {
  const showDrawer = useShowDrawer();

  const handleEditClick = () => showDrawer((resolve) => (
    console.log('Profile to edit:', profile), 
    <EditProfileDrawer resolve={resolve} />
  ));
  
  return (
    <Button variant="outline" className="text-primary" onClick={handleEditClick}>
      <span>Edit Profile</span>
      <Edit />
    </Button>
  );
}
