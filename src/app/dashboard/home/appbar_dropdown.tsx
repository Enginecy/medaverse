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
    <DropdownMenu open={open} onOpenChange={setOpen}>
        <OutlinedButton type="button" className="w-full">
      <DropdownMenuTrigger asChild>
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold">John Doe</span>
              <span className="text-xs text-gray-500">Senior Associate</span>
            </div>
            <Image
              src={Profile}
              alt="Profile"
              className="h-10 w-10 rounded-full border border-gray-200 object-cover shadow"
              width={40}
              height={40}
            />
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
      </DropdownMenuTrigger>
        </OutlinedButton>
      <DropdownMenuContent className="z-[9999] w-56 rounded-xl border bg-white p-2 shadow-xl focus:outline-none">
        <DropdownMenuLabel className="font-semibold text-gray-700">
          Account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2">
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2">
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2">
          Billing
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 rounded-md px-3 py-2">
          Help
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer hover:bg-red-100 text-red-600 rounded-md px-3 py-2">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
