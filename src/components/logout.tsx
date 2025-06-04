"use client";

import { useRouter } from "next/navigation";
import { useSupabase } from "../lib/supabase/provider";
import { Button } from "./ui/button";

export function Logout() {
  const supabase = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return <Button onClick={handleLogout}>Sign Out</Button>;
}
