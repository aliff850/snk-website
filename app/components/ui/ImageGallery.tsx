"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { createPortal } from "react-dom";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const touchStartXRef = useRef<number | null>(null);
    const modalTouchStartXRef = useRef<number | null>(null);

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

    // Ensure portals only render client-side
    useEffect(() => {
        setIsMounted(true);
    }, []);

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

    const openModal = useCallback((targetIndex?: number) => {
        if (typeof targetIndex === "number") {
            goTo(targetIndex);
        }
        setIsModalOpen(true);
        setIsPaused(true);
    }, [goTo]);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setIsPaused(false);
    }, []);

    // Keyboard controls while modal is open
    useEffect(() => {
        if (!isModalOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                closeModal();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                next();
            } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                prev();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [isModalOpen, next, prev, closeModal]);

    const handleModalTouchStart = (e: React.TouchEvent) => {
        modalTouchStartXRef.current = e.touches[0]?.clientX ?? null;
    };

    const handleModalTouchEnd = (e: React.TouchEvent) => {
        const startX = modalTouchStartXRef.current;
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
            <div className={`relative w-full ${aspectClassName || "aspect-video"}`}>
                {slides.map((img, i) => (
                    <div
                        key={img.src + i}
                        className={
                            "absolute inset-0 transition-opacity duration-700 ease-out overflow-hidden rounded-2xl md:rounded-3xl " +
                            (i === index ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none z-0")
                        }
                        aria-hidden={i !== index}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt ?? `Slide ${i + 1}`}
                            onClick={() => openModal(i)}
                            fill
                            priority={i === index}
                            className="object-cover transition-transform duration-500 cursor-zoom-in"
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
            {isModalOpen && isMounted && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
                    role="dialog"
                    aria-modal="true"
                    onTouchStart={handleModalTouchStart}
                    onTouchEnd={handleModalTouchEnd}
                >
                    <button
                        aria-label="Close"
                        onClick={closeModal}
                        className="absolute top-4 right-4 z-20 text-white p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div
                        className="relative w-[92vw] h-[80vh]"
                        onClick={closeModal}
                    >
                        <div className="absolute inset-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <Image
                                src={slides[index]?.src ?? ""}
                                alt={slides[index]?.alt ?? `Image ${index + 1}`}
                                fill
                                priority
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}


