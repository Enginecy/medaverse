"use client";
import { Grid2x2, LogOut } from "lucide-react";
import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Logout } from "./logout";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard/home",
    icon: Grid2x2,
  },
];

export function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar className="bg-background" collapsible="icon">
      <SidebarHeader className="border-b border-gray-200">
        <Image
          className="mx-auto w-40"
          src="/meda_health_logo.png"
          width={300}
          height={300}
          alt="Picture of the author"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isSelected = pathName === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isSelected}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Logout>
          <SidebarMenuButton className="text-red-500 transition-colors hover:bg-red-50 hover:text-red-700 active:bg-red-100 active:text-red-800">
            log out
            <LogOut className="ml-auto" />
          </SidebarMenuButton>
        </Logout>
      </SidebarFooter>
    </Sidebar>
  );
}
