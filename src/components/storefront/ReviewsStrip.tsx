"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, MessageSquareQuote } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

interface Review {
  id: string;
  name: string;
  role?: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  order: number;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    name: "Ayesha Khan",
    rating: 5,
    text: "ARCU-DERM meri daily routine ka best addition hai. Skin zyada hydrated aur fresh lagti hai.",
    imageUrl: null,
    order: 1,
  },
  {
    id: "fallback-2",
    name: "Hamza Ali",
    rating: 4,
    text: "Texture bohat pasand aya. Heavy feel nahi hota aur skin soft lagti hai.",
    imageUrl: null,
    order: 2,
  },
  {
    id: "fallback-3",
    name: "Zara Ahmed",
    rating: 5,
    text: "Packaging premium hai aur product overall high-quality feel hota hai.",
    imageUrl: null,
    order: 3,
  },
  {
    id: "fallback-4",
    name: "Bilal Hassan",
    rating: 4,
    text: "Lightweight formula daily skincare mein easily use ho jata hai.",
    imageUrl: null,
    order: 4,
  },
  {
    id: "fallback-5",
    name: "Mahnoor Fatima",
    rating: 5,
    text: "Packaging dekh kar hi premium feel aati hai, delivery bhi properly packed thi.",
    imageUrl: null,
    order: 5,
  },
  {
    id: "fallback-6",
    name: "Usman Tariq",
    rating: 5,
    text: "Use ke baad skin noticeably zyada hydrated feel hoti hai. Dobara khareedne ka mann hai.",
    imageUrl: null,
    order: 6,
  },
];

const AVATAR_PALETTE = [
  "from-[#fdf3de] to-[#eebe78]",
  "from-[#e0ad5e] to-[#b06f22]",
  "from-[#fae3bf] to-[#dda45a]",
  "from-[#f5d49c] to-[#e0ad5e]",
  "from-[#eec37c] to-[#8f5715]",
  "from-[#fdf0da] to-[#dda45a]",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${
            s <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsStrip() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref, visible } = useReveal();

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/reviews", { cache: "no-store", signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        const list: Review[] = Array.isArray(data) ? data : [];
        setReviews(list.length > 0 ? list.slice(0, 8) : FALLBACK_REVIEWS);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setReviews(FALLBACK_REVIEWS);
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <section className="py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-[#fae3bf] border-t-[#dda45a] rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="py-12 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          ref={ref}
          className={`flex items-end justify-between gap-4 mb-8 reveal ${
            visible ? "is-visible" : ""
          }`}
        >
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-grad-soft text-[#8f5715] text-[10px] sm:text-xs font-semibold rounded-full mb-3 border border-[#fae3bf]">
              <MessageSquareQuote className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              What Customers Say
            </span>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Customer Reviews
            </h2>
            <div className="w-10 h-[3px] bg-grad-caramel rounded-full mt-2" />
          </div>
          <Link
            href="/reviews"
            className="shrink-0 text-[#8f5715] hover:text-[#b06f22] text-xs sm:text-sm font-bold transition-colors whitespace-nowrap"
          >
            View All
          </Link>
        </div>

        {/* Small cards: swipe on mobile, grid on desktop */}
        <div
          className={`flex gap-3 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:gap-5 reveal ${
            visible ? "is-visible" : ""
          }`}
        >
          {reviews.map((review) => (
            <article
              key={review.id}
              className="w-[230px] lg:w-auto shrink-0 snap-start bg-white rounded-2xl border border-[#fae3bf] p-4 hover:shadow-xl hover:shadow-[#dda45a]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <Quote className="w-5 h-5 text-[#fae3bf] mb-1.5 rotate-180 self-end" />

              <div className="mb-2">
                <Stars rating={review.rating} />
              </div>

              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 flex-1">
                &ldquo;{review.text}&rdquo;
              </p>

              {review.imageUrl && (
                <div className="relative w-full h-20 mt-3 rounded-xl overflow-hidden bg-grad-soft">
                  <Image
                    src={review.imageUrl}
                    alt={`${review.name} review`}
                    fill
                    sizes="230px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#fae3bf]">
                <div
                  className={`w-8 h-8 bg-gradient-to-br ${avatarColor(
                    review.name
                  )} rounded-full flex items-center justify-center text-white font-bold text-[11px] shrink-0`}
                >
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-800 text-[11px] truncate">
                    {review.name}
                  </p>
                  {review.role && (
                    <p className="text-[10px] text-gray-400 truncate">
                      {review.role}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
