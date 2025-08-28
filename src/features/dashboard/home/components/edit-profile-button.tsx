import { Button } from "@/components/ui/button";
import { EditProfileDrawer } from "@/features/dashboard/home/components/edit-profile-drawer";
import type { UserProfile } from "@/features/dashboard/home/server/db/home";
import { useShowDrawer } from "@/lib/react-utils";
import { Edit } from "lucide-react";

export function EditProfileButton(
  {profile} : { profile : UserProfile  }
) {
  const showDrawer = useShowDrawer();

  const handleEditClick = showDrawer((resolve) => (
    <EditProfileDrawer resolve={resolve} />
  ));
  return (
    <Button variant="outline" className="text-primary">
      <span>Edit Profile</span>
      <Edit />
    </Button>
  );
}
