"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Video,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
  Play,
  RotateCcw,
} from "lucide-react";
import toast from "react-hot-toast";

const SUGGESTED_PRODUCTS = [
  "ARCUDERM CS Serum",
  "ARCU GLEAM Face Wash",
  "ARCU-CAL K2",
  "Mida-D Vitamin D3",
  "Radiance Duo Bundle",
  "Skin Care Essentials",
];

export default function NewVideoPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    videoUrl: "",
    title: "",
    creator: "",
    handle: "@arcurepharma",
    product: "ARCUDERM CS Serum",
    order: 1,
    isActive: 1,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("video/") && !/\.(mp4|webm|mov|mkv)$/i.test(file.name)) {
      toast.error("Please select a valid video file (.mp4, .webm, .mov)");
      return;
    }

    setUploading(true);
    setUploadProgress(15);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "arcurepharma/reels");

      setUploadProgress(40);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      setUploadProgress(85);
      const data = await res.json();

      if (data.url) {
        setForm((prev) => ({
          ...prev,
          videoUrl: data.url,
          title: prev.title || file.name.replace(/\.[^/.]+$/, ""),
        }));
        setUploadProgress(100);
        toast.success(
          data.source === "imagekit"
            ? "Uploaded to ImageKit CDN!"
            : "Video uploaded successfully!"
        );
      } else {
        toast.error(data.error || "Failed to upload video");
      }
    } catch {
      toast.error("Upload failed. Check your network or file size.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.videoUrl.trim()) {
      toast.error("Please upload a video or enter a video URL");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Video added successfully!");
        router.push("/admin/videos");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add video");
      }
    } catch {
      toast.error("Network error while adding video");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl pb-16">
      {/* Breadcrumb Header */}
      <Link
        href="/admin/videos"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Videos</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Video Reel</h1>
        <p className="text-gray-500 text-sm mt-1">
          Upload influencer testimonials, tutorials, or product demos to show on the storefront
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Live Preview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Video className="w-4 h-4 text-[#16a34a]" />
              Video Source
            </h3>

            {/* Video Player Preview if available */}
            {form.videoUrl ? (
              <div className="relative aspect-[9/16] bg-slate-950 rounded-2xl overflow-hidden shadow-md group">
                <video
                  src={form.videoUrl}
                  controls
                  playsInline
                  autoPlay
                  loop
                  muted
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-2.5 right-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({ ...prev, videoUrl: "" }));
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    className="p-1.5 bg-black/60 hover:bg-black/90 text-white rounded-full backdrop-blur-sm transition-all text-xs"
                    title="Change video"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Upload Dropzone */
              <div
                onClick={() => fileRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[260px] ${
                  uploading
                    ? "border-[#16a34a] bg-[#f0fdf4]"
                    : "border-gray-200 hover:border-[#16a34a] hover:bg-gray-50/80 bg-gray-50/40"
                }`}
              >
                {uploading ? (
                  <div className="space-y-3 w-full text-center">
                    <div className="w-10 h-10 border-3 border-emerald-200 border-t-[#16a34a] rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-bold text-gray-700">
                      Uploading to ImageKit / Server...
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#16a34a] h-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-emerald-50 text-[#16a34a] rounded-2xl flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-gray-800">
                      Click to upload video
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      MP4, WebM, MOV (9:16 vertical recommended)
                    </p>
                  </>
                )}
              </div>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="video/*,.mp4,.webm,.mov"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Direct URL input */}
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                Or enter direct video URL:
              </label>
              <input
                type="text"
                value={form.videoUrl}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, videoUrl: e.target.value }))
                }
                placeholder="https://ik.imagekit.io/... or /videos/reels/..."
                className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="font-bold text-gray-900 text-base pb-3 border-b border-gray-100">
              Video Details &amp; Tagging
            </h3>

            {/* Title / Caption */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                Title / Caption
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="e.g. Arcure CS Serum Routine"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
              />
            </div>

            {/* Creator / Handle in 2 cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Creator / Influencer Name *
                </label>
                <input
                  type="text"
                  required
                  value={form.creator}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, creator: e.target.value }))
                  }
                  placeholder="e.g. Dr. Aiman or Arcure Expert"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Social Handle
                </label>
                <input
                  type="text"
                  value={form.handle}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, handle: e.target.value }))
                  }
                  placeholder="e.g. @arcurepharma"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all font-mono"
                />
              </div>
            </div>

            {/* Featured Product */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-1.5">
                Featured Product Tag *
              </label>
              <input
                type="text"
                required
                value={form.product}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, product: e.target.value }))
                }
                placeholder="e.g. ARCUDERM CS Serum"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all mb-2"
              />

              <div className="flex flex-wrap gap-1.5">
                <span className="text-[11px] text-gray-400 font-medium py-1">Quick pick:</span>
                {SUGGESTED_PRODUCTS.map((prod) => (
                  <button
                    key={prod}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, product: prod }))}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all cursor-pointer ${
                      form.product === prod
                        ? "bg-[#16a34a] text-white border-[#16a34a]"
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:border-[#16a34a]"
                    }`}
                  >
                    {prod}
                  </button>
                ))}
              </div>
            </div>

            {/* Order & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.order}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      order: parseInt(e.target.value) || 1,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#16a34a] focus:bg-white transition-all"
                />
                <span className="text-[11px] text-gray-400 mt-1 block">
                  Lower numbers appear first on the site
                </span>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-800 mb-1.5">
                  Visibility
                </label>
                <label className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={form.isActive === 1}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.checked ? 1 : 0,
                      }))
                    }
                    className="w-4 h-4 text-[#16a34a] rounded focus:ring-[#16a34a]"
                  />
                  <span className="text-xs font-bold text-gray-700">
                    Publish immediately on storefront
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link
                href="/admin/videos"
                className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving Video...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save &amp; Publish Video</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
