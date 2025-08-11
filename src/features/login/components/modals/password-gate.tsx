"use client";

import { useEffect } from "react";
import { useSupabase } from "@/lib/supabase/provider";
import { useContext, useState } from "react";
import { ModalContext } from "@/providers/modal";
import { UpdatePasswordDialog } from "@/features/login/components/modals/update-password-dialog";

export function ClientPasswordGate() {
  const supabase = useSupabase();
  const modal = useContext(ModalContext);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!isMounted || !user) {
        setChecked(true);
        return;
      }
      const mustUpdate = (user.user_metadata as Record<string, unknown>)?.must_update_password as boolean | undefined;
      if (mustUpdate) {
        modal.openDialog(<UpdatePasswordDialog />);
      }
      setChecked(true);
    })();
    return () => {
      isMounted = false;
    };
  }, [supabase, modal]);

  if (!checked) return null;
  return null;
} 