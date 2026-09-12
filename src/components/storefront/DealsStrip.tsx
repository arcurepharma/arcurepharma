"use client";

import { Gift, Truck, Tag, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/lib/useReveal";

const DEALS = [
  {
    icon: <Tag className="w-5 h-5" />,
    title: "10% OFF",
    subtitle: "Build Your Own Bundle",
    text: "Get 10% OFF when you bundle 3 items",
    imageUrl: "/jenpharm/deal-10-off.png",
    href: "/#products",
  },
  {
    icon: <Gift className="w-5 h-5" />,
    title: "FREE GIFT",
    subtitle: "On Orders Above Rs. 2,000",
    text: "Get a free gift with every qualifying order",
    imageUrl: "/jenpharm/deal-free-gift.png",
    href: "/#products",
  },
  {
    icon: <Truck className="w-5 h-5" />,
    title: "FREE SHIPPING",
    subtitle: "On All Orders",
    text: "Enjoy free doorstep delivery across Pakistan",
    imageUrl: "/jenpharm/deal-free-shipping.png",
    href: "/#products",
  },
];

export default function DealsStrip() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal();

  return (
    <section className="py-20 lg:py-28 bg-[#e5f2ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-16 reveal ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-teal-700 text-sm font-semibold rounded-full mb-4 border border-teal-100">
            <Sparkles className="w-4 h-4" />
            Big Savings
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Deals &amp; Offers
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">
            Save more on your health essentials with exclusive offers
          </p>
          <div className="section-divider mt-6" />
        </div>

        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 reveal ${gridVisible ? "is-visible" : ""}`}
        >
          {DEALS.map((deal, i) => (
            <Link
              key={i}
              href={deal.href}
              className="group bg-white rounded-3xl overflow-hidden border border-teal-100/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-[#eef0f4]">
                <Image
                  src={deal.imageUrl}
                  alt={deal.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-full shadow-lg">
                  {deal.icon}
                  {deal.title}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {deal.subtitle}
                </h3>
                <p className="text-gray-500 text-sm mb-4">{deal.text}</p>
                <span className="inline-flex items-center gap-1.5 text-teal-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}