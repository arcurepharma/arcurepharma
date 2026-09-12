"use client";

import { useEffect, useState } from "react";

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
      className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-pulse min-h-[56px] min-w-[56px]"
      aria-label="Chat on WhatsApp"
    >
      <svg
        viewBox="0 0 448 512"
        fill="currentColor"
        className="w-7 h-7 sm:w-9 sm:h-9"
        aria-hidden="true"
      >
        <path d="M380.9 97.1C339 55.1 283.5 32 224.1 32c-61.4 0-118 23.1-160.8 65.1C21.5 138.5 0 196.6 0 257.1c0 30.9 8.4 60.4 24.3 86.6L1 458.8c-1.6 6.5 4.8 11.8 11 9.8l118.3-24.4c25.2 12.9 54.3 19.8 84 19.8h.8c61.4 0 118-23.1 160.8-65.1C427.2 391.6 448 333.5 448 273c0-60.8-20.3-118.9-67.1-175.9zM224.1 399.5c-26.4 0-52.8-7-75.7-20.3l-5.6-3.3-70.1 14.4 14.5-68.3-3.7-5.8C68.6 290.5 60 261.7 60 232.7c0-104.5 84.9-189.7 189.4-189.7 50.4 0 99.3 19.5 135.5 54.6s55.5 79.5 55.5 129.8c0 104.7-84.9 190-180.3 190zM323.2 295.5c-5.9-3-33.4-16.8-38.6-18.7-5.2-1.9-9-2.8-12.8 2.9-3.8 5.7-14.7 18.7-18 22.5-3.3 3.8-6.6 4.3-12.5 1.4-5.9-2.9-24.9-9.2-47.5-29.3-17.6-15.6-29.4-34.9-32.9-40.8-3.4-5.9-0.4-9.1 2.6-12.1 2.7-2.7 5.9-7.1 8.9-10.7 3-3.6 4-6.2 6-10.3 2-4.1 1-7.7-0.5-10.8-1.5-3.1-12.8-31.2-17.7-42.7-4.7-11.1-9.5-9.6-12.8-9.8-3.3-.2-7.1-.2-10.9-.2-3.8 0-9.9 1.4-15.1 7.1-5.2 5.7-19.8 19.4-19.8 47.3 0 27.9 20.3 54.9 23.2 58.7 2.9 3.8 40.1 61.2 97.1 85.8 13.6 5.9 24.2 9.4 32.4 12 6.8 2.6 13 2.5 17.9 1.5 5.5-1.1 16.8-6.9 19.2-13.5 2.4-6.6 2.4-12.3 1.7-13.5-.7-1.2-2.6-1.9-5.5-3z" />
      </svg>
    </button>
  );
}