"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import Footer from "@/components/storefront/Footer";
import { useCartStore, CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    items,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCartStore();
  const [deliveryFee, setDeliveryFee] = useState("150");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    houseNo: "",
    street: "",
    landmark: "",
    postalCode: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.delivery_fee) setDeliveryFee(data.delivery_fee);
      })
      .catch(() => {});
  }, []);

  const subtotal = getTotalPrice();
  const total = subtotal + Number(deliveryFee);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.houseNo ||
      !form.street ||
      !form.landmark ||
      !form.postalCode
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      if (form.password) {
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }),
        });
        if (!regRes.ok && regRes.status !== 409) {
          toast.error("Could not create your account. Please check your details.");
          setSubmitting(false);
          return;
        }
      }

      const orderData = {
        customerEmail: form.email,
        customerPhone: form.phone,
        customerName: form.name,
        address: `${form.houseNo}, ${form.street}`,
        landmark: form.landmark,
        postalCode: form.postalCode,
        items: JSON.stringify(
          items.map((item) => ({
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          }))
        ),
        deliveryFee,
        totalAmount: total,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (res.ok) {
        const order = await res.json();
        clearCart();
        router.push(
          `/thank-you?orderId=${order.id}`
        );
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch {
      toast.error("Failed to place order");
    }
    setSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-8 text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/#products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-xl overflow-hidden shrink-0">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate">
                          {item.title}
                        </h3>
                        <p className="text-teal-600 font-semibold text-sm">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="font-medium text-gray-800 text-sm w-20 text-right">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4">
                  Delivery Information
                </h2>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({ ...form, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="+92 300 1234567"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password (create account to track your orders)
                    </label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Optional password"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        House / Flat # *
                      </label>
                      <input
                        type="text"
                        value={form.houseNo}
                        onChange={(e) =>
                          setForm({ ...form, houseNo: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="42"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street *
                      </label>
                      <input
                        type="text"
                        value={form.street}
                        onChange={(e) =>
                          setForm({ ...form, street: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Main Boulevard, Sector 5"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nearest Landmark *
                      </label>
                      <input
                        type="text"
                        value={form.landmark}
                        onChange={(e) =>
                          setForm({ ...form, landmark: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Near City Hospital"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={form.postalCode}
                        onChange={(e) =>
                          setForm({ ...form, postalCode: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="75500"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">
                        {item.title} &times; {item.quantity}
                      </span>
                      <span className="font-medium text-gray-800 shrink-0">
                        {formatPrice(Number(item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-700">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <Truck className="w-4 h-4" /> Delivery
                    </span>
                    <span className="text-gray-700">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-teal-700 text-xl">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full mt-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 text-center"
                >
                  {submitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
