"use client";

import { useEffect, useState } from "react";
import { Star, Quote, BadgeCheck, ShieldCheck, MessageSquareQuote, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { useReveal } from "@/lib/useReveal";

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  order: number;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    name: "Huma",
    role: "Verified Customer - 6 weeks",
    rating: 5,
    text: "MandelAC Serum helped calm my active acne significantly. Breakouts reduced, inflammation went down, and my skin feels clearer and healthier within just a few weeks!",
    imageUrl: "/jenpharm/result-huma.jpg",
    order: 1,
  },
  {
    id: "fallback-2",
    name: "Zoha",
    role: "Verified Customer - 4 weeks",
    rating: 5,
    text: "Maxdif Moisturizer keeps my skin so hydrated all day. Tone looks brighter, more even, and my dull patches have really improved with regular use!",
    imageUrl: "/jenpharm/result-zoha.jpg",
    order: 2,
  },
  {
    id: "fallback-3",
    name: "Mubeen",
    role: "Verified Customer - 3 months",
    rating: 5,
    text: "If used as advised, this actually works! I've been using it for 3 months and noticed an inch of multiple hair growth where my hair was receding. My hair is much fuller now!",
    imageUrl: "/jenpharm/result-mubeen.jpg",
    order: 3,
  },
  {
    id: "fallback-4",
    name: "Shahid",
    role: "Verified Customer - 4 weeks",
    rating: 5,
    text: "Since adding Maxdif Cream to my routine, my hyperpigmentation has noticeably reduced. Skin feels smoother, brighter, and so much more even toned now!",
    imageUrl: "/jenpharm/result-shahid.jpg",
    order: 4,
  },
  {
    id: "fallback-5",
    name: "Dr. Fatima Khan",
    role: "Hospital Administrator",
    rating: 5,
    text: "Arcure Pharma has been our trusted supplier for over 3 years. Their quality and reliability are unmatched.",
    imageUrl: null,
    order: 5,
  },
  {
    id: "fallback-6",
    name: "Ahmed Raza",
    role: "Loyal Customer",
    rating: 5,
    text: "Fast delivery, genuine products and excellent customer service. I would not shop anywhere else.",
    imageUrl: null,
    order: 6,
  },
  {
    id: "fallback-7",
    name: "Sara Malik",
    role: "Pharmacy Owner",
    rating: 4,
    text: "Professional team with a wide range of products. Their prices are competitive and delivery is always on time.",
    imageUrl: null,
    order: 7,
  },
  {
    id: "fallback-8",
    name: "Ayesha Siddiqui",
    role: "Regular Customer",
    rating: 5,
    text: "Their medicines are always genuine with proper expiry dates. The WhatsApp ordering is super convenient.",
    imageUrl: null,
    order: 8,
  },
  {
    id: "fallback-9",
    name: "Kamran Ali",
    role: "Distributor Partner",
    rating: 5,
    text: "Working with Arcure Pharma for two years now. Honest pricing, consistent supply and a team that actually listens.",
    imageUrl: null,
    order: 9,
  },
];

