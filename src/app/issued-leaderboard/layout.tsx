import { ThemeProvider } from "next-themes";

export default function IssuedLeaderboardLayout({
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
