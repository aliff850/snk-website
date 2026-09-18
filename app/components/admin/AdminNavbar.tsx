"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Settings, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function AdminNavbar() {
    const router = useRouter();
    const { logout } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="w-full border-b border-white/10 bg-black/40 backdrop-blur-md px-6 py-4 flex items-center justify-between">
            {/* Left: SNK Logo (takes user to original home page) */}
            <div 
                onClick={() => router.push('/')} 
                className="cursor-pointer flex items-center gap-2"
            >
                <img src="/images/snk-logo.png" alt="SNK" className="h-8 object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                <span className="font-bold tracking-wider text-lg">snk</span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-8 bg-black/60 border border-white/10 px-8 py-2 rounded-full text-sm">
                <Link href="/admin" className="text-white hover:text-red-400 transition-colors font-medium">Home</Link>
                <Link href="/admin/staff" className="text-gray-400 hover:text-white transition-colors">Staff</Link>
                <Link href="/admin/clients" className="text-gray-400 hover:text-white transition-colors">Clients</Link>
            </div>

            {/* Right: User Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="p-2.5 rounded-full border border-white/20 bg-black/60 hover:bg-white/10 transition-colors flex items-center justify-center text-white"
                >
                    <User className="w-5 h-5" />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-black/95 border border-white/20 rounded-2xl shadow-2xl py-2 z-50 backdrop-blur-xl text-sm">
                        <div className="px-4 py-2 border-b border-white/10 text-xs text-gray-400 font-mono">
                            Master Administrator
                        </div>

                        {/* Go to Master's Page */}
                        <button 
                            onClick={() => { setDropdownOpen(false); router.push('/admin'); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-3 text-white transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4 text-red-500" />
                            Go to Master's Page
                        </button>

                        <button 
                            onClick={() => { setDropdownOpen(false); router.push('/admin/manage-account'); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                        >
                            <Settings className="w-4 h-4 text-gray-400" />
                            Manage Account
                        </button>

                        <div className="border-t border-white/10 my-1"></div>

                        <button 
                            onClick={() => { logout(); router.push('/login'); }}
                            className="w-full text-left px-4 py-2.5 hover:bg-red-500/20 flex items-center gap-3 text-red-400 transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}
