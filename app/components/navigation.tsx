"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
// import AnimateOnLoad from "./ui/AnimateOnLoad"
// import { Button } from "@/components/ui/button"
// import { Car } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <nav
      className={`fixed top-4 left-0 right-0 z-50 transition-all duration-300 bg-white/30 backdrop-blur-sm border border-white/20 w-fit mx-auto rounded-3xl ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto py-3 px-8">
        <div className="flex items-center justify-center space-x-8 font-onest">

          <Link href="/" className="flex items-center space-x-2 group">
            {/* <span className="text-xl font-bold text-brand">SNK Market Data Research</span> */}
            <Image src="/placeholder.svg" alt="Site logo" className="group-hover:scale-105 transition-all duration-300" width={90} height={0} />
          </Link>

          <div className="hidden md:flex items-center space-x-8 text-foreground">
            <Link
              href="/about"
              className="hover:text-brand transition-colors overflow-hidden group relative">
                About Us
                <hr className="absolute w-full rounded-full border border-brand/80 right-20 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>
            <Link
              href="/services"
              className="hover:text-brand transition-colors overflow-hidden group relative">
                Our Services
                <hr className="absolute w-full rounded-full border border-brand/80 right-24 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>
            <Link
              href="/news"
              className="hover:text-brand transition-colors overflow-hidden group relative">
                Latest News
                <hr className="absolute w-full rounded-full border border-brand/80 right-24 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>
            <Link
              href="/contact"
              className="hover:text-brand transition-colors overflow-hidden group relative">
                Contact
                <hr className="absolute w-full rounded-full border border-brand/80 right-20 top-5 group-hover:right-0 transition-all duration-150 ease-in-out"/>
            </Link>

          </div>

        </div>
      </div>

      
    </nav>
  )
}
