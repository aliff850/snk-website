"use server"

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

export async function login(formData: FormData) {
    const supabase = await createClient();
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data);
    console.log(data)
    console.log('error: ' + error)

    if (error) return { error: error.message }

    redirect('/')
    return { error: null }
}

export async function signup(formData: FormData) {
    const supabase = await createClient()
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)
    console.log(data)
    console.log('error: ' + error)
    if (error) return { error: error.message }

    redirect('/')
    return { error: null }
}


