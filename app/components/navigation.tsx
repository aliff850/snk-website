"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
// import AnimateOnLoad from "./ui/AnimateOnLoad"
// import { Button } from "@/components/ui/button"
// import { Car } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change/reload
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    // Close menu on page reload
    window.addEventListener("beforeunload", handleRouteChange);

    // Close menu on route change (Next.js router events)
    const handlePopState = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("beforeunload", handleRouteChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // const scrollToSection = (sectionId: string) => {
  //   const element = document.getElementById(sectionId)
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth" })
  //   }
  // }

  // Determine auth state on client
  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    // initial check
    supabase.auth.getUser().then(({ data }) => {
      if (!isMounted) return;
      setIsLoggedIn(!!data.user);
    });

    // subscribe to changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session?.user);
      }
    );

    console.log("loggedin", isLoggedIn);
    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center items-center p-4 font-onest">
      <div
        className={`container md:py-3 md:px-8 transition-all duration-300 md:backdrop-blur-lg md:border md:border-brand-white/20 w-full max-w-7xl rounded-full ${
          isScrolled
            ? "md:bg-brand-white md:shadow-lg text-foreground"
            : "text-brand-white"
        }`}
      >
        <div className="flex md:grid md:grid-cols-3 items-center">
          <Link href="/" className="hidden md:flex items-center gap-2 group">
            {/* <span className="text-xl font-bold text-brand">SNK Market Data Research</span> */}
            <Image
              src="/placeholder_3.svg"
              alt="Site logo"
              className="group-hover:scale-105 transition-all duration-300"
              width={130}
              height={0}
            />
          </Link>

          <div
            id="navigations"
            className="hidden md:flex justify-center justify-self-center items-center gap-8"
          >
            <Link
              href="/about"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap"
            >
              About Us
              <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-20 top-5 group-hover:right-0 transition-all duration-150 ease-in-out" />
            </Link>
            <Link
              href="/services"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap"
            >
              Our Services
              <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-24 top-5 group-hover:right-0 transition-all duration-150 ease-in-out" />
            </Link>
            <Link
              href="/news"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap"
            >
              Latest News
              <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-24 top-5 group-hover:right-0 transition-all duration-150 ease-in-out" />
            </Link>
            <Link
              href="/contact"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap"
            >
              Contact
              <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-20 top-5 group-hover:right-0 transition-all duration-150 ease-in-out" />
            </Link>
          </div>

          {/* Mobile menu and Login button */}
          <div className="w-full flex items-center gap-3 md:justify-end">
            {/* Mobile Navigation Bar */}
            <div className="md:hidden flex items-center justify-between w-full px-6 py-3 rounded-xl bg-brand-white shadow-lg">
              <Link
                href="/"
                className="flex items-center justify-center"
              >
                <Image
                  src="/placeholder_3.svg"
                  alt="Site logo"
                  className="hover:scale-105 transition-transform duration-200"
                  width={100}
                  height={0}
                />
              </Link>

              {/* Insane Hamburger Menu Button */}
              <button
                type="button"
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="flex items-center justify-center p-2.5 rounded-lg hover:bg-brand/10 active:bg-brand/20 transition-all duration-200"
              >
                <span className="sr-only">Open menu</span>
                <span className="relative block w-6 h-5">
                  <span
                    className={`absolute left-0 top-0 h-0.5 w-6 bg-foreground transition-all duration-300 ease-in-out rounded-full ${
                      isMenuOpen ? "translate-y-2 rotate-45" : ""
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 top-2 h-0.5 w-6 bg-foreground transition-all duration-300 ease-in-out rounded-full ${
                      isMenuOpen ? "opacity-0 scale-75" : "opacity-100 scale-100"
                    }`}
                  ></span>
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 w-6 bg-foreground transition-all duration-300 ease-in-out rounded-full ${
                      isMenuOpen ? "-translate-y-2 -rotate-45" : ""
                    }`}
                  ></span>
                </span>
              </button>
            </div>

            <div className="hidden md:block">
              {isLoggedIn ? (
                <Link
                  href="/auth/signout"
                  className="flex items-center text-brand-white hover:bg-brand hover:scale-105 transition-all px-4 py-2 rounded-xl bg-brand/80"
                >
                  Sign Out
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center text-brand-white hover:bg-brand hover:scale-105 transition-all px-4 py-2 rounded-xl bg-brand/80"
                >
                  Log In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden rounded-2xl border border-brand-white/30 bg-white shadow-md transition-all duration-300 ${
            isMenuOpen
              ? "mt-3 opacity-100 scale-100 max-h-96"
              : "mt-0 opacity-0 scale-95 max-h-0"
          }`}
        >
          <div
            className={`flex flex-col gap-4 p-8 ${
              isMenuOpen ? "py-8" : "py-8"
            }`}
          >
            {/* <Link href="/" className="flex items-center justify-center md:hidden">
              <Image src="/placeholder.svg" alt="Site logo" width={90} height={0} />
            </Link> */}

            <Link
              href="/about"
              className="text-foreground hover:bg-brand-white/60 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-foreground hover:bg-brand-white/60 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Our Services
            </Link>
            <Link
              href="/news"
              className="text-foreground hover:bg-brand-white/60 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Latest News
            </Link>
            <Link
              href="/contact"
              className="text-foreground hover:bg-brand-white/60 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>

            <hr className="border border-brand/20 w-full" />

            {isLoggedIn ? (
              <Link
                href="/auth/signout"
                className="flex items-center text-foreground hover:bg-brand-white/60 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Out
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center text-foreground hover:bg-brand-white/60 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Log In
              </Link>
            )}
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in ml-2"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg> */}
          </div>
        </div>
      </div>
    </nav>
  );
}
