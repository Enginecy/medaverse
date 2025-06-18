import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Profile from "public/profile.jpg";

export function ProfileButton() {
  return (
    <Button variant="outline" className="py-6" asChild>
      <Link href="/dashboard/profile">
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold">John Doe</span>
            <span className="text-muted-foreground text-xs">
              Senior Associate
            </span>
          </div>
          <Image
            src={Profile}
            alt="Profile"
            className="border-border h-10 w-10 rounded-full border object-cover
              shadow"
          />
        </div>
      </Link>
    </Button>
  );
}
