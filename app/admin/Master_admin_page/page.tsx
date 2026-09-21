"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { ShieldAlert, UserPlus, Users, Database } from "lucide-react"
import AdminNavbar from "@/components/admin/AdminNavbar"

export default function MasterHomePage() {
    const { user } = useAuth();
    const router = useRouter();

    if (user?.role !== 'master_admin' && user?.role !== 'admin') {
        return (
            <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest flex items-center justify-center">
                <div className="bg-black/90 p-8 rounded-3xl border border-red-500/50 text-center shadow-2xl">
                    <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
                    <h1 className="text-2xl font-bold text-white mb-2">Restricted Access</h1>
                    <p className="text-gray-400">This area is restricted to the Master Administrator.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest text-white">
            <div className="w-full min-h-svh bg-black/70 flex flex-col">
                
                {/* Navbar */}
                <AdminNavbar />

                {/* Main Content Area */}
                <div className="flex-1 px-6 md:px-16 lg:px-24 pt-20 pb-16 flex flex-col justify-center max-w-7xl mx-auto w-full">
                    
                    {/* Greeting Header */}
                    <div className="mb-16">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
                            WELCOME BACK<br />
                            <span className="text-white">MY MASTER</span>
                        </h1>
                    </div>

                    {/* Centered Action Buttons */}
                    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
                        <button 
                            onClick={() => alert("Create New User for Staff flow goes here.")}
                            className="w-full py-4 px-6 bg-black/80 hover:bg-white hover:text-black border border-white/20 rounded-full font-semibold transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-3 cursor-pointer group"
                        >
                            <UserPlus className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                            Create New User for Staff
                        </button>

                        <button 
                            onClick={() => alert("Create New User for Client flow goes here.")}
                            className="w-full py-4 px-6 bg-black/80 hover:bg-white hover:text-black border border-white/20 rounded-full font-semibold transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-3 cursor-pointer group"
                        >
                            <Users className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                            Create New User for Client
                        </button>

                        <button 
                            onClick={() => router.push('/admin/database-viewer-page')}
                            className="w-full py-4 px-6 bg-black/80 hover:bg-white hover:text-black border border-white/20 rounded-full font-semibold transition-all duration-300 shadow-lg text-center flex items-center justify-center gap-3 cursor-pointer group"
                        >
                            <Database className="w-5 h-5 text-red-500 group-hover:text-black transition-colors" />
                            View Database or Upload new data
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}