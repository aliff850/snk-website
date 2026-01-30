"use client"

import { useAuth } from "../../context/AuthContext"
import { Button } from "../components/ui/button"
import { User, Check, CircleAlert, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { UnderConstruction } from "../components/utility/underconstruction"

export default function AccountPage() {

    // const [isLoading, setIsLoading] = useState(false);
    // const [showPassword, setShowPassword] = useState(false);
    // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { user } = useAuth();

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">

                <div className="py-8"></div>

                <div className="w-full h-full flex flex-col gap-2 md:gap-8 bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-12 py-8 rounded-3xl text-brand-white shadow-lg">

                    <div className="flex items-center gap-2">
                        <User className="w-6 h-6" />
                        <h1 className="text-3xl font-bold text-brand-white">Manage Your Account</h1>
                    </div>

                    <UnderConstruction />

                    {/* <div className="h-full flex flex-col justify-center items-center gap-2">
                        <Construction className="w-8 h-8 text-brand-white" />
                        <p className="text-center text-xl text-brand-white">Under Construction</p>
                    </div> */}

                    {/* <form
                        className="w-full flex flex-col gap-8"
                    >
                        <input
                            type="text"
                            placeholder={user?.full_name}
                            className="border border-white/40 bg-white/10 placeholder:text-brand-white px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full"
                        />

                        <input
                            type="text"
                            placeholder={user?.email}
                            className="border border-white/40 bg-white/10 placeholder:text-brand-white px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full"
                        />

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

                        <div className="w-full flex justify-end">
                            <Button type="submit" variant="secondary" size="sm">
                                Save Changes <Check className="ml-2" />
                            </Button>
                        </div>

                    </form> */}



                </div>
            </div>
        </section>
    )
}
