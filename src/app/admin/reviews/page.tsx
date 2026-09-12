"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star, Quote } from "lucide-react";
import toast from "react-hot-toast";

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  imageUrl: string | null;
  order: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete review by "${name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted");
        setReviews((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage customer reviews shown on the /reviews page
          </p>
        </div>
        <Link
          href="/admin/reviews/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Review
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Quote className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            No reviews yet. Add your first review — text or with a picture!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              {review.imageUrl ? (
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={review.imageUrl}
                    alt={`${review.name} review`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full">
                    Photo review
                  </span>
                </div>
              ) : (
                <div className="h-16 bg-gradient-to-r from-teal-50 to-emerald-50 flex items-center justify-center">
                  <Quote className="w-6 h-6 text-teal-300" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">
                    Order: {review.order}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {review.name}
                  {review.role && (
                    <span className="text-gray-400 font-normal">
                      {" "}
                      · {review.role}
                    </span>
                  )}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-3 mb-4">
                  {review.text}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/reviews/${review.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(review.id, review.name)}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}