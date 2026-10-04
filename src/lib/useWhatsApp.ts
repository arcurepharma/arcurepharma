"use client";

import { useEffect, useState } from "react";

export const OFFICIAL_WHATSAPP_NUMBER = "923305115999";
export const OFFICIAL_PHONE = "+92 330 5115999";
export const OFFICIAL_EMAIL = "info@arcurepharma.com";
export const OFFICIAL_WEBSITE = "https://www.arcurepharma.com/";

export function sanitizeWhatsApp(raw?: string | null): string {
  if (!raw) return OFFICIAL_WHATSAPP_NUMBER;
  const clean = String(raw).replace(/\D/g, "");
  // Guard against known invalid dummy/typo numbers
  if (
    clean === "933162647620" ||
    clean === "923162647620" ||
    clean === "923001234567" ||
    clean.length < 10
  ) {
    return OFFICIAL_WHATSAPP_NUMBER;
  }
  // Convert Pakistani local format (03...) to international (923...)
  if (clean.startsWith("03") && clean.length === 11) {
    return "92" + clean.slice(1);
  }
  return clean;
}

export function getWhatsAppChatUrl(phone?: string, message?: string): string {
  const target = sanitizeWhatsApp(phone);
  if (!message) {
    return `https://wa.me/${target}`;
  }
  return `https://wa.me/${target}?text=${encodeURIComponent(message)}`;
}

let cachedNumber: string | null = null;
let inflight: Promise<string> | null = null;

function fetchSettingsNumber(): Promise<string> {
  if (cachedNumber) return Promise.resolve(cachedNumber);
  if (!inflight) {
    inflight = fetch("/api/settings")
      .then((r) => r.json().catch(() => ({})))
      .then((data) => {
        cachedNumber = sanitizeWhatsApp(data?.whatsapp_number);
        return cachedNumber;
      })
      .catch(() => {
        cachedNumber = OFFICIAL_WHATSAPP_NUMBER;
        return cachedNumber;
      });
  }
  return inflight;
}

export function useWhatsAppNumber(): string {
  const [number, setNumber] = useState<string>(
    cachedNumber || OFFICIAL_WHATSAPP_NUMBER
  );

  useEffect(() => {
    let mounted = true;
    fetchSettingsNumber().then((n) => {
      if (mounted) setNumber(n);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return number;
}

export function buildWhatsAppMessage(opts: {
  title: string;
  price: string;
  productId: string;
  qty?: number;
}): string {
  const qty = opts.qty || 1;
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return [
    "Hello Arcure Pharma!",
    "",
    "I would like to order this product:",
    `- ${opts.title} (Qty: ${qty})`,
    `- Price: Rs. ${Number(opts.price).toFixed(0)}`,
    "",
    `Product link: ${origin}/product/${opts.productId}`,
    "",
    "Please confirm the order.",
  ].join("\n");
}