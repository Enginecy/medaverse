import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileButton } from "@/features/dashboard/home/components/profile_button";
import { HelpingHand, MailIcon, Newspaper, TrophyIcon, TruckIcon } from "lucide-react";
import { ThemeProvider } from "@/providers/theme";

import Link from "next/link";
import { ClientPasswordGate } from "@/features/login/components/modals/password-gate";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Leaderboard",
    icon: TrophyIcon,
    href: "/leaderboard",
    newWindow: true,
    style:
      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
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
  {
    title: "Support",
    icon: HelpingHand,
    href: "https://api.leadconnectorhq.com/widget/form/9iGj1DgBj0lIfXkEG8kQ",
    newWindow: true,
  }
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider attribute="class" forcedTheme="light" enableSystem>
      <SidebarProvider>
        <div
          className="flex h-screen w-full max-w-full overflow-hidden
            bg-gradient-to-tl from-[#a3d7ff] from-30% to-white to-70%"
        >
          <AppSidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <nav
              className="flex h-16 w-full items-center justify-between gap-2
                bg-transparent px-2 md:h-20 md:justify-end md:gap-4 md:px-4
                lg:h-24"
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
                      variant={"default"}
                      className={cn(
                        `hover:bg-primary min-h-[43px] rounded-full bg-white
                        px-8 py-6 text-black hover:cursor-pointer
                        hover:text-white md:min-h-auto`,
                        item.style,
                      )}
                    >
                      <item.icon className="md:h-5 md:w-5" size={1} />
                      <span className="hidden sm:inline">{item.title}</span>
                    </Button>
                  </Link>
                ))}
                <ProfileButton />
              </div>
            </nav>
            <main
              className="min-w-0 flex-1 overflow-auto bg-transparent p-2 md:p-4
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
