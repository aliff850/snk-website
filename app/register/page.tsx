import AnimateOnLoad from "../components/ui/AnimateOnLoad"
import { Button } from "../components/ui/button"
import Link from "next/link"

export default function Register() {
    
    return(
        <section className="w-full min-h-screen bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
            <div className="w-full h-screen bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">

            <div className="w-full max-w-xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-24 py-8 rounded-3xl text-brand-white shadow-lg">

                    <AnimateOnLoad className="w-full flex flex-col gap-8">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <h1 className="text-3xl font-bold text-brand-white">
                                Register
                            </h1>
                            <p>Register a new SNK account</p>
                        </div>

                        <form className="w-full flex flex-col gap-4">
                            <input
                                id="name"
                                type="text"
                                placeholder="Full Name"
                                className="uppercase placeholder:normal-case border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                                required
                            />
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                                required
                            />
                            <input
                                id="password"
                                type="password"
                                placeholder="Password"
                                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                                required
                            />

                            {/* Maybe another input here asking whether they are individual or from a company? */}

                            <Button type="submit" variant="secondary">
                                Register
                            </Button>
                        </form>

                        <hr className="w-full border border-white/40 rounded-full"/>

                        <p className="w-full flex items-center justify-center">
                            Already have an account? 
                            <Link href="/login" className="ml-1 hover:text-brand transition-colors duration-300">Log In</Link>
                        </p>

                    </AnimateOnLoad>
                </div>

            </div>
        </section>
    )
}