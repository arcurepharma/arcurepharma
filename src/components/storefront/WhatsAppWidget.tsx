"use client";

import { useWhatsAppNumber } from "@/lib/useWhatsApp";
import WhatsAppGlyph from "./WhatsAppGlyph";

export default function WhatsAppWidget() {
  const whatsappNumber = useWhatsAppNumber();

  const handleRedirect = () => {
    if (whatsappNumber) {
      window.open(`https://wa.me/${whatsappNumber}`, "_blank");
    }
  };

  return (
    <button
      onClick={handleRedirect}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 min-h-[56px] min-w-[56px]"
      aria-label="Chat on WhatsApp"
      title="Chat with Arcure Pharma on WhatsApp (+92 330 5115999)"
    >
      <WhatsAppGlyph className="w-7 h-7 sm:w-9 sm:h-9" />
    </button>
  );
}
