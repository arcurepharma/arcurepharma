"use client";

import { ShieldCheck, Truck, Award, HeadphonesIcon, RefreshCcw, CreditCard } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: ShieldCheck,
      title: "100% Genuine",
      description: "Authentic products guaranteed",
      color: "teal",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Doorstep delivery across Pakistan",
      color: "blue",
    },
    {
      icon: Award,
      title: "Dermatologist Approved",
      description: "Clinically tested formulas",
      color: "purple",
    },
    {
      icon: HeadphonesIcon,
      title: "24/7 Support",
      description: "Expert customer care always",
      color: "orange",
    },
    {
      icon: RefreshCcw,
      title: "Easy Returns",
      description: "30-day money-back guarantee",
      color: "green",
    },
    {
      icon: CreditCard,
      title: "Secure Payment",
      description: "Multiple payment options",
      color: "pink",
    },
  ];

  const colorClasses: Record<string, { bg: string; icon: string; border: string }> = {
    teal: { bg: "bg-teal-50", icon: "text-teal-600", border: "border-teal-100" },
    blue: { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-100" },
    purple: { bg: "bg-purple-50", icon: "text-purple-600", border: "border-purple-100" },
    orange: { bg: "bg-orange-50", icon: "text-orange-600", border: "border-orange-100" },
    green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-100" },
    pink: { bg: "bg-pink-50", icon: "text-pink-600", border: "border-pink-100" },
  };

  return (
    <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Arcure Pharma?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Your health and satisfaction are our top priorities
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => {
            const colors = colorClasses[badge.color];
            const Icon = badge.icon;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-teal-200 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1.5">
                  {badge.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
