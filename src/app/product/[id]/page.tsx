"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  BadgeCheck,
  Truck,
  ShieldCheck,
Minus,
  Plus,
  PlayCircle,
  Droplets,
  FileText,
  AlertCircle,
  Zap,
} from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import FooterOnly from "@/components/storefront/FooterOnly";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

interface Product {
  id: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  imageUrl: string;
  images?: string[];
  videoUrl?: string | null;
  benefits?: string[];
  ingredients?: string;
  howToUse?: string;
  warnings?: string;
  isPrescriptionRequired?: number;
  sku?: string;
  isActive?: number;
}

interface Review {
  id: string;
  name: string;
  role?: string;
  rating?: number;
  text: string;
  imageUrl?: string | null;
}

const beforeAfterResults = [
  {
    before: "/results/result-1-before.jpg",
    after: "/results/result-1-after.jpg",
  },
  {
    before: "/results/result-2-before.jpg",
    after: "/results/result-2-after.jpg",
  },
];

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const [qty, setQty] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data.slice(0, 6) : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) {
          setProduct(data);
          setActiveImg(data.imageUrl);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    if (!product) return;
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.imageUrl,
      });
    }
    toast.success(`${qty} x ${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    handleAdd();
    router.push("/checkout");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <div className="w-10 h-10 border-4 border-[#fde8fc] border-t-[#fcb8fd] rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-40 pb-20 text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#fcb8fd] text-white rounded-xl hover:bg-[#d460d6] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </main>
    );
  }

  const gallery = Array.from(
    new Set([product.imageUrl, ...(product.images || [])])
  ).filter(Boolean) as string[];

  const isOutOfStock = product.isActive === 0;
  const benefits = product.benefits || [];

  const infoSections = [
    { icon: FileText, title: "Description", text: product.description || "No description available." },
    { icon: Droplets, title: "Key Ingredients", text: product.ingredients || "Not specified." },
    { icon: Zap, title: "How to Use", text: product.howToUse || "Follow the directions provided with the product." },
    { icon: AlertCircle, title: "Warnings", text: product.warnings || "Read label instructions before use. Keep out of reach of children." },
  ].filter((s) => s.text && s.text !== "Not specified.");

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Link href="/#products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#d460d6] mb-6 text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* ── Gallery ── */}
          <div>
            <div className="relative aspect-square bg-[#fff5fe] rounded-3xl overflow-hidden border border-[#fde8fc]">
              {gallery.map((img, i) => (
                <Image
                  key={i}
                  src={img}
                  alt={product.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-contain p-6 sm:p-10 transition-opacity duration-500 ${
                    activeImg === img ? "opacity-100" : "opacity-0"
                  } ${isOutOfStock ? "opacity-40 grayscale" : ""}`}
                />
              ))}
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <span className="bg-gray-800/80 text-white text-xs font-bold px-4 py-2 rounded-full tracking-wider">
                    OUT OF STOCK
                  </span>
                </div>
              )}
              {product.videoUrl && (
                <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1 px-2.5 py-1 bg-[#fcb8fd]/90 text-white text-[10px] font-semibold rounded-lg backdrop-blur-sm">
                  <PlayCircle className="w-3.5 h-3.5" /> Video Available
                </span>
              )}
            </div>

            {gallery.length > 1 && (
              <div className="flex gap-3 mt-4">
                {gallery.slice(0, 6).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImg === img ? "border-[#fcb8fd] scale-105" : "border-gray-100 hover:border-[#fde8fc]"
                    }`}
                  >
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div>
            {product.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fff5fe] text-[#d460d6] text-xs font-bold rounded-full mb-3">
                <BadgeCheck className="w-3.5 h-3.5" /> {product.category}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-1.5 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-gray-400 ml-1">(Verified Product)</span>
            </div>

            <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-6">
              {formatPrice(product.price)}
              <span className="text-sm font-medium text-gray-400 ml-2">incl. GST</span>
            </p>

            {product.sku && (
              <p className="text-xs text-gray-400 mb-4">
                SKU: <span className="font-mono">{product.sku}</span>
              </p>
            )}

            {product.isPrescriptionRequired === 1 && (
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-5">
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <p className="text-xs text-amber-800 font-medium">
                  Prescription required. Upload your prescription at checkout.
                </p>
              </div>
            )}

            {/* Qty + Actions */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="w-11 text-center font-bold text-gray-800">{qty}</span>
                <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="w-11 h-12 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                disabled={isOutOfStock}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#fcb8fd] hover:bg-[#e8a0f0] text-[#6b1f6d] font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#fcb8fd]/20"
              >
                <ShoppingCart className="w-4 h-4" /> {isOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-gray-900 hover:bg-gray-700 text-white font-bold text-sm rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
            >
              <Zap className="w-4 h-4" /> Buy Now
            </button>

            {benefits.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-gray-900 mb-3">Key Benefits</h2>
                <div className="flex flex-wrap gap-2">
                  {benefits.map((b, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#fff5fe] text-[#d460d6] text-xs font-semibold rounded-full border border-[#fde8fc]">
                      <BadgeCheck className="w-3.5 h-3.5" /> {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Info sections ── */}
        <div className="mt-14">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 border-b-2 border-[#fde8fc] pb-3">
            Product Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {infoSections.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <s.icon className="w-5 h-5 text-[#d460d6]" />
                  <h3 className="font-bold text-gray-900 text-sm">{s.title}</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Before & After Results ── */}
        <div className="mt-14">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fff5fe] text-[#fcb8fd] text-xs font-semibold rounded-full mb-4 border border-[#fde8fc]">
              ✨ Real People, Real Results
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Before &amp; After Results
            </h2>
            <p className="text-gray-400 text-sm">
              See the transformations our customers have experienced.
            </p>
            <div className="w-12 h-1 bg-[#fcb8fd] rounded-full mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-3xl mx-auto">
            {beforeAfterResults.map((r, i) => (
              <div key={i} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-gray-200">
                    <Image src={r.before} alt="Before" fill sizes="200px" className="object-cover" />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-700 text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                      BEFORE
                    </span>
                  </div>
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-[#fde8fc]">
                    <Image src={r.after} alt="After" fill sizes="200px" className="object-cover" />
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-[#fcb8fd] text-white text-[9px] sm:text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap shadow">
                      AFTER
                    </span>
                  </div>
                </div>
                <div className="flex justify-center text-[#fcb8fd]">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-6">
            * Individual results may vary. Consistent use as directed is recommended.
          </p>
        </div>

        {/* ── Customer Reviews ── */}
        {reviews.length > 0 && (
          <div className="mt-14">
            <div className="flex items-center justify-between mb-6 border-b-2 border-[#fde8fc] pb-3">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Customer Reviews
              </h2>
              <Link href="/reviews" className="text-[#fcb8fd] hover:text-[#d460d6] text-sm font-bold transition-colors">
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center gap-3 mb-3">
                    {review.imageUrl ? (
                      <Image
                        src={review.imageUrl}
                        alt={review.name}
                        width={44}
                        height={44}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-[#fff5fe] text-[#fcb8fd] font-bold flex items-center justify-center text-lg shrink-0">
                        {(review.name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{review.name}</p>
                      {review.role && <p className="text-xs text-gray-400 truncate">{review.role}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${s <= (review.rating || 5) ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-100"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-4">{review.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterOnly />
    </main>
  );
}