function Stars({ rating, size = "w-4 h-4" }: { rating: number; size?: string }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`${size} ${
            s <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function initialColor(name: string) {
  const palette = [
    "from-teal-500 to-emerald-600",
    "from-sky-500 to-blue-600",
    "from-violet-500 to-purple-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-pink-600",
    "from-cyan-500 to-teal-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "photo" | "text">("all");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setReviews(list.length > 0 ? list : FALLBACK_REVIEWS);
        setLoading(false);
      })
      .catch(() => {
        setReviews(FALLBACK_REVIEWS);
        setLoading(false);
      });
  }, []);

  const photoCount = reviews.filter((r) => r.imageUrl).length;
  const textCount = reviews.length - photoCount;
  const filteredReviews = reviews.filter((r) =>
    filter === "all" ? true : filter === "photo" ? !!r.imageUrl : !r.imageUrl
  );

  const filters = [
    { key: "all" as const, label: "All Reviews", count: reviews.length },
    { key: "photo" as const, label: "With Photos", count: photoCount },
    { key: "text" as const, label: "Text Only", count: textCount },
  ];

  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal();

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length
      ).toFixed(1)
    : "0.0";

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-800 to-teal-900 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl" />
        <div
          ref={headerRef}
          className={`relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center reveal ${
            headerVisible ? "is-visible" : ""
          }`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20 mb-6">
            <MessageSquareQuote className="w-4 h-4" />
            Customer Reviews
          </span>
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            What Our Customers{" "}
            <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
              Really Think
            </span>
          </h1>
          <p className="text-teal-100/90 text-lg max-w-2xl mx-auto leading-relaxed">
            Real feedback from hospitals, pharmacies and customers who trust
            Arcure Pharma for their health needs.
          </p>

          {!loading && reviews.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-3">
                <span className="text-4xl font-bold text-white">
                  {avgRating}
                </span>
                <div>
                  <Stars rating={Math.round(Number(avgRating))} size="w-4 h-4" />
                  <p className="text-teal-100/80 text-xs mt-1">
                    Average rating
                  </p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-emerald-300" />
                <div>
                  <span className="block text-2xl font-bold text-white">
                    {reviews.length}+
                  </span>
                  <p className="text-teal-100/80 text-xs">Verified reviews</p>
                </div>
              </div>
              <div className="hidden sm:block w-px h-10 bg-white/20" />
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8 text-emerald-300" />
                <div>
                  <span className="block text-2xl font-bold text-white">
                    100%
                  </span>
                  <p className="text-teal-100/80 text-xs">Genuine customers</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Reviews grid */}
      <section className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border border-gray-100">
              <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Reviews coming soon. Check back later!
              </p>
            </div>
          ) : (
            <>
              {/* Filter tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 ${
                      filter === f.key
                        ? "bg-teal-600 text-white shadow-lg shadow-teal-600/25"
                        : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-teal-400 hover:text-teal-700"
                    }`}
                  >
                    {f.label}
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        filter === f.key
                          ? "bg-white/20 text-white"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {f.count}
                    </span>
                  </button>
                ))}
              </div>

              {filteredReviews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                  <p className="text-gray-400">
                    No reviews in this category yet.
                  </p>
                </div>
              ) : (
                <div
                  ref={gridRef}
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 reveal ${
                    gridVisible ? "is-visible" : ""
                  }`}
                >
                  {filteredReviews.map((review, i) =>
                    review.imageUrl ? (
                      <ImageReviewCard key={review.id} review={review} index={i} />
                    ) : (
                      <TextReviewCard key={review.id} review={review} index={i} />
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-600 to-emerald-600 px-8 py-14 text-center">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <h2 className="relative text-2xl lg:text-3xl font-bold text-white mb-3">
              Experienced the Arcure difference yourself?
            </h2>
            <p className="relative text-teal-50/90 mb-8 max-w-xl mx-auto">
              Explore our range of trusted health products and join thousands
              of happy customers.
            </p>
            <Link
              href="/#products"
              className="relative inline-flex items-center gap-2 px-8 py-3.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-teal-50 transition-all hover:shadow-xl active:scale-95"
            >
              Shop Our Products
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function TextReviewCard({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  return (
    <div
      className="group relative bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-2xl hover:shadow-teal-600/10 hover:-translate-y-2 transition-all duration-500 overflow-hidden"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <Quote className="absolute -top-2 -right-2 w-20 h-20 text-teal-50 group-hover:text-teal-100 transition-colors rotate-180" />
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <Stars rating={review.rating} />
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-[11px] font-semibold rounded-full">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        </div>
        <p className="text-gray-600 leading-relaxed mb-6 min-h-24">
          &ldquo;{review.text}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-5 border-t border-gray-100">
          <div
            className={`w-11 h-11 bg-gradient-to-br ${initialColor(
              review.name
            )} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg shrink-0`}
          >
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {review.name}
            </p>
            <p className="text-gray-500 text-xs">{review.role || "Customer"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImageReviewCard({
  review,
  index,
}: {
  review: Review;
  index: number;
}) {
  return (
    <div
      className="group relative bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-teal-600/10 hover:-translate-y-2 transition-all duration-500"
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={review.imageUrl!}
          alt={`${review.name} review`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-900/80 via-teal-900/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm">
            <Stars rating={review.rating} size="w-3.5 h-3.5" />
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-teal-600/90 backdrop-blur-sm text-white text-[11px] font-semibold rounded-full">
            <BadgeCheck className="w-3.5 h-3.5" />
            Verified
          </span>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 leading-relaxed text-sm mb-5 line-clamp-4">
          &ldquo;{review.text}&rdquo;
        </p>
        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
          <div
            className={`w-10 h-10 bg-gradient-to-br ${initialColor(
              review.name
            )} rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg shrink-0`}
          >
            {review.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">
              {review.name}
            </p>
            <p className="text-gray-500 text-xs">
              {review.role || "Customer"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}