"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  Phone,
  LogOut,
  CheckCircle2,
  Truck,
  Clock,
} from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { formatPrice, formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  id: string;
  title: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: string;
  deliveryFee: string;
  status: string;
  createdAt: string;
  address: string;
}

const statusStyles: Record<string, string> = {
  Pending: "bg-gray-100 text-gray-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Dispatched: "bg-yellow-100 text-yellow-700",
  "On the way": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const loadOrders = () => {
    fetch("/api/account/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          loadOrders();
        } else {
          setLoading(false);
        }
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please enter your email and password");
      return;
    }
    setAuthLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        toast.success(mode === "login" ? "Welcome back!" : "Account created!");
        setForm({ name: "", email: "", phone: "", password: "" });
        loadOrders();
      } else {
        toast.error(data.error || "Authentication failed");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOrders([]);
    toast.success("Signed out");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center pt-48">
          <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-28 pb-20">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
            <p className="text-gray-500">
              Sign in to track your orders and manage your profile
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-8">
            <div className="flex gap-2 mb-6 bg-gray-50 rounded-xl p-1">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "login"
                    ? "bg-white shadow text-teal-700"
                    : "text-gray-500"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("register")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "register"
                    ? "bg-white shadow text-teal-700"
                    : "text-gray-500"
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="John Doe"
                  />
                </div>
              )}
              {mode === "register" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="+92 300 1234567"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="••••••••"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50"
              >
                {authLoading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Welcome, {user.name || user.email.split("@")[0]}!
          </h1>
          <p className="text-gray-500">Manage your orders and account</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 mb-4">Profile</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0">
                    {(user.name || user.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {user.name || "—"}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                {user.phone && (
                  <p className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-teal-500 shrink-0" />
                    {user.phone}
                  </p>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 mt-2 px-4 py-2.5 bg-red-50 text-red-600 text-sm font-medium rounded-xl hover:bg-red-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">My Orders</h2>
                <p className="text-gray-500 text-sm mt-1">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                </p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-16 px-6">
                  <Package className="w-14 h-14 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <Link
                    href="/#products"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const statusText = order.status;
                    const itemsCount = (order.items || []).reduce(
                      (s, i) => s + i.quantity,
                      0
                    );
                    return (
                      <div key={order.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-800 text-sm">
                              Order #<span className="font-mono">{order.id.slice(0, 10)}</span>
                            </p>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {formatDate(order.createdAt)} &bull; {itemsCount} item{itemsCount !== 1 ? "s" : ""}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full ${statusStyles[statusText] || statusStyles.Pending}`}
                          >
                            {statusText === "Delivered" ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : statusText === "On the way" || statusText === "Dispatched" ? (
                              <Truck className="w-3.5 h-3.5" />
                            ) : (
                              <Clock className="w-3.5 h-3.5" />
                            )}
                            {statusText}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {(order.items || []).map((item, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg"
                              >
                                {item.title} &times; {item.quantity}
                              </span>
                            ))}
                          </div>
                          <p className="font-bold text-teal-700 shrink-0 ml-4">
                            {formatPrice(order.totalAmount)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
