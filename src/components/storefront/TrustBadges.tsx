"use client";

import { Leaf, FlaskConical, ShieldOff, Sparkles } from "lucide-react";

const badges = [
  {
    icon: Leaf,
    title: "Clean Ingredients",
    description: "Safe & toxin-free",
  },
  {
    icon: FlaskConical,
    title: "Clinically Proven",
    description: "Dermatologically tested",
  },
  {
    icon: ShieldOff,
    title: "Cruelty Free",
    description: "We never test on animals",
  },
  {
    icon: Sparkles,
    title: "Sustainable Beauty",
    description: "Good for you & the planet",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-y border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div
                key={i}
                className={`flex items-center gap-3 px-4 sm:px-8 py-5 sm:py-6 ${
                  i < badges.length - 1 ? "border-r border-gray-100" : ""
                }`}
              >
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#fff5fe] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#fcb8fd]" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-gray-800 leading-tight">
                    {badge.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {badge.description}
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



