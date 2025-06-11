import Image from "next/image";
import Profile from "public/profile.jpg";
import { AppSidebar } from "@/components/app-sidebar";
import { OutlinedButton } from "@/components/ui/outlined_button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Newspaper, ChevronDown, ChevronUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppBarDropdown } from "@/app/dashboard/home/appbar_dropdown";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col">
          // app bar
          <div className="fixed top-0 right-0 flex h-16 w-full items-center justify-end gap-4 border-b border-gray-200 bg-white px-4">
            <OutlinedButton>
              <Newspaper className="h-5 w-5" />
              <span>News</span>
            </OutlinedButton>

            <OutlinedButton>News</OutlinedButton>
            <AppBarDropdown />
            <OutlinedButton>News</OutlinedButton>

          </div>
          // main content
          <main className="bg-sidebar flex w-full pt-16">{children}</main>
          //TODO : fix the scrolling issue in the main content (it has its own
          scrolling)
        </div>
      </SidebarProvider>
    </div>
  );
}
