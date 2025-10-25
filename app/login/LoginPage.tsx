"use client";

import { Button } from "../components/ui/button";
import AnimateOnLoad from "../components/ui/AnimateOnLoad";
import Link from "next/link";
import { login } from "@/utils/authentication";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const loginPromise = login(formData);

    toast.promise(loginPromise, {
      pending: "Logging in...",
      success: {
        render() {
          return "Successfully logged in!";
        },
      },
      error: {
        render({ data }: { data: any }) {
          const message =
            typeof data?.message === "string"
              ? data.message
              : typeof data === "string"
              ? data
              : undefined;
          return message || "An unexpected error occurred";
        },
      },
    });

    try {
      await loginPromise;
      router.push("/");
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-svh bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
      <div className="w-full h-svh bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-24 py-8 rounded-3xl text-brand-white shadow-lg">
          <AnimateOnLoad className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4 justify-center items-center">
              <h1 className="text-3xl font-bold text-brand-white">Log In</h1>
              <p>Log into your SNK account</p>
            </div>

            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                required
                disabled={isLoading}
              />
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
                    <Eye size={20}/>
                  ) : (
                    <EyeOff size={20}/>
                  )}
                </button>
              </div>

              {error && <p className="text-xs text-red-300">{error}</p>}
              <Button type="submit" variant="secondary" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <hr className="w-full border border-white/40 rounded-full" />

            <p className="w-full flex items-center justify-center">
              No account yet?
              <Link
                href="/register"
                className="ml-1 hover:text-brand transition-colors duration-300 underline decoration-dotted underline-offset-2"
              >
                Register now
              </Link>
            </p>
          </AnimateOnLoad>
        </div>
      </div>
    </section>
  );
}


