"use client";

import AnimateOnLoad from "@/app/components/ui/AnimateOnLoad";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { toast } from "react-toastify";

export default function ConfirmRegistration() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialEmail = useMemo(
    () => searchParams.get("email") || "",
    [searchParams]
  );
  const [email, setEmail] = useState(initialEmail);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!email) return;
    // Keep URL in sync with entered email (so refresh/back keeps it)
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("email", email);
    router.replace(`?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleResend = async () => {
    if (!email) {
      toast.error("Please enter your email to resend the confirmation.");
      return;
    }
    setIsLoading(true);
    const supabase = createClient();
    const resendPromise = supabase.auth.resend({ type: "signup", email });

    toast.promise(resendPromise, {
      pending: "Resending confirmation email...",
      success: "Confirmation email sent! Please check your inbox.",
      error: {
        render({ data }: { data: any }) {
          const err = (data && (data as any).error) || data;
          return String(err?.message || err || "Failed to resend email");
        },
      },
    });

    try {
      const { error } = await resendPromise;
      if (error) throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-[url('/images/w214.jpg')] bg-cover bg-center font-onest">
      <div className="w-full min-h-screen bg-black/50 px-4 md:px-12 lg:px-24 py-16 flex flex-col justify-center items-center">
        <div className="w-full max-w-xl flex flex-col justify-center items-center bg-brand-white/10 backdrop-blur-sm border border-brand-white/30 px-8 md:px-24 py-8 rounded-3xl text-brand-white shadow-lg">
          <AnimateOnLoad className="w-full flex flex-col gap-8">
            <div className="flex flex-col gap-2 justify-center items-center text-center">
              <h1 className="text-3xl font-bold text-brand-white">
                Confirm your email
              </h1>
              <p className="text-brand-white/90">
                We sent a confirmation link to your email address.
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              <label htmlFor="email" className="text-sm text-brand-white/80">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="border border-white/40 bg-white/10 placeholder:text-brand-white/60 px-4 text-brand-white py-2 transition-all duration-200 rounded-full outline-none focus:border-brand"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-brand-white/70">
                Didn’t receive the email? Check your spam folder or resend
                below.
              </p>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-3 md:gap-4">
              <Button
                onClick={handleResend}
                variant="secondary"
                disabled={isLoading}
              >
                {isLoading ? "Resending..." : "Resend email"}
              </Button>
              <Link
                href="/login"
                className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 rounded-full border border-white/40 bg-white/10 text-brand-white hover:bg-white/20 transition-colors"
              >
                Back to Log In
              </Link>
            </div>

            <hr className="w-full border border-white/40 rounded-full" />

            <div className="w-full text-sm text-brand-white/80">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  The confirmation link expires after 10 minutes. If it expires,
                  resend.
                </li>
                <li>
                  Make sure the email address above is correct before resending.
                </li>
              </ul>
            </div>
          </AnimateOnLoad>
        </div>
      </div>
    </section>
  );
}
