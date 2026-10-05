"use client";

import { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface ReelItem {
  id: string;
  src: string;
  handle: string;
  creator: string;
  product: string;
}

const INITIAL_REELS: ReelItem[] = [
  {
    id: "reel-1",
    src: "/videos/reels/arcure-influancer.mp4",
    handle: "@arcurepharma",
    creator: "Arcure Expert Care",
    product: "ARCUDERM CS Serum",
  },
  {
    id: "reel-2",
    src: "/videos/reels/arcure-influancer.1.mp4",
    handle: "@arcurepharma",
    creator: "Dermatological Routine",
    product: "ARCU GLEAM Face Wash",
  },
  {
    id: "reel-3",
    src: "/videos/reels/arcure-influancer.2.mp4",
    handle: "@arcurepharma",
    creator: "Radiance & Glow",
    product: "Skin Care Essentials",
  },
  {
    id: "reel-4",
    src: "/videos/reels/arcure-influancer.3.mp4",
    handle: "@arcurepharma",
    creator: "Daily Health Journey",
    product: "ARCU-CAL K2 & Mida-D",
  },
];

const IG_PATH =
  "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z";

export default function InstagramReels() {
  const [reels, setReels] = useState<ReelItem[]>(INITIAL_REELS);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    "reel-1": true,
    "reel-2": true,
    "reel-3": true,
    "reel-4": true,
  });

  useEffect(() => {
    fetch("/api/reels")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const mapped: ReelItem[] = data.map((d: any) => ({
            id: d.id,
            src: d.videoUrl || d.src,
            handle: d.handle || "@arcurepharma",
            creator: d.creator || "Arcure Creator",
            product: d.product || "Arcure Formula",
          }));
          setReels(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const [pausedStates, setPausedStates] = useState<Record<string, boolean>>({
    "reel-1": false,
    "reel-2": false,
    "reel-3": false,
    "reel-4": false,
  });

  const [inView, setInView] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  // Autoplay videos safely ONLY when section is scrolled into view
  useEffect(() => {
    const playAllMuted = () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) {
          video.muted = true;
          video.play().catch(() => {
            // Browser autoplay policy catch
          });
        }
      });
    };

    const pauseAll = () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    };

    // Intersection observer to load and play/pause only when in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            playAllMuted();
          } else {
            pauseAll();
          }
        });
      },
      { rootMargin: "150px", threshold: 0.1 }
    );

    const section = document.getElementById("social-proof");
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, [inView]);

  // Update active slide on carousel scroll
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.offsetWidth * 0.8;
    const newIndex = Math.round(scrollLeft / slideWidth);
    if (newIndex >= 0 && newIndex < reels.length) {
      setActiveSlide(newIndex);
    }
  };

  const scrollToSlide = (index: number) => {
    if (!carouselRef.current) return;
    const container = carouselRef.current;
    const slide = container.children[index] as HTMLElement | undefined;
    if (slide) {
      slide.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setActiveSlide(index);
    }
  };

  const handleToggleMute = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRefs.current[id];
    if (!video) return;

    const nextMuted = !video.muted;
    video.muted = nextMuted;

    // If unmuting this video, mute all others to prevent audio clash
    if (!nextMuted) {
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (v && k !== id) {
          v.muted = true;
        }
      });
      setMutedStates((prev) => {
        const next: Record<string, boolean> = {};
        Object.keys(prev).forEach((key) => {
          next[key] = key === id ? false : true;
        });
        return next;
      });
    } else {
      setMutedStates((prev) => ({ ...prev, [id]: true }));
    }
  };

  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setPausedStates((prev) => ({ ...prev, [id]: false }));
      }).catch(() => {});
    } else {
      video.pause();
      setPausedStates((prev) => ({ ...prev, [id]: true }));
    }
  };

  return (
    <section
      id="social-proof"
      className="py-12 lg:py-24 bg-transparent overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 lg:mb-14">
          <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 bg-[#c58a38] text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4 shadow-sm shadow-[#c58a38]/20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={IG_PATH} />
            </svg>
            Real Influencers &bull; Real Results
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-2 sm:mb-4">
            What People Say About
            <span className="block sm:inline bg-gradient-to-r from-[#c58a38] via-[#a87428] to-[#16a34a] bg-clip-text text-transparent">
              {" "}
              Arcure Pharma
            </span>
          </h2>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto text-xs sm:text-base lg:text-lg font-medium">
            Watch trusted creators and genuine customers share their daily skincare
            transformations with Arcure Pharma formulas.
          </p>

          <div className="section-divider mt-4 sm:mt-6" />
        </div>

          {/* ── Mobile Carousel Layout (md:hidden) ── */}
        <div className="md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 py-2"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {reels.map((reel, idx) => {
              const isMuted = mutedStates[reel.id] ?? true;
              const isPaused = pausedStates[reel.id] ?? false;

              return (
                <div
                  key={`mobile-${reel.id}`}
                  onClick={() => handleTogglePlay(reel.id)}
                  className="relative w-[78vw] sm:w-[65vw] max-w-[340px] shrink-0 snap-center aspect-[9/16] rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-[#c58a38]/10 ring-1 ring-black/5 bg-slate-950 cursor-pointer group select-none"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el;
                    }}
                    src={inView ? reel.src : undefined}
                    autoPlay={inView}
                    loop
                    muted={isMuted}
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Gradient shadow overlay for readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 pointer-events-none" />

                  {/* Pause indicator icon */}
                  {isPaused && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-fade-in">
                      <div className="w-14 h-14 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-lg">
                        <Play className="w-6 h-6 ml-1 fill-white" />
                      </div>
                    </div>
                  )}

                  {/* Top Badge */}
                  <div className="absolute top-3.5 left-3.5 z-10">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[11px] font-semibold rounded-full border border-white/10">
                      <Sparkles className="w-3 h-3 text-[#c58a38]" />
                      {reel.product}
                    </span>
                  </div>

                  {/* Bottom Creator Info & Mute Button */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between z-10 gap-2">
                    <div className="min-w-0 pr-2">
                      <p className="text-white text-xs font-bold truncate drop-shadow-sm">
                        {reel.creator}
                      </p>
                      <p className="text-white/80 text-[11px] font-medium flex items-center gap-1 mt-0.5 drop-shadow-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-pink-400"
                        >
                          <path d={IG_PATH} />
                        </svg>
                        {reel.handle}
                      </p>
                    </div>

                    {/* Mute / Unmute Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleMute(reel.id, e)}
                      aria-label={isMuted ? "Unmute video" : "Mute video"}
                      className="shrink-0 p-2.5 bg-black/60 hover:bg-black/80 active:scale-90 text-white rounded-full backdrop-blur-md transition-all z-20 border border-white/15 shadow-md"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-white" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-[#16a34a] animate-pulse" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Carousel Pagination Dots & Navigation */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => scrollToSlide(Math.max(0, activeSlide - 1))}
              disabled={activeSlide === 0}
              aria-label="Previous reel"
              className="p-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {reels.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToSlide(i)}
                  aria-label={`Go to reel ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    activeSlide === i
                      ? "w-6 bg-[#c58a38]"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                scrollToSlide(Math.min(reels.length - 1, activeSlide + 1))
              }
              disabled={activeSlide === reels.length - 1}
              aria-label="Next reel"
              className="p-1.5 rounded-full bg-white shadow-sm border border-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 active:scale-95 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Desktop 4-Column Grid Layout (hidden md:grid) ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-4 lg:gap-6 max-w-6xl mx-auto">
          {reels.map((reel) => {
            const isMuted = mutedStates[reel.id] ?? true;
            const isPaused = pausedStates[reel.id] ?? false;

            return (
              <div
                key={`desktop-${reel.id}`}
                onClick={() => handleTogglePlay(reel.id)}
                className="relative rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg shadow-[#c58a38]/10 hover:shadow-2xl transition-all duration-500 cursor-pointer group bg-slate-950 aspect-[9/16] w-full border border-gray-100 ring-1 ring-black/5 select-none"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[reel.id] = el;
                  }}
                  src={inView ? reel.src : undefined}
                  autoPlay={inView}
                  loop
                  muted={isMuted}
                  playsInline
                  preload="none"
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Subtle dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20 pointer-events-none transition-opacity duration-300" />

                {/* Play/Pause center overlay when paused */}
                {isPaused && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 animate-fade-in">
                    <div className="w-14 h-14 bg-black/55 backdrop-blur-md rounded-full flex items-center justify-center text-white shadow-xl">
                      <Play className="w-6 h-6 ml-1 fill-white" />
                    </div>
                  </div>
                )}

                {/* Product Pill Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-black/40 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/10 group-hover:bg-[#c58a38] transition-colors">
                    <Sparkles className="w-3 h-3 text-[#c58a38] group-hover:text-white" />
                    {reel.product}
                  </span>
                </div>

                {/* Bottom Overlay: Creator info & Mute toggle */}
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10 gap-2">
                  <div className="min-w-0 pr-2">
                    <p className="text-white text-sm font-bold truncate drop-shadow-md">
                      {reel.creator}
                    </p>
                    <p className="text-white/80 text-xs font-medium flex items-center gap-1.5 mt-0.5 drop-shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-pink-400"
                      >
                        <path d={IG_PATH} />
                      </svg>
                      {reel.handle}
                    </p>
                  </div>

                  {/* Mute / Unmute Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleMute(reel.id, e)}
                    aria-label={isMuted ? "Unmute video" : "Mute video"}
                    className="shrink-0 p-2.5 bg-black/60 hover:bg-black/90 active:scale-95 text-white rounded-full backdrop-blur-md transition-all z-20 border border-white/20 shadow-lg group-hover:scale-110"
                    title={isMuted ? "Click to unmute" : "Click to mute"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-white" />
                    ) : (
                      <Volume2 className="w-4 h-4 text-[#16a34a] animate-pulse" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote hint */}
        <p className="text-center text-xs text-gray-400 mt-6 lg:mt-8">
          Videos autoplay seamlessly muted. Tap the speaker icon to unmute or tap the video to pause.
        </p>
      </div>
    </section>
  );
}
