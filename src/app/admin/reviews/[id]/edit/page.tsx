"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star, X, ImageIcon } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditReviewPage() {
  const router = useRouter();
  const params = useParams();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    name: "",
    role: "",
    rating: 5,
    text: "",
    imageUrl: "",
    order: 0,
  });

  useEffect(() => {
    fetch(`/api/reviews/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          role: data.role || "",
          rating: data.rating || 5,
          text: data.text || "",
          imageUrl: data.imageUrl || "",
          order: data.order || 0,
        });
        setFetching(false);
      });
  }, [params.id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "arcurepharma/reviews");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success("Image uploaded!");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) {
      toast.error("Name and review text are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Review updated!");
        router.push("/admin/reviews");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/reviews"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Reviews
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Review</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-400 transition-all"
          >
            {form.imageUrl ? (
              <div className="relative">
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="w-full h-44 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm((prev) => ({ ...prev, imageUrl: "" }));
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-600 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  {uploading
                    ? "Uploading..."
                    : "Click to upload a customer photo (makes it a picture review)"}
                </p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role / Designation
            </label>
            <input
              type="text"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setForm({ ...form, rating: s })}
                className="p-1 transition-transform hover:scale-125"
                title={`${s} star${s > 1 ? "s" : ""}`}
              >
                <Star
                  className={`w-6 h-6 ${
                    s <= form.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-sm font-semibold text-gray-700">
              {form.rating}.0
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Review Text *
          </label>
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
          />
          <p className="text-xs text-gray-400 mt-1">
            Lower numbers appear first on the page
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}