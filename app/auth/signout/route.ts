import { type NextRequest } from 'next/server'
import { signout } from '@/utils/authentication'
import { redirect } from 'next/navigation'
// import { useEffect } from "react"
// import { toast } from "react-toastify";

export async function GET(request: NextRequest) {
    signout()
    redirect('/')

    // useEffect(() => {
    //     if (success) toast.success(`Successfully logged in`);
    //     else toast.error("Login attempt failed");
    // }, [])
}