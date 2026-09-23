"use client";

import { useEffect, useState } from "react";

const FALLBACK_NUMBER = "923001234567";

let cachedNumber: string | null = null;
let inflight: Promise<string> | null = null;

function fetchSettingsNumber(): Promise<string> {
  if (cachedNumber) return Promise.resolve(cachedNumber);
  if (!inflight) {
    inflight = fetch("/api/settings")
      .then((r) => r.json().catch(() => ({})))
      .then((data) => {
        cachedNumber = data?.whatsapp_number
          ? String(data.whatsapp_number)
          : FALLBACK_NUMBER;
        return cachedNumber;
      })
      .catch(() => {
        cachedNumber = FALLBACK_NUMBER;
        return cachedNumber;
      });
  }
  return inflight;
}

export function useWhatsAppNumber(): string {
  const [number, setNumber] = useState<string>(
    cachedNumber || FALLBACK_NUMBER
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