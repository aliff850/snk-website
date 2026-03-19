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
    tokens_remaining?: number;
    tokens_per_week?: number;
}

interface AuthContextType {
    user: User | null;
    login: (formData: FormData) => Promise<{ ok: boolean; message?: string; user?: User }>;
    logout: () => Promise<void>;
    refreshTokens: () => Promise<void>;
    getAccessToken: () => Promise<string | null>;
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
            tokens_remaining: sbUser.user_metadata?.tokens_remaining,
            tokens_per_week: sbUser.user_metadata?.tokens_per_week,
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

    const refreshTokens = async () => {
        try {
            // refreshSession() forces a new JWT from Supabase with the latest user_metadata.
            // This is necessary because the backend updates metadata via admin API,
            // which doesn't invalidate the client's cached session.
            const { data: { session }, error } = await supabase.auth.refreshSession();
            if (error) {
                console.error("Error refreshing session:", error);
                return;
            }
            if (session?.user) {
                setUser(mapUser(session.user));
            }
        } catch (error) {
            console.error("Error refreshing tokens:", error);
        }
    };

    const getAccessToken = async (): Promise<string | null> => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            return session?.access_token ?? null;
        } catch (error) {
            console.error("Error getting access token:", error);
            return null;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, refreshTokens, getAccessToken, isLoading }}>
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
