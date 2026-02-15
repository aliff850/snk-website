"use client"

import AnimateOnLoad from "@/components/ui/AnimateOnLoad"
import LoginContainer from "@/components/ui/LoginContainer"
// import Link from "next/link"
import { Button } from "@/app/components/ui/ButtonComponent"
import { ArrowRight } from "lucide-react"
import { forgotPassword } from "@/utils/authentication"
import { useState } from "react"
import { toast } from "react-toastify"

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            const result = await forgotPassword(formData);
            if (result.ok) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
                <LoginContainer>
                    <AnimateOnLoad className="w-full flex flex-col gap-4 md:gap-8">
                        <div className="flex flex-col gap-2 md:gap-4 justify-center items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-brand-white">Forgot Password</h1>
                            <p className="text-center">Enter your email address and we'll send you a link to reset your password.</p>
                        </div>

                        <form
                            className="w-full flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                                required
                                disabled={isLoading}
                            />
                            <Button type="submit" variant="secondary" disabled={isLoading}>
                                {isLoading ? "Sending..." : <>Send Reset Link <ArrowRight className="ml-2" /></>}
                            </Button>
                        </form>
                    </AnimateOnLoad>
                </LoginContainer>
            </div>
        </section>
    )
}