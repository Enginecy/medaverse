import { Avatar, AvatarImage } from "@/components/ui/avatar";

type UserChipProps = {
  user: {
    name: string;
    email: string | null;
    avatar?: string;
  };
};
export function UserChip({ user }: UserChipProps) {
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} />
      </Avatar>
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-muted-foreground text-sm">{user.email}</div>
      </div>
    </div>
  );
}
