"use client"

import AnimateOnLoad from "../components/ui/AnimateOnLoad"
// import Link from "next/link"
import { Button } from "../components/ui/button"
import { ArrowRight } from "lucide-react"

export default function ForgotPassword() {
    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
                <div className="w-full max-w-xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-24 py-8 rounded-3xl text-brand-white shadow-lg">
                    <AnimateOnLoad className="w-full flex flex-col gap-8">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <h1 className="text-3xl font-bold text-brand-white">Forgot Password</h1>
                            <p className="text-center">Enter your email address and we'll send you a link to reset your password.</p>
                        </div>

                        <form
                            className="w-full flex flex-col gap-4"
                        // onSubmit={}
                        >
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                                required
                            //disabled={isLoading}
                            />
                            <Button type="submit" variant="secondary">
                                Send Reset Link <ArrowRight className="ml-2" />
                            </Button>
                        </form>
                    </AnimateOnLoad>
                </div>
            </div>
        </section>
    )
}