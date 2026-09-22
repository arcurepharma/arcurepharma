"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Truck,
  MapPin, Loader2, WifiOff, PencilLine, CheckCircle2, LogIn,
} from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import { useCartStore, CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "COD",         label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "💵", available: true },
  { id: "JazzCash",   label: "JazzCash",          desc: "Coming soon",                icon: "📱", available: false },
  { id: "EasyPaisa",  label: "EasyPaisa",         desc: "Coming soon",                icon: "💳", available: false },
  { id: "BankTransfer",label: "Bank Transfer",    desc: "Coming soon",                icon: "🏦", available: false },
];

type AddressMode = null | "gps" | "manual";
interface AuthUser { id: string; name: string; email: string; phone: string; }

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();

  const [user, setUser]                   = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading]     = useState(true);
  const [deliveryFee, setDeliveryFee]     = useState("150");
  const [submitting, setSubmitting]       = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [addressMode, setAddressMode]     = useState<AddressMode>(null);
  const [detectingLocation, setDetecting] = useState(false);
  const [gpsCoords, setGpsCoords]         = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAddress, setGpsAddress]       = useState<string>("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "", phone2: "",
    houseNo: "", street: "", landmark: "", postalCode: "",
  });

  // ── Check login ──
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user || null);
        setAuthLoading(false);
        // Pre-fill form from user data
        if (data.user) {
          const nameParts = (data.user.name || "").split(" ");
          setForm((f) => ({
            ...f,
            firstName: nameParts[0] || f.firstName,
            lastName:  nameParts.slice(1).join(" ") || f.lastName,
            email:     data.user.email || f.email,
            phone:     data.user.phone || f.phone,
          }));
        }
      })
      .catch(() => setAuthLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data.delivery_fee) setDeliveryFee(data.delivery_fee); })
      .catch(() => {});
  }, []);

  const subtotal = getTotalPrice();
  const total    = subtotal + Number(deliveryFee);

  // ── GPS detect ──
  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error("Geolocation not supported"); return; }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setGpsCoords({ lat, lng });
        try {
          const res  = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const a    = data.address || {};
          const houseNo  = a.house_number || "";
          const road     = [a.road, a.pedestrian, a.footway].find(Boolean) || "";
          const suburb   = [a.suburb, a.neighbourhood, a.quarter].find(Boolean) || "";
          const street   = [road, suburb].filter(Boolean).join(", ");
          const city     = a.city || a.town || a.village || a.county || "";
          const postcode = a.postcode || "";
          setForm((f) => ({ ...f, houseNo: houseNo || f.houseNo, street: street || f.street, landmark: city || f.landmark, postalCode: postcode || f.postalCode }));
          const readable = [houseNo, road, suburb, city, postcode].filter(Boolean).join(", ");
          setGpsAddress(readable || data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setGpsAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setAddressMode("gps");
        setDetecting(false);
        toast.success("📍 Location detected!");
      },
      (err) => {
        toast.error((err.code === 1 ? "Location denied." : "Location unavailable.") + " Enter manually.");
        setDetecting(false);
        setAddressMode("manual");
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast.error("Please login first"); return; }
    if (items.length === 0) { toast.error("Your cart is empty!"); return; }
    if (!form.firstName) { toast.error("Please enter your first name"); return; }
    if (!form.lastName)  { toast.error("Please enter your last name"); return; }
    if (!form.email)     { toast.error("Please enter your email"); return; }
    if (!form.phone)     { toast.error("Please enter your phone"); return; }
    if (addressMode === null) { toast.error("Please choose address method"); return; }
    if (addressMode === "manual" && (!form.street || !form.landmark || !form.postalCode)) {
      toast.error("Please fill in your delivery address"); return;
    }

    setSubmitting(true);
    try {
      const mapsLink    = gpsCoords ? `https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}` : null;
      const addressLine = addressMode === "gps"
        ? (form.houseNo ? `House/Flat: ${form.houseNo}` : "GPS Location Detected")
        : [form.houseNo, form.street].filter(Boolean).join(", ");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: form.email || user.email,
          customerPhone: form.phone,
          customerPhone2: form.phone2,
          customerName:  form.firstName.trim(),
          customerLastName: form.lastName.trim(),
          address:       addressLine,
          landmark:      addressMode === "gps" ? gpsAddress : form.landmark,
          postalCode:    addressMode === "gps" ? "" : form.postalCode,
          items:         JSON.stringify(items.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity }))),
          deliveryFee,
          totalAmount:   total,
          paymentMethod,
          notes: mapsLink ? `GPS: ${gpsCoords!.lat},${gpsCoords!.lng} | Maps: ${mapsLink} | Address: ${gpsAddress}` : null,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        clearCart();
        router.push(`/thank-you?orderId=${order.id}`);
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch {
      toast.error("Failed to place order");
    }
    setSubmitting(false);
  };

  const inp = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#e855d8] focus:border-transparent transition-all";

  // ── Auth loading ──
  if (authLoading) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center pt-40">
          <div className="w-10 h-10 border-4 border-[#fde8fc] border-t-[#e855d8] rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  // ── NOT LOGGED IN — show login wall ──
  if (!user) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 pt-32 pb-20">
          <div className="glass-card rounded-3xl p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full bg-[#fde8fc] flex items-center justify-center mx-auto mb-6">
              <LogIn className="w-9 h-9 text-[#e855d8]" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Please sign in to your account to place an order.<br />
              This helps you track your orders and view order history.
            </p>

            {/* Cart preview */}
            {items.length > 0 && (
              <div className="bg-white/60 rounded-xl p-4 mb-6 text-left border border-pink-100/60">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Cart ({items.length} items)</p>
                <div className="space-y-2">
                  {items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700 truncate mr-2">{item.title} × {item.quantity}</span>
                      <span className="text-[#e855d8] font-semibold shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                  {items.length > 3 && (
                    <p className="text-xs text-gray-400">+{items.length - 3} more items</p>
                  )}
                </div>
                <div className="border-t border-pink-100 mt-3 pt-3 flex justify-between font-bold text-sm">
                  <span>Total</span>
                  <span className="text-[#e855d8]">{formatPrice(subtotal + Number(deliveryFee))}</span>
                </div>
              </div>
            )}

            <Link
              href={`/account?redirect=/checkout`}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#e855d8] hover:bg-[#c73ab8] text-white font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-[#e855d8]/25 active:scale-95 text-sm"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </Link>

            <Link href="/" className="block mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── LOGGED IN — show checkout ──
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
        <p className="text-sm text-gray-500 mb-8">
          Ordering as <span className="font-semibold text-[#e855d8]">{user.name || user.email}</span>
        </p>

        {items.length === 0 ? (
          <div className="text-center py-20 glass-card rounded-2xl">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link href="/#products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#e855d8] text-white rounded-xl hover:bg-[#c73ab8] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Left ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Cart */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-white/50 rounded-xl">
                      <div className="w-16 h-16 bg-white/70 rounded-xl overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
                        <p className="text-[#e855d8] font-semibold text-sm">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-white/70 rounded-lg hover:bg-white transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-7 text-center font-medium text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-white/70 rounded-lg hover:bg-white transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <p className="font-medium text-gray-800 text-sm w-20 text-right">{formatPrice(Number(item.price) * item.quantity)}</p>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 mb-5">Delivery Information</h2>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inp} placeholder="Ahmad" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input type="text" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inp} placeholder="Ali" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} placeholder="ahmad@gmail.com" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} placeholder="+92 300 1234567" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Phone <span className="text-gray-400 font-normal">(optional)</span></label>
                      <input type="tel" value={form.phone2} onChange={(e) => setForm({ ...form, phone2: e.target.value })} className={inp} placeholder="+92 321 7654321" />
                    </div>
                  </div>

                  {/* Address chooser */}
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-gray-800 mb-3">Delivery Address *</p>

                    {addressMode === null && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" onClick={detectLocation} disabled={detectingLocation}
                          className="flex flex-col items-center gap-3 p-5 border-2 border-[#fde8fc] bg-white/60 hover:border-[#e855d8] rounded-2xl transition-all group disabled:opacity-60"
                        >
                          {detectingLocation ? <Loader2 className="w-8 h-8 text-[#e855d8] animate-spin" /> : <MapPin className="w-8 h-8 text-[#e855d8] group-hover:scale-110 transition-transform" />}
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-sm">{detectingLocation ? "Detecting…" : "Use My Location"}</p>
                            <p className="text-xs text-gray-400 mt-0.5">Auto-detect via GPS</p>
                          </div>
                        </button>
                        <button type="button" onClick={() => setAddressMode("manual")}
                          className="flex flex-col items-center gap-3 p-5 border-2 border-gray-200 bg-white/60 hover:border-[#e855d8] rounded-2xl transition-all group"
                        >
                          <PencilLine className="w-8 h-8 text-gray-500 group-hover:text-[#e855d8] group-hover:scale-110 transition-all" />
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-sm">Enter Manually</p>
                            <p className="text-xs text-gray-400 mt-0.5">Type your address</p>
                          </div>
                        </button>
                      </div>
                    )}

                    {addressMode === "gps" && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-green-800">Location Detected</p>
                            <p className="text-xs text-green-700 mt-0.5 break-words">{gpsAddress}</p>
                            {gpsCoords && (
                              <a href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-green-700 underline">
                                <MapPin className="w-3 h-3" /> Verify on Google Maps
                              </a>
                            )}
                          </div>
                          <button type="button" onClick={() => { setAddressMode(null); setGpsCoords(null); setGpsAddress(""); }} className="text-xs text-gray-400 hover:text-red-500 shrink-0 font-medium">Change</button>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">House / Flat # <span className="text-gray-400 font-normal">(optional)</span></label>
                          <input type="text" value={form.houseNo} onChange={(e) => setForm({ ...form, houseNo: e.target.value })} className={inp} placeholder="Add house / flat number if not detected" />
                        </div>
                      </div>
                    )}

                    {addressMode === "manual" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Enter your delivery address below</p>
                          <button type="button" onClick={() => setAddressMode(null)} className="text-xs text-[#e855d8] hover:underline font-medium">← Back</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">House / Flat #</label>
                            <input type="text" value={form.houseNo} onChange={(e) => setForm({ ...form, houseNo: e.target.value })} className={inp} placeholder="42-B" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street / Area *</label>
                            <input type="text" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} className={inp} placeholder="Main Boulevard, Sector 5" required />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City / Landmark *</label>
                            <input type="text" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} className={inp} placeholder="Karachi / Near City Hospital" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code *</label>
                            <input type="text" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} className={inp} placeholder="75500" required />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </div>

              {/* Payment */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button key={method.id} type="button" disabled={!method.available}
                      onClick={() => method.available && setPaymentMethod(method.id)}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        !method.available ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50/50"
                        : paymentMethod === method.id ? "border-[#e855d8] bg-[#fff5fe]"
                        : "border-gray-200 hover:border-[#e855d8]/40 bg-white/60"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{method.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{method.desc}</p>
                      </div>
                      {!method.available && <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full"><WifiOff className="w-2.5 h-2.5" /> Soon</span>}
                      {method.available && paymentMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-[#e855d8] flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2.5 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{item.title} × {item.quantity}</span>
                      <span className="font-medium text-gray-800 shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-pink-100/60 pt-4 space-y-2">
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-700">{formatPrice(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500 flex items-center gap-1"><Truck className="w-4 h-4" /> Delivery</span><span className="text-gray-700">{formatPrice(deliveryFee)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Payment</span><span className="text-gray-700 font-medium">{paymentMethod}</span></div>
                </div>
                <div className="border-t border-pink-100/60 pt-4 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#e855d8] text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
                <button type="submit" form="checkout-form" disabled={submitting}
                  className="w-full mt-5 py-3.5 bg-[#e855d8] hover:bg-[#c73ab8] text-white font-bold rounded-xl transition-all disabled:opacity-50 text-sm tracking-wide"
                >
                  {submitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Placing Order…</span> : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
