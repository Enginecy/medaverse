"use server";
import { env } from "@/env";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/utils";

export async function sendEmailOTP(
  email: string,
): Promise<ActionResult<typeof data>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    options: { shouldCreateUser: false },
    email,
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return {
        success: false,
        error: {
          message: error.message,
          statusCode: 400,
          details: "Email send rate limit exceeded",
        },
      };
    }
    return {
      success: false,
      error: {
        message: "Email not found",
        statusCode: 400,
        details: "Please check your email and try again",
      },
    };
  }
  return {
    success: true,
    data,
  };
}

export async function verifyEmailOtp({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<ActionResult<typeof data>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: "email",
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: 400,
        details: error.cause?.toString() ?? "Unknown error",
      },
    };
  }
  return {
    success: true,
    data,
  };
}

export async function debugLoginWithPassword({
  email,
}: {
  email: string;
}): Promise<ActionResult<typeof data>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: env.AUTOMATIC_LOGIN_PASSWORD,
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: 400,
        details: error.cause?.toString() ?? "Unknown error",
      },
    };
  }
  return {
    success: true,
    data,
  };
}
