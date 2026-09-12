"use client";

import { useEffect, useState } from "react";
import { Eye, TrendingUp } from "lucide-react";

export default function LiveViewers() {
  const [viewers, setViewers] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState(0);

  useEffect(() => {
    // Simulate live viewers between 15-35
    const baseViewers = Math.floor(Math.random() * 20) + 15;
    setViewers(baseViewers);

    // Simulate recent purchases
    const basePurchases = Math.floor(Math.random() * 10) + 5;
    setRecentPurchases(basePurchases);

    // Update viewers periodically
    const interval = setInterval(() => {
      setViewers((prev) => {
        const change = Math.floor(Math.random() * 5) - 2;
        return Math.max(10, Math.min(40, prev + change));
      });
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-50 hidden lg:flex flex-col gap-3 animate-fade-in">
      {/* Live Viewers */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 px-4 py-3 flex items-center gap-3 animate-pulse-glow">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <Eye className="w-4 h-4 text-gray-600" />
        <div className="text-sm">
          <span className="font-bold text-gray-900">{viewers}</span>
          <span className="text-gray-500 ml-1">viewing now</span>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3">
        <TrendingUp className="w-4 h-4" />
        <div className="text-sm">
          <span className="font-bold">{recentPurchases}</span>
          <span className="ml-1 opacity-90">sold in last hour</span>
        </div>
      </div>
    </div>
  );
}
