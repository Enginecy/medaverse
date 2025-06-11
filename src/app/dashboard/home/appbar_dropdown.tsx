"use client";
import { OutlinedButton } from "@/components/ui/outlined_button";

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@radix-ui/react-dropdown-menu";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Profile from "public/profile.jpg";
import { useState } from "react";

export function AppBarDropdown() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu  open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild >
         <OutlinedButton >
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold">John Doe</span>
              <span className="text-xs text-gray-500">Senior Associate</span>
            </div>
            <Image
              src={Profile}
              alt="Profile"
              className="h-10 w-10 rounded-full"
              width={32}
              height={32}
            />
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </OutlinedButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
