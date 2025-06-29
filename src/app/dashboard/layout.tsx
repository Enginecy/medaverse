import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProfileButton } from "@/features/dashboard/home/components/profile_button";
import { DockIcon, MailIcon, Newspaper, TruckIcon } from "lucide-react";
import Link from "next/link";

const navItems = [
  {
    title: "News",
    icon: Newspaper,
    link : "/dashboard/news",
  },
  {
    title: "Docs",
    icon: DockIcon,
    link : "/dashboard/docs",
  },
  {
    title: "MedaMail",
    icon: MailIcon,
    link : "/dashboard/medamail",
  },
  {
    title: "Carriers",
    icon: TruckIcon,
    link : "/dashboard/carriers",
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
            className="border-border bg-card flex h-24 w-full items-center
              justify-end gap-4 border-b px-4"
          >
            {navItems.map((item) => (
              <Button key={item.title} variant={"outline"} className="py-6" asChild>
                <Link href={item.link} >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            ))}
            <ProfileButton />
          </nav>
          <main className="bg-background flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
