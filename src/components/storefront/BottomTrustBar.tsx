"use client";

import { Truck, RotateCcw, ShieldCheck, Headphones } from "lucide-react";

const items = [
  {
    icon: Truck,
    title: "Free Shipping",
    desc: "On orders over Rs.999",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "15 days return policy",
  },
  {
    icon: ShieldCheck,
    title: "Secure Payment",
    desc: "100% secure checkout",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "We're here to help",
  },
];

export default function BottomTrustBar() {
  return (
    <section className="bg-white border-t border-gray-100 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-gray-100">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-3 sm:px-6 lg:px-8"
              >
                <div className="shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fff5fe] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#fcb8fd]" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-gray-800 leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}



