import { Button } from "@/components/ui/button";
import { EditProfileDrawer } from "@/features/dashboard/home/components/edit-profile-drawer";
import type { User } from "@/features/dashboard/user-management/server/db/user-management";
import { useShowDrawer } from "@/lib/react-utils";
import { Edit } from "lucide-react";

export function EditProfileButton(
  {profile} : { profile : User }
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
