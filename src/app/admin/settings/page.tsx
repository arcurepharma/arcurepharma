"use client";

import { useEffect, useState } from "react";
import { Save, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [deliveryFee, setDeliveryFee] = useState("150");
  const [sliderDuration, setSliderDuration] = useState("5");
  const [whatsappNumber, setWhatsappNumber] = useState("923001234567");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.delivery_fee) setDeliveryFee(data.delivery_fee);
        if (data.slider_duration) setSliderDuration(data.slider_duration);
        if (data.whatsapp_number) setWhatsappNumber(data.whatsapp_number);
        setLoading(false);
      });
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
      ]);
      toast.success("Settings saved!");
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
        <p className="text-gray-500 text-sm mt-1">Configure your store settings</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-8">
        <div>
          <h2 className="font-bold text-gray-900 mb-1">Delivery Fee</h2>
          <p className="text-gray-500 text-sm mb-4">
            Standard delivery charge applied to all orders
          </p>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Rs.</span>
            <input
              type="number"
              value={deliveryFee}
              onChange={(e) => setDeliveryFee(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              min="0"
            />
          </div>
        </div>

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

        <div>
          <h2 className="font-bold text-gray-900 mb-1">WhatsApp Number</h2>
          <p className="text-gray-500 text-sm mb-4">
            Number for the WhatsApp chat widget (international format, no + or dashes, e.g. 923001234567)
          </p>
          <div className="flex items-center gap-3">
            <span className="p-3 bg-teal-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-teal-600" />
            </span>
            <input
              type="text"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="923001234567"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
