"use client";
import {
  DollarSign,
  Grid2x2,
  LogOut,
  Settings,
  Users,
  File,
  LockIcon,
  CalendarDays,
} from "lucide-react";
import Image from "next/image";
import logo from "public/meda_health_logo.png";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { Logout } from "./logout";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    title: "First 90",
    url: "/dashboard/first90",
    icon: CalendarDays,
  },
  {
    title: "Sales",
    url: "/dashboard/sales",
    icon: DollarSign,
  },
  {
    title: "Documents Management",
    url: "/dashboard/docs-management",
    icon: File,
  },
  {
    title: "Admin Settings",
    url: "/dashboard/admin-settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathName = usePathname();
  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-transparent">
      <SidebarHeader className="py-4 md:py-[22.5px]">
        <Image
          className="mx-auto w-32 md:w-40"
          src={logo}
          width={300}
          height={300}
          alt="Meda Health Logo"
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isSelected = pathName.includes(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      size="lg"
                      className={cn(
                        "hover:bg-primary-200 rounded-full p-4",
                        isSelected && "bg-primary text-primary-foreground",
                      )}
                    >
                      <a
                        href={item.url}
                        className={"min-h-[48px] md:min-h-auto"}
                      >
                        <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                        <span className="text-sm md:text-sm">{item.title}</span>
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
        <Link href="/auth/reset-password">
          <SidebarMenuButton
            size="lg"
            className="hover:bg-primary-400 hover:text-primary-foreground
              active:bg-primary-200 active:text-primary-foreground min-h-[48px]
              transition-colors md:min-h-auto"
          >
            <span>Update Password</span>
            <LockIcon className="ml-auto h-5 w-5 md:h-4 md:w-4" />
          </SidebarMenuButton>
        </Link>
        <Logout>
          <SidebarMenuButton
            size="lg"
            className="min-h-[48px] text-red-500 transition-colors
              hover:bg-red-50 hover:text-red-700 active:bg-red-100
              active:text-red-800 md:min-h-auto"
          >
            <span>log out</span>
            <LogOut className="ml-auto h-5 w-5 md:h-4 md:w-4" />
          </SidebarMenuButton>
        </Logout>
      </SidebarFooter>
    </Sidebar>
  );
}
