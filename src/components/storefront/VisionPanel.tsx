"use client";

import { ShieldCheck, Heart, Truck, Stethoscope, Pill, Clock } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

export default function VisionPanel() {
  const { ref: headerRef, visible: headerVisible } = useReveal();
  const { ref: gridRef, visible: gridVisible } = useReveal();

  const values = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Quality Assured",
      text: "All products sourced from certified manufacturers with strict quality control and regulatory compliance.",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health First",
      text: "Committed to making healthcare accessible and affordable for everyone across Pakistan.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Fast Delivery",
      text: "Reliable doorstep delivery ensuring your medications and health products reach you on time.",
    },
    {
      icon: <Stethoscope className="w-8 h-8" />,
      title: "Expert Advice",
      text: "Professional guidance from our team of healthcare experts for your wellness needs.",
    },
    {
      icon: <Pill className="w-8 h-8" />,
      title: "Wide Range",
      text: "Comprehensive selection of medicated products for skincare, haircare, and general health.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      text: "Round-the-clock customer support to assist you with orders and product inquiries.",
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={headerRef}
          className={`text-center mb-16 reveal ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 text-white text-sm font-semibold rounded-full mb-4 backdrop-blur-sm border border-white/20">
            <Heart className="w-4 h-4" />
            Our Vision
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Committed to Your Well-Being
          </h2>
          <p className="text-white/80 mt-3 max-w-xl mx-auto text-lg">
            Building a healthier tomorrow through trusted medicated care
          </p>
          <div className="w-16 h-1 bg-white/40 rounded-full mt-6 mx-auto" />
        </div>

        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 reveal ${gridVisible ? "is-visible" : ""}`}
        >
          {values.map((v, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-8 text-center hover:bg-white/15 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white group-hover:scale-110 group-hover:bg-white/25 transition-all duration-300">
                {v.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{v.title}</h3>
              <p className="text-white/75 text-sm leading-relaxed">{v.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
