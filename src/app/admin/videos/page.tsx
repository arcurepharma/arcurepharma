"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  Play,
  Pause,
  Eye,
  EyeOff,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import toast from "react-hot-toast";

interface Reel {
  id: string;
  videoUrl: string;
  title: string;
  creator: string;
  handle: string;
  product: string;
  order: number;
  isActive: number;
}

export default function AdminVideosPage() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const fetchReels = () => {
    setLoading(true);
    fetch("/api/reels?all=true")
      .then((r) => r.json())
      .then((data) => {
        setReels(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast.error("Failed to load videos");
      });
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete video "${title || "Untitled"}"?`)) return;
    try {
      const res = await fetch(`/api/reels/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Video deleted successfully");
        setReels((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error("Failed to delete video");
      }
    } catch {
      toast.error("Failed to delete video");
    }
  };

  const handleToggleStatus = async (reel: Reel) => {
    const nextStatus = reel.isActive === 1 ? 0 : 1;
    try {
      const res = await fetch(`/api/reels/${reel.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextStatus }),
      });
      if (res.ok) {
        toast.success(
          nextStatus === 1 ? "Video published on site" : "Video set to inactive"
        );
        setReels((prev) =>
          prev.map((r) => (r.id === reel.id ? { ...r, isActive: nextStatus } : r))
        );
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleTogglePlay = (id: string) => {
    const video = videoRefs.current[id];
    if (!video) return;

    if (video.paused) {
      // Pause all others
      Object.entries(videoRefs.current).forEach(([k, v]) => {
        if (v && k !== id) v.pause();
      });
      video.play().catch(() => {});
      setPlayingId(id);
    } else {
      video.pause();
      setPlayingId(null);
    }
  };

  const activeCount = reels.filter((r) => r.isActive === 1).length;

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#f0fdf4] text-[#16a34a] rounded-xl border border-[#bbf7d0]">
              <Video className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Reels &amp; Videos</h1>
          </div>
          <p className="text-gray-500 text-sm mt-1">
            Upload &amp; manage short-form videos displayed in the &ldquo;What People Say&rdquo; section
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchReels}
            className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl transition-all shadow-xs"
            title="Refresh videos"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-[#16a34a]/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Video</span>
          </Link>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Total Videos
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-1">{reels.length}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold">
            <Video className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Active on Storefront
            </p>
            <p className="text-2xl font-extrabold text-[#16a34a] mt-1">{activeCount}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-[#16a34a] rounded-xl flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Storefront Preview
            </p>
            <Link
              href="/#social-proof"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c58a38] hover:underline mt-1.5"
            >
              <span>View live on site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-[#c58a38] rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Videos List / Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 gap-3">
          <div className="w-8 h-8 border-3 border-emerald-100 border-t-[#16a34a] rounded-full animate-spin" />
          <p className="text-xs text-gray-500 font-medium">Loading video reels...</p>
        </div>
      ) : reels.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400 mb-4">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No videos added yet</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Upload your first influencer testimonial or customer video to showcase it on the storefront.
          </p>
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#16a34a] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#15803d]"
          >
            <Plus className="w-4 h-4" /> Add Video
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reels.map((reel) => {
            const isPlaying = playingId === reel.id;
            const isImageKit =
              reel.videoUrl.includes("imagekit.io") ||
              reel.videoUrl.includes("ik.imagekit.io");

            return (
              <div
                key={reel.id}
                className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col group"
              >
                {/* 9:16 Video Player Card */}
                <div
                  onClick={() => handleTogglePlay(reel.id)}
                  className="relative aspect-[9/16] bg-slate-950 overflow-hidden cursor-pointer"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[reel.id] = el;
                    }}
                    src={reel.videoUrl}
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient shadow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                  {/* Play / Pause Toggle Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-opacity ${
                        isPlaying ? "opacity-0 group-hover:opacity-80" : "opacity-90"
                      }`}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 fill-white" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5 fill-white" />
                      )}
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full border border-white/10">
                      Order: #{reel.order}
                    </span>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-full border backdrop-blur-md ${
                        reel.isActive === 1
                          ? "bg-emerald-500/80 text-white border-emerald-400/30"
                          : "bg-gray-700/80 text-gray-300 border-gray-600/30"
                      }`}
                    >
                      {reel.isActive === 1 ? "Active" : "Hidden"}
                    </span>
                  </div>

                  {/* Bottom Video Info */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <span className="inline-block px-2 py-0.5 bg-[#c58a38] text-white text-[10px] font-bold rounded-md mb-1 shadow-xs">
                      {reel.product}
                    </span>
                    <p className="text-white text-xs font-bold truncate">
                      {reel.creator}
                    </p>
                    <p className="text-white/70 text-[10px] font-medium truncate">
                      {reel.handle}
                    </p>
                  </div>
                </div>

                {/* Card Controls & Details */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm truncate">
                      {reel.title || reel.creator || "Untitled Reel"}
                    </h4>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[10px] ${
                          isImageKit
                            ? "bg-purple-50 text-purple-700 font-semibold"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {isImageKit ? "ImageKit CDN" : "Local Video"}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(reel)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                        reel.isActive === 1
                          ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      title={reel.isActive === 1 ? "Click to hide" : "Click to publish"}
                    >
                      {reel.isActive === 1 ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/admin/videos/${reel.id}`}
                        className="p-2 text-gray-500 hover:text-[#16a34a] hover:bg-[#f0fdf4] rounded-xl transition-colors cursor-pointer"
                        title="Edit video details"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDelete(reel.id, reel.title || reel.creator)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title="Delete video"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
