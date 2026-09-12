"use client";

import { useRef, useState } from "react";
import { Upload, X, Star, Link2, ClipboardPaste } from "lucide-react";
import toast from "react-hot-toast";

interface AdminImagePickerProps {
  images: string[];
  coverIndex: number;
  uploading: boolean;
  onUploadingChange: (v: boolean) => void;
  onAdd: (urls: string[]) => void;
  onRemove: (idx: number) => void;
  onSetCover: (idx: number) => void;
  compact?: boolean;
}

export default function AdminImagePicker({
  images,
  coverIndex,
  uploading,
  onUploadingChange,
  onAdd,
  onRemove,
  onSetCover,
  compact,
}: AdminImagePickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");

  const uploadFiles = async (files: File[]) => {
    if (!files.length) return;
    onUploadingChange(true);
    const urls: string[] = [];
    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", "arcurepharma/products");
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } catch {
        toast.error("Upload failed");
      }
    }
    onUploadingChange(false);
    if (urls.length) {
      onAdd(urls);
      toast.success(`${urls.length} image(s) uploaded!`);
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) uploadFiles(Array.from(files));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = Array.from(e.clipboardData?.items ?? []);
    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      uploadFiles(files);
      return;
    }
    const text = e.clipboardData.getData("text");
    const urls = text
      .split(/\s+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http"));
    if (urls.length) {
      e.preventDefault();
      onAdd(urls);
      toast.success(`${urls.length} image URL(s) added!`);
    }
  };

  const addUrl = () => {
    const urls = urlInput
      .split(/[\s,]+/)
      .map((u) => u.trim())
      .filter((u) => u.startsWith("http"));
    if (!urls.length) {
      toast.error("Paste a valid image URL");
      return;
    }
    onAdd(urls);
    toast.success(`${urls.length} image URL(s) added!`);
    setUrlInput("");
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileRef.current?.click()}
        onPaste={handlePaste}
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-teal-400 transition-all"
      >
        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">
          {uploading ? "Uploading..." : "Click to upload files"}
        </p>
        <p className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
          <ClipboardPaste className="w-3 h-3" />
          or paste an image / URL here (Ctrl+V)
        </p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3">
          <Link2 className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addUrl();
              }
            }}
            placeholder="Paste image URL..." 
            className="flex-1 py-3 bg-transparent text-sm focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={addUrl}
          disabled={uploading}
          className="px-4 py-3 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
        >
          Add
        </button>
      </div>

      {images.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-3">
            {images.length} image(s). Click{" "}
            <Star className="inline w-3 h-3 text-yellow-500" /> to set cover.
          </p>
          <div className="flex flex-wrap gap-3">
            {images.map((url, idx) => (
              <div
                key={idx}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 ${
                  idx === coverIndex ? "border-teal-500" : "border-gray-200"
                }`}
              >
                <img
                  src={url}
                  alt={`Image ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onSetCover(idx)}
                  className="absolute top-1 left-1 p-1 bg-black/50 rounded-full hover:bg-teal-600 transition-colors"
                  title="Set as cover"
                >
                  <Star
                    className={`w-3 h-3 ${
                      idx === coverIndex
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-white"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(idx)}
                  className="absolute top-1 right-1 p-1 bg-black/50 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}