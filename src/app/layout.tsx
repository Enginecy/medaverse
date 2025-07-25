import "@/styles/globals.css";

import { type Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { SupabaseClientProvider } from "@/lib/supabase/provider";
import { QueryProvider } from "@/providers/client-query";
import { ModalProvider } from "@/providers/modal";

export const metadata: Metadata = {
  title: "Medaverse",
};

// const urbanist = Urbanist({
//   subsets: ["latin"],
// });

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <SupabaseClientProvider>
        <html lang="en" >
          <body>
            <ModalProvider>
              {children}
              <Toaster />
            </ModalProvider>
          </body>
        </html>
      </SupabaseClientProvider>
    </QueryProvider>
  );
}
