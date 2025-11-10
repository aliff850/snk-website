"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export interface GalleryImage {
    src: string;
    alt?: string;
}

interface ImageGalleryProps {
    images: GalleryImage[];
    intervalMs?: number;
    className?: string;
    roundedClassName?: string;
    aspectClassName?: string;
    autoPlay?: boolean;
}

export default function ImageGallery({
    images,
    intervalMs = 3500,
    className,
    // roundedClassName = "rounded-3xl",
    aspectClassName,
    autoPlay = true,
}: ImageGalleryProps) {
    const [index, setIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const touchStartXRef = useRef<number | null>(null);

    const total = images.length;

    const goTo = useCallback((next: number) => {
        if (total === 0) return;
        const normalized = ((next % total) + total) % total;
        setIndex(normalized);
    }, [total]);

    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const prev = useCallback(() => goTo(index - 1), [goTo, index]);

    useEffect(() => {
        if (total <= 1) return;
        if (isPaused) return;
        if (!autoPlay) return;
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % total);
        }, intervalMs);
        return () => clearInterval(id);
    }, [intervalMs, total, isPaused, autoPlay]);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartXRef.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const startX = touchStartXRef.current;
        const endX = e.changedTouches[0]?.clientX ?? null;
        if (startX == null || endX == null) return;
        const delta = endX - startX;
        if (Math.abs(delta) < 40) return;
        if (delta < 0) next();
        else prev();
    };

    const slides = useMemo(() => images, [images]);

    return (
        <div
            className={"relative w-full h-full select-none " + (className ?? "")}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
        >
            <div className={`relative w-full ${aspectClassName ? aspectClassName : "h-full"}`}>
                {slides.map((img, i) => (
                    <div
                        key={img.src + i}
                        className={
                            "absolute inset-0 transition-opacity duration-700 ease-out " +
                            (i === index ? "opacity-100" : "opacity-0")
                        }
                        aria-hidden={i !== index}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt ?? `Slide ${i + 1}`}
                            fill
                            priority={i === index}
                            className="object-cover transition-transform duration-500"
                        />
                    </div>
                ))}
            </div>

            {total > 1 && (
                <>
                    {/* Navigation arrows */}
                    <button
                        aria-label="Previous image"
                        onClick={prev}
                        className="opacity-0 hover:opacity-100 absolute inset-y-0 left-0 w-12 md:w-20 z-10 text-white flex items-center justify-start bg-gradient-to-r from-brand/60 to-transparent transition-opacity duration-500 focus:outline-none"
                    >
                        <ArrowLeft className="w-5 h-5 md:w-8 md:h-8 ml-2 md:ml-3" />
                    </button>
                    
                    <button
                        aria-label="Next image"
                        onClick={next}
                        className="opacity-0 hover:opacity-100 absolute inset-y-0 right-0 w-12 md:w-20 z-10 text-white flex items-center justify-end bg-gradient-to-l from-brand/60 to-transparent transition-opacity duration-500 focus:outline-none"
                    >
                        <ArrowRight className="w-5 h-5 md:w-8 md:h-8 mr-2 md:mr-3" />
                    </button>

                    {/* Navigation dots */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        {slides.map((_, i) => (
                            <button
                                key={i}
                                aria-label={`Go to slide ${i + 1}`}
                                onClick={() => goTo(i)}
                                className={
                                    "h-2.5 w-2.5 rounded-full transition-all duration-300 " +
                                    (i === index ? "bg-brand w-6" : "bg-brand/40 hover:bg-brand/70")
                                }
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}


