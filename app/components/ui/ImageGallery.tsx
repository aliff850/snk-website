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
}

export default function ImageGallery({
    images,
    intervalMs = 3500,
    className,
    roundedClassName = "rounded-3xl",
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
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % total);
        }, intervalMs);
        return () => clearInterval(id);
    }, [intervalMs, total, isPaused]);

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
            <div className={`relative w-full h-full`}>
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
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    
                    <button
                        aria-label="Next image"
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                    >
                        <ArrowRight className="w-5 h-5" />
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


