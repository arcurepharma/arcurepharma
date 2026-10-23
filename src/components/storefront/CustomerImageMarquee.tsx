"use client";

import { useEffect, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import {
  IMAGE_REVIEW_SETTING_KEY,
  isImageReviewUrl,
  parseImageReviewImages,
} from "@/lib/image-review";

/**
 * Customer result images come from the same admin panel as before
 * (/admin/image-review) - the storefront just renders them without a header so
 * the videos and the images read as one single section.
 */
export function useImageReviewImages(): string[] {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/settings", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load customer images");
        return response.json();
      })
      .then((data: Record<string, unknown>) => {
        setImages(
          parseImageReviewImages(data[IMAGE_REVIEW_SETTING_KEY]).filter(
            isImageReviewUrl
          )
        );
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
      });

    return () => controller.abort();
  }, []);

  return images;
}

export function ResultImageMarquee({ images }: { images: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const imageSignature = images.join("|");

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reducedMotion) return;

    let animationFrame = 0;
    let position = 0;
    let lastTime = performance.now();
    const speed = 34;

    const move = (currentTime: number) => {
      const elapsed = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;
      position -= speed * elapsed;

      const groupWidth = track.scrollWidth / 2;
      if (groupWidth > 0 && position <= -groupWidth) {
        position += groupWidth;
      }

      track.style.transform = `translateX(${position}px)`;
      animationFrame = requestAnimationFrame(move);
    };

    animationFrame = requestAnimationFrame(move);
    return () => cancelAnimationFrame(animationFrame);
  }, [imageSignature]);

  return (
    <div
      className="relative w-full overflow-hidden py-2"
      aria-label="Customer result images"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-24 bg-gradient-to-l from-white to-transparent z-10" />

      <div
        ref={trackRef}
        className="flex w-max"
        style={{ willChange: "transform" }}
      >
        <ResultImageGroup images={images} />
        <ResultImageGroup images={images} decorative />
      </div>
    </div>
  );
}

function ResultImageGroup({
  images,
  decorative = false,
}: {
  images: string[];
  decorative?: boolean;
}) {
  return (
    <div
      className="flex w-[calc(100vw_-_1rem)] sm:w-[calc(100vw_-_3rem)] lg:w-[calc(100vw_-_4rem)] lg:max-w-[1440px] shrink-0 gap-1 pr-1 sm:gap-4 sm:pr-4"
      aria-hidden={decorative}
    >
      {images.map((image, index) => (
        <div
          key={`${image}-${index}`}
          role={decorative ? undefined : "img"}
          aria-label={decorative ? undefined : `Customer result ${index + 1}`}
          className="w-[calc((100%_-_1rem)/5)] sm:w-[calc((100%_-_4rem)/5)] aspect-square shrink-0 overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 ring-1 ring-gray-200 shadow-md shadow-[#dda45a]/10 bg-cover bg-center"
          style={
            image
              ? { backgroundImage: `url(${JSON.stringify(image)})` }
              : undefined
          }
        >
          {!image && (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <ImageOff className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
