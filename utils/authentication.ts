"use server";

import { createClient } from "./supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data, error } = await supabase.auth.signInWithPassword(auth_data);
  if (error) return { success: false, error: error.message };
  return { success: true, error: ''};
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const auth_data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        fullname: formData.get("fullname") as string,
      },
    },
  };

  const { data, error } = await supabase.auth.signUp(auth_data);
  if (error) { return { success: false, error: error.message }; }
  return { success: true, error: ''} 
}

export async function signout() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();
  if (error) return { success: false, error: error.message };
  return { success: true, error: ''}
}
