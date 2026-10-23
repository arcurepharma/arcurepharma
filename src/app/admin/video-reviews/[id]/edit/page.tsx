"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import VideoReviewForm, {
  type VideoReviewFormData,
} from "@/components/admin/VideoReviewForm";

interface VideoReview {
  id: string;
  title: string;
  customerName: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  order: number;
  isActive: number;
}

export default function EditVideoReviewPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = String(params?.id || "");
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState<VideoReviewFormData | undefined>(
    undefined
  );

  useEffect(() => {
    if (!id) return;
    fetch(`/api/video-reviews/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data: VideoReview) => {
        setInitial({
          title: data.title || "",
          customerName: data.customerName || "",
          videoUrl: data.videoUrl || "",
          thumbnailUrl: data.thumbnailUrl || "",
          order: data.order ?? 0,
          isActive: data.isActive ?? 1,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Video load nahi hua");
        router.push("/admin/video-reviews");
      });
  }, [id, router]);

  const handleSubmit = async (data: VideoReviewFormData) => {
    try {
      const res = await fetch(`/api/video-reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Video updated!");
        router.push("/admin/video-reviews");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to update video");
      }
    } catch {
      toast.error("Failed to update video");
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl py-20 text-center">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/video-reviews"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Video Reviews
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Video Review</h1>

      <VideoReviewForm
        initial={initial}
        submitLabel="Save Changes"
        loadingLabel="Saving..."
        onSubmit={handleSubmit}
      />
    </div>
  );
}
