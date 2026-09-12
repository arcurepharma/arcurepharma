"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import AdminImagePicker from "@/components/admin/AdminImagePicker";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<string[]>(["General"]);
  const [images, setImages] = useState<string[]>([]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "General",
    imageUrl: "",
    videoUrl: "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const names = Array.isArray(data)
          ? data.map((c: { name: string }) => c.name)
          : [];
        const list = Array.from(new Set(["General", ...names]));
        setCategories(list);
      })
      .catch(() => {});
  }, []);

  const addImages = (urls: string[]) => {
    setImages((prev) => {
      const next = [...prev, ...urls];
      if (next.length === urls.length) {
        setForm((f) => ({ ...f, imageUrl: urls[0] }));
        setCoverIndex(0);
      }
      return next;
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      if (idx === coverIndex) {
        const newCover = Math.min(coverIndex, next.length - 1);
        setCoverIndex(Math.max(0, newCover));
        if (next.length > 0) setForm((f) => ({ ...f, imageUrl: next[Math.max(0, newCover)] }));
      } else if (idx < coverIndex) {
        setCoverIndex((c) => c - 1);
      }
      if (next.length === 0) setForm((f) => ({ ...f, imageUrl: "" }));
      return next;
    });
  };

  const setCover = (idx: number) => {
    setCoverIndex(idx);
    setForm((f) => ({ ...f, imageUrl: images[idx] || "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.imageUrl) {
      toast.error("Please fill all required fields and upload an image");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      if (res.ok) {
        toast.success("Product created!");
        router.push("/admin/products");
      } else {
        toast.error("Failed to create product");
      }
    } catch {
      toast.error("Failed to create product");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Products
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Product</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images *
          </label>
          <AdminImagePicker
            images={images}
            coverIndex={coverIndex}
            uploading={uploading}
            onUploadingChange={setUploading}
            onAdd={addImages}
            onRemove={removeImage}
            onSetCover={setCover}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="e.g., Paracetamol 500mg"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (Rs.) *
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="250"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            placeholder="Brief description of the product..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Video URL (optional)
          </label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="https://example.com/product-video.mp4 or YouTube link"
          />
          <p className="mt-1 text-xs text-gray-400">
            Paste a video link (MP4 or YouTube/Vimeo). It will be shown on the
            product page.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
