"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, ArrowLeft, Star, PlayCircle, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import FooterOnly from "@/components/storefront/FooterOnly";
import ResultsSection from "@/components/storefront/ResultsSection";
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
  isActive?: number;
}

interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<ProductData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch(`/api/products/${params.id}`).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
      fetch(`/api/reviews`).then((r) => r.json()),
    ])
      .then(([productData, reviewsData]) => {
        setProduct(productData);
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center pt-40">
          <div className="w-10 h-10 border-4 border-[#fae3ec] border-t-[#a83866] rounded-full animate-spin" />
        </div>
        <FooterOnly />
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
            className="px-6 py-3 bg-[#a83866] text-white rounded-xl hover:bg-[#8a2a52] transition-colors"
          >
            Go Home
          </button>
        </div>
        <FooterOnly />
      </main>
    );
  }

  const isOutOfStock = product.isActive === 0;
  const allImages =
    product.images && Array.isArray(product.images) && product.images.length > 0
      ? product.images
      : [product.imageUrl];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl });
    }
    toast.success(`${quantity}x ${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    for (let i = 0; i < quantity; i++) {
      addItem({ id: product.id, title: product.title, price: product.price, imageUrl: product.imageUrl });
    }
    router.push("/checkout");
  };

  const avgRating = reviews.length
    ? Math.round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length)
    : 5;

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* ── Image Gallery ── */}
          <div>
            <div className="relative aspect-square bg-[#fdf4f7] rounded-2xl overflow-hidden border border-[#fae3ec] mb-4">
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="bg-gray-800/75 text-white text-sm font-bold px-4 py-2 rounded-full">
                    OUT OF STOCK
                  </span>
                </div>
              )}
              <Image
                src={allImages[selectedImage]}
                alt={product.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-contain p-4 ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
                priority
              />
              {product.category && (
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#a83866] text-white text-xs font-medium rounded-full z-10">
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
                    className={`relative min-w-[72px] aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      idx === selectedImage ? "border-[#a83866]" : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <img src={url} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            {product.videoUrl && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-[#a83866]" /> Product Video
                </h3>
                <VideoPlayer url={product.videoUrl} title={product.title} />
              </div>
            )}
          </div>

          {/* ── Product Info ── */}
          <div className="flex flex-col">
            {product.category && (
              <span className="inline-block w-fit px-3 py-1 bg-[#fdf4f7] text-[#a83866] text-xs font-semibold rounded-full mb-3">
                {product.category}
              </span>
            )}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>

            {/* Stars */}
            <div className="flex items-center gap-1 mb-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className={`w-4 h-4 ${s <= avgRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
              ))}
              <span className="text-sm text-gray-400 ml-1">({reviews.length} reviews)</span>
            </div>

            <p className="text-3xl font-bold text-[#a83866] mb-5">{formatPrice(product.price)}</p>

            {product.description && (
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-gray-700">Quantity</span>
              <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-xl transition-colors">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(99, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-xl transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all active:scale-[0.98] ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#fdf4f7] hover:bg-[#fae3ec] text-[#a83866] border border-[#fae3ec]"
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 font-semibold rounded-xl transition-all active:scale-[0.98] hover:shadow-lg ${
                  isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#a83866] hover:bg-[#8a2a52] text-white hover:shadow-[#a83866]/20"
                }`}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Results Section ── */}
      <ResultsSection />

      {/* ── Reviews Section ── */}
      {reviews.length > 0 && (
        <section className="py-14 lg:py-20 bg-[#fdf4f7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-[#a83866] text-xs sm:text-sm font-semibold rounded-full mb-4 border border-[#fae3ec]">
                <CheckCircle className="w-4 h-4" /> Verified Customer Reviews
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What Our Customers Say</h2>
              <div className="w-12 h-1 bg-[#a83866] rounded-full mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {reviews.slice(0, 6).map((review) => (
                <div key={review.id} className="review-card bg-white rounded-2xl p-6 shadow-sm border border-[#fae3ec] relative">
                  {/* Stars */}
                  <div className="flex items-center gap-0.5 mb-3 relative z-10">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 relative z-10 line-clamp-4">
                    {review.text}
                  </p>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c85882] to-[#a83866] flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {review.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{review.name}</p>
                      {review.role && <p className="text-[11px] text-gray-400">{review.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <FooterOnly />
    </main>
  );
}

function VideoPlayer({ url, title }: { url: string; title: string }) {
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

  if (youtubeMatch) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
        <iframe src={`https://www.youtube.com/embed/${youtubeMatch[1]}`} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
      </div>
    );
  }
  if (vimeoMatch) {
    return (
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
        <iframe src={`https://player.vimeo.com/video/${vimeoMatch[1]}`} title={title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
      </div>
    );
  }
  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 bg-black">
      <video src={url} controls preload="metadata" playsInline className="absolute inset-0 w-full h-full object-contain">
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
