import * as React from "react"
import Link from "next/link"
import { Target } from "lucide-react"

type ButtonVariant = "primary" | "secondary"
type ButtonSize = "sm" | "base" | "md" | "lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  target?: string
  children: React.ReactNode
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-150 shadow-lg hover:shadow-xl w-full md:w-auto min-w-[120px]"

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand-white text-brand hover:bg-brand-white/90 active:bg-brand-element",
  secondary: "bg-brand text-white hover:bg-brand/90 active:bg-brand-element",
}

const sizes: Record<ButtonSize, string> = {
  sm: "md:px-8 py-2",
  base: "md:px-8 py-3",
  md: "md:px-16 py-3",
  lg: "md:px-24 py-3"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, target, children, ...props }, ref) => {
    const buttonClasses = cn(baseClasses, variantClasses[variant], sizes[size], className)
    
    if (href) {
      return (
        <Link
          href={href}
          target={target}
          className={buttonClasses}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      )
    }
    
    return (
      <button
        ref={ref}
        className={buttonClasses}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"


