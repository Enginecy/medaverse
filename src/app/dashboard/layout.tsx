import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
    newWindow: true,
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
    newWindow: true,
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
        <div className="flex h-screen w-full max-w-full overflow-hidden">
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <nav
              className="border-border bg-card flex h-16 w-full items-center
                justify-between gap-2 border-b px-2 md:h-20 md:justify-end
                md:gap-4 md:px-4 lg:h-24"
            >
              <SidebarTrigger className="min-h-[44px] min-w-[44px] md:hidden" />
              <div className="flex items-center gap-2 md:gap-4">
                {navItems.map((item) => (
                  <Link
                    href={item.href ?? "#"}
                    key={item.title}
                    target={item.newWindow ? "_blank" : "_self"}
                    rel={item.newWindow ? "noopener noreferrer" : undefined}
                  >
                    <Button
                      variant={"outline"}
                      className="min-h-[44px] px-2 py-3 md:min-h-auto md:px-4
                        md:py-4 lg:py-6"
                      size="sm"
                    >
                      <item.icon className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="hidden sm:inline">{item.title}</span>
                    </Button>
                  </Link>
                ))}
                <ProfileButton />
              </div>
            </nav>
            <main
              className="bg-background min-w-0 flex-1 overflow-auto p-2 md:p-4
                lg:p-6"
            >
              <ClientPasswordGate />
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}
