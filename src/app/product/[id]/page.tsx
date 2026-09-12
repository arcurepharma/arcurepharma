"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, PlayCircle } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";
import Image from "next/image";

interface ProductData {
  id: string;
  title: string;
  price: string;
  description: string;
  category: string;
  imageUrl: string;
  images: string[] | null;
  videoUrl?: string | null;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center pt-40">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
        <Footer />
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 pt-40 text-center">
          <p className="text-gray-500 text-lg mb-4">Product not found</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
          >
            Go Home
          </button>
        </div>
        <Footer />
      </main>
    );
  }

  const allImages =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    toast.success(`${quantity}x ${product.title} added to cart!`);
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-4">
              <Image
                src={allImages[selectedImage]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain p-4"
                priority
              />
              {product.category && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-teal-600 text-white text-xs font-medium rounded-full z-10">
                  {product.category}
                </span>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-18 h-18 min-w-[72px] aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      idx === selectedImage
                        ? "border-teal-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${product.title} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {product.videoUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-teal-600" />
                  Product Video
                </h3>
                <VideoPlayer url={product.videoUrl} title={product.title} />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {product.category && (
              <span className="inline-block w-fit px-3 py-1 bg-teal-50 text-teal-700 text-xs font-medium rounded-full mb-3">
                {product.category}
              </span>
            )}

            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              {product.title}
            </h1>

            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-gray-400 ml-1">(5.0)</span>
            </div>

            <p className="text-3xl font-bold text-teal-700 mb-6">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity</span>
              <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-xl transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-xl transition-colors"
                >
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-teal-600/20 active:scale-[0.98]"
              >
                <ShoppingCart className="w-5 h-5" />
                Buy Now
              </button>
              <button
                onClick={() => {
                  for (let i = 0; i < quantity; i++) {
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      imageUrl: product.imageUrl,
                    });
                  }
                  router.push("/checkout");
                }}
                className="py-3.5 px-6 bg-teal-50 hover:bg-teal-100 text-teal-700 font-medium rounded-xl transition-colors text-center"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function VideoPlayer({ url, title }: { url: string; title: string }) {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  if (youtubeMatch) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  if (vimeoMatch) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
        <iframe
          src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
          title={title}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
      <video
        src={url}
        controls
        preload="metadata"
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
