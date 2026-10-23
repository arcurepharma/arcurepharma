"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { Upload, Link2, Trash2, Video } from "lucide-react";
import toast from "react-hot-toast";
import { resolveVideoSource } from "@/lib/video-source";

export interface VideoReviewFormData {
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl: string;
  order: number;
  isActive: number;
}

interface Props {
  initial?: Partial<VideoReviewFormData>;
  submitLabel: string;
  loadingLabel: string;
  onSubmit: (data: VideoReviewFormData) => Promise<void>;
}

const EMPTY: VideoReviewFormData = {
  title: "",
  customerName: "",
  videoUrl: "",
  thumbnailUrl: "",
  order: 0,
  isActive: 1,
};

export default function VideoReviewForm({
  initial,
  submitLabel,
  loadingLabel,
  onSubmit,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<VideoReviewFormData>({ ...EMPTY, ...initial });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [mode, setMode] = useState<"link" | "upload">("link");

  const detected = resolveVideoSource(form.videoUrl, form.thumbnailUrl);

  const handleVideoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "arcurepharma/video-reviews");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, videoUrl: data.url }));
        setMode("upload");
        toast.success("Video uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploading(false);
  };

  const handleThumbUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingThumb(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "arcurepharma/video-reviews");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) {
        setForm((prev) => ({ ...prev, thumbnailUrl: data.url }));
        toast.success("Thumbnail uploaded!");
      } else {
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploadingThumb(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.videoUrl.trim()) {
      toast.error("Please add a video link or upload a video");
      return;
    }
    setSaving(true);
    try {
      await onSubmit({ ...form, videoUrl: form.videoUrl.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
      {/* Source toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("link")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === "link"
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Link2 className="w-4 h-4" /> Paste Link
        </button>
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === "upload"
              ? "bg-teal-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          <Upload className="w-4 h-4" /> Upload Video
        </button>
      </div>

      {mode === "link" ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video Link *
          </label>
          <input
            type="url"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <p className="text-xs text-gray-400 mt-1">
            YouTube, Vimeo, Facebook link ya koi bhi direct video file (.mp4 /
            .webm) chalega.
          </p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video File
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-teal-400 transition-all"
          >
            <Video className="w-9 h-9 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {uploading
                ? "Uploading..."
                : form.videoUrl
                  ? "Click to replace the video"
                  : "Click to upload video (max 50 MB)"}
            </p>
            {form.videoUrl && (
              <p className="text-xs text-teal-600 mt-2 break-all">
                {form.videoUrl}
              </p>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/ogg,video/quicktime"
            onChange={handleVideoUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Preview */}
      {form.videoUrl.trim() && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preview
          </label>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900">
            {detected.source === "file" ? (
              <video
                src={detected.fileUrl}
                poster={detected.thumbnailUrl || undefined}
                controls
                preload="metadata"
                className="w-full h-full object-contain"
              />
            ) : detected.thumbnailUrl ? (
              <Image
                src={detected.thumbnailUrl}
                alt="Video thumbnail"
                fill
                sizes="640px"
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-sm">
                {detected.source === "facebook"
                  ? "Facebook video — link save hote hi website par chalega"
                  : "Preview image load nahi ho rahi"}
              </div>
            )}
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-[10px] font-bold uppercase rounded">
              {detected.source}
            </span>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="e.g., Ayesha ka glowing skin journey"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customer Name
        </label>
        <input
          type="text"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="e.g., Ayesha Khan"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Auto-detect hota hai — link chhor dein to khud ban jayega"
          />
          <button
            type="button"
            onClick={() => thumbRef.current?.click()}
            disabled={uploadingThumb}
            className="shrink-0 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            {uploadingThumb ? "..." : "Upload"}
          </button>
        </div>
        <input
          ref={thumbRef}
          type="file"
          accept="image/*"
          onChange={handleThumbUpload}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            min="0"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibility
          </label>
          <button
            type="button"
            onClick={() =>
              setForm((prev) => ({ ...prev, isActive: prev.isActive ? 0 : 1 }))
            }
            className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
              form.isActive
                ? "bg-teal-600 text-white hover:bg-teal-700"
                : "bg-gray-200 text-gray-600 hover:bg-gray-300"
            }`}
          >
            {form.isActive ? "Visible on website" : "Hidden"}
          </button>
          <p className="text-xs text-gray-400 mt-1">
            {form.isActive ? "Website par show hoga" : "Website par nahi dikhega"}
          </p>
        </div>
      </div>

      {form.videoUrl && (
        <button
          type="button"
          onClick={() => setForm({ ...form, videoUrl: "", thumbnailUrl: "" })}
          className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear video
        </button>
      )}

      <button
        type="submit"
        disabled={saving || uploading || uploadingThumb}
        className="w-full py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
      >
        {saving ? loadingLabel : submitLabel}
      </button>
    </form>
  );
}
