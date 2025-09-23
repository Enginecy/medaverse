import { ThemeProvider } from "next-themes";

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" forcedTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  );
}
 