"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { getFullImageUrl } from "@/services/uploads";
import type { ServiceImage } from "@/services/services";

interface ServiceImageCarouselProps {
  images?: ServiceImage[] | null;
  fallbackImageUrl?: string | null;
  serviceName: string;
}

export function ServiceImageCarousel({
  images,
  fallbackImageUrl,
  serviceName,
}: ServiceImageCarouselProps) {
  const gallery = (images ?? []).map((image) => image.url);
  if (fallbackImageUrl && !gallery.includes(fallbackImageUrl)) {
    gallery.unshift(fallbackImageUrl);
  }

  const [activeIndex, setActiveIndex] = useState(0);
  if (gallery.length === 0) return null;

  const currentIndex = activeIndex % gallery.length;
  const currentUrl = getFullImageUrl(gallery[currentIndex]);

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + gallery.length) % gallery.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % gallery.length);
  }

  return (
    <div
      className="relative aspect-[21/9] w-full overflow-hidden border-b bg-muted"
      role="region"
      aria-label={`${serviceName} photo gallery`}
      aria-roledescription="carousel"
    >
      {currentUrl && (
        <img
          key={currentUrl}
          src={currentUrl}
          alt={`${serviceName} photo ${currentIndex + 1} of ${gallery.length}`}
          className="size-full object-cover"
        />
      )}

      {gallery.length > 1 && (
        <>
          <button
            type="button"
            onClick={showPrevious}
            aria-label="Show previous photo"
            className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/55 text-white shadow transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={showNext}
            aria-label="Show next photo"
            className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-black/55 text-white shadow transition hover:bg-black/75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/45 px-3 py-2">
            {gallery.map((url, index) => (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show photo ${index + 1}`}
                aria-current={currentIndex === index}
                className={`size-2.5 rounded-full transition ${
                  currentIndex === index ? "bg-white" : "bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
          <span className="absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white">
            {currentIndex + 1} / {gallery.length}
          </span>
        </>
      )}
    </div>
  );
}
