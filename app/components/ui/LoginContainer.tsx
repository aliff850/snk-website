import React from 'react'

interface LoginContainerProps {
    children: React.ReactNode
}

export default function LoginContainer({ children }: LoginContainerProps) {
    return (
        <div className="w-full max-w-lg flex flex-col justify-center items-center backdrop-blur-sm border border-brand-white/30 px-4 md:px-12 py-6 md:py-8 rounded-2xl md:rounded-3xl text-brand-white shadow-lg">
            {children}
        </div>
    )
}