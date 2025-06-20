"use server";
import { env } from "@/env";
import { createClient } from "@/lib/supabase/server";

export async function sendEmailOTP(email: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    options: { shouldCreateUser: false },
    email,
  });

  if (error) throw error;
  return data;
}

export async function verifyEmailOtp({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) throw error;
  return data;
}

export async function debugLoginWithPassword({ email }: { email: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: env.AUTOMATIC_LOGIN_PASSWORD,
  });

  if (error) throw error;
  return data;
}
