"use server";

import { createClient } from "./supabase/server";
import { unstable_noStore as noStore } from "next/cache";
import { getAuthErrorMessage } from "./supabase/errors";


export async function login(formData: FormData) {
  const supabase = await createClient();
  noStore()
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(auth_data);
  if (error) return { ok: false, message: getAuthErrorMessage(error) }
  const user = {
    email: data.user.email,
    full_name: data.user.user_metadata.full_name,
    role: data.user.user_metadata.role
  }
  return { ok: true, user: user };
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  noStore()
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("fullname") as string,
        role: "user",
        tokens_remaining: 3,
        tokens_per_week: 3,
        last_refill_at: new Date().toISOString(),
      },
      redirectTo: `${process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : process.env.NEXT_PUBLIC_APP_URL}`,
    },
  };

  const { data, error } = await supabase.auth.signUp(auth_data);
  if (error) return { ok: false, message: getAuthErrorMessage(error) }
  return { ok: true };
}

export async function forgotPassword(formData: FormData) {
  const supabase = await createClient();
  noStore();
  const email = formData.get("email") as string;
  const origin = process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : process.env.NEXT_PUBLIC_APP_URL;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/forgot-password/reset-password`,
  });

  if (error) return { ok: false, message: getAuthErrorMessage(error) };
  return { ok: true, message: "Password reset link sent to your email." };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  noStore();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  console.log(error?.message)
  if (error) return { ok: false, message: getAuthErrorMessage(error) };
  return { ok: true, message: "Password has been reset successfully." };
}
