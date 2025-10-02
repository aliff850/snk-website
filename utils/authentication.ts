"use server";

import { createClient } from "./supabase/server";

type AuthResult = {
  ok: boolean;
  message?: string;
};

function toSafeMessage(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  const normalized = message.toLowerCase();
  if (normalized.includes("invalid login") || normalized.includes("invalid credentials")) {
    return "Invalid email or password.";
  }
  if (normalized.includes("email not confirmed") || normalized.includes("email not confirmed")) {
    return "Please confirm your email before logging in.";
  }
  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "An account with this email already exists.";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "Too many attempts. Please try again later.";
  }
  if (normalized.includes("password should be at least") || normalized.includes("password requirements")) {
    return "Password must be at least 8 characters long and include uppercase, lowercase, digits, and symbols.";
  }
  return "Unable to complete the request. Please try again.";
}

export async function login(formData: FormData) {
  const supabase = await createClient();
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { data, error } = await supabase.auth.signInWithPassword(auth_data);
    if (error) {
      return { ok: false, message: toSafeMessage(error.message) } as AuthResult;
    }
    return { ok: true } as AuthResult;
  } catch (err: any) {
    return { ok: false, message: toSafeMessage(err?.message) } as AuthResult;
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("fullname") as string,
        // not sure what user metadata to save for account creation
      },
      redirectTo: `${process.env.NODE_ENV === "development" ? "http://127.0.0.1:3000" : process.env.NEXT_PUBLIC_APP_URL}`,
    },
  };

  try {
    const { data, error } = await supabase.auth.signUp(auth_data);
    if (error) {
      return { ok: false, message: toSafeMessage(error.message) } as AuthResult;
    }
    return { ok: true } as AuthResult;
  } catch (err: any) {
    return { ok: false, message: toSafeMessage(err?.message) } as AuthResult;
  }
}

export async function signout() {
  const supabase = await createClient();

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { ok: false, message: toSafeMessage(error.message) } as AuthResult;
    }
    return { ok: true } as AuthResult;
  } catch (err: any) {
    return { ok: false, message: toSafeMessage(err?.message) } as AuthResult;
  }
}
