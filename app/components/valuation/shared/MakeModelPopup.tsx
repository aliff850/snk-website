import { CarFront, X } from "lucide-react";

export function MakeModelPopup({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative bg-brand w-full max-w-sm rounded-2xl p-8 shadow-xl animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute right-4 top-4">
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-brand-white/80 hover:bg-brand-white/20 hover:text-brand-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="py-2 flex flex-col items-center gap-2 text-brand-white">
                    <CarFront className="h-12 w-12" />
                    <p className="text-center text-brand-white text-lg font-medium">Please select make and model</p>
                </div>

            </div>
        </div>
    )
}