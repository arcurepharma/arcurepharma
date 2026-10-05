"use client";

import { useWhatsAppNumber, buildWhatsAppMessage } from "@/lib/useWhatsApp";
import WhatsAppGlyph from "./WhatsAppGlyph";

interface WhatsAppBuyButtonProps {
  product: { id: string; title: string; price: string };
  qty?: number;
  className?: string;
}

export default function WhatsAppBuyButton({
  product,
  qty,
  className,
}: WhatsAppBuyButtonProps) {
  const whatsappNumber = useWhatsAppNumber();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      type="button"
      onClick={handleClick}
      className={
        className ||
        "w-full flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold rounded-md transition-all active:scale-[0.98] tracking-wide uppercase bg-[#1d685b] hover:bg-[#154e44] text-white shadow-sm"
      }
    >
      <WhatsAppGlyph className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
      <span className="truncate">BUY ON WHATSAPP</span>
    </button>
  );
}