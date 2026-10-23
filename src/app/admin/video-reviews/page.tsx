"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Video, EyeOff, Play } from "lucide-react";
import toast from "react-hot-toast";
import { resolveVideoSource } from "@/lib/video-source";

interface VideoReview {
  id: string;
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  order: number;
  isActive: number;
}

export default function AdminVideoReviewsPage() {
  const [videos, setVideos] = useState<VideoReview[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVideos = () => {
    fetch("/api/video-reviews?all=1")
      .then((r) => r.json())
      .then((data) => {
        setVideos(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    try {
      const res = await fetch(`/api/video-reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Video deleted");
        setVideos((prev) => prev.filter((v) => v.id !== id));
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (video: VideoReview) => {
    try {
      const res = await fetch(`/api/video-reviews/${video.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: video.isActive ? 0 : 1 }),
      });
      if (res.ok) {
        const updated = await res.json();
        setVideos((prev) =>
          prev.map((v) => (v.id === video.id ? { ...v, ...updated } : v))
        );
        toast.success(updated.isActive ? "Now visible" : "Now hidden");
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Reviews</h1>
          <p className="text-gray-500 text-sm mt-1">
            Customer video testimonials — link se ya upload karke add karein
          </p>
        </div>
        <Link
          href="/admin/video-reviews/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-medium rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Video
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Video className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No videos yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const info = resolveVideoSource(video.videoUrl, video.thumbnailUrl);
            return (
              <div
                key={video.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="relative aspect-video bg-gray-900">
                  {info.thumbnailUrl ? (
                    <Image
                      src={info.thumbnailUrl}
                      alt={video.title || "Video"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : info.source === "file" ? (
                    <video
                      src={info.fileUrl}
                      muted
                      playsInline
                      preload="metadata"
                      aria-label={video.title || "Video"}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/25 transition-colors">
                    <span className="w-12 h-12 bg-white/85 rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-[#b06f22] fill-[#b06f22]" />
                    </span>
                  </div>
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 bg-black/55 text-white text-[10px] font-bold uppercase rounded-full">
                      {info.source}
                    </span>
                    <span className="px-2.5 py-1 bg-black/55 text-white text-[10px] font-bold rounded-full">
                      Order: {video.order}
                    </span>
                  </div>
                  {video.isActive ? null : (
                    <span className="absolute top-3 right-3 px-2.5 py-1 bg-gray-800/80 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {video.title || "Untitled Video"}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4">
                    {video.customerName || "No customer name"}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/video-reviews/${video.id}/edit`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => toggleActive(video)}
                      title={video.isActive ? "Hide from website" : "Show on website"}
                      className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                        video.isActive
                          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "bg-teal-50 text-teal-600 hover:bg-teal-100"
                      }`}
                    >
                      {video.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
