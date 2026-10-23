"use client";

import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  ImagePlus,
  Images,
  Link2,
  Loader2,
  Save,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  IMAGE_REVIEW_SETTING_KEY,
  IMAGE_REVIEW_SLOT_COUNT,
  createEmptyImageReviewImages,
  isImageReviewUrl,
  normalizeImageReviewImages,
  parseImageReviewImages,
} from "@/lib/image-review";

export default function AdminImageReviewPage() {
  const [images, setImages] = useState<string[]>(
    createEmptyImageReviewImages
  );
  const [savedImages, setSavedImages] = useState<string[]>(
    createEmptyImageReviewImages
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const [editorVersion, setEditorVersion] = useState(0);
  const hasChanges = images.some(
    (image, index) => image !== (savedImages[index] ?? "")
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/settings", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load image slots");
        return response.json();
      })
      .then((data: Record<string, unknown>) => {
        const nextImages = parseImageReviewImages(
          data[IMAGE_REVIEW_SETTING_KEY]
        );
        setImages(nextImages);
        setSavedImages(nextImages);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        toast.error("Could not load the image review panel");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const updateImage = (index: number, imageUrl: string) => {
    setImages((currentImages) => {
      const nextImages = [...currentImages];
      nextImages[index] = imageUrl;
      return nextImages;
    });
  };

  const handleSave = async () => {
    const invalidSlot = images.findIndex(
      (image) => image && !isImageReviewUrl(image)
    );

    if (invalidSlot !== -1) {
      toast.error(`Slot ${invalidSlot + 1} has an invalid image URL`);
      return;
    }

    const nextImages = normalizeImageReviewImages(images);
    setSaving(true);

    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: IMAGE_REVIEW_SETTING_KEY,
          value: JSON.stringify(nextImages),
        }),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Failed to save image slots");
      }

      setImages(nextImages);
      setSavedImages(nextImages);
      toast.success("Customer result images published");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save image slots"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1500px]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Image Review Panel</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage all 12 customer result images shown in the moving storefront
          section.
        </p>
      </div>

      <div className="sticky top-0 z-20 mb-6 flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
            <Images className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-gray-900">
              {images.filter(Boolean).length} of {IMAGE_REVIEW_SLOT_COUNT}{" "}
              slots filled
            </p>
            <p className="text-xs text-gray-500">
              Uploads go to ImageKit. Save all to publish changes.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setImages(savedImages);
              setEditorVersion((version) => version + 1);
            }}
            disabled={!hasChanges || saving || uploadingSlot !== null}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Undo2 className="h-4 w-4" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasChanges || saving || uploadingSlot !== null}
            className="flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {images.map((imageUrl, index) => (
          <ImageReviewSlotCard
            key={`${index}-${editorVersion}`}
            index={index}
            imageUrl={imageUrl}
            disabled={saving || uploadingSlot !== null}
            onChange={(nextImageUrl) => updateImage(index, nextImageUrl)}
            onUploadingChange={(uploading) =>
              setUploadingSlot(uploading ? index : null)
            }
          />
        ))}
      </div>
    </div>
  );
}

function ImageReviewSlotCard({
  index,
  imageUrl,
  disabled,
  onChange,
  onUploadingChange,
}: {
  index: number;
  imageUrl: string;
  disabled: boolean;
  onChange: (imageUrl: string) => void;
  onUploadingChange: (uploading: boolean) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(imageUrl);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Choose a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }

    setUploading(true);
    onUploadingChange(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "arcurepharma/customer-results");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Image upload failed");
      }

      if (!isImageReviewUrl(data.url)) {
        throw new Error("ImageKit returned an invalid image URL");
      }

      onChange(data.url);
      setUrlInput(data.url);
      toast.success(`Slot ${index + 1} uploaded to ImageKit`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Image upload failed"
      );
    } finally {
      setUploading(false);
      onUploadingChange(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const applyImageUrl = () => {
    const nextImageUrl = urlInput.trim();

    if (!isImageReviewUrl(nextImageUrl)) {
      toast.error("Paste a valid http or https image URL");
      return;
    }

    onChange(nextImageUrl);
    toast.success(`Slot ${index + 1} link updated`);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-gray-900">
            Image {String(index + 1).padStart(2, "0")}
          </h2>
          <p className="text-xs text-gray-400">Homepage position {index + 1}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            imageUrl
              ? "bg-emerald-50 text-emerald-700"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          {imageUrl ? "Ready" : "Empty"}
        </span>
      </div>

      <div className="space-y-4 p-5">
        <div
          className="relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-gray-100 bg-cover bg-center"
          style={
            imageUrl
              ? { backgroundImage: `url(${JSON.stringify(imageUrl)})` }
              : undefined
          }
        >
          {!imageUrl && (
            <div className="flex h-full w-full flex-col items-center justify-center text-gray-300">
              <ImagePlus className="mb-2 h-9 w-9" />
              <span className="text-sm font-medium text-gray-400">
                No image selected
              </span>
            </div>
          )}
          {imageUrl && (
            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open image"
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-black/55 text-white transition-colors hover:bg-black/75"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={urlInput}
              onChange={(event) => setUrlInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  applyImageUrl();
                }
              }}
              placeholder="Paste image URL"
              aria-label={`Image URL for slot ${index + 1}`}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <button
            type="button"
            onClick={applyImageUrl}
            disabled={disabled || uploading}
            className="rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-semibold text-teal-700 transition-colors hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Apply
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? "Uploading..." : imageUrl ? "Replace Image" : "Upload Image"}
          </button>
          <button
            type="button"
            onClick={() => {
              onChange("");
              setUrlInput("");
            }}
            disabled={disabled || uploading || !imageUrl}
            title="Clear image"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void uploadFile(file);
          }}
        />
      </div>
    </article>
  );
}
