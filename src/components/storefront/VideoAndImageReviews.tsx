"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Play, X, Video } from "lucide-react";
import { useReveal } from "@/lib/useReveal";
import { resolveVideoSource, type VideoSourceInfo } from "@/lib/video-source";
import {
  ResultImageMarquee,
  useImageReviewImages,
} from "./CustomerImageMarquee";

interface VideoReview {
  id: string;
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
}

function Player({ info, title }: { info: VideoSourceInfo; title: string }) {
  if (info.source === "file") {
    return (
      <video
        src={info.fileUrl}
        poster={info.thumbnailUrl || undefined}
        controls
        autoPlay
        playsInline
        preload="metadata"
        className="w-full h-full object-contain bg-black"
      />
    );
  }

  return (
    <iframe
      src={info.embedUrl}
      title={title || "Video review"}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      className="w-full h-full border-0"
    />
  );
}

/**
 * Single customer proof section: video testimonials first, customer result
 * images right below. Both are managed separately in the admin panel
 * (/admin/video-reviews and /admin/image-review).
 */
export default function VideoAndImageReviews() {
  const [videos, setVideos] = useState<VideoReview[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [active, setActive] = useState<VideoReview | null>(null);
  const images = useImageReviewImages();
  const { ref, visible } = useReveal();

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/video-reviews", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setVideosLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setVideosLoading(false);
      });

    return () => controller.abort();
  }, []);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close]);

  if (videosLoading && images.length === 0) return null;
  if (videos.length === 0 && images.length === 0) return null;

  const activeInfo = active
    ? resolveVideoSource(active.videoUrl, active.thumbnailUrl)
    : null;

  return (
    <section className="py-14 lg:py-20 bg-grad-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Videos */}
        {videos.length > 0 && (
          <>
            <div
              ref={ref}
              className={`text-center mb-10 reveal ${visible ? "is-visible" : ""}`}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-grad-soft text-[#8f5715] text-xs sm:text-sm font-semibold rounded-full mb-4 border border-[#fae3bf]">
                <Video className="w-4 h-4" />
                Video Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Hear It From Our Customers
              </h2>
              <p className="text-gray-500 text-sm sm:text-base mt-3 max-w-xl mx-auto">
                Real people, real routines — unfiltered stories in their own
                words.
              </p>
              <div className="w-12 h-1 bg-grad-caramel rounded-full mx-auto mt-4" />
            </div>

            <div
              className={`grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 reveal ${
                visible ? "is-visible" : ""
              }`}
            >
              {videos.map((video) => {
                const info = resolveVideoSource(video.videoUrl, video.thumbnailUrl);
                return (
                  <button
                    key={video.id}
                    type="button"
                    onClick={() => setActive(video)}
                    className="group text-left bg-white rounded-2xl border border-[#fae3bf] overflow-hidden hover:shadow-xl hover:shadow-[#dda45a]/25 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="relative aspect-video bg-gray-900">
                      {info.thumbnailUrl ? (
                        <Image
                          src={info.thumbnailUrl}
                          alt={video.title || "Video review"}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : info.source === "file" ? (
                        <video
                          src={info.fileUrl}
                          muted
                          playsInline
                          preload="metadata"
                          aria-label={video.title || "Video review"}
                          className="w-full h-full object-cover"
                        />
                      ) : null}

                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                        <span className="w-11 sm:w-14 h-11 sm:h-14 bg-white/85 group-hover:bg-grad-caramel rounded-full flex items-center justify-center shadow-lg transition-colors">
                          <Play className="w-4 sm:w-5 h-4 sm:h-5 text-[#b06f22] fill-[#b06f22]" />
                        </span>
                      </div>

                      {video.customerName && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/55 text-white text-[9px] sm:text-[10px] font-semibold rounded-full backdrop-blur-sm">
                          {video.customerName}
                        </span>
                      )}
                    </div>

                    {video.title && (
                      <p className="text-[11px] sm:text-xs font-semibold text-gray-700 px-3 py-2.5 line-clamp-2">
                        {video.title}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Customer result images - no header, part of the same section */}
        {images.length > 0 && (
          <div className={videos.length > 0 ? "mt-10 lg:mt-14" : ""}>
            <ResultImageMarquee images={images} />
          </div>
        )}
      </div>

      {/* Lightbox */}
      {active && activeInfo && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            aria-label="Close video"
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Player info={activeInfo} title={active.title} />
          </div>

          {(active.title || active.customerName) && (
            <div
              className="absolute bottom-6 left-0 right-0 text-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              {active.title && (
                <p className="text-white font-semibold text-sm sm:text-base">
                  {active.title}
                </p>
              )}
              {active.customerName && (
                <p className="text-white/70 text-xs sm:text-sm mt-0.5">
                  {active.customerName}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
