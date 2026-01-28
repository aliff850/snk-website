"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { login as loginAction } from "@/utils/authentication";
import { useRouter } from "next/navigation";

interface User {
    email?: string;
    full_name?: string;
    role?: string;
}

interface AuthContextType {
    user: User | null;
    login: (formData: FormData) => Promise<{ ok: boolean; message?: string; user?: User }>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const supabase = createClient();

    const mapUser = (sbUser: SupabaseUser): User => {
        return {
            email: sbUser.email,
            full_name: sbUser.user_metadata?.full_name,
            role: sbUser.user_metadata?.role,
        };
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user: sbUser } } = await supabase.auth.getUser();
                if (sbUser) {
                    setUser(mapUser(sbUser));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(mapUser(session.user));
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (formData: FormData) => {
        const result = await loginAction(formData);
        if (result.ok && result.user) {
            setUser(result.user);
        }
        return result;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push("/login");
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
