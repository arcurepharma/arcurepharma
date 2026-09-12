"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Printer, ArrowLeft } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
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
  createdAt: string;
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      return;
    }
    fetch(`/api/orders/${orderId}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
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
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Go Home
          </Link>
        </div>
      </main>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce(
    (sum: number, item: OrderItem) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <div className="text-center mb-8 no-print">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank You for Your Order!
          </h1>
          <p className="text-gray-500">
            Your order has been placed successfully
          </p>
        </div>

        <div
          id="invoice"
          className="bg-white rounded-2xl border border-gray-100 p-8"
        >
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Arcure Pharma</h2>
              <p className="text-gray-500 text-sm">Order Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Order #{order.id.slice(0, 8)}
              </p>
              <p className="text-xs text-gray-400">
                {formatDate(order.createdAt)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Customer
              </h3>
              {order.customerName && (
                <p className="text-sm text-gray-800">{order.customerName}</p>
              )}
              <p className="text-sm text-gray-600">{order.customerEmail}</p>
              <p className="text-sm text-gray-600">{order.customerPhone}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                Shipping Address
              </h3>
              <p className="text-sm text-gray-600">{order.address}</p>
              {order.landmark && (
                <p className="text-sm text-gray-600">
                  Landmark: {order.landmark}
                </p>
              )}
              {order.postalCode && (
                <p className="text-sm text-gray-600">
                  Postal Code: {order.postalCode}
                </p>
              )}
            </div>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Item
                </th>
                <th className="text-center text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Qty
                </th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Price
                </th>
                <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider pb-3">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: OrderItem, i: number) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-3 text-sm text-gray-800 font-medium">
                    {item.title}
                  </td>
                  <td className="py-3 text-sm text-gray-600 text-center">
                    {item.quantity}
                  </td>
                  <td className="py-3 text-sm text-gray-600 text-right">
                    {formatPrice(item.price)}
                  </td>
                  <td className="py-3 text-sm text-gray-800 font-medium text-right">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-700">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Fee</span>
              <span className="text-gray-700">{formatPrice(order.deliveryFee || 0)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-teal-700 text-xl">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
            <p>Status: <span className="font-medium text-gray-600">{order.status}</span></p>
            <p className="mt-1">Thank you for choosing Arcure Pharma!</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-8 no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50" />}>
      <ThankYouContent />
    </Suspense>
  );
}
