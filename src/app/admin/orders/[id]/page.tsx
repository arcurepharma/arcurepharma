"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  RefreshCw,
} from "lucide-react";

interface OrderItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
}

interface OrderData {
  id: string;
  userId: string | null;
  customerEmail: string;
  customerPhone: string;
  customerPhone2?: string;
  customerName: string;
  customerLastName?: string;
  address: string;
  landmark: string;
  postalCode: string;
  items: OrderItem[];
  deliveryFee: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string | null;
  trackingNumber: string | null;
  status: string;
  notes: string | null;
  statusHistory: { status: string; timestamp: string; note: string }[];
  createdAt: string;
}

const statusOptions = ["Pending", "Confirmed", "Dispatched", "On the way", "Delivered"];

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrder(updated);
        toast.success(`Order status updated to "${status}"`);
      } else {
        toast.error("Failed to update status");
      }
    } catch {
      toast.error("Failed to update status");
    }
    setUpdating(false);
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "Dispatched":
        return "bg-yellow-100 text-yellow-700";
      case "On the way":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
        <p className="text-gray-500 mb-4">Order not found</p>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const fullName = [order.customerName, order.customerLastName].filter(Boolean).join(" ") || "—";
  const mapsLink = order.notes?.split("Maps: ")[1]?.split(" ")[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-teal-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${getStatusStyle(order.status)}`}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Items</p>
          <p className="text-2xl font-bold text-gray-900">{items.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-teal-600">Rs. {Number(order.totalAmount).toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Payment</p>
          <p className="text-lg font-bold text-gray-900">{order.paymentMethod || "COD"}</p>
          <p className={`text-xs font-semibold mt-1 ${order.paymentStatus === "Paid" ? "text-green-600" : "text-gray-400"}`}>
            {order.paymentStatus || "Pending"}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">User ID</p>
          <p className="text-sm font-mono text-gray-700 break-all">{order.userId ? order.userId.slice(0, 13) + "…" : "Guest"}</p>
        </div>
      </div>

      {/* Status update */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Update Status</h2>
        <div className="flex items-center gap-2">
          {statusOptions.map((s) => (
            <button
              key={s}
              disabled={updating}
              onClick={() => handleStatusChange(s)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all disabled:opacity-50 ${
                order.status === s
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-teal-400 hover:text-teal-600"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        {order.trackingNumber && (
          <p className="mt-3 text-xs text-gray-500">
            Tracking: <span className="font-mono font-semibold text-gray-700">{order.trackingNumber}</span>
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Customer info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" /> Customer Details
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-900 font-semibold">{fullName}</p>
            <p className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-gray-400" /> {order.customerEmail}
            </p>
            <p className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" /> {order.customerPhone}
            </p>
            {order.customerPhone2 && (
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" /> Secondary: {order.customerPhone2}
              </p>
            )}
          </div>
        </div>

        {/* Delivery address */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" /> Delivery Address
          </h2>
          <div className="space-y-3 text-sm text-gray-600">
            <p className="text-gray-800 font-medium">{order.address}</p>
            {order.landmark && <p>Landmark: {order.landmark}</p>}
            {order.postalCode && <p>Postal Code: {order.postalCode}</p>}
            {mapsLink && (
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                <MapPin className="w-3.5 h-3.5" /> View Location
              </a>
            )}
            {order.transactionId && (
              <p className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" /> Transaction: {order.transactionId}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 pb-0 flex items-center gap-2">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-teal-600" /> Order Items
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Product</th>
                <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Qty</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Price</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, i) => (
                <tr key={i}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{item.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">Rs. {Number(item.price).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800 text-right">
                    Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="text-gray-700">Rs. {subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Delivery Fee</span>
            <span className="text-gray-700">Rs. {Number(order.deliveryFee || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-3 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-teal-600 text-lg">Rs. {Number(order.totalAmount).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Status history */}
      {Array.isArray(order.statusHistory) && order.statusHistory.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-teal-600" /> Status History
          </h2>
          <div className="space-y-3">
            {order.statusHistory.map((h, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-teal-500" />
                <span className="font-medium text-gray-800">{h.status}</span>
                <span className="text-xs text-gray-400">
                  {new Date(h.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}