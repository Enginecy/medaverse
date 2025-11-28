import { ThemeProvider } from "next-themes";

export default function First90LeaderboardLayout({
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

