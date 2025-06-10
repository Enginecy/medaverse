import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="fixed" />
        {children}
      </main>
    </SidebarProvider>
  );
}
