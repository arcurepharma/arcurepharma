"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  Copy,
  Check,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

interface OrderItem {
  id?: string;
  title: string;
  price: string | number;
  quantity: number;
  imageUrl?: string;
  category?: string;
}

interface TimelineItem {
  status: string;
  timestamp: string;
  location: string;
  note: string;
  completed: boolean;
  current: boolean;
}

interface OrderData {
  orderId: string;
  shortId?: string;
  trackingNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city?: string;
  postalCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  currentStatus: string;
  createdAt: string;
  estimatedDelivery: string;
  totalAmount: string;
  deliveryFee: string;
  items: OrderItem[];
  statusHistory: TimelineItem[];
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialQuery =
    searchParams.get("query") ||
    searchParams.get("id") ||
    searchParams.get("orderId") ||
    searchParams.get("trackingNumber") ||
    "";

  const [inputVal, setInputVal] = useState(initialQuery);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchTracking = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setError("Please enter a valid Order ID or Tracking Number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/orders/track?query=${encodeURIComponent(trimmed)}`);
      const data = await res.json();

      if (!res.ok) {
        setOrder(null);
        setError(data.error || "Order not found. Please verify the ID and try again.");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Unable to connect to the tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setInputVal(initialQuery);
      fetchTracking(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(inputVal);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return "bg-green-100 text-green-800 border-green-200";
    if (s.includes("out for delivery")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (s.includes("shipped") || s.includes("dispatched")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (s.includes("processing")) return "bg-amber-100 text-amber-800 border-amber-200";
    if (s.includes("cancelled")) return "bg-red-100 text-red-800 border-red-200";
    return "bg-teal-100 text-teal-800 border-teal-200";
  };

  const calculateProgressPercent = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("delivered")) return 100;
    if (s.includes("out for delivery")) return 80;
    if (s.includes("shipped") || s.includes("dispatched")) return 60;
    if (s.includes("processing")) return 40;
    if (s.includes("confirmed")) return 20;
    return 10;
  };

  const formatRs = (val: string | number) => {
    const num = Number(val) || 0;
    return `Rs. ${num.toLocaleString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] text-[#16a34a] text-xs font-bold rounded-full mb-4 border border-[#bbf7d0]">
          <Truck className="w-3.5 h-3.5" />
          <span>Real-Time Order & Product Tracking</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight">
          Track Your Order
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          Enter your Order ID (from invoice/SMS) or Tracking Number to track the journey of your products.
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200/80 p-4 sm:p-7 mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Enter Order ID (e.g. #ARC-8941 or UUID) or Tracking Number"
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm sm:text-base text-gray-900 focus:bg-white focus:ring-2 focus:ring-[#16a34a] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 sm:py-4 bg-[#16a34a] hover:bg-[#15803d] active:scale-98 text-white text-sm sm:text-base font-bold rounded-xl shadow-lg shadow-green-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Tracking...</span>
              </>
            ) : (
              <>
                <Truck className="w-4 h-4" />
                <span>Track Product</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Suggestions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Quick Test:</span>
          <button
            type="button"
            onClick={() => {
              setInputVal("demo123");
              fetchTracking("demo123");
            }}
            className="px-2.5 py-1 bg-gray-100 hover:bg-green-50 hover:text-[#16a34a] text-gray-700 rounded-lg transition-colors font-mono font-medium cursor-pointer"
          >
            demo123
          </button>
          <button
            type="button"
            onClick={() => {
              setInputVal("ARC-8941-DEMO");
              fetchTracking("ARC-8941-DEMO");
            }}
            className="px-2.5 py-1 bg-gray-100 hover:bg-green-50 hover:text-[#16a34a] text-gray-700 rounded-lg transition-colors font-mono font-medium cursor-pointer"
          >
            ARC-8941-DEMO
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm animate-fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Order Results */}
      {order && (
        <div className="space-y-8 animate-fade-in">
          {/* Header Card: Order ID & Current Status Banner */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs uppercase font-bold tracking-wider text-gray-400">Order ID</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(order.orderId)}
                    title="Copy full Order ID"
                    className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 font-mono">
                  #{order.shortId || order.orderId.slice(0, 8).toUpperCase()}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Tracking No: <span className="font-semibold text-gray-800">{order.trackingNumber}</span>
                </p>
              </div>

              <div className="flex flex-col sm:items-end">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${getStatusColor(
                    order.currentStatus
                  )}`}
                >
                  <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                  {order.currentStatus}
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Estimated Delivery:{" "}
                  <strong className="text-gray-800">
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </span>
              </div>
            </div>

            {/* Visual Step Progress Bar */}
            <div className="py-6">
              <div className="relative mb-2">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 via-[#16a34a] to-emerald-500 transition-all duration-700 ease-out"
                    style={{ width: `${calculateProgressPercent(order.currentStatus)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between text-[10px] sm:text-xs font-semibold text-gray-500 mt-2">
                <span>Placed</span>
                <span>Confirmed</span>
                <span>Packed</span>
                <span>Shipped</span>
                <span>Out for Delivery</span>
                <span>Delivered</span>
              </div>
            </div>

            {/* Customer & Delivery Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Delivery Address</p>
                  <p className="font-semibold text-gray-800 leading-tight mt-0.5">{order.customerName}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{order.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Payment Info</p>
                  <p className="font-semibold text-gray-800 leading-tight mt-0.5">{order.paymentMethod}</p>
                  <p className="text-xs text-gray-600 mt-0.5">Status: {order.paymentStatus}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase">Order Date</p>
                  <p className="font-semibold text-gray-800 leading-tight mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                    })}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString("en-US", {
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCTS IN THIS ORDER (Requested by user: "tracker which will track our product") */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Products in this Order</h3>
                  <p className="text-xs text-gray-500">
                    {order.items?.length || 0} items being delivered
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900">
                Total: {formatRs(order.totalAmount)}
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {order.items && order.items.length > 0 ? (
                order.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      {/* Product Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gray-50 border border-gray-100 relative overflow-hidden shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <Image
                            src={item.imageUrl}
                            alt={item.title}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div className="sm:hidden flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-gray-900 leading-snug">
                          {item.title}
                        </h4>
                        {item.category && (
                          <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-1.5 py-0.5 rounded">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Product Details (Desktop & Shared info) */}
                    <div className="flex-1 min-w-0">
                      <div className="hidden sm:flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                            {item.title}
                          </h4>
                          {item.category && (
                            <span className="inline-block mt-0.5 text-[11px] font-semibold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <p className="text-sm sm:text-base font-bold text-gray-900 shrink-0">
                          {formatRs(Number(item.price) * (item.quantity || 1))}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-1 sm:mt-2 text-xs text-gray-500 pt-1 border-t sm:border-0 border-gray-50">
                        <span>
                          Qty: <strong className="text-gray-700">{item.quantity || 1}</strong> × {formatRs(item.price)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="sm:hidden font-bold text-gray-900">
                            {formatRs(Number(item.price) * (item.quantity || 1))}
                          </span>
                          {item.id && (
                            <Link
                              href={`/product/${item.id}`}
                              className="inline-flex items-center gap-1 text-[#16a34a] hover:underline font-semibold"
                            >
                              View Product <ChevronRight className="w-3 h-3" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 py-4">No product details attached to this order.</p>
              )}
            </div>

            {/* Total breakdown */}
            <div className="mt-6 pt-4 border-t border-gray-100 space-y-1.5 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Products Subtotal:</span>
                <span>{formatRs(Number(order.totalAmount) - Number(order.deliveryFee || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee:</span>
                <span>{formatRs(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-sm sm:text-base pt-2 border-t border-gray-100">
                <span>Grand Total:</span>
                <span className="text-[#16a34a]">{formatRs(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Tracking Timeline Log */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/80 shadow-lg p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#16a34a]" />
              Tracking Activity History
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              {order.statusHistory.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Step Node Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-all ${
                      step.current
                        ? "bg-[#16a34a] text-white ring-4 ring-green-100"
                        : step.completed
                        ? "bg-teal-600 text-white"
                        : "bg-gray-100 text-gray-400 border border-gray-300"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-current" />
                    )}
                  </div>

                  {/* Step Details */}
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h4
                        className={`text-sm sm:text-base font-bold ${
                          step.completed ? "text-gray-900" : "text-gray-400"
                        }`}
                      >
                        {step.status}
                      </h4>
                      <span className="text-xs text-gray-400 font-mono">
                        {step.timestamp}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{step.location}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* WhatsApp Support Assistance */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-green-50 border border-green-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#16a34a] text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-600/30">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base">Have questions about your delivery?</h4>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                  Our pharmacists and customer care team are available on WhatsApp to assist you.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/923305115999?text=${encodeURIComponent(
                `Hello Arcure Pharma! I am tracking Order #${order.shortId || order.orderId} (Tracking: ${order.trackingNumber}). Can you please share an update?`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all shrink-0 flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Chat on WhatsApp (+92 330 5115999)
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Navbar />
      <div className="pt-20 sm:pt-24 flex-1">
        <Suspense
          fallback={
            <div className="flex justify-center items-center py-40">
              <div className="w-10 h-10 border-4 border-green-200 border-t-[#16a34a] rounded-full animate-spin" />
            </div>
          }
        >
          <TrackingContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
