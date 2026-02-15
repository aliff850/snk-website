"use client"

import AnimateOnLoad from "@/components/ui/AnimateOnLoad"
import LoginContainer from "@/components/ui/LoginContainer"
// import Link from "next/link"
import { Button } from "@/app/components/ui/ButtonComponent"
import { ArrowRight, CircleAlert, Eye, EyeOff } from "lucide-react"
import { useState, useEffect } from "react"
import { resetPassword } from "@/utils/authentication"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check hash for specific error params (from previous step)
        const hash = window.location.hash;
        if (hash && hash.includes("error=")) {
            const params = new URLSearchParams(hash.substring(1)); // Remove the #
            const errorDescription = params.get("error_description");
            const errorCode = params.get("error_code");

            if (errorDescription) {
                // Decode + as space if needed, though URLSearchParams usually handles it
                toast.error(errorDescription.replace(/\+/g, " "));

                // If token expired, redirect back to forgot password to try again
                if (errorCode === "otp_expired") {
                    router.push("/forgot-password");
                }
            }
        }
    }, [router]);

    // Function to check whether both password fields match
    const checkPasswordMatch = () => {
        const password = document.getElementById("password") as HTMLInputElement;
        const confirmPassword = document.getElementById("confirm-password") as HTMLInputElement;
        const passwordMatchError = document.getElementById("password-match-error") as HTMLParagraphElement;
        if (password.value !== confirmPassword.value) {
            passwordMatchError.classList.remove("hidden");
            passwordMatchError.classList.add("flex");
        } else {
            passwordMatchError.classList.add("hidden");
            passwordMatchError.classList.remove("flex");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const password = (e.currentTarget.elements.namedItem('password') as HTMLInputElement).value;
        const confirmPassword = (e.currentTarget.elements.namedItem('confirm-password') as HTMLInputElement).value;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        try {
            const result = await resetPassword(formData);
            if (result.ok) {
                toast.success(result.message);
                router.push('/forgot-password/reset-success');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
                <LoginContainer>
                    <AnimateOnLoad className="w-full flex flex-col gap-4 md:gap-8">
                        <div className="flex flex-col gap-2 md:gap-4 justify-center items-center">
                            <h1 className="text-2xl md:text-3xl font-bold text-brand-white">Reset Password</h1>
                            <p className="text-center">Enter your new password.</p>
                        </div>

                        <form
                            className="w-full flex flex-col gap-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full pr-12"
                                    required
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                            <p id="password-match-error" className="hidden text-xs text-red-300 items-center gap-2"><CircleAlert className="w-4 h-4" />Passwords do not match</p>
                            <Button type="submit" variant="secondary" disabled={isLoading}>
                                {isLoading ? "Updating..." : <>Reset Password <ArrowRight className="ml-2" /></>}
                            </Button>
                        </form>
                    </AnimateOnLoad>
                </LoginContainer>
            </div>
        </section>
    )
}