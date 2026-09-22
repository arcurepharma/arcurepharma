"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Minus, Plus, Trash2, ShoppingBag, Truck,
  MapPin, Loader2, WifiOff, PencilLine, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/storefront/Navbar";
import { useCartStore, CartItem } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "COD",          label: "Cash on Delivery", desc: "Pay when your order arrives", icon: "ðŸ’µ", available: true },
  { id: "JazzCash",    label: "JazzCash",          desc: "Coming soon",                icon: "ðŸ“±", available: false },
  { id: "EasyPaisa",   label: "EasyPaisa",         desc: "Coming soon",                icon: "ðŸ’³", available: false },
  { id: "BankTransfer",label: "Bank Transfer",      desc: "Coming soon",                icon: "ðŸ¦", available: false },
];

// address mode: null = not chosen yet | "gps" = using location | "manual" = typing
type AddressMode = null | "gps" | "manual";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [deliveryFee, setDeliveryFee]     = useState("150");
  const [submitting, setSubmitting]       = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [addressMode, setAddressMode]     = useState<AddressMode>(null);
  const [detectingLocation, setDetecting] = useState(false);
  const [gpsCoords, setGpsCoords]         = useState<{ lat: number; lng: number } | null>(null);
  const [gpsAddress, setGpsAddress]       = useState<string>("");   // human-readable from Nominatim

  const [form, setForm] = useState({
    email: "", password: "", name: "", phone: "",
    houseNo: "", street: "", landmark: "", postalCode: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data.delivery_fee) setDeliveryFee(data.delivery_fee); })
      .catch(() => {});
  }, []);

  const subtotal = getTotalPrice();
  const total    = subtotal + Number(deliveryFee);

  // â”€â”€ GPS detect â”€â”€
  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
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

          // Auto-fill form fields
          setForm((f) => ({
            ...f,
            houseNo:    houseNo  || f.houseNo,
            street:     street   || f.street,
            landmark:   city     || f.landmark,
            postalCode: postcode || f.postalCode,
          }));

          // Build readable summary for display
          const readable = [houseNo, road, suburb, city, postcode].filter(Boolean).join(", ");
          setGpsAddress(readable || data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        } catch {
          setGpsAddress(`${lat.toFixed(5)}, ${lng.toFixed(5)}`);
        }
        setAddressMode("gps");
        setDetecting(false);
        toast.success("ðŸ“ Location detected!");
      },
      (err) => {
        const msg =
          err.code === 1 ? "Location access denied."
          : err.code === 2 ? "Location unavailable."
          : "Location timed out.";
        toast.error(msg + " Please enter address manually.");
        setDetecting(false);
        setAddressMode("manual");
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  };

  // â”€â”€ Submit â”€â”€
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0)       { toast.error("Your cart is empty!"); return; }
    if (!form.name)                { toast.error("Please enter your name"); return; }
    if (!form.email)               { toast.error("Please enter your email"); return; }
    if (!form.phone)               { toast.error("Please enter your phone"); return; }
    if (addressMode === null)      { toast.error("Please choose address method"); return; }
    if (addressMode === "manual" && (!form.street || !form.landmark || !form.postalCode)) {
      toast.error("Please fill in your delivery address"); return;
    }

    setSubmitting(true);
    try {
      if (form.password) {
        const r = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
        });
        if (!r.ok && r.status !== 409) {
          toast.error("Could not create account."); setSubmitting(false); return;
        }
      }

      const mapsLink = gpsCoords
        ? `https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`
        : null;

      // GPS mode: address field mein sirf house number, baaki GPS coords se
      // Manual mode: address field mein full typed address
      const addressLine = addressMode === "gps"
        ? (form.houseNo ? `House/Flat: ${form.houseNo}` : "GPS Location Detected")
        : [form.houseNo, form.street].filter(Boolean).join(", ");

      const landmarkVal  = addressMode === "gps" ? gpsAddress : form.landmark;
      const postalVal    = addressMode === "gps" ? "" : form.postalCode;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: form.email,
          customerPhone: form.phone,
          customerName:  form.name,
          address:       addressLine,
          landmark:      landmarkVal,
          postalCode:    postalVal,
          items:         JSON.stringify(items.map((i) => ({ id: i.id, title: i.title, price: i.price, quantity: i.quantity }))),
          deliveryFee,
          totalAmount:   total,
          paymentMethod,
          // Always store raw GPS coords in notes so admin can show map
          notes: mapsLink
            ? `GPS: ${gpsCoords!.lat},${gpsCoords!.lng} | Maps: ${mapsLink} | Address: ${gpsAddress}`
            : null,
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

  const inp = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#fcb8fd] focus:border-transparent transition-all";

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
            <Link href="/#products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#fcb8fd] text-white rounded-xl hover:bg-[#d460d6] transition-colors">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* â”€â”€ Left â”€â”€ */}
            <div className="lg:col-span-2 space-y-6">

              {/* Cart */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item: CartItem) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-800 text-sm truncate">{item.title}</h3>
                        <p className="text-[#fcb8fd] font-semibold text-sm">{formatPrice(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                        <span className="w-7 text-center font-medium text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                      <p className="font-medium text-gray-800 text-sm w-20 text-right">{formatPrice(Number(item.price) * item.quantity)}</p>
                      <button onClick={() => removeItem(item.id)} className="p-1.5 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-5">Delivery Information</h2>
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">

                  {/* Contact fields â€” always visible */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inp} placeholder="Ahmad Ali" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} placeholder="ahmad@email.com" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} placeholder="+92 300 1234567" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-gray-400 font-normal text-xs">(optional)</span>
                      </label>
                      <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inp} placeholder="Create account to track orders" />
                    </div>
                  </div>

                  {/* â”€â”€ Address method chooser â”€â”€ */}
                  <div className="pt-2">
                    <p className="text-sm font-semibold text-gray-800 mb-3">Delivery Address *</p>

                    {/* Only show chooser if no mode selected yet */}
                    {addressMode === null && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* GPS option */}
                        <button
                          type="button"
                          onClick={detectLocation}
                          disabled={detectingLocation}
                          className="flex flex-col items-center gap-3 p-5 border-2 border-[#fde8fc] bg-[#fff5fe] hover:border-[#fcb8fd] rounded-2xl transition-all group disabled:opacity-60"
                        >
                          {detectingLocation
                            ? <Loader2 className="w-8 h-8 text-[#fcb8fd] animate-spin" />
                            : <MapPin className="w-8 h-8 text-[#fcb8fd] group-hover:scale-110 transition-transform" />
                          }
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-sm">
                              {detectingLocation ? "Detectingâ€¦" : "Use My Location"}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">Auto-detect via GPS</p>
                          </div>
                        </button>

                        {/* Manual option */}
                        <button
                          type="button"
                          onClick={() => setAddressMode("manual")}
                          className="flex flex-col items-center gap-3 p-5 border-2 border-gray-200 bg-white hover:border-[#fcb8fd] rounded-2xl transition-all group"
                        >
                          <PencilLine className="w-8 h-8 text-gray-500 group-hover:text-[#fcb8fd] group-hover:scale-110 transition-all" />
                          <div className="text-center">
                            <p className="font-bold text-gray-800 text-sm">Enter Manually</p>
                            <p className="text-xs text-gray-400 mt-0.5">Type your address</p>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* â”€â”€ GPS mode confirmed â”€â”€ */}
                    {addressMode === "gps" && (
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-green-800">Location Detected</p>
                            <p className="text-xs text-green-700 mt-0.5 break-words">{gpsAddress}</p>
                            {gpsCoords && (
                              <a
                                href={`https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-1.5 text-xs font-semibold text-green-700 underline"
                              >
                                <MapPin className="w-3 h-3" /> Verify on Google Maps
                              </a>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => { setAddressMode(null); setGpsCoords(null); setGpsAddress(""); }}
                            className="text-xs text-gray-400 hover:text-red-500 shrink-0 font-medium"
                          >
                            Change
                          </button>
                        </div>

                        {/* Optional house number only */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            House / Flat # <span className="text-gray-400 font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={form.houseNo}
                            onChange={(e) => setForm({ ...form, houseNo: e.target.value })}
                            className={inp}
                            placeholder="Add house / flat number if not detected"
                          />
                        </div>
                      </div>
                    )}

                    {/* â”€â”€ Manual mode â”€â”€ */}
                    {addressMode === "manual" && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500">Enter your delivery address below</p>
                          <button
                            type="button"
                            onClick={() => setAddressMode(null)}
                            className="text-xs text-[#fcb8fd] hover:underline font-medium"
                          >
                            â† Back
                          </button>
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
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      disabled={!method.available}
                      onClick={() => method.available && setPaymentMethod(method.id)}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                        !method.available
                          ? "opacity-50 cursor-not-allowed border-gray-100 bg-gray-50"
                          : paymentMethod === method.id
                          ? "border-[#fcb8fd] bg-[#fff5fe]"
                          : "border-gray-200 hover:border-[#fcb8fd]/40 bg-white"
                      }`}
                    >
                      <span className="text-2xl">{method.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm">{method.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{method.desc}</p>
                      </div>
                      {!method.available && (
                        <span className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                          <WifiOff className="w-2.5 h-2.5" /> Soon
                        </span>
                      )}
                      {method.available && paymentMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-[#fcb8fd] flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* â”€â”€ Summary â”€â”€ */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
                <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-2.5 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate mr-2">{item.title} Ã— {item.quantity}</span>
                      <span className="font-medium text-gray-800 shrink-0">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-700">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1"><Truck className="w-4 h-4" /> Delivery</span>
                    <span className="text-gray-700">{formatPrice(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="text-gray-700 font-medium">{paymentMethod}</span>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-[#fcb8fd] text-xl">{formatPrice(total)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  form="checkout-form"
                  disabled={submitting}
                  className="w-full mt-5 py-3.5 bg-[#fcb8fd] hover:bg-[#e8a0f0] text-[#6b1f6d] font-bold rounded-xl transition-all disabled:opacity-50 text-sm tracking-wide"
                >
                  {submitting
                    ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Placing Orderâ€¦</span>
                    : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}



