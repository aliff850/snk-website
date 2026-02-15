"use client"

import { useAuth } from "../../context/AuthContext"
import { Button } from "../components/ui/ButtonComponent"
import { User, Check, CircleAlert, Eye, EyeOff, Cog, Trash, ArrowRight, ChartColumnIncreasing } from "lucide-react"
import { useState } from "react"
// import { UnderConstruction } from "../components/utility/underconstruction"

export function DetailContainer({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-2 md:gap-4 rounded-2xl md:rounded-3xl border border-brand-white/30 bg-brand-white/10 text-brand-white p-4 md:p-6">
            {children}
        </div>
    )
}

export default function AccountPage() {

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // User data from AuthContext
    const { user } = useAuth();

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full min-h-svh bg-black/50 px-4 pb-8 md:px-12 lg:px-24 md:pb-12 pt-24 flex flex-col justify-center items-center overflow-hidden">

                <div className="w-full max-w-7xl flex flex-col gap-4 md:gap-8 backdrop-blur-sm border border-brand-white/30 px-4 md:px-12 py-6 md:py-8 rounded-2xl md:rounded-3xl text-brand-white shadow-lg">

                    <div className="flex items-center gap-2">
                        <Cog className="w-4 h-4 md:w-6 md:h-6" />
                        <h1 className="text-xl md:text-3xl font-bold text-brand-white">Account Management</h1>
                    </div>

                    {/* Account details and subscription section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <DetailContainer>
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4 md:w-6 md:h-6" />
                                <h2 className="text-lg md:text-xl font-bold text-brand-white">Account Details</h2>
                            </div>
                            <div>
                                <p className="font-bold">Name: <span className="font-normal">{user?.full_name}</span></p>
                                <p className="font-bold">Email: <span className="font-normal">{user?.email}</span></p>
                                <p className="font-bold">Role: <span className="font-normal">{user?.role}</span></p>
                            </div>
                        </DetailContainer>

                        {/* The subscription things are placeholders for now */}
                        <DetailContainer>
                            <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-start md:items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ChartColumnIncreasing className="w-4 h-4 md:w-6 md:h-6" />
                                    <h2 className="text-lg md:text-xl font-bold text-brand-white">Valuation Tokens</h2>
                                </div>
                                {/* <Button variant="secondary" size="sm2">Get More <ArrowRight /></Button> */}
                            </div>

                            <div className="flex flex-col items-start">
                                <p className="font-bold text-4xl">0</p>
                                <p>remaining Valuation Tokens.</p>
                            </div>
                        </DetailContainer>


                    </div>

                    {/* Account detail update section */}
                    <DetailContainer>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 md:w-6 md:h-6" />
                            <h2 className="text-lg md:text-xl font-bold text-brand-white">Update Account Details</h2>
                        </div>
                        <form
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full"
                        >
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-xs md:text-sm font-bold text-brand-white ml-2">Full Name</label>
                                <input
                                    type="text"
                                    placeholder={user?.full_name}
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-xs md:text-sm font-bold text-brand-white ml-2">Email Address</label>
                                <input
                                    type="text"
                                    placeholder={user?.email}
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-xs md:text-sm font-bold text-brand-white ml-2">New Password</label>
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
                            </div>

                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-xs md:text-sm font-bold text-brand-white ml-2">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm Password"
                                        className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand w-full pr-12"
                                        required
                                    // onChange={checkPasswordMatch}
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
                            </div>

                            {/* Radio button to receive weekly newsletter */}
                            <div className="flex flex-col gap-1.5 w-full">
                                <label className="text-xs md:text-sm font-bold text-brand-white ml-2">Would you like to receive Weekly Newsletter?</label>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                        <input type="radio" name="newsletter" value="yes" className="w-4 h-4 accent-brand" />
                                        <label className="text-xs md:text-sm font-bold text-brand-white">Yes</label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input type="radio" name="newsletter" value="no" className="w-4 h-4 accent-brand" />
                                        <label className="text-xs md:text-sm font-bold text-brand-white ">No</label>
                                    </div>
                                </div>
                            </div>

                            <p id="password-match-error" className="hidden text-xs text-red-300 flex items-center gap-2"><CircleAlert className="w-4 h-4" />Passwords do not match</p>

                            <div className="md:col-span-2 w-full flex justify-end">
                                <Button type="submit" variant="secondary" size="sm">
                                    Save Changes <Check className="ml-2" />
                                </Button>
                            </div>
                        </form>
                    </DetailContainer>

                    {/* Section to request account deletion */}
                    <DetailContainer>
                        <div className="flex items-center gap-2">
                            <Trash className="w-6 h-6" />
                            <h2 className="text-2xl font-bold">Delete Account</h2>
                        </div>
                        <p className="text-xs md:text-sm">If you would like to request the deletion of your account, please click the button below.</p>
                        <p className="text-xs md:text-sm text-red-300">This action is irreversible and will result in the permanent deletion of your account and all associated data.</p>
                        <div className="md:col-span-2 w-full flex justify-end">
                            <Button variant="secondary" size="sm">
                                Delete Account <Trash className="ml-2" />
                            </Button>
                        </div>
                    </DetailContainer>
                </div>
            </div>
        </section>
    )
}
