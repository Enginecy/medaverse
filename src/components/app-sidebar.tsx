"use client";
import { DollarSign, Grid2x2, LogOut, Users } from "lucide-react";
import Image from "next/image";
import logo from "public/meda_health_logo.png";

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
  {
    title: "User Management",
    url: "/dashboard/user-management",
    icon: Users,
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: DollarSign,
  },
];

export function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-border border-b py-[22.5px]">
        <Image
          className="mx-auto w-40"
          src={logo}
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
          <SidebarMenuButton
            className="text-red-500 transition-colors hover:bg-red-50
              hover:text-red-700 active:bg-red-100 active:text-red-800"
          >
            log out
            <LogOut className="ml-auto" />
          </SidebarMenuButton>
        </Logout>
      </SidebarFooter>
    </Sidebar>
  );
}
