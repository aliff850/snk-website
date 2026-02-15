"use client"

import { ArrowRight, CircleCheck } from "lucide-react"
import AnimateOnLoad from "@/components/ui/AnimateOnLoad"
import LoginContainer from "@/components/ui/LoginContainer"
import { Button } from "@/app/components/ui/ButtonComponent"

export default function ResetSuccessPage() {
    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
                <LoginContainer>
                    <AnimateOnLoad className="w-full flex flex-col gap-4 md:gap-8">
                        <div className="flex flex-col gap-2 md:gap-4 justify-center items-center">
                            <CircleCheck className="w-24 h-24" />
                            <h1 className="text-2xl md:text-3xl font-bold text-brand-white">Password Reset</h1>
                            <p className="text-center">Your password has been successfully reset!</p>
                        </div>

                        <Button variant="secondary" className="w-full" href="/login">
                            Return to Login <ArrowRight className="ml-2" />
                        </Button>
                    </AnimateOnLoad>
                </LoginContainer>
            </div>
        </section>
    )
}