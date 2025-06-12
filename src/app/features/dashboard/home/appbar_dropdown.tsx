"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Profile from "public/profile.jpg";
import { useState } from "react";

export function AppBarDropdown() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="py-6">
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
              className="border-border h-10 w-10 rounded-full border
                object-cover shadow"
            />
            {open ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
