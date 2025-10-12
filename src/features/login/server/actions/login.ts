"use server";
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

export async function loginWithPassword({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<ActionResult<typeof data>> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: {
        message: error.message,
        statusCode: 400,
        details: error.code?.toString() ?? "Unknown error",
      },
    };
  }
  return {
    success: true,
    data,
  };
}

export async function updatePasswordAndClearFlag({
  newPassword,
}: {
  newPassword: string;
}): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();
  if (getUserError || !user) {
    return {
      success: false,
      error: {
        message: getUserError?.message ?? "Not authenticated",
        statusCode: 401,
        details: "You must be logged in to update your password.",
      },
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
    data: { must_update_password: false },
  });
  if (updateError) {
    return {
      success: false,
      error: {
        message: updateError.message,
        statusCode: 400,
        details: updateError.cause?.toString() ?? "Unknown error",
      },
    };
  }
  return { success: true, data: undefined };
}

export async function sendPasswordResetEmail(
  email: string,
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/auth/reset-password`,
  });

  if (error) {
    if (error.code === "over_email_send_rate_limit") {
      return {
        success: false,
        error: {
          message: "Too many requests",
          statusCode: 429,
          details: "Please wait a few minutes before trying again",
        },
      };
    }
    return {
      success: false,
      error: {
        message: "Failed to send reset email",
        statusCode: 400,
        details: error.message,
      },
    };
  }

  return { success: true, data: undefined };
}

export async function resetPassword(
  newPassword: string,
): Promise<ActionResult<void>> {
  const supabase = await createClient();

  const {
    data: { user },
    error: getUserError,
  } = await supabase.auth.getUser();

  if (getUserError || !user) {
    return {
      success: false,
      error: {
        message: "Invalid or expired reset link",
        statusCode: 401,
        details: "Please request a new password reset link",
      },
    };
  }

  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return {
      success: false,
      error: {
        message: "Failed to update password",
        statusCode: 400,
        details: updateError.message,
      },
    };
  }

  return { success: true, data: undefined };
}
