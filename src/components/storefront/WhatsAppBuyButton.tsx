"use client";

import { useWhatsAppNumber, buildWhatsAppMessage } from "@/lib/useWhatsApp";
import WhatsAppGlyph from "./WhatsAppGlyph";

interface WhatsAppBuyButtonProps {
  product: { id: string; title: string; price: string };
  qty?: number;
}

export default function WhatsAppBuyButton({
  product,
  qty,
}: WhatsAppBuyButtonProps) {
  const whatsappNumber = useWhatsAppNumber();

  const handleClick = () => {
    const message = buildWhatsAppMessage({
      title: product.title,
      price: product.price,
      productId: product.id,
      qty,
    });
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-1.5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold rounded-md transition-all active:scale-[0.98] tracking-wide bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
    >
      <WhatsAppGlyph className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      BUY ON WHATSAPP
    </button>
  );
}