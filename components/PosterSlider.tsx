'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Poster } from '@/data/poster';

interface PosterSliderProps {
  posters: Poster[];
}

export default function PosterSlider({ posters }: PosterSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    if (posters.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [posters.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % posters.length);
  };

  if (posters.length === 0) return null;

  return (
    <section className="relative h-[30vh] md:h-[92vh] w-full overflow-hidden bg-neutral-950">
      {/* Slides */}
      <div className="relative h-full w-full">
        {posters.map((poster, index) => (
          <div
            key={poster.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <Image
              src={poster.image}
              alt={poster.alt}
              fill
              className="object-cover opacity-90"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Subtle gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%),linear-gradient(to_top,_rgba(0,0,0,0.75),_transparent_45%)]" />

      {/* Navigation Arrows */}
      {posters.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 bg-white/40 hover:bg-white text-neutral-900 p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all"
            aria-label="Previous slide"
          >
            <svg className="md:w-6 md:h-6 w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 bg-white/40 hover:bg-white text-neutral-900 p-2 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all"
            aria-label="Next slide"
          >
            <svg className="md:w-6 md:h-6 w-2 h-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {posters.length > 1 && (
        <div className="absolute bottom-7 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {posters.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/45 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

