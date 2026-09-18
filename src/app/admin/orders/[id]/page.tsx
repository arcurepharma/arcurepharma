"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail, Share2, Copy, Check } from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface OrderItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
  imageUrl?: string;
}

interface Order {
  id: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  address: string;
  landmark: string;
  postalCode: string;
  items: OrderItem[];
  deliveryFee: string;
  totalAmount: string;
  status: string;
  notes: string | null;
  paymentMethod: string;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  Delivered:  "bg-green-100 text-green-700",
  Confirmed:  "bg-blue-100 text-blue-700",
  Dispatched: "bg-yellow-100 text-yellow-700",
  "On the way": "bg-purple-100 text-purple-700",
};

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [order, setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied]   = useState(false);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#fae3ec] border-t-[#a83866] rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Order not found</p>
      </div>
    );
  }

  const items    = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);

  // Parse GPS coords from notes  →  "GPS: lat,lng | Maps: https://..."
  const gpsMatch  = order.notes?.match(/GPS:\s*([-\d.]+),([-\d.]+)/);
  const lat       = gpsMatch ? parseFloat(gpsMatch[1]) : null;
  const lng       = gpsMatch ? parseFloat(gpsMatch[2]) : null;
  const hasGps    = lat !== null && lng !== null;

  // Google Maps embed src (no API key needed for basic embed)
  const embedSrc  = hasGps
    ? `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`
    : null;

  // Shareable link
  const mapsLink  = hasGps
    ? `https://www.google.com/maps?q=${lat},${lng}`
    : null;

  // Share via native share sheet OR copy to clipboard
  const shareLocation = async () => {
    if (!mapsLink) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order #${order.id.slice(0, 8).toUpperCase()} — Delivery Location`,
          text:  `Delivery address for order #${order.id.slice(0, 8).toUpperCase()}`,
          url:   mapsLink,
        });
      } catch {
        // user dismissed share sheet — ignore
      }
    } else {
      await navigator.clipboard.writeText(mapsLink);
      setCopied(true);
      toast.success("Location link copied!");
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="max-w-5xl">
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
          <p className="text-gray-400 text-sm mt-1">Placed on {formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 text-sm font-semibold rounded-full ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: customer + map ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Customer</h2>
            <div className="space-y-2.5">
              {order.customerName && (
                <p className="text-sm font-semibold text-gray-800">{order.customerName}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-[#a83866] shrink-0" />
                {order.customerEmail}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-[#a83866] shrink-0" />
                <a href={`tel:${order.customerPhone}`} className="hover:text-[#a83866] transition-colors font-medium">
                  {order.customerPhone}
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#a83866] shrink-0 mt-0.5" />
                <div>
                  {/* GPS order: sirf GPS detected address dikhao, manual text nahi */}
                  {hasGps ? (
                    <div>
                      <p className="font-semibold text-green-700 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        GPS Location Detected
                      </p>
                      {/* Show the human-readable address extracted from notes */}
                      {order.notes?.includes("Address:") && (
                        <p className="text-gray-500 mt-0.5 text-xs">
                          {order.notes.split("Address:")[1]?.trim()}
                        </p>
                      )}
                      {order.address && !order.address.includes("GPS") && (
                        <p className="text-gray-500 text-xs mt-0.5">{order.address.replace("House/Flat: ", "")}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <p>{order.address}</p>
                      {order.landmark   && <p className="text-gray-400">Landmark: {order.landmark}</p>}
                      {order.postalCode && <p className="text-gray-400">Postal Code: {order.postalCode}</p>}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Payment: <span className="font-semibold text-gray-800">{order.paymentMethod || "COD"}</span>
              </p>
            </div>
          </div>

          {/* ── Embedded Map (GPS orders only) ── */}
          {hasGps && embedSrc && (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Map header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-bold text-gray-800">GPS Location</span>
                  <span className="text-xs text-gray-400">({lat?.toFixed(5)}, {lng?.toFixed(5)})</span>
                </div>

                {/* Share button */}
                <button
                  onClick={shareLocation}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#a83866] hover:bg-[#8a2a52] text-white text-xs font-bold rounded-lg transition-colors"
                >
                  {copied
                    ? <><Check className="w-3.5 h-3.5" /> Copied!</>
                    : <><Share2 className="w-3.5 h-3.5" /> Share Location</>
                  }
                </button>
              </div>

              {/* Embedded map */}
              <div className="relative w-full h-[340px]">
                <iframe
                  src={embedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Customer Location"
                />
              </div>

              {/* Open in Maps link */}
              <div className="px-5 py-3 border-t border-gray-100">
                <a
                  href={mapsLink!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </div>
          )}

          {/* No GPS notice */}
          {!hasGps && (
            <div className="bg-gray-50 rounded-2xl border border-gray-200 px-5 py-4 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-300 shrink-0" />
              <p className="text-sm text-gray-400">No GPS location — customer entered address manually.</p>
            </div>
          )}
        </div>

        {/* ── Right: order summary ── */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.imageUrl && (
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-1" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate">{item.title}</p>
                    <p className="text-[11px] text-gray-400">× {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-gray-800 shrink-0">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery</span><span>{formatPrice(order.deliveryFee || 0)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#a83866] text-lg">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
