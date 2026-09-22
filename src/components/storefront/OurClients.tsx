"use client";

import { useEffect, useRef } from "react";
import { Building2, Users } from "lucide-react";
import { useReveal } from "@/lib/useReveal";

const CLIENTS = [
  "Dermalax clinic",
  "AB clinic",
  "Al khaleej",
  "Shamsi hospital",
  "Dr shaheena",
  "Shan clinic",
  "Revive aesthetic clinic",
  "Dr ilayas clinic",
  "Adnan Khan hospital",
];

export default function OurClients() {
  const { ref: headerRef, visible: headerVisible } = useReveal();

  return (
    <section className="py-16 lg:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={headerRef}
          className={`text-center mb-12 reveal ${headerVisible ? "is-visible" : ""}`}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fff5fe] text-[#fcb8fd] text-sm font-semibold rounded-full mb-4">
            <Users className="w-4 h-4" />
            Our Clients
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by Leading Clinics &amp; Hospitals
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-lg">
            Proudly serving healthcare providers across the region
          </p>
          <div className="section-divider mt-6" />
        </div>
      </div>

      <div className="relative w-full">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-white to-transparent z-10" />

        <div className="flex overflow-hidden">
          <MarqueeTrack />
        </div>
      </div>
    </section>
  );
}

function MarqueeTrack() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let x = 0;
    let last = performance.now();
    const speed = 50;

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      x -= speed * dt;
      const groupWidth = track.scrollWidth / 2;
      if (x <= -groupWidth) {
        x += groupWidth;
      }
      track.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={trackRef}
      className="flex w-max"
      style={{ willChange: "transform" }}
    >
      <div className="flex items-center gap-4 pr-4 shrink-0">
        {CLIENTS.map((name) => (
          <ClinicChip key={name} name={name} />
        ))}
      </div>
      <div className="flex items-center gap-4 pr-4 shrink-0" aria-hidden="true">
        {CLIENTS.map((name) => (
          <ClinicChip key={name} name={name} />
        ))}
      </div>
    </div>
  );
}

function ClinicChip({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3 px-6 sm:px-8 py-4 sm:py-5 bg-white rounded-2xl border border-gray-100 shadow-sm whitespace-nowrap min-w-max">
      <div className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-[#fcb8fd] to-[#fcb8fd] rounded-xl flex items-center justify-center shrink-0">
        <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
      </div>
      <span className="font-semibold text-gray-800 text-sm sm:text-base">
        {name}
      </span>
    </div>
  );
}


