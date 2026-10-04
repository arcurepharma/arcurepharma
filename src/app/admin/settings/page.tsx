"use client";

import { useEffect, useState } from "react";
import { Save, MessageCircle, Mail, Phone, Globe } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [deliveryFee, setDeliveryFee] = useState("150");
  const [sliderDuration, setSliderDuration] = useState("5");
  const [whatsappNumber, setWhatsappNumber] = useState("923305115999");
  const [officialEmail, setOfficialEmail] = useState("info@arcurepharma.com");
  const [officialPhone, setOfficialPhone] = useState("+92 330 5115999");
  const [websiteUrl, setWebsiteUrl] = useState("https://www.arcurepharma.com/");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.delivery_fee) setDeliveryFee(data.delivery_fee);
        if (data.slider_duration) setSliderDuration(data.slider_duration);
        if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
        if (data.official_email) setOfficialEmail(data.official_email);
        if (data.official_phone) setOfficialPhone(data.official_phone);
        if (data.website_url) setWebsiteUrl(data.website_url);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: "delivery_fee", value: deliveryFee }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "slider_duration",
            value: sliderDuration,
          }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "whatsapp_number",
            value: whatsappNumber,
          }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "official_email",
            value: officialEmail,
          }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "official_phone",
            value: officialPhone,
          }),
        }),
        fetch("/api/settings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: "website_url",
            value: websiteUrl,
          }),
        }),
      ]);
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your store details and official contacts</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8 shadow-sm">
        {/* Delivery Fee */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Delivery Fee</h2>
          <p className="text-gray-500 text-sm mb-4">
            Standard delivery charge applied to all orders
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 font-semibold text-sm">Rs.</span>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0"
            />
          </div>
        </div>

        {/* Slider Duration */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Slider Duration</h2>
          <p className="text-gray-500 text-sm mb-4">
            Time interval between automatic slide transitions (in seconds)
          </p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={sliderDuration}
              onChange={(e) => setSliderDuration(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="1"
              max="30"
            />
            <span className="text-gray-400 text-sm">seconds</span>
          </div>
        </div>

        {/* WhatsApp Number */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1">WhatsApp Number</h2>
          <p className="text-gray-500 text-sm mb-4">
            Official WhatsApp number for floating chat widget and order buttons (e.g. 923305115999)
          </p>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-teal-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-teal-600" />
            </span>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              placeholder="923305115999"
            />
          </div>
        </div>

        {/* Official Email */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Official Email Address</h2>
          <p className="text-gray-500 text-sm mb-4">
            Displayed on website footer, invoices, and customer contact sections
          </p>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-teal-50 rounded-xl">
              <Mail className="w-5 h-5 text-teal-600" />
            </span>
            <input
              type="email"
              value={officialEmail}
              onChange={(e) => setOfficialEmail(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              placeholder="info@arcurepharma.com"
            />
          </div>
        </div>

        {/* Official Phone */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Official Support Phone</h2>
          <p className="text-gray-500 text-sm mb-4">
            Customer hotline phone number displayed on website
          </p>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-teal-50 rounded-xl">
              <Phone className="w-5 h-5 text-teal-600" />
            </span>
            <input
              type="text"
              value={officialPhone}
              onChange={(e) => setOfficialPhone(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              placeholder="+92 330 5115999"
            />
          </div>
        </div>

        {/* Website URL */}
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Official Website URL</h2>
          <p className="text-gray-500 text-sm mb-4">
            Official production domain and base URL
          </p>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-teal-50 rounded-xl">
              <Globe className="w-5 h-5 text-teal-600" />
            </span>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              placeholder="https://www.arcurepharma.com/"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
