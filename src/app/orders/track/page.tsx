"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle, Clock, MapPin } from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";

interface OrderStatus {
  status: string;
  timestamp: string;
  location: string;
  note: string;
  completed: boolean;
}

interface Order {
  orderId: string;
  trackingNumber: string;
  customerName: string;
  items: number;
  totalAmount: number;
  currentStatus: string;
  estimatedDelivery: string;
  statusHistory: OrderStatus[];
}

export default function OrderTrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOrder(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (trackingNumber.toLowerCase() === "demo123" || trackingNumber.startsWith("TRK")) {
      setOrder({
        orderId: "ORD-001",
        trackingNumber: trackingNumber,
        customerName: "Ahmed Khan",
        items: 3,
        totalAmount: 4500,
        currentStatus: "Out for Delivery",
        estimatedDelivery: "2026-09-12",
        statusHistory: [
          {
            status: "Order Placed",
            timestamp: "2026-09-10 10:30 AM",
            location: "Online",
            note: "Your order has been confirmed",
            completed: true,
          },
          {
            status: "Processing",
            timestamp: "2026-09-10 02:15 PM",
            location: "Karachi Warehouse",
            note: "Order is being prepared for shipment",
            completed: true,
          },
          {
            status: "Shipped",
            timestamp: "2026-09-11 09:00 AM",
            location: "Karachi DC",
            note: "Package handed over to courier",
            completed: true,
          },
          {
            status: "Out for Delivery",
            timestamp: "2026-09-11 03:30 PM",
            location: "Lahore Hub",
            note: "Package is on the way to your address",
            completed: true,
          },
          {
            status: "Delivered",
            timestamp: "Estimated: Sep 12",
            location: "Your Address",
            note: "Package will be delivered soon",
            completed: false,
          },
        ],
      });
    } else {
      setError("Tracking number not found. Please check and try again.");
    }

    setLoading(false);
  };

  const statusIcons: Record<string, any> = {
    "Order Placed": Clock,
    Processing: Package,
    Shipped: Truck,
    "Out for Delivery": Truck,
    Delivered: CheckCircle,
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Track Your Order
            </h1>
            <p className="text-gray-500 text-lg">
              Enter your tracking number to see real-time updates
            </p>
          </div>

          {/* Search Form */}
          <form
            onSubmit={handleTrack}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8"
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number (try: demo123)"
                  required
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {loading ? "Tracking..." : "Track Order"}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-sm text-red-600 flex items-center gap-2">
                <span>⚠️</span> {error}
              </p>
            )}
          </form>

          {/* Order Details */}
          {order && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Order #{order.orderId}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tracking: {order.trackingNumber}
                    </p>
                  </div>
                  <span className="inline-flex px-4 py-2 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full">
                    {order.currentStatus}
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Customer</p>
                    <p className="font-semibold text-gray-900">
                      {order.customerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Items</p>
                    <p className="font-semibold text-gray-900">
                      {order.items} products
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                    <p className="font-bold text-teal-700 text-lg">
                      Rs. {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Estimated Delivery:</span>{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Tracking Timeline
                </h3>

                <div className="space-y-6">
                  {order.statusHistory.map((status, index) => {
                    const Icon = statusIcons[status.status] || Package;
                    const isLast = index === order.statusHistory.length - 1;
                    
                    return (
                      <div key={index} className="relative flex gap-4">
                        {/* Timeline Line */}
                        {!isLast && (
                          <div
                            className={`absolute left-6 top-12 bottom-0 w-0.5 ${
                              status.completed ? "bg-teal-600" : "bg-gray-300"
                            }`}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            status.completed
                              ? "bg-teal-600 text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-2">
                            <h4
                              className={`font-bold text-lg ${
                                status.completed
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {status.status}
                            </h4>
                            <span
                              className={`text-sm ${
                                status.completed
                                  ? "text-gray-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {status.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {status.location}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{status.note}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Help Section */}
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6">
                <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                <p className="text-sm text-gray-700 mb-4">
                  If you have any questions about your order, feel free to contact
                  our support team.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    WhatsApp Support
                  </a>
                  <a
                    href="mailto:support@arcurepharma.com"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    Email Us
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Demo Info */}
          {!order && !loading && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
              <p className="text-sm text-blue-800">
                💡 <span className="font-semibold">Demo:</span> Try tracking number{" "}
                <code className="px-2 py-1 bg-blue-100 rounded font-mono">
                  demo123
                </code>{" "}
                to see a sample tracking result
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
