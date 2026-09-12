"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function NewSliderPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    imageUrl: "",
    title: "",
    subtitle: "",
    order: 0,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "arcurepharma/sliders");
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
    if (!form.imageUrl) {
      toast.error("Please upload a slide image");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/sliders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Slide created!");
        router.push("/admin/sliders");
      } else {
        toast.error("Failed to create slide");
      }
    } catch {
      toast.error("Failed to create slide");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/sliders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Sliders
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add New Slide</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slide Image *</label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-12 text-center cursor-pointer hover:border-teal-400 transition-all"
          >
            {form.imageUrl ? (
              <img src={form.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {uploading ? "Uploading..." : "Click to upload slide image (1920x800 recommended)"}
                </p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="e.g., Summer Health Sale"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="e.g., Up to 30% off on health products"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            min="0"
          />
          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Slide"}
        </button>
      </form>
    </div>
  );
}
