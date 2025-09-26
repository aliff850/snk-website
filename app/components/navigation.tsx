"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
// import AnimateOnLoad from "./ui/AnimateOnLoad"
// import { Button } from "@/components/ui/button"
// import { Car } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // const scrollToSection = (sectionId: string) => {
  //   const element = document.getElementById(sectionId)
  //   if (element) {
  //     element.scrollIntoView({ behavior: "smooth" })
  //   }
  // }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex flex-col justify-center items-center p-4 font-onest">
      <div className={`container md:py-3 md:px-8 transition-all duration-300 md:backdrop-blur-sm md:border md:border-brand-white/20 w-full max-w-7xl rounded-full ${
        isScrolled ? "md:bg-brand-white md:backdrop-blur-md md:shadow-lg text-foreground" : "md:bg-brand-white/30 text-brand-white"
      }`}
      >
      <div className="flex md:grid md:grid-cols-3 items-center">

          <Link href="/" className="hidden md:flex items-center gap-2 group">
            {/* <span className="text-xl font-bold text-brand">SNK Market Data Research</span> */}
            <Image src="/placeholder.svg" alt="Site logo" className="group-hover:scale-105 transition-all duration-300" width={90} height={0} />
          </Link>

          <div id="navigations" className="hidden md:flex justify-center justify-self-center items-center gap-8">
            <Link
              href="/about"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap">
                About Us
                <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-20 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>
            <Link
              href="/services"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap">
                Our Services
                <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-24 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>
            <Link
              href="/news"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap">
                Latest News
                <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-24 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>
            <Link
              href="/contact"
              className="hover:text-brand transition-colors overflow-hidden group relative whitespace-nowrap">
                Contact
                <hr className="hidden md:block absolute w-full rounded-full border border-brand/80 right-20 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>

          </div>

          <div className="ml-auto md:ml-0 justify-self-end flex items-center gap-3">

            <button
              type="button"
              aria-label="Toggle navigation menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 shrink-0 rounded-xl border border-brand-white/40 bg-white/70 backdrop-blur hover:bg-white transition-colors"
            >
              {/* INSANE HAMBURGER ANIMATIONS */}

              <span className="sr-only">Open menu</span>
              <span className={`relative block w-5 h-3.5 transition-all`}>
                <span className={`absolute left-0 top-0 h-0.5 w-5 bg-foreground transition-transform ${isMenuOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
                <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-foreground transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute left-0 bottom-0 h-0.5 w-5 bg-foreground transition-transform ${isMenuOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
              </span>
            </button>

            <div className="md:block hidden">
              <Link href="/login" className="flex items-center text-brand-white hover:bg-brand hover:scale-105 transition-all px-4 py-2 rounded-xl bg-brand/80">
                Log In
                {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in ml-2"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg> */}
              </Link>
            </div>
          </div>

        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden rounded-2xl border border-brand-white/30 bg-white shadow-md transition-all duration-300 ${
            isMenuOpen ? 'mt-3 opacity-100 scale-100 max-h-96' : 'mt-0 opacity-0 scale-95 max-h-0'
          }`}
        >
          <div className={`flex flex-col gap-4 p-8 ${isMenuOpen ? 'py-8' : 'py-8'}`}>

            {isMenuOpen && (
              <Link href="/" className="flex items-center justify-center md:hidden">
                <Image src="/placeholder.svg" alt="Site logo" width={90} height={0} />
              </Link>
            )}

            <Link href="/about" className="text-foreground hover:bg-brand-white/60 transition-colors" onClick={() => setIsMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/services" className="text-foreground hover:bg-brand-white/60 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Our Services
            </Link>
            <Link href="/news" className="text-foreground hover:bg-brand-white/60 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Latest News
            </Link>
            <Link href="/contact" className="text-foreground hover:bg-brand-white/60 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>

            <hr className="border border-brand/20 w-full"/>

            <Link href="/login" className="flex items-center text-foreground hover:bg-brand-white/60 transition-colors" onClick={() => setIsMenuOpen(false)}>
              Log In
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in-icon lucide-log-in ml-2"><path d="m10 17 5-5-5-5"/><path d="M15 12H3"/><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/></svg> */}
            </Link>

          </div>
        </div>
      </div>

      
    </nav>
  )
}
