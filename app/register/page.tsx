"use client";

import AnimateOnLoad from "../components/ui/AnimateOnLoad";
import { Button } from "../components/ui/button";
import Link from "next/link";
import { signup } from "@/utils/authentication";
import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    const signupPromise = signup(formData);

    toast.promise(signupPromise, {
      pending: "Creating account...",
      success: {
        render() {
          // router.push("/");
          return "Successfully registered!";
        },
      },
      error: {
        render({ data }: { data: string }) {
          return String(data) || "An unexpected error occurred";
        },
      },
    });

    try {
      await signupPromise;
      const email = formData.get("email") as string;
      router.push(`/register/confirm?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(String(err) || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="w-full min-h-screen bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
      <div className="w-full h-screen bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-24 py-8 rounded-3xl text-brand-white shadow-lg">
          <AnimateOnLoad className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-4 justify-center items-center">
              <h1 className="text-3xl font-bold text-brand-white">Register</h1>
              <p>Register a new SNK account</p>
            </div>
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <input
                id="name"
                name="fullname"
                type="text"
                placeholder="Full Name"
                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                required
                disabled={isLoading}
              />
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                required
                disabled={isLoading}
              />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password"
                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                required
                disabled={isLoading}
              />

              {/* Maybe another input here asking whether they are individual or from a company? */}

              {error && <p className="text-xs text-red-300">{error}</p>}
              <Button type="submit" variant="secondary" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register"}
              </Button>
            </form>

            <hr className="w-full border border-white/40 rounded-full" />

            <p className="w-full flex items-center justify-center">
              Already have an account?
              <Link
                href="/login"
                className="ml-1 hover:text-brand transition-colors duration-300 underline decoration-dotted underline-offset-2"
              >
                Log In
              </Link>
            </p>
          </AnimateOnLoad>
        </div>
      </div>
    </section>
  );
}
