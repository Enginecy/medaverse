import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ProfileButton } from "@/features/dashboard/home/components/profile_button";
import { MailIcon, Newspaper, TrophyIcon, TruckIcon } from "lucide-react";
import { ThemeProvider } from "@/providers/theme";

import Link from "next/link";
import { ClientPasswordGate } from "@/features/login/components/modals/password-gate";

const navItems = [
  {
    title: "Leaderboard",
    icon: TrophyIcon,
    href: "/leaderboard",
  },
  {
    title: "News",
    icon: Newspaper,
    href: "/dashboard/news",
  },
  {
    title: "MedaMail",
    icon: MailIcon,
    href: "https://outlook.office.com/mail",
  },
  {
    title: "Carriers",
    icon: TruckIcon,
    href: "/dashboard/carriers",
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem>
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <nav
              className="border-border bg-card flex h-24 w-full items-center
                justify-end gap-4 border-b px-4"
            >
              {navItems.map((item) => (
                <Link href={item.href ?? "#"} key={item.title}>
                  <Button variant={"outline"} className="py-6">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              ))}
              <ProfileButton />
            </nav>
            <main className="bg-background flex-1 overflow-auto">
              <ClientPasswordGate />
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
