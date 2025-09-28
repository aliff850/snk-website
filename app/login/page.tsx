import { Button } from "../components/ui/button"
import AnimateOnLoad from "../components/ui/AnimateOnLoad"

export default function Login() {
    return(
        
        <section className="w-full min-h-screen bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">

            <div className="w-full h-screen bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">

                

                    <div className="w-full max-w-2xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-16 py-8 rounded-3xl text-brand-white shadow-lg">

                        <AnimateOnLoad className="w-full flex flex-col gap-8">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <h1 className="text-3xl font-bold text-brand-white">
                                Log In
                            </h1>
                            <p>Log into your account</p>
                        </div>

                        <form className="w-full flex flex-col gap-4">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Email"
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white/70 px-4 text-brand-white py-2 transition-all duration-200 rounded-full"
                                    required
                                />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    className="border border-white/40 bg-white/10 placeholder:text-brand-white/70 px-4 text-brand-white py-2 transition-all duration-200 rounded-full"
                                    required
                                />

                                <Button type="submit" variant="secondary">
                                    Log In
                                </Button>
                        </form>
                        </AnimateOnLoad>
                    </div>

            </div>

        </section>
    
    )
}