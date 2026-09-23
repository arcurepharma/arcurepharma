"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Save } from "lucide-react";
import toast from "react-hot-toast";
import AdminImagePicker from "@/components/admin/AdminImagePicker";

interface Category {
  id: string;
  name: string;
  imageUrl?: string | null;
  createdAt: string;
}

const FIXED_ORDER = ["Skin Care", "Supplements"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const fetchCategories = () => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        const sorted = [...list].sort((a, b) => {
          const ai = FIXED_ORDER.indexOf(a.name);
          const bi = FIXED_ORDER.indexOf(b.name);
          return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
        });
        setCategories(sorted);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const updateImage = (id: string, urls: string[]) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, imageUrl: urls[0] || null } : c))
    );
  };

  const removeImage = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, imageUrl: null } : c))
    );
  };

  const handleSave = async (cat: Category) => {
    setSavingId(cat.id);
    try {
      const res = await fetch(`/api/categories/${cat.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cat.name, imageUrl: cat.imageUrl || null }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${cat.name} image saved`);
      } else {
        toast.error(data.error || "Failed to save category");
      }
    } catch {
      toast.error("Failed to save category");
    }
    setSavingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload a display image for each category. These tiles show on the storefront in a 50/50 layout.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No categories yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900">{cat.name}</h2>
                  <p className="text-gray-400 text-xs mt-0.5">
                    50% tile on storefront
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                  Category
                </span>
              </div>

              <div className="p-5 space-y-5">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                  {cat.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-contain bg-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-xs">No image uploaded yet</span>
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Category image (shown on homepage)
                  </p>
                  <AdminImagePicker
                    images={cat.imageUrl ? [cat.imageUrl] : []}
                    coverIndex={0}
                    uploading={uploadingId === cat.id}
                    onUploadingChange={(v) =>
                      setUploadingId(v ? cat.id : null)
                    }
                    onAdd={(urls) => updateImage(cat.id, urls)}
                    onRemove={() => removeImage(cat.id)}
                    onSetCover={() => {}}
                    compact
                  />
                </div>

                <button
                  onClick={() => handleSave(cat)}
                  disabled={savingId === cat.id}
                  className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingId === cat.id ? "Saving..." : "Save Image"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}