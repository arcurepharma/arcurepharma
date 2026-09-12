"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "923162647620"; // آپ کا WhatsApp نمبر

export default function WhatsAppWidget() {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(
      "Assalam Alaikum! میں Arcure Pharma سے معلومات چاہتا ہوں۔"
    );
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, "_blank");
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-pulse min-h-[56px] min-w-[56px]"
      aria-label="Chat on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
    </button>
  );
}
