"use client"

import AnimateOnLoad from "../../components/ui/AnimateOnLoad"
// import Link from "next/link"
import { Button } from "../../components/ui/button"
import { ArrowRight, CircleAlert, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Function to check whether both password fields match
    const checkPasswordMatch = () => {
        const password = document.getElementById("password") as HTMLInputElement;
        const confirmPassword = document.getElementById("confirm-password") as HTMLInputElement;
        const passwordMatchError = document.getElementById("password-match-error") as HTMLParagraphElement;
        if (password.value !== confirmPassword.value) {
            passwordMatchError.classList.remove("hidden");
        } else {
            passwordMatchError.classList.add("hidden");
        }
    }

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
                <div className="w-full max-w-xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-24 py-8 rounded-3xl text-brand-white shadow-lg">
                    <AnimateOnLoad className="w-full flex flex-col gap-8">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <h1 className="text-3xl font-bold text-brand-white">Reset Password</h1>
                            <p className="text-center">Enter your new password.</p>
                        </div>

                        <form
                            className="w-full flex flex-col gap-4"
                        >
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-white/60 hover:text-brand-white transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeOff size={20} />
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full pr-12"
                                    required
                                    onChange={checkPasswordMatch}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-white/60 hover:text-brand-white transition-colors duration-200"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeOff size={20} />
                                    )}
                                </button>
                            </div>
                            <p id="password-match-error" className="hidden text-xs text-red-300 flex items-center gap-2"><CircleAlert className="w-4 h-4" />Passwords do not match</p>
                            <Button type="submit" variant="secondary">
                                Reset Password <ArrowRight className="ml-2" />
                            </Button>
                        </form>
                    </AnimateOnLoad>
                </div>
            </div>
        </section>
    )
}