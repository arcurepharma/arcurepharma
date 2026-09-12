"use client";

import { useEffect, useState } from "react";
import { Star, BadgeCheck, ArrowRight, Quote, Users, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/lib/useReveal";

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  imageUrl: string | null;
}

const FALLBACK_REVIEWS: Review[] = [
  {
    id: "fallback-1",
    name: "Huma",
    role: "Verified Customer - 6 weeks",
    rating: 5,
    text: "MandelAC Serum helped calm my active acne significantly. Breakouts reduced, inflammation went down, and my skin feels clearer and healthier within just a few weeks!",
    imageUrl: "/jenpharm/result-huma.jpg",
  },
  {
    id: "fallback-2",
    name: "Zoha",
    role: "Verified Customer - 4 weeks",
    rating: 5,
    text: "Maxdif Moisturizer keeps my skin so hydrated all day. Tone looks brighter, more even, and my dull patches have really improved with regular use!",
    imageUrl: "/jenpharm/result-zoha.jpg",
  },
  {
    id: "fallback-3",
    name: "Mubeen",
    role: "Verified Customer - 3 months",
    rating: 5,
    text: "If used as advised, this actually works! I've been using it for 3 months and noticed an inch of multiple hair growth where my hair was receding. My hair is much fuller now!",
    imageUrl: "/jenpharm/result-mubeen.jpg",
  },
  {
    id: "fallback-4",
    name: "Shahid",
    role: "Verified Customer - 4 weeks",
    rating: 5,
    text: "Since adding Maxdif Cream to my routine, my hyperpigmentation has noticeably reduced. Skin feels smoother, brighter, and so much more even toned now!",
    imageUrl: "/jenpharm/result-shahid.jpg",
  },
  {
    id: "fallback-5",
    name: "Ayesha Siddiqui",
    role: "Regular Customer",
    rating: 5,
    text: "Their medicines are always genuine with proper expiry dates. The WhatsApp ordering is super convenient.",
    imageUrl: null,
  },
  {
    id: "fallback-6",
    name: "Kamran Ali",
    role: "Distributor Partner",
    rating: 5,
    text: "Working with Arcure Pharma for two years now. Honest pricing, consistent supply and a team that actually listens.",
    imageUrl: null,
  },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal();
  const { ref: statsRef, visible: statsVisible } = useReveal();

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setReviews(list.length > 0 ? list.slice(0, 6) : FALLBACK_REVIEWS);
        setLoading(false);
      })
      .catch(() => {
        setReviews(FALLBACK_REVIEWS);
        setLoading(false);
      });
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
      : "4.9";

  return (
    <section id="testimonials" className="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          ref={headerRef}
          className={`text-center mb-16 reveal ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full mb-4">
            <Quote className="w-4 h-4" />
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">
            Trusted by thousands of happy customers across Pakistan
          </p>
          <div className="section-divider mt-6" />
        </div>

        {/* Stats bar */}
        <div
          ref={statsRef}
          className={`flex flex-wrap justify-center gap-6 lg:gap-12 mb-16 reveal ${statsVisible ? "is-visible" : ""}`}
        >
          {[
            {
              icon: <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />,
              value: avgRating,
              label: "Average Rating",
            },
            {
              icon: <Users className="w-5 h-5 text-teal-600" />,
              value: "5,000+",
              label: "Happy Customers",
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
              value: "98%",
              label: "Satisfaction Rate",
            },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 stat-counter px-6 py-3 rounded-xl">
              {stat.icon}
              <div>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Quote className="w-8 h-8 text-teal-400" />
            </div>
            <p className="text-gray-400 text-lg">Reviews coming soon. Check back later!</p>
          </div>
        ) : (
          <>
            <div
              ref={gridRef}
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 reveal ${gridVisible ? "is-visible" : ""}`}
            >
              {reviews.map((t, i) => (
                <div
                  key={t.id}
                  className="review-card relative p-7 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4 relative z-10">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`w-[18px] h-[18px] ${
                          j < (t.rating || 5)
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review text */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-[14px] relative z-10 line-clamp-4">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  {/* Reviewer info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100 relative z-10">
                    {t.imageUrl ? (
                      <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-teal-100 relative">
                        <Image
                          src={t.imageUrl}
                          alt={t.name}
                          fill
                          sizes="44px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-11 h-11 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md shadow-teal-600/20">
                        {t.name[0]?.toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-900 text-sm truncate">
                        {t.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {t.role || "Verified Customer"}
                      </p>
                    </div>
                    <BadgeCheck className="w-5 h-5 text-teal-500 shrink-0" />
                  </div>
                </div>
              ))}
            </div>

            {/* View All CTA */}
            <div className="text-center mt-12">
              <Link
                href="/reviews"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-full transition-all hover:shadow-lg hover:shadow-teal-600/25 active:scale-95"
              >
                <BadgeCheck className="w-4 h-4" />
                View All Reviews
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
