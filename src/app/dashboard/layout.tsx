import { AppSidebar } from "../../components/app-sidebar";
import { SidebarProvider } from "../../components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="bg-sidebar w-full">{children}</main>
    </SidebarProvider>
  );
}
