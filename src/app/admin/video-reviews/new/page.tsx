"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import VideoReviewForm, {
  type VideoReviewFormData,
} from "@/components/admin/VideoReviewForm";

export default function NewVideoReviewPage() {
  const router = useRouter();

  const handleSubmit = async (data: VideoReviewFormData) => {
    try {
      const res = await fetch("/api/video-reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Video added!");
        router.push("/admin/video-reviews");
      } else {
        const data2 = await res.json().catch(() => ({}));
        toast.error(data2.error || "Failed to add video");
      }
    } catch {
      toast.error("Failed to add video");
    }
  };

  return (
    <div className="max-w-2xl">
      <Link
        href="/admin/video-reviews"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Video Reviews
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">Add Video Review</h1>

      <VideoReviewForm
        submitLabel="Add Video"
        loadingLabel="Adding..."
        onSubmit={handleSubmit}
      />
    </div>
  );
}
