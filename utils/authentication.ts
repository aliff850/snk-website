"use server";

import { createClient } from "./supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(auth_data);
  if (error) throw error.message;
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

  const { data, error } = await supabase.auth.signUp(auth_data);
  if (error) throw error.message;
}

export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) throw error.message;
}
