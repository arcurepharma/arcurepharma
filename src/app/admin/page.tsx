"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Image, DollarSign } from "lucide-react";
import Link from "next/link";

interface Stats {
  products: number;
  orders: number;
  sliders: number;
  revenue: string;
}

interface OrderRow {
  id: string;
  customerEmail: string;
  totalAmount: string;
  status: string;
}

interface apiOrder {
  totalAmount: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    products: 0,
    orders: 0,
    sliders: 0,
    revenue: "0",
  });
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/sliders").then((r) => r.json()),
    ]).then(([products, orders, sliders]) => {
      const revenue = orders.reduce(
        (sum: number, o: apiOrder) => sum + Number(o.totalAmount || 0),
        0
      );
      setStats({
        products: products.length || 0,
        orders: orders.length || 0,
        sliders: sliders.length || 0,
        revenue: revenue.toFixed(0),
      });
      setRecentOrders((orders || []).slice(0, 5));
    });
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats.products,
      icon: Package,
      bg: "bg-blue-600",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      icon: ShoppingCart,
      bg: "bg-green-600",
    },
    {
      label: "Slider Banners",
      value: stats.sliders,
      icon: Image,
      bg: "bg-purple-600",
    },
    {
      label: "Total Revenue",
      value: `Rs. ${stats.revenue}`,
      icon: DollarSign,
      bg: "bg-teal-600",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back. Here&apos;s your store overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 ${card.bg} rounded-xl flex items-center justify-center`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-gray-500 text-sm mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-teal-600 text-sm font-medium hover:text-teal-700"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Order ID
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Total
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-gray-400"
                  >
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: OrderRow) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {order.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {order.customerEmail}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Rs. {Number(order.totalAmount).toFixed(0)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full ${
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
