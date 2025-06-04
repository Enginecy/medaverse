import { useSupabase } from "@/lib/supabase/provider";
import { ORM } from "../lib/supabase/orm";

export function useORM() {
  const supabase = useSupabase();

  return new ORM(supabase);
}
