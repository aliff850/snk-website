import * as React from "react"
import Link from "next/link"

type ButtonVariant = "primary" | "secondary"
type ButtonSize = "sm" | "md" | "lg"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  children: React.ReactNode
}

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ")
}

const baseClasses = "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-white text-brand hover:bg-gray-100",
  secondary: "bg-brand text-white hover:bg-brand-hover",
}

const sizes: Record<ButtonSize, string> = {
  sm: "px-8 py-3",
  md: "px-16 py-3",
  lg: "px-24 py-3"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const buttonClasses = cn(baseClasses, variantClasses[variant], sizes[size], className)
    
    if (href) {
      return (
        <Link
          href={href}
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


