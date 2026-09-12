"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Slider {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  order: number;
}

export default function AdminSlidersPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSliders = () => {
    fetch("/api/sliders")
      .then((r) => r.json())
      .then((data) => {
        setSliders(data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    try {
      const res = await fetch(`/api/sliders/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Slide deleted");
        setSliders((prev) => prev.filter((s) => s.id !== id));
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
          <h1 className="text-2xl font-bold text-gray-900">Slider Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your hero carousel slides</p>
        </div>
        <Link
          href="/admin/sliders/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Slide
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : sliders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500">No slides yet. Add your first slide!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map((slider) => (
            <div
              key={slider.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={slider.imageUrl}
                  alt={slider.title || "Slide"}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-black/50 text-white text-xs rounded-full">
                  Order: {slider.order}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-gray-800 text-sm mb-1">
                  {slider.title || "Untitled Slide"}
                </h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-4">
                  {slider.subtitle || "No subtitle"}
                </p>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/sliders/${slider.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(slider.id)}
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
