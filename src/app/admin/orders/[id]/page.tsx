"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { formatPrice, formatDate } from "@/lib/utils";

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
  createdAt: string;
}

export default function AdminOrderDetailPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
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

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce(
    (sum: number, item: OrderItem) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <span
          className={`px-4 py-2 text-sm font-medium rounded-full ${
            order.status === "Delivered"
              ? "bg-green-100 text-green-700"
              : order.status === "Confirmed"
                ? "bg-blue-100 text-blue-700"
                : order.status === "Dispatched"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "On the way"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-3">
            {order.customerName && (
              <p className="text-sm text-gray-800">
                <span className="font-medium">Name:</span> {order.customerName}
              </p>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="w-4 h-4 text-teal-500" />
              {order.customerEmail}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-teal-500" />
              {order.customerPhone}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
              <div>
                <p>{order.address}</p>
                {order.landmark && <p>Landmark: {order.landmark}</p>}
                {order.postalCode && <p>Postal Code: {order.postalCode}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4">Invoice Summary</h2>
          <div className="space-y-3">
            {items.map((item: OrderItem, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.title} &times; {item.quantity}
                </span>
                <span className="font-medium text-gray-800">
                  {formatPrice(Number(item.price) * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-700">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Delivery Fee</span>
                <span className="text-gray-700">{formatPrice(order.deliveryFee || 0)}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-teal-700 text-lg">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Ordered Items</h2>
        <div className="space-y-3">
          {items.map((item: OrderItem, i: number) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500">
                  Qty: {item.quantity} &bull; Price: {formatPrice(item.price)}
                </p>
              </div>
              <p className="font-medium text-gray-800 text-sm">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
