import { AppBarDropdown } from "@/app/dashboard/home/appbar_dropdown";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { DockIcon, MailIcon, Newspaper, TruckIcon } from "lucide-react";

const navItems = [
  {
    title: "News",
    icon: Newspaper,
  },
  {
    title: "Docs",
    icon: DockIcon,
  },
  {
    title: "MedaMail",
    icon: MailIcon,
  },
  {
    title: "Carriers",
    icon: TruckIcon,
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <nav
            className="flex h-24 w-full items-center justify-end gap-4 border-b
              border-gray-200 bg-white px-4"
          >
            {navItems.map((item) => (
              <Button key={item.title} variant={"outline"} className="py-6">
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Button>
            ))}
            <AppBarDropdown />
          </nav>
          <main className="bg-sidebar flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
