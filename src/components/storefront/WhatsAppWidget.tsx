"use client";

import { useEffect, useState } from "react";
import WhatsAppGlyph from "./WhatsAppGlyph";

const DEFAULT_WHATSAPP_NUMBER = "923001234567";

export default function WhatsAppWidget() {
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_WHATSAPP_NUMBER);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.whatsapp_number) {
          setWhatsappNumber(data.whatsapp_number);
        }
      })
      .catch(() => {});
  }, []);

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
    >
<WhatsAppGlyph className="w-7 h-7 sm:w-9 sm:h-9" />
    </button>
  );
}


