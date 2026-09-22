"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle, Printer, ArrowLeft } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import { formatPrice, formatDate } from "@/lib/utils";

interface OrderItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
}

interface OrderData {
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
  paymentMethod: string;
  createdAt: string;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => { setOrder(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <div className="w-10 h-10 border-4 border-[#fde8fc] border-t-[#fcb8fd] rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-2xl mx-auto px-4 pt-40 pb-20 text-center">
          <p className="text-gray-500 text-lg">No order found</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-[#fcb8fd] text-white rounded-xl hover:bg-[#d460d6] transition-colors">
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </main>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((sum: number, item: OrderItem) => sum + Number(item.price) * item.quantity, 0);

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #invoice, #invoice * { visibility: visible !important; }
          #invoice { position: fixed !important; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
        }
      `}</style>

      <main className="min-h-screen bg-gray-50">
        <div className="no-print">
          <Navbar />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
          {/* Success message â€” hidden on print */}
          <div className="text-center mb-8 no-print">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-500">Thank you for choosing Arcure Pharma. Your order is being processed.</p>
          </div>

          {/* Invoice */}
          <div id="invoice" className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm">

            {/* Invoice header */}
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
              <div>
                <Image src="/logo-arcure.png" alt="Arcure Pharma" width={160} height={40} className="h-10 w-auto object-contain mb-2" />
                <p className="text-[#fcb8fd] text-xs font-semibold uppercase tracking-wider">Order Invoice</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">#{order.id.slice(0, 8).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(order.createdAt)}</p>
                <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  order.status === "Delivered" ? "bg-green-100 text-green-700"
                  : order.status === "Cancelled" ? "bg-red-100 text-red-700"
                  : "bg-[#fff5fe] text-[#fcb8fd]"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Customer + Address */}
            <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</h3>
                {order.customerName && <p className="text-sm font-semibold text-gray-800">{order.customerName}</p>}
                <p className="text-sm text-gray-500">{order.customerEmail}</p>
                <p className="text-sm text-gray-500">{order.customerPhone}</p>
                <p className="text-sm text-gray-500 mt-1">Payment: <span className="font-medium text-gray-700">{order.paymentMethod || "COD"}</span></p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Address</h3>
                <p className="text-sm text-gray-600">{order.address}</p>
                {order.landmark && <p className="text-sm text-gray-500">Landmark: {order.landmark}</p>}
                {order.postalCode && <p className="text-sm text-gray-500">Postal Code: {order.postalCode}</p>}
              </div>
            </div>

            {/* Items table */}
            <table className="w-full mb-5">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">Item</th>
                  <th className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">Qty</th>
                  <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">Price</th>
                  <th className="text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest pb-3">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item: OrderItem, i: number) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-3 text-sm text-gray-800 font-medium">{item.title}</td>
                    <td className="py-3 text-sm text-gray-500 text-center">{item.quantity}</td>
                    <td className="py-3 text-sm text-gray-500 text-right">{formatPrice(item.price)}</td>
                    <td className="py-3 text-sm font-semibold text-gray-800 text-right">{formatPrice(Number(item.price) * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="space-y-1.5 mb-5">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Subtotal</span><span className="text-gray-600">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Delivery Fee</span><span className="text-gray-600">{formatPrice(order.deliveryFee || 0)}</span></div>
              <div className="flex justify-between pt-3 border-t border-gray-100">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-[#fcb8fd] text-xl">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>

            <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
              <p>Thank you for choosing <span className="text-[#fcb8fd] font-semibold">Arcure Pharma</span>!</p>
              <p className="mt-1">For support: +92 334 116 9999 | arcurepharma3007@gmail.com</p>
            </div>
          </div>

          {/* Action buttons â€” hidden on print */}
          <div className="flex items-center justify-center gap-4 mt-8 no-print">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-6 py-3 bg-[#fff5fe] text-[#fcb8fd] border border-[#fde8fc] font-semibold rounded-xl hover:bg-[#fde8fc] transition-colors text-sm"
            >
              <Printer className="w-4 h-4" /> Print Invoice
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-6 py-3 bg-[#fcb8fd] text-white font-semibold rounded-xl hover:bg-[#d460d6] transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ThankYouContent />
    </Suspense>
  );
}